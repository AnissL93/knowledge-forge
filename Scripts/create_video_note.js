module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    const fs = require("fs");
    const path = require("path");
    const os = require("os");
    const crypto = require("crypto");

    const { pathToFileURL } = require("url");

    // ========================================
    // Config
    // ========================================

    const VIDEOS_FOLDER = "02_Sources/Videos";
    const TEMPLATE_PATH = "Templates/Video.md";

    // ========================================
    // Helpers
    // ========================================

    function safeFileName(name) {
        return String(name)
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function expandHome(p) {
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

    function getYouTubeVideoId(urlString) {
        try {
            const url = new URL(urlString);

            if (url.hostname === "youtu.be") {
                return url.pathname
                    .replace("/", "")
                    .split("?")[0];
            }

            if (
                url.hostname.includes("youtube.com")
            ) {
                if (url.pathname === "/watch") {
                    return url.searchParams.get("v");
                }

                if (url.pathname.startsWith("/shorts/")) {
                    return url.pathname
                        .split("/")[2];
                }

                if (url.pathname.startsWith("/embed/")) {
                    return url.pathname
                        .split("/")[2];
                }
            }
        } catch (_) {}

        return "";
    }

    // ========================================
    // 1. Ask for URL or local path
    // ========================================

    const input = await quickAddApi.inputPrompt(
        "Media URL or local path",
        "YouTube URL or ~/Videos/video.mp4"
    );

    if (!input) return;

    const source = input.trim();

    // ========================================
    // 2. Detect source
    // ========================================

    let title = "";
    let creator = "";
    let platform = "";
    let mediaUrl = "";
    let localPath = "";
    let videoId = "";

    // ----------------------------------------
    // Remote URL
    // ----------------------------------------

    if (/^https?:\/\//i.test(source)) {
        mediaUrl = source;

        videoId = getYouTubeVideoId(source);

        if (videoId) {
            platform = "youtube";

            try {
                const oembedUrl =
                    "https://www.youtube.com/oembed" +
                    `?url=${encodeURIComponent(source)}` +
                    "&format=json";

                const response =
                    await obsidian.requestUrl({
                        url: oembedUrl,
                        method: "GET"
                    });

                title =
                    response.json?.title || "";

                creator =
                    response.json?.author_name || "";

            } catch (error) {
                console.warn(
                    "Failed to fetch YouTube metadata:",
                    error
                );
            }
        } else {
            platform = "web";
        }
    }

    // ----------------------------------------
    // Local file
    // ----------------------------------------

    else {
        localPath = path.resolve(
            expandHome(source)
        );

        if (!fs.existsSync(localPath)) {
            new obsidian.Notice(
                `File does not exist: ${localPath}`
            );
            return;
        }

        const stat =
            fs.statSync(localPath);

        if (!stat.isFile()) {
            new obsidian.Notice(
                `Not a file: ${localPath}`
            );
            return;
        }

        platform = "local";

        title = path.basename(
            localPath,
            path.extname(localPath)
        );

        mediaUrl =
            pathToFileURL(localPath).href;
    }

    // ========================================
    // 3. Confirm title
    // ========================================

    title = await quickAddApi.inputPrompt(
        "Video title",
        "Confirm or edit title",
        title
    );

    if (!title) return;

    // ========================================
    // 4. Confirm creator
    // ========================================

    creator = await quickAddApi.inputPrompt(
        "Creator",
        "Channel / speaker",
        creator
    );

    creator = creator || "";

    // ========================================
    // 5. Media Extended URI
    // ========================================

    const mediaExtendedUri =
        `obsidian://mx-open?url=${encodeURIComponent(mediaUrl)}`;

    const mediaLink =
        `[Open in Media Extended](${mediaExtendedUri})`;

    // ========================================
    // 6. Load template
    // ========================================

    const templateFile =
        app.vault.getAbstractFileByPath(
            TEMPLATE_PATH
        );

    if (!templateFile) {
        new obsidian.Notice(
            `Template not found: ${TEMPLATE_PATH}`
        );
        return;
    }

    const template =
        await app.vault.read(templateFile);


    // ========================================
    // Media Extended identity
    // ========================================
    
    // 生成一个 Media Extended 唯一 ID
    const mxUid = crypto
          .randomBytes(6)
          .toString("hex");
    
    // Media Extended 使用不同字段表示媒体类型
    let mediaSource = "";
    
    if (platform === "local") {
        mediaSource =
            `media: "${mediaUrl.replace(/"/g, '\\"')}"`;
    } else {
        mediaSource =
            `video: "${mediaUrl.replace(/"/g, '\\"')}"`;
    }

    // ========================================
    // 7. Template variables
    // ========================================

    params.variables.title = title;
    params.variables.creator = creator;
    params.variables.platform = platform;
    params.variables.url = mediaUrl;
    params.variables.source = source;
    params.variables.localPath = localPath;
    params.variables.videoId = videoId;
    params.variables.mediaLink = mediaLink;
    params.variables.mxUid = mxUid;
    params.variables.mediaSource = mediaSource;

    // QuickAdd renders {{VALUE:xxx}} and {{DATE:xxx}}
    const rendered =
        await quickAddApi.format(
            template,
            params.variables
        );

    // ========================================
    // 8. Create video folder
    // ========================================

    await ensureFolder(
        VIDEOS_FOLDER
    );

    // ========================================
    // 9. Create note
    // ========================================

    const fileName =
        safeFileName(title);

    const notePath =
        `${VIDEOS_FOLDER}/${fileName}.md`;

    const existing =
        app.vault.getAbstractFileByPath(
            notePath
        );

    if (existing) {
        new obsidian.Notice(
            `Video note already exists: ${title}`
        );

        await app.workspace
            .getLeaf(false)
            .openFile(existing);

        return;
    }

    const file =
        await app.vault.create(
            notePath,
            rendered
        );


    // ========================================
    // 10. Open note
    // ========================================

    await app.workspace
        .getLeaf(false)
        .openFile(file);

    new obsidian.Notice(
        `Created video note: ${title}`
    );
};
