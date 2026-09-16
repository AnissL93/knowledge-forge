module.exports = {
  entry: createPaperNote,
  settings: {
    name: "Create Paper Note",
    author: "OpenAI",
    options: {
      "Highlights Folder": { type: "text", defaultValue: "02_Sources/Papers/Highlights" },
      "Notes Folder": { type: "text", defaultValue: "02_Sources/Papers/Notes" },
      "Template Path": { type: "text", defaultValue: "Templates/Paper.md" },
      "Filename Format": { type: "text", defaultValue: "{author} {year} - {title}" }
    }
  }
};

async function createPaperNote(params, settings) {
  const { app, quickAddApi, obsidian } = params;
  const H = String(settings["Highlights Folder"] || "02_Sources/Papers/Highlights").trim();
  const N = String(settings["Notes Folder"] || "02_Sources/Papers/Notes").trim();
  const T = String(settings["Template Path"] || "Templates/Paper.md").trim();
  const F = String(settings["Filename Format"] || "{author} {year} - {title}").trim();

  const safe = s => String(s ?? "").trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ");
  const stripMd = s => String(s).replace(/\.md$/i, "");
  const fmOf = f => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
  const heading = c => (String(c).match(/^#\s+(.+?)\s*$/m) || [,""])[1].trim();
  const first = (...v) => v.find(x => x !== undefined && x !== null && String(x).trim() !== "") ?? "";
  const yearOf = v => ((String(v || "").match(/\b(19|20)\d{2}\b/) || [""])[0]);

  async function ensureFolder(folder) {
    let cur = "";
    for (const part of folder.split("/").filter(Boolean)) {
      cur = cur ? `${cur}/${part}` : part;
      if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur);
    }
  }

  function people(value) {
    const arr = !value ? [] : (Array.isArray(value) ? value : [value]);
    return arr.map(v => {
      if (typeof v === "string") {
        const s = v.trim();
        return { full: s, last: s.split(/\s+/).slice(-1)[0] || s };
      }
      if (v && typeof v === "object") {
        const given = first(v.firstName, v.first, v.given, v.givenName);
        const family = first(v.lastName, v.last, v.family, v.familyName);
        const full = first(v.name, [given, family].filter(Boolean).join(" "));
        return { full: String(full || "").trim(), last: String(family || full || "").trim() };
      }
      return { full: "", last: "" };
    }).filter(x => x.full);
  }

  function yamlString(v) { return JSON.stringify(String(v ?? "")); }
  function yamlArray(v) { return JSON.stringify((v || []).map(String)); }

  const files = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(`${H}/`))
    .sort((a,b) => a.basename.localeCompare(b.basename));

  if (!files.length) {
    new obsidian.Notice(`No paper highlight notes found in ${H}`);
    return;
  }

  const src = await quickAddApi.suggester(files.map(f => f.basename), files, "Choose Paper Highlights");
  if (!src) return;

  const content = await app.vault.read(src);
  const fm = fmOf(src);

  let title = String(first(fm.title, fm.itemTitle, fm.item_title, heading(content), src.basename))
    .replace(/\s*[-–—:]\s*(?:Zotero|ZotLit|Highlights?|Annotations?)$/i, "")
    .trim();

  const ps = people(first(fm.authors, fm.author, fm.creators, fm.creator));
  const authorNames = ps.map(p => p.full);
  const firstAuthor = ps[0]?.last || ps[0]?.full || "";
  const year = yearOf(first(fm.year, fm.date, fm.publicationYear, fm.publication_year, fm.issued));
  const citekey = String(first(fm.citationKey, fm.citekey, fm.citation_key, fm.key)).trim();
  const doi = String(first(fm.doi, fm.DOI)).trim();
  const venue = String(first(fm.publicationTitle, fm.publication_title, fm.journal, fm.venue, fm.proceedingsTitle, fm.conferenceName)).trim();
  const url = String(first(fm.url, fm.URL)).trim();
  const zotero = String(first(fm.zotero, fm.zoteroLink, fm.zotero_link, fm.zotero_uri, fm.desktopURI, fm.select)).trim();

  title = await quickAddApi.inputPrompt("Paper title", "Confirm or edit title", title);
  if (!title) return;

  let suggested = F
    .replaceAll("{author}", firstAuthor || "Unknown")
    .replaceAll("{year}", year || "n.d.")
    .replaceAll("{title}", title || "Untitled")
    .replaceAll("{citekey}", citekey || "")
    .replace(/\s+/g, " ")
    .trim();

  const filename = await quickAddApi.inputPrompt("Paper note filename", "Confirm or edit filename", safe(suggested));
  if (!filename) return;

  await ensureFolder(N);
  const notePath = `${N}/${safe(filename)}.md`;

  const existing = app.vault.getAbstractFileByPath(notePath);
  if (existing) {
    new obsidian.Notice(`Paper Note already exists: ${filename}`);
    await app.workspace.getLeaf(false).openFile(existing);
    return;
  }

  const templateFile = app.vault.getAbstractFileByPath(T);
  if (!templateFile) {
    new obsidian.Notice(`Paper template not found: ${T}`);
    return;
  }

  const template = await app.vault.read(templateFile);
  Object.assign(params.variables, {
    title,
    titleYaml: yamlString(title),
    authors: authorNames.join(", "),
    authorsYaml: yamlArray(authorNames),
    firstAuthor,
    year,
    citekey,
    doi,
    venue,
    url,
    urlYaml: yamlString(url),
    zoteroLink: zotero,
    zoteroLinkYaml: yamlString(zotero),
    highlightLink: `[[${stripMd(src.path)}|Paper Highlights]]`,
    highlightPath: src.path,
    highlightPathYaml: yamlString(src.path)
  });

  const rendered = await quickAddApi.format(template, params.variables);
  const file = await app.vault.create(notePath, rendered);
  await app.workspace.getLeaf(false).openFile(file);
  new obsidian.Notice(`Created Paper Note: ${filename}`);
}
