module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    const CLIPPING_FOLDER = "09_Material/Clippings";
    const ARTICLE_FOLDER = "02_Sources/Articles";
    const TEMPLATE_PATH = "Templates/Article.md";

    // ============================================================
    // Helpers
    // ============================================================

    function safeFileName(name) {
        return String(name)
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    async function ensureFolder(folderPath) {
        const parts = folderPath.split("/");
        let current = "";

        for (const part of parts) {
            current = current
                ? `${current}/${part}`
                : part;

            if (!app.vault.getAbstractFileByPath(current)) {
                await app.vault.createFolder(current);
            }
        }
    }

    function getFrontmatter(file) {
        return (
            app.metadataCache
                .getFileCache(file)
                ?.frontmatter ?? {}
        );
    }

    function getFirstHeading(content) {
        const match = content.match(/^#\s+(.+?)\s*$/m);
        return match ? match[1].trim() : "";
    }

    function stripMd(path) {
        return path.replace(/\.md$/i, "");
    }

    // ============================================================
    // 1. Choose source
    // ============================================================

    const sourceMode = await quickAddApi.suggester(
        [
            "Existing Clipping",
            "From URL"
        ],
        [
            "clipping",
            "url"
        ],
        "Create Article Note"
    );

    if (!sourceMode) return;

    // ============================================================
    // Metadata
    // ============================================================

    let title = "";
    let url = "";
    let author = "";
    let site = "";
    let published = "";

    let clippingFile = null;
    let materialLink = "";
    let materialPath = "";

    // ============================================================
    // 2A. Existing Clipping
    // ============================================================

    if (sourceMode === "clipping") {
        const clippingFiles = app.vault
            .getMarkdownFiles()
            .filter(file =>
                file.path.startsWith(
                    `${CLIPPING_FOLDER}/`
                )
            );

        if (clippingFiles.length === 0) {
            new obsidian.Notice(
                `No clippings found in ${CLIPPING_FOLDER}`
            );
            return;
        }

        clippingFile = await quickAddApi.suggester(
            file => file.basename,
            clippingFiles,
            "Select clipping"
        );

        if (!clippingFile) return;

        const fm = getFrontmatter(clippingFile);
        const content =
            await app.vault.read(clippingFile);

        title =
            fm.title ||
            getFirstHeading(content) ||
            clippingFile.basename;

        url =
            fm.url ||
            fm.source ||
            fm.link ||
            "";

        author =
            fm.author ||
            fm.creator ||
            "";

        site =
            fm.site ||
            fm.domain ||
            "";

        published =
            fm.published ||
            fm.date ||
            "";

        materialPath =
            clippingFile.path;

        materialLink =
            `[[${stripMd(clippingFile.path)}|Clipping]]`;
    }

    // ============================================================
    // 2B. Start from URL
    // ============================================================

    if (sourceMode === "url") {
        url = await quickAddApi.inputPrompt(
            "Article URL",
            "https://..."
        );

        if (!url) return;

        url = url.trim();

        // Try to fetch basic metadata
        try {
            const response =
                await obsidian.requestUrl({
                    url,
                    method: "GET"
                });

            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    response.text,
                    "text/html"
                );

            title =
                doc.querySelector(
                    'meta[property="og:title"]'
                )?.content ||
                doc.querySelector(
                    'meta[name="twitter:title"]'
                )?.content ||
                doc.title ||
                "";

            author =
                doc.querySelector(
                    'meta[name="author"]'
                )?.content ||
                doc.querySelector(
                    'meta[property="article:author"]'
                )?.content ||
                "";

            published =
                doc.querySelector(
                    'meta[property="article:published_time"]'
                )?.content ||
                "";

            site =
                new URL(url).hostname;

        } catch (error) {
            console.warn(
                "Could not fetch webpage metadata:",
                error
            );
        }
    }

    // ============================================================
    // 3. Confirm title
    // ============================================================

    title = await quickAddApi.inputPrompt(
        "Article title",
        "Confirm or edit title",
        title
    );

    if (!title) return;

    // ============================================================
    // 4. Create Article Note
    // ============================================================

    await ensureFolder(
        ARTICLE_FOLDER
    );

    const notePath =
        `${ARTICLE_FOLDER}/${safeFileName(title)}.md`;

    const existing =
        app.vault.getAbstractFileByPath(
            notePath
        );

    if (existing) {
        new obsidian.Notice(
            `Article already exists: ${title}`
        );

        await app.workspace
            .getLeaf(false)
            .openFile(existing);

        return;
    }

    const templateFile =
        app.vault.getAbstractFileByPath(
            TEMPLATE_PATH
        );

    if (!templateFile) {
        throw new Error(
            `Template not found: ${TEMPLATE_PATH}`
        );
    }

    const template =
        await app.vault.read(templateFile);

    // ============================================================
    // 5. Template variables
    // ============================================================

    params.variables.title = title;
    params.variables.url = url;
    params.variables.author = author;
    params.variables.site = site;
    params.variables.published = published;

    params.variables.materialLink =
        materialLink;

    params.variables.materialPath =
        materialPath;

    params.variables.sourceMode =
        sourceMode;

    const rendered =
        await quickAddApi.format(
            template,
            params.variables
        );

    const articleFile =
        await app.vault.create(
            notePath,
            rendered
        );

    // ============================================================
    // 6. Open Article Note
    // ============================================================

    await app.workspace
        .getLeaf(false)
        .openFile(articleFile);

    // ============================================================
    // 7A. Existing clipping -> open clipping beside article
    // ============================================================

    if (
        sourceMode === "clipping" &&
        clippingFile
    ) {
        try {
            const leaf =
                app.workspace.getLeaf("split");

            await leaf.openFile(
                clippingFile
            );

        } catch (error) {
            console.warn(
                "Could not open clipping:",
                error
            );
        }
    }

    // ============================================================
    // 7B. URL -> open Web Viewer beside article
    // ============================================================

    if (
        sourceMode === "url" &&
        url
    ) {
        try {
            const leaf =
                app.workspace.getLeaf("split");

            await leaf.setViewState({
                type: "webviewer",
                state: {
                    url: url,
                    navigate: true
                },
                active: true
            });

        } catch (error) {
            console.warn(
                "Could not open Web Viewer:",
                error
            );
        }
    }

    new obsidian.Notice(
        `Created Article Note: ${title}`
    );
};
