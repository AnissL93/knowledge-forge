module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    // ============================================================
    // Configuration
    // ============================================================

    const MERMAID_TEMPLATE_FOLDER = "Templates/Mermaid";
    const MERMAID_OUTPUT_FOLDER = "Attachments/Diagrams/Mermaid";
    const EXCALIDRAW_OUTPUT_FOLDER = "Attachments/Diagrams/Excalidraw";

    // ============================================================
    // Helpers
    // ============================================================

    function safeFileName(name) {
        return String(name ?? "")
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ");
    }

    async function ensureFolder(folderPath) {
        const parts = folderPath.split("/");
        let current = "";

        for (const part of parts) {
            current = current ? `${current}/${part}` : part;

            if (!app.vault.getAbstractFileByPath(current)) {
                await app.vault.createFolder(current);
            }
        }
    }

    function getActiveEditor() {
        return app.workspace.activeEditor?.editor ?? null;
    }

    function stripMermaidFence(text) {
        const trimmed = String(text ?? "").trim();

        // Handles:
        // ```mermaid
        // ...
        // ```
        //
        // and:
        // ```mermaid-next
        // ...
        // ```
        const match = trimmed.match(
            /^```(?:mermaid|mermaid-next)\s*\n([\s\S]*?)\n```$/i
        );

        return match ? match[1].trim() : trimmed;
    }

    function detectFence(text) {
        const match = String(text ?? "")
            .trim()
            .match(/^```(mermaid(?:-next)?)/i);

        return match ? match[1].toLowerCase() : "";
    }

    function insertAtCursor(editor, text) {
        if (!editor) return false;
        editor.replaceSelection(text);
        return true;
    }

    function findCommands(predicate) {
        const commands = app.commands?.listCommands?.() ?? [];
        return commands.filter(predicate);
    }

    async function chooseCommand(commands, prompt) {
        if (!commands.length) return null;

        if (commands.length === 1) {
            return commands[0];
        }

        return await quickAddApi.suggester(
            commands.map(c => c.name),
            commands,
            prompt
        );
    }

    // ============================================================
    // Mermaid
    // ============================================================

    async function handleMermaid() {
        const mode = await quickAddApi.suggester(
            [
                "Inline in current note",
                "Standalone .mermaid file + embed"
            ],
            [
                "inline",
                "standalone"
            ],
            "Mermaid output mode"
        );

        if (!mode) return;

        const templates = app.vault
            .getMarkdownFiles()
            .filter(file =>
                file.path.startsWith(`${MERMAID_TEMPLATE_FOLDER}/`)
            )
            .sort((a, b) =>
                a.basename.localeCompare(b.basename)
            );

        if (templates.length === 0) {
            new obsidian.Notice(
                `No Mermaid templates found in ${MERMAID_TEMPLATE_FOLDER}`
            );
            return;
        }

        const selectedTemplate = await quickAddApi.suggester(
            templates.map(file => file.basename),
            templates,
            "Choose Mermaid diagram type"
        );

        if (!selectedTemplate) return;

        const templateContent =
            await app.vault.read(selectedTemplate);

        // --------------------------------------------------------
        // Inline Mermaid
        // --------------------------------------------------------

        if (mode === "inline") {
            const editor = getActiveEditor();

            if (!editor) {
                new obsidian.Notice(
                    "Open a Markdown note before inserting an inline Mermaid diagram."
                );
                return;
            }

            insertAtCursor(
                editor,
                `${templateContent.trim()}\n`
            );

            new obsidian.Notice(
                `Inserted Mermaid: ${selectedTemplate.basename}`
            );

            return;
        }

        // --------------------------------------------------------
        // Standalone Mermaid
        // --------------------------------------------------------

        const editor = getActiveEditor();

        if (!editor) {
            new obsidian.Notice(
                "Open a Markdown note first so the standalone diagram can be embedded."
            );
            return;
        }

        const name = await quickAddApi.inputPrompt(
            "Diagram name",
            selectedTemplate.basename
        );

        if (!name) return;

        await ensureFolder(MERMAID_OUTPUT_FOLDER);

        const filename = safeFileName(name);
        const diagramPath =
            `${MERMAID_OUTPUT_FOLDER}/${filename}.mermaid`;

        let diagramFile =
            app.vault.getAbstractFileByPath(diagramPath);

        if (!diagramFile) {
            const rawSource =
                stripMermaidFence(templateContent);

            diagramFile =
                await app.vault.create(
                    diagramPath,
                    `${rawSource}\n`
                );
        }

        const embed =
            `![[${diagramPath}]]`;

        insertAtCursor(
            editor,
            `${embed}\n`
        );

        const fence = detectFence(templateContent);

        if (fence === "mermaid-next") {
            new obsidian.Notice(
                "Standalone .mermaid files are rendered by Mermaid View / its Mermaid runtime. Very new Mermaid-Next-only syntax may not render there."
            );
        } else {
            new obsidian.Notice(
                `Created and embedded Mermaid diagram: ${filename}`
            );
        }
    }

    // ============================================================
    // Excalidraw
    // ============================================================

    async function createExcalidrawWithAutomate(mode) {
        const ea =
            globalThis.ExcalidrawAutomate ||
            globalThis.window?.ExcalidrawAutomate;

        if (!ea || typeof ea.create !== "function") {
            return false;
        }

        const name = await quickAddApi.inputPrompt(
            "Excalidraw name",
            "Diagram"
        );

        if (!name) return true;

        const filename = safeFileName(name);

        await ensureFolder(EXCALIDRAW_OUTPUT_FOLDER);

        const before = new Set(
            app.vault
                .getFiles()
                .filter(f =>
                    f.path.startsWith(
                        `${EXCALIDRAW_OUTPUT_FOLDER}/`
                    )
                )
                .map(f => f.path)
        );

        try {
            ea.reset?.();

            await ea.create({
                filename,
                foldername: EXCALIDRAW_OUTPUT_FOLDER,
                templatePath: null,
                onNewPane: true
            });
        } catch (error) {
            console.error(
                "ExcalidrawAutomate create() failed:",
                error
            );
            return false;
        }

        // Give Obsidian time to index the new file.
        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );

        const after = app.vault
            .getFiles()
            .filter(f =>
                f.path.startsWith(
                    `${EXCALIDRAW_OUTPUT_FOLDER}/`
                )
            );

        let created = after.find(
            f => !before.has(f.path)
        );

        // Fallback: find the newest matching filename.
        if (!created) {
            const matching = after
                .filter(f =>
                    f.basename === filename ||
                    f.basename.startsWith(filename)
                )
                .sort(
                    (a, b) =>
                        (b.stat?.mtime ?? 0) -
                        (a.stat?.mtime ?? 0)
                );

            created = matching[0];
        }

        if (
            mode === "embed" &&
            created
        ) {
            const editor = getActiveEditor();

            if (editor) {
                insertAtCursor(
                    editor,
                    `![[${created.path}]]\n`
                );
            } else {
                new obsidian.Notice(
                    `Created ${created.path}, but no Markdown editor was active for embedding.`
                );
            }
        }

        return true;
    }

    async function createExcalidrawViaCommand(mode) {
        const commands = findCommands(c => {
            const name =
                String(c.name ?? "").toLowerCase();

            if (!name.includes("excalidraw")) return false;
            if (!name.includes("create new drawing")) return false;

            if (mode === "embed") {
                return name.includes(
                    "embed into active document"
                );
            }

            return !name.includes(
                "embed into active document"
            );
        });

        const command = await chooseCommand(
            commands,
            "Choose Excalidraw command"
        );

        if (!command) {
            new obsidian.Notice(
                "Could not find an Excalidraw create command. Make sure the Excalidraw plugin is enabled."
            );
            return;
        }

        if (mode === "embed" && !getActiveEditor()) {
            new obsidian.Notice(
                "Open a Markdown note before using Excalidraw create + embed."
            );
            return;
        }

        app.commands.executeCommandById(
            command.id
        );

        new obsidian.Notice(
            "Used Excalidraw's own command. Configure Excalidraw's drawing/embed folder as Attachments/Diagrams/Excalidraw for consistent storage."
        );
    }

    async function handleExcalidraw() {
        const mode = await quickAddApi.suggester(
            [
                "Create standalone drawing",
                "Create drawing + embed in current note"
            ],
            [
                "standalone",
                "embed"
            ],
            "Excalidraw output mode"
        );

        if (!mode) return;

        const handled =
            await createExcalidrawWithAutomate(
                mode
            );

        if (!handled) {
            await createExcalidrawViaCommand(
                mode
            );
        }
    }

    // ============================================================
    // Main Menu
    // ============================================================

    const diagramType = await quickAddApi.suggester(
        [
            "Mermaid",
            "Excalidraw"
        ],
        [
            "mermaid",
            "excalidraw"
        ],
        "Create Diagram"
    );

    if (!diagramType) return;

    if (diagramType === "mermaid") {
        await handleMermaid();
        return;
    }

    if (diagramType === "excalidraw") {
        await handleExcalidraw();
        return;
    }
};
