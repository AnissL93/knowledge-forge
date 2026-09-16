module.exports = {
    entry: createGitHubRepo,
    settings: {
        name: "Create GitHub Repo",
        author: "OpenAI",
        options: {
            "GitHub Token (optional)": { type: "text", defaultValue: "" },
            "Repo Notes Folder": { type: "text", defaultValue: "02_Sources/Repositories" },
            "Template Path": { type: "text", defaultValue: "Templates/GitHub Repo.md" },
            "External Folder": { type: "text", defaultValue: "90_External" },
            "Filename Format": { type: "text", defaultValue: "{owner} - {repo}" }
        }
    }
};

async function createGitHubRepo(params, settings) {
    const { app, quickAddApi, obsidian } = params;

    const token = String(settings["GitHub Token (optional)"] || "").trim();
    const notesFolder = String(settings["Repo Notes Folder"] || "02_Sources/Repositories").trim();
    const templatePath = String(settings["Template Path"] || "Templates/GitHub Repo.md").trim();
    const externalFolder = String(settings["External Folder"] || "90_External").trim();
    const filenameFormat = String(settings["Filename Format"] || "{owner} - {repo}").trim();

    const safeFileName = v => String(v ?? "").trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ");
    const yamlString = v => JSON.stringify(String(v ?? ""));
    const yamlArray = values => JSON.stringify((values || []).map(v => String(v ?? "").trim()).filter(Boolean));

    function parseRepoInput(input) {
        const text = String(input || "").trim();
        if (!text) return null;

        let m = text.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i);
        if (m) return { owner: m[1], repo: m[2].replace(/\.git$/i, "") };

        try {
            const url = new URL(text);
            if (["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
                const parts = url.pathname.split("/").filter(Boolean);
                if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
            }
        } catch (_) {}

        m = text.match(/^([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
        if (m) return { owner: m[1], repo: m[2].replace(/\.git$/i, "") };

        return null;
    }

    async function ensureFolder(folderPath) {
        let current = "";
        for (const part of folderPath.split("/").filter(Boolean)) {
            current = current ? `${current}/${part}` : part;
            if (!app.vault.getAbstractFileByPath(current)) {
                await app.vault.createFolder(current);
            }
        }
    }

    async function githubGet(path) {
        const headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2026-03-10"
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await obsidian.requestUrl({
            url: `https://api.github.com${path}`,
            method: "GET",
            headers
        });

        if (response.status >= 400) {
            throw new Error(`GitHub API ${response.status}: ${response.json?.message || path}`);
        }
        return response.json;
    }

    async function linkLocalClone(owner, repo) {
        const mode = await quickAddApi.suggester(
            ["Reference only", "Link existing local clone"],
            ["reference", "local"],
            "Repository connection"
        );
        if (!mode) return { cancelled: true };
        if (mode === "reference") return { cancelled: false, localPath: "", externalPath: "" };

        if (!(app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            new obsidian.Notice("Local repo linking only works in Obsidian Desktop.");
            return { cancelled: false, localPath: "", externalPath: "" };
        }

        const fs = require("fs");
        const fsp = require("fs/promises");
        const path = require("path");
        const os = require("os");

        const expandHome = p => p === "~" ? os.homedir() : p.startsWith("~/") ? path.join(os.homedir(), p.slice(2)) : p;

        const input = await quickAddApi.inputPrompt("Local repository path", `~/code/${repo}`);
        if (!input) return { cancelled: true };

        const localPath = path.resolve(expandHome(input.trim()));
        if (!fs.existsSync(localPath)) throw new Error(`Local directory does not exist: ${localPath}`);

        const stat = await fsp.stat(localPath);
        if (!stat.isDirectory()) throw new Error(`Not a directory: ${localPath}`);

        const vaultRoot = app.vault.adapter.getBasePath();
        const externalRoot = path.join(vaultRoot, externalFolder);
        await fsp.mkdir(externalRoot, { recursive: true });

        const linkName = `${safeFileName(owner)}--${safeFileName(repo)}`;
        const linkPath = path.join(externalRoot, linkName);

        if (!fs.existsSync(linkPath)) {
            await fsp.symlink(localPath, linkPath, process.platform === "win32" ? "junction" : "dir");
        }

        return { cancelled: false, localPath, externalPath: `${externalFolder}/${linkName}` };
    }

    const input = await quickAddApi.inputPrompt(
        "GitHub repository",
        "owner/repo or https://github.com/owner/repo"
    );
    if (!input) return;

    const parsed = parseRepoInput(input);
    if (!parsed) {
        new obsidian.Notice("Could not parse repository. Use owner/repo or a GitHub repository URL.");
        return;
    }

    let data;
    try {
        data = await githubGet(`/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`);
    } catch (error) {
        console.error(error);
        new obsidian.Notice(error.message);
        return;
    }

    let connection;
    try {
        connection = await linkLocalClone(data.owner.login, data.name);
    } catch (error) {
        console.error(error);
        new obsidian.Notice(error.message);
        return;
    }
    if (connection.cancelled) return;

    const status = await quickAddApi.suggester(
        ["Saved", "Exploring", "Using", "Watching"],
        ["saved", "exploring", "using", "watching"],
        "Repository status"
    );
    if (!status) return;

    await ensureFolder(notesFolder);

    const filename = safeFileName(
        filenameFormat
            .replaceAll("{owner}", data.owner.login)
            .replaceAll("{repo}", data.name)
            .replaceAll("{language}", data.language || "")
    );
    const notePath = `${notesFolder}/${filename}.md`;

    const existing = app.vault.getAbstractFileByPath(notePath);
    if (existing) {
        new obsidian.Notice(`Repository note already exists: ${filename}`);
        await app.workspace.getLeaf(false).openFile(existing);
        return;
    }

    const templateFile = app.vault.getAbstractFileByPath(templatePath);
    if (!templateFile) {
        new obsidian.Notice(`Template not found: ${templatePath}`);
        return;
    }

    const template = await app.vault.read(templateFile);
    const license = data.license?.spdx_id || data.license?.name || "";
    const cloneCommand = `git clone ${data.clone_url}`;

    Object.assign(params.variables, {
        status,
        owner: data.owner.login,
        ownerYaml: yamlString(data.owner.login),
        repo: data.name,
        repoYaml: yamlString(data.name),
        fullName: data.full_name,
        fullNameYaml: yamlString(data.full_name),
        description: data.description || "",
        descriptionYaml: yamlString(data.description || ""),
        githubUrl: data.html_url,
        githubUrlYaml: yamlString(data.html_url),
        cloneUrl: data.clone_url,
        cloneUrlYaml: yamlString(data.clone_url),
        cloneCommand,
        homepage: data.homepage || "",
        homepageYaml: yamlString(data.homepage || ""),
        language: data.language || "",
        languageYaml: yamlString(data.language || ""),
        license,
        licenseYaml: yamlString(license),
        topicsYaml: yamlArray(data.topics || []),
        topics: (data.topics || []).join(", "),
        stars: String(data.stargazers_count ?? 0),
        forks: String(data.forks_count ?? 0),
        defaultBranch: data.default_branch || "",
        archived: String(Boolean(data.archived)),
        githubCreatedAt: data.created_at || "",
        githubUpdatedAt: data.updated_at || "",
        pushedAt: data.pushed_at || "",
        readmeUrl: `${data.html_url}#readme`,
        issuesUrl: `${data.html_url}/issues`,
        releasesUrl: `${data.html_url}/releases`,
        localPath: connection.localPath || "",
        localPathYaml: yamlString(connection.localPath || ""),
        externalPath: connection.externalPath || "",
        externalPathYaml: yamlString(connection.externalPath || ""),
        externalLink: connection.externalPath ? `[[${connection.externalPath}]]` : ""
    });

    let rendered;
    try {
        rendered = await quickAddApi.format(template, params.variables);
    } catch (error) {
        console.error(error);
        new obsidian.Notice(`Could not render GitHub Repo template: ${error.message}`);
        return;
    }

    const file = await app.vault.create(notePath, rendered);
    await app.workspace.getLeaf(false).openFile(file);
    new obsidian.Notice(`Created GitHub repository note: ${data.full_name}`);
}
