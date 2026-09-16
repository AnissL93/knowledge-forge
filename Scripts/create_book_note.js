module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    // ============================================================
    // 配置
    // ============================================================

    const HIGHLIGHTS_FOLDER = "02_Sources/Books/Highlights";
    const NOTES_FOLDER = "02_Sources/Books/Notes";
    const TEMPLATE_PATH = "Templates/Book.md";

    // ============================================================
    // Helpers
    // ============================================================

    function cleanBookTitle(title) {
        return String(title ?? "")
            .trim()

            // "KOReader Highlights - Book"
            .replace(
                /^(?:KOReader\s*)?(?:Highlights?|Notes?)\s*[-–—:]\s*/i,
                ""
            )

            // "Book - KOReader Highlights"
            .replace(
                /\s*[-–—:]\s*(?:KOReader\s*)?(?:Highlights?|Notes?)$/i,
                ""
            )

            // "Book - KOReader"
            .replace(
                /\s*[-–—:]\s*KOReader$/i,
                ""
            )
            .trim();
    }

    function safeFileName(name) {
        return name
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function stringifyAuthor(value) {
        if (!value) return "";

        if (Array.isArray(value)) {
            return value
                .map(v => {
                    if (typeof v === "string") return v;

                    if (v && typeof v === "object") {
                        return (
                            v.name ||
                            [v.firstName, v.lastName]
                                .filter(Boolean)
                                .join(" ")
                        );
                    }

                    return "";
                })
                .filter(Boolean)
                .join(", ");
        }

        return String(value);
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

    function getFirstHeading(content) {
        const match = content.match(/^#\s+(.+?)\s*$/m);
        return match ? match[1].trim() : "";
    }

    // ============================================================
    // 1. 找到所有 Highlight notes
    // ============================================================

    const highlightFiles = app.vault
        .getMarkdownFiles()
        .filter(file =>
            file.path.startsWith(
                `${HIGHLIGHTS_FOLDER}/`
            )
        );

    if (highlightFiles.length === 0) {
        new obsidian.Notice(
            `没有找到 Highlight 文件：${HIGHLIGHTS_FOLDER}`
        );
        return;
    }

    // ============================================================
    // 2. 让用户选择一本书
    // ============================================================

    const selectedFile =
        await quickAddApi.suggester(
            file => file.basename,
            highlightFiles,
            "选择一本书的 KOReader Highlights"
        );

    if (!selectedFile) return;

    // ============================================================
    // 3. 读取 Highlight 文件
    // ============================================================

    const content =
        await app.vault.read(selectedFile);

    const cache =
        app.metadataCache.getFileCache(selectedFile);

    const frontmatter =
        cache?.frontmatter ?? {};

    // ============================================================
    // 4. 推断书名
    //
    // 优先级：
    // frontmatter.title
    // → 一级标题
    // → 文件名
    // ============================================================

    let title =
        frontmatter.title ||
        frontmatter.bookTitle ||
        frontmatter.book_title ||
        getFirstHeading(content) ||
        selectedFile.basename;

    title = cleanBookTitle(title);

    if (!title) {
        title = await quickAddApi.inputPrompt(
            "Book title"
        );

        if (!title) return;
    }

    // 允许创建前修改自动识别出来的标题
    title = await quickAddApi.inputPrompt(
        "Book title",
        "确认或修改书名",
        title
    );

    if (!title) return;

    title = title.trim();

    // ============================================================
    // 5. 获取作者
    // ============================================================

    const author = stringifyAuthor(
        frontmatter.author ??
        frontmatter.authors ??
        frontmatter.creator ??
        frontmatter.creators
    );

    // ============================================================
    // 6. 一些可以提供给 Template 的变量
    // ============================================================

    const highlightPath =
        selectedFile.path.replace(/\.md$/i, "");

    const highlightLink =
        `[[${highlightPath}|KOReader Highlights]]`;

    const fileName = safeFileName(title);

    const notePath =
        `${NOTES_FOLDER}/${fileName}.md`;

    // ============================================================
    // 7. 如果 Book Note 已经存在，就直接打开
    // ============================================================

    const existing =
        app.vault.getAbstractFileByPath(notePath);

    if (existing) {
        new obsidian.Notice(
            `Book Note 已存在：${title}`
        );

        await app.workspace
            .getLeaf(false)
            .openFile(existing);

        return;
    }

    // ============================================================
    // 8. 读取 Book template
    // ============================================================

    const templateFile =
        app.vault.getAbstractFileByPath(
            TEMPLATE_PATH
        );

    if (!templateFile) {
        throw new Error(
            `找不到 Book Template：${TEMPLATE_PATH}`
        );
    }

    const template =
        await app.vault.read(templateFile);

    // ============================================================
    // 9. 设置 QuickAdd variables
    //
    // Template 里可以直接写：
    //
    // {{VALUE:title}}
    // {{VALUE:author}}
    // {{VALUE:highlightLink}}
    // {{VALUE:highlightPath}}
    // ============================================================

    params.variables.title = title;
    params.variables.author = author;
    params.variables.highlightLink =
        highlightLink;
    params.variables.highlightPath =
        selectedFile.path;
    params.variables.highlightFile =
        selectedFile.basename;

    // 兼容更多可能的 metadata
    params.variables.year =
        frontmatter.year ??
        frontmatter.date ??
        "";

    // ============================================================
    // 10. 用 QuickAdd 渲染 Template
    // ============================================================

    const rendered =
        await quickAddApi.format(
            template,
            params.variables
        );

    // ============================================================
    // 11. 创建 Notes 目录
    // ============================================================

    await ensureFolder(NOTES_FOLDER);

    // ============================================================
    // 12. 创建 Book Note
    // ============================================================

    const newFile =
        await app.vault.create(
            notePath,
            rendered
        );

    // ============================================================
    // 13. 打开新 Book Note
    // ============================================================

    await app.workspace
        .getLeaf(false)
        .openFile(newFile);

    new obsidian.Notice(
        `已创建 Book Note：${title}`
    );
};
