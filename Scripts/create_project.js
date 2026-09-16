module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    const fs = require("fs");
    const fsp = require("fs/promises");
    const path = require("path");
    const os = require("os");

    // ============================================================
    // Config
    // ============================================================

    const PROJECTS_FOLDER = "01_Projects";
    const EXTERNAL_FOLDER = "90_External";

    // ============================================================
    // Helpers
    // ============================================================

    function expandHome(p) {
        if (!p) return p;

        if (p === "~") {
            return os.homedir();
        }

        if (p.startsWith("~/")) {
            return path.join(
                os.homedir(),
                p.slice(2)
            );
        }

        return p;
    }

    function safeName(name) {
        return String(name)
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-");
    }

    function yamlString(value) {
        return `"${String(value)
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')}"`;
    }

    async function ensureFolder(folderPath) {
        const parts = folderPath.split("/");
        let current = "";

        for (const part of parts) {
            current = current
                ? `${current}/${part}`
                : part;

            if (
                !app.vault.getAbstractFileByPath(
                    current
                )
            ) {
                await app.vault.createFolder(
                    current
                );
            }
        }
    }

    // ============================================================
    // 1. Project name
    // ============================================================

    const projectName =
        await quickAddApi.inputPrompt(
            "Project name",
            "e.g. HeteroOpt"
        );

    if (!projectName) return;

    // ============================================================
    // 2. Area
    // ============================================================

    const area =
        await quickAddApi.suggester(
            [
                "Research",
                "Startup",
                "Software",
                "Writing",
                "History",
                "Business",
                "Personal",
                "Personal System",
                "Other"
            ],
            [
                "research",
                "startup",
                "software",
                "writing",
                "history",
                "business",
                "personal",
                "personal-system",
                "other"
            ],
            "Project area"
        );

    if (!area) return;

    // ============================================================
    // 3. Ask whether this project has an external repo
    // ============================================================

    const hasExternalRepo =
        await quickAddApi.suggester(
            [
                "No external repo",
                "Attach external repo"
            ],
            [
                false,
                true
            ],
            "External repository?"
        );

    if (
        hasExternalRepo === null ||
        hasExternalRepo === undefined
    ) {
        return;
    }

    // ============================================================
    // 4. Basic project paths
    // ============================================================

    await ensureFolder(PROJECTS_FOLDER);

    const projectFileName =
        safeName(projectName);

    const projectNotePath =
        `${PROJECTS_FOLDER}/${projectFileName}.md`;

    if (
        app.vault.getAbstractFileByPath(
            projectNotePath
        )
    ) {
        new obsidian.Notice(
            `Project already exists: ${projectName}`
        );

        const existing =
            app.vault.getAbstractFileByPath(
                projectNotePath
            );

        await app.workspace
            .getLeaf(false)
            .openFile(existing);

        return;
    }

    // ============================================================
    // 5. Optional repo handling
    // ============================================================

    let repoPath = "";
    let repoName = "";
    let repoSection = `## Repository

No external repository attached.
`;

    if (hasExternalRepo) {
        if (
            !(
                app.vault.adapter instanceof
                obsidian.FileSystemAdapter
            )
        ) {
            throw new Error(
                "External repo linking only works on Obsidian Desktop."
            );
        }

        const repoInput =
            await quickAddApi.inputPrompt(
                "Repository / external directory",
                "~/code/project"
            );

        if (!repoInput) return;

        repoPath =
            path.resolve(
                expandHome(repoInput)
            );

        if (!fs.existsSync(repoPath)) {
            throw new Error(
                `Directory does not exist: ${repoPath}`
            );
        }

        const stat =
            await fsp.stat(repoPath);

        if (!stat.isDirectory()) {
            throw new Error(
                `Not a directory: ${repoPath}`
            );
        }

        repoName =
            path.basename(repoPath);

        const vaultRoot =
            app.vault.adapter.getBasePath();

        const externalRoot =
            path.join(
                vaultRoot,
                EXTERNAL_FOLDER
            );

        const symlinkPath =
            path.join(
                externalRoot,
                repoName
            );

        await fsp.mkdir(
            externalRoot,
            {
                recursive: true
            }
        );

        if (
            !fs.existsSync(
                symlinkPath
            )
        ) {
            if (
                process.platform ===
                "win32"
            ) {
                await fsp.symlink(
                    repoPath,
                    symlinkPath,
                    "junction"
                );
            } else {
                await fsp.symlink(
                    repoPath,
                    symlinkPath,
                    "dir"
                );
            }
        }

        let repoLink =
            `\`${repoPath}\``;

        const possibleReadmes = [
            "README.md",
            "README.MD",
            "readme.md"
        ];

        for (
            const readme
            of possibleReadmes
        ) {
            if (
                fs.existsSync(
                    path.join(
                        repoPath,
                        readme
                    )
                )
            ) {
                repoLink =
                    `[[${EXTERNAL_FOLDER}/${repoName}/${readme.replace(/\.md$/i, "")}|README]]`;

                break;
            }
        }

        repoSection = `## Repository

${repoLink}

External directory:

\`${EXTERNAL_FOLDER}/${repoName}\`

Local path:

\`${repoPath}\`
`;
    }

    // ============================================================
    // 6. Create project note
    // ============================================================

    const today =
        new Date()
            .toISOString()
            .slice(0, 10);

    const repoYaml =
        hasExternalRepo
            ? `repo: ${yamlString(repoPath)}
external: ${yamlString(`${EXTERNAL_FOLDER}/${repoName}`)}`
            : `repo:
external:`;

    const content = `---
type: project
area: ${area}
status: active
${repoYaml}
created: ${today}
updated: ${today}
---

# ${projectName}

## Goal

-

## Why Now

-

## Current Status

-

## Research Questions

-

## Workstreams

-

${repoSection}
## Sources

-

## Concepts

-

## Ideas

-

## Experiments / Validation

-

## Business

-

## Decisions

-

## Next Actions

- [ ]

## Work Log

### ${today}

-
`;

    const file =
        await app.vault.create(
            projectNotePath,
            content
        );

    // ============================================================
    // 7. Open note
    // ============================================================

    await app.workspace
        .getLeaf(false)
        .openFile(file);

    new obsidian.Notice(
        hasExternalRepo
            ? `Created project + external repo: ${projectName}`
            : `Created project: ${projectName}`
    );
};
