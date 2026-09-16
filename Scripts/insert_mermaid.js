module.exports = async (params) => {
    const { app, quickAddApi, obsidian } = params;

    const TEMPLATE_FOLDER = "Templates/Mermaid";

    const editor = app.workspace.activeEditor?.editor;

    if (!editor) {
        new obsidian.Notice("Open a Markdown note first.");
        return;
    }

    const templates = app.vault
        .getMarkdownFiles()
        .filter(file =>
            file.path.startsWith(`${TEMPLATE_FOLDER}/`)
        )
        .sort((a, b) =>
            a.basename.localeCompare(b.basename)
        );

    if (templates.length === 0) {
        new obsidian.Notice(
            `No Mermaid templates found in ${TEMPLATE_FOLDER}`
        );
        return;
    }

    const selected = await quickAddApi.suggester(
        templates.map(file => file.basename),
        templates,
        "Insert Mermaid diagram"
    );

    if (!selected) return;

    const content = (await app.vault.read(selected)).trim();

    editor.replaceSelection(`${content}\n`);

    new obsidian.Notice(
        `Inserted Mermaid template: ${selected.basename}`
    );
};
