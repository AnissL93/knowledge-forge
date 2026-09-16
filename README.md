# Knowledge Forge

An Obsidian vault for research + startup work. It is not a note manager; it is a pipeline:

```text
Capture → Source → Concept → Idea → Experiment / Project → Writing / Output
```

Raw material (papers, books, videos, web pages, GitHub repos, movies, market research) gets forged into your own knowledge and output.

## Folder structure

```text
00_Inbox/          Capture here, do not classify
01_Projects/       What I am pushing forward (project dashboards, not encyclopedias)
02_Sources/        What other people said (raw material → my source note)
  Papers/          Highlights/ (ZotLit-managed) + Notes/ (my paper notes)
  Books/           Highlights/ (KOReader-managed) + Notes/
  Articles/        Web article notes (raw clip lives in 09_Material/Clippings)
  Videos/          Video notes (Media Extended)
  Repositories/    GitHub repo notes
  Movies/          Movie notes (TMDB)
  Podcasts/  Reports/
03_Concepts/       What I already know (one concept per note)
04_Methods/        Reusable methods / algorithms / procedures
05_Experiments/    What I actually tried (EXP001 - ...)
06_Ideas/          New hypotheses
07_Writing/        Papers / reports / articles
08_Meetings/       Supervisor / cofounder / customer
09_Material/       Raw material, not notes (Clippings/ = Web Clipper output)
10_Business/       Reusable business knowledge: Company / Market / Strategy (see its README)
11_Daily/          Daily note = time log, archived as YYYY/MM
90_External/       Symlinks to external git repos; readable by Obsidian, git-ignored
99_Archive/        Finished projects, rejected directions
Attachments/       Diagrams/{Mermaid,Excalidraw}  Image/  Paper/  Export/
Scripts/           QuickAdd user scripts
Templates/         Note templates + Mermaid/ diagram snippets + Writing/ paper sections
```

### Where does a note go?

| The question it answers | Folder |
|---|---|
| What did I just capture? | `00_Inbox` |
| What am I pushing forward? | `01_Projects` |
| What did someone else (paper/book/video/page) say? | `02_Sources/*` |
| What do I know about this field? | `03_Concepts` |
| What reusable method is this? | `04_Methods` |
| What did I try? | `05_Experiments` |
| What new hypothesis do I have? | `06_Ideas` |
| What am I producing? | `07_Writing` |
| This company / this market / long-term strategy? | `10_Business/{Company,Market,Strategy}` |
| What happened today? | `11_Daily` |

Rule: the *thing you are doing* goes in `01_Projects`; the reusable knowledge it produces settles into `02–10`. The example notes in each folder show this with one sample project, `LLM Reasoning Study`.

## Root files

- `Dashboard.md` — today / overdue / next 7 days / active projects / reading queue
- `Agenda.md` — org-agenda style Tasks queries
- `Kanban.md` — query-based board; tasks stay in their original notes
- `style-settings.json` — Style Settings plugin config
- `Templates/README.md` — every note type, placeholder syntax, Mermaid pack
- `10_Business/README.md` — business folder guide
- `.gitignore` — excludes `90_External/`

## Plugins

Minimal set. Tasks queries tasks; Dataview queries note metadata. Keep them separate.

| Role | Plugin | Required |
|---|---|---|
| org-capture / custom commands | **QuickAdd** | yes |
| TODO / scheduled / deadline / agenda / kanban | **Tasks** | yes |
| Metadata queries (papers, projects, experiments) | **Dataview** | yes |
| Zotero papers + annotations | **ZotLit** (+ ZotLit Companion in Zotero) | for papers |
| KOReader book highlights | **KOReader Highlights Importer** | for books |
| Video notes / timestamps | **Media Extended** | for videos |
| Web pages | **Obsidian Web Clipper** (browser extension) | for articles |
| Diagrams | **Mermaid Next**, optional **Excalidraw** | optional |
| Pomodoro | any minimal timer (PomoBar) | optional |

Core plugins: Backlinks, Daily Notes, Templates, Properties, Quick Switcher, Bases.

### Plugin settings

**Templates** — Settings → Templates → Template folder: `Templates`.

**Daily notes** — Settings → Daily notes:
- New file location: `11_Daily/{{date:YYYY}}/{{date:MM}}`
- Template: `Templates/Daily Note`

**Tasks** — defaults are fine. Use `📅` for deadline and `⏳` for scheduled:
`- [ ] Read Ansor 📅 2026-09-20 ⏳ 2026-09-18`. Enable "Auto-suggest" for the emoji picker.

**Dataview** — enable "Enable JavaScript queries" is *not* needed. Queries rely on frontmatter keys: `type` (project / source / idea / experiment / daily), `status`, `source_type`, `projects`, `updated`.

**QuickAdd** — see [Build the flow](#build-the-flow) below.

**ZotLit** — Settings → ZotLit:
- Literature note folder: `02_Sources/Papers/Highlights`
- Templates → Note filename: create editable template file, use `02_Sources/Papers/zotlit-filename.liquid.md`
  (`{{ zt.title | truncate: 100 }} - {{ zt.citationKey }}{% suffix %}`)
- Templates → Note content: use `02_Sources/Papers/zotlit-content.liquid.md`
- Templates → Frontmatter: add managed fields so `Create Paper Note` can inherit them:

  | Key | Expression |
  |---|---|
  | `title` | `zt.title` |
  | `authors` | `zt.creators \| map: "fullName"` |
  | `year` | `zt.date \| date: "%Y"` |
  | `citekey` | `zt.citationKey` |
  | `doi` | `zt.DOI` |
  | `venue` | `zt.publicationTitle` |
  | `item_type` | `zt.itemType` |

  Use ZotLit's *Template Data Explorer* to check which `zt.*` fields your Zotero items actually have.
- Zotero side: install ZotLit Companion; Better BibTeX for stable citation keys.

**KOReader Highlights Importer** — Settings → KOReader Highlights Importer:
- Scan path / data folder: KOReader's `docsettings` directory, e.g. `~/.config/koreader/docsettings`
- Highlights folder: `02_Sources/Books/Highlights`
- KOReader side: Settings → Document → Book metadata location → `./docsettings` (keeps `.sdr` out of the Calibre library; use *Move book metadata* to migrate existing `.sdr`).

**Media Extended** — Settings → Media Extended:
- Note folder / default note location: `02_Sources/Videos`
- Timestamp / screenshot insert into the active note. `Create Video Note` writes `mx-uid` so "Open note" from the player jumps back to the right note.

**Obsidian Web Clipper** (browser) — in your Article template:
- Note location: `09_Material/Clippings`
- Note name: `{{title}}`
- Keep `url`, `author`, `published`, `site` properties; `Create Article Note` reads them.

**Excalidraw** (if used) — drawing folder: `Attachments/Diagrams/Excalidraw`.

**CSS** — put `tasks.css` in `.obsidian/snippets/`, enable under Settings → Appearance → CSS snippets.

## Build the flow

### Step 0: folders and templates

1. Create the folder tree above.
2. Copy `Templates/` and `Scripts/` into the vault root.
3. Apply the plugin settings above.

### Step 1: Capture (org-capture)

QuickAdd → Add Choice `Capture Inbox`, type **Capture**, file `00_Inbox/Inbox.md`, append to end. Bind `Ctrl+Alt+C`.

Rule: **never classify while capturing.** Concept / Idea / Method is decided later.

### Step 2: register the QuickAdd scripts

One Choice per script: type **Macro** → Macro Builder → Add → **User Script** → pick `Scripts/xxx.js` → enable *Add to command palette*.

| Choice | Script | What it does | Needs |
|---|---|---|---|
| Create Project | `create_project.js` | Prompts name / area / repo path → `01_Projects/X.md` + `90_External/X` symlink (repo-less variant available) | — |
| Create Paper Note | `create_paper_note.js` | Pick a file in `Papers/Highlights` → renders `Templates/Paper.md` to `Papers/Notes/{author} {year} - {title}.md`, inherits metadata, links back | ZotLit |
| Create Book Note | `create_book_note.js` | Pick a file in `Books/Highlights` → `Books/Notes/` | KOReader Importer |
| Create Video Note | `create_video_note.js` | YouTube / Bilibili URL or local path → `02_Sources/Videos/` | Media Extended |
| Create Article Note | `create_article_note.js` | Pick an existing clip, or start from a URL → `02_Sources/Articles/` | Web Clipper |
| Create GitHub Repo | `create_github_repo.js` | `owner/repo` or URL → GitHub API metadata → `02_Sources/Repositories/`, optional symlink of local clone into `90_External` | optional GitHub token (script settings) |
| Create Movie | `create_movie.js` | TMDB search / IMDb id → `02_Sources/Movies/` | TMDB Read Access Token (script settings) |
| Create Diagram | `create_diagram.js` | Mermaid: pick template, write standalone file in `Attachments/Diagrams/Mermaid/` or embed inline; Excalidraw: delegates to its command | Mermaid Next / Excalidraw |
| Insert Mermaid | `insert_mermaid.js` | Insert a snippet from `Templates/Mermaid/*` at the cursor | Mermaid Next |

Scripts with a `settings` block (paper, github, movie) expose their folders/tokens in QuickAdd → the Choice's gear icon.

Template Choices (type **Template**): Create Idea → `Templates/Idea.md` into `06_Ideas`; Create Experiment → `Templates/Experiment.md` into `05_Experiments`; likewise Concept, Method, Meeting, Company Research, Market Research.

### Step 3: hotkeys

High-frequency actions get a key; everything else goes through the QuickAdd menu:

| Action | Linux / Windows | macOS |
|---|---|---|
| Capture Inbox | `Ctrl+Alt+C` | `Cmd+Opt+C` |
| Create Project | `Ctrl+Alt+P` | `Cmd+Opt+P` |
| Create Idea | `Ctrl+Alt+I` | `Cmd+Opt+I` |
| Create Experiment | `Ctrl+Alt+E` | `Cmd+Opt+E` |
| Insert Mermaid | `Ctrl+Alt+M` | `Cmd+Opt+M` |
| QuickAdd Menu | `Ctrl+Alt+Space` | `Cmd+Opt+Space` |

### Step 4: source pipelines

**Papers: Zotero → ZotLit → Obsidian**

```text
Browser / arXiv / Scholar
  ↓  save to Zotero (PDF + metadata + Better BibTeX key)
Zotero
  ↓  read & highlight the PDF in Zotero
ZotLit: "Open literature note quick switcher" → pick the item
  ↓  creates/opens 02_Sources/Papers/Highlights/<Title - citekey>.md
      (managed region: frontmatter, annotations, Zotero back-link;
       re-run "Update literature note metadata" after new highlights)
QuickAdd: Create Paper Note → pick that Highlights file
  ↓  02_Sources/Papers/Notes/<Author Year - Title>.md  (your own reading note)
Concepts / Ideas / Experiments → Project
```

- PDFs never enter the vault; the `zotero:` link in frontmatter opens the item.
- Do not write your thoughts in the Highlights file — ZotLit owns it. Write in the Notes file.

**Books: Calibre → KOReader → Obsidian**

```text
Calibre   manages EPUB / PDF / metadata
  ↓  open the book with KOReader (Calibre: set KOReader as external viewer)
KOReader  read, highlight, add notes → written to .sdr in ~/.config/koreader/docsettings
  ↓
Obsidian: "Scan KOReader Highlights" (check what it found)
Obsidian: "Import KOReader Highlights"
  ↓  02_Sources/Books/Highlights/<Book>.md  (managed; re-import merges)
QuickAdd: Create Book Note → pick that Highlights file
  ↓  02_Sources/Books/Notes/<Book>.md  (your own reading note)
Concepts / Ideas
```

**Web pages**

```text
Web Clipper → 09_Material/Clippings/<title>.md → Create Article Note → 02_Sources/Articles/
```
or run Create Article Note directly from a URL (it clips first, then creates the note).

**Videos**: open the URL / file in Media Extended, run Create Video Note, then insert timestamps and screenshots into that note while watching.

**GitHub repos**, **movies**: the scripts fetch metadata and fill the template.

**Diagrams**: full Mermaid snippet set in `Templates/Mermaid/`; `Create Diagram` handles Mermaid and Excalidraw, output in `Attachments/Diagrams/`.

### Step 5: external projects

For code that lives in a GitHub repo but whose docs you want to edit in Obsidian:

1. `Create Project` with the repo path → it runs `ln -s <repo> 90_External/<name>`.
2. `.gitignore` already excludes `90_External/`, so the vault repo never commits the linked project.
3. Link from `01_Projects/<name>.md` to `90_External/<name>/docs/...`.

### Step 6: tasks and agenda

- Tasks live in their notes (project / daily / source). `Agenda.md`, `Dashboard.md`, `Kanban.md` are pure queries.
- Dataview views depend on frontmatter (`type`, `status`, `updated`); keep the templates' frontmatter intact.

## Daily loop

```text
Morning  open project note → Next Actions → pick 1–3 things → Agenda.md
Reading  capture to Inbox first → worthwhile items go through a source pipeline
         → distill Concepts → Ideas emerge
Evening  Daily note Work Log, one section per project, linked to Concepts / Ideas
Weekly   empty 00_Inbox; update project status / updated; move finished work to 99_Archive
```

How much to write per paper: A-tier (core) — full note; B-tier (related) — core idea + relation to my work; C-tier (skimmed) — one line.

## Target knowledge graph

```text
                    [[Research Question]]
                           ↑
[[Paper A]] → [[Concept]] ← [[Paper B]]
     ↓            ↓
 [[Method]]     [[Idea]]
                   ↓
              [[Experiment]]
                   ↓
                [[Paper]]
```

Three questions the vault must answer: what did others find → Sources; what do I know → Concepts; what will I contribute → Ideas + Experiments + Writing.
