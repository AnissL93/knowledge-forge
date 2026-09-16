# Templates

Every note type in the vault has one template here. Three different engines consume them, so the placeholder syntax differs — see [Placeholder syntax](#placeholder-syntax).

## Note templates

| Template | Goes to | Created by | Frontmatter `type` |
|---|---|---|---|
| `Project.md` | `01_Projects/` | QuickAdd macro `Create Project` (`Scripts/create_project.js`) | `project` |
| `Paper.md` | `02_Sources/Papers/Notes/` | `Create Paper Note` (`create_paper_note.js`), reads a ZotLit file in `Papers/Highlights/` | `source` / `paper` |
| `Book.md` | `02_Sources/Books/Notes/` | `Create Book Note` (`create_book_note.js`), reads a KOReader import in `Books/Highlights/` | `source` / `book` |
| `Article.md` | `02_Sources/Articles/` | `Create Article Note` (`create_article_note.js`), from a clip in `09_Material/Clippings/` or a URL | `source` / `article` |
| `Video.md` | `02_Sources/Videos/` | `Create Video Note` (`create_video_note.js`), Media Extended | `source` / `video` |
| `GitHub Repo.md` | `02_Sources/Repositories/` | `Create GitHub Repo` (`create_github_repo.js`), GitHub API | `source` / `github-repository` |
| `Movie.md` | `02_Sources/Movies/` | `Create Movie` (`create_movie.js`), TMDB API | `source` / `movie` |
| `Literature.md` | `02_Sources/Papers/Notes/` | Core Templates — tier A paper, full note | — |
| `Literature - Related.md` | `02_Sources/Papers/Notes/` | Core Templates — tier B, 200–500 words | — |
| `Literature - Skim.md` | `02_Sources/Papers/Notes/` | Core Templates — tier C, one paragraph | — |
| `Concept.md` | `03_Concepts/` | QuickAdd template choice or Core Templates | — |
| `Method.md` | `04_Methods/` | QuickAdd template choice or Core Templates | — |
| `Experiment.md` | `05_Experiments/` | QuickAdd template choice `Create Experiment` | `experiment` |
| `Idea.md` | `06_Ideas/` | QuickAdd template choice `Create Idea` | `idea` |
| `Meeting.md` | `08_Meetings/` | QuickAdd template choice or Core Templates | — |
| `Company Research.md` | `10_Business/Company/` | QuickAdd template choice | `company` |
| `Market Research.md` | `10_Business/Market/` | QuickAdd template choice | `market-research` |
| `Daily Note.md` | `11_Daily/YYYY/MM/` | Core Daily Notes plugin | `daily` |
| `Work Log.md` | inside a project note or `11_Daily/` | Core Templates | `worklog` |

Frontmatter keys matter: `Dashboard.md` and the Dataview queries filter on `type`, `status`, `source_type`, `projects`, `updated`. Add fields freely, but keep these.

Status vocabularies used by the queries:
- project: `active` / `paused` / `archived`
- source: `reading` / `read` (`watching` / `watched`, `listened`)
- idea: `seed` / `exploring` / `experimenting` / `confirmed` / `dropped`
- experiment: `planned` / `running` / `done`

## Writing pack — `Writing/`

Seven section templates for a paper draft: `00 Outline` → `06 Discussion`. Create one note per section in `07_Writing/<Paper>/` and link back to the notes that hold the evidence (`[[EXP001 - ...]]`, `[[Paper Note]]`, `[[IDEA - ...]]`). `00 Outline` is the entry point; it links the project note and target venue.

## Mermaid pack — `Mermaid/`

30 ready-to-edit diagram snippets (flowchart, sequence, class, state, ER, Gantt, mindmap, timeline, quadrant, Sankey, C4, …) plus `Mermaid.md`, a single cheatsheet with all of them.

Two ways to use them:

- **Insert inline** — QuickAdd `Insert Mermaid` (`Scripts/insert_mermaid.js`): pick a snippet, it lands at the cursor. Suggested hotkey `Ctrl/Cmd+Alt+M`.
- **Standalone file** — QuickAdd `Create Diagram` (`Scripts/create_diagram.js`): writes to `Attachments/Diagrams/Mermaid/<name>.md` and embeds `![[...]]`; also handles Excalidraw.

Notes:
- Snippets use the ` ```mermaid-next ` fence for the Mermaid Next plugin. If Mermaid Next is set to replace Obsidian's renderer, or you drop the plugin, change fences to ` ```mermaid `.
- Some newer diagram types (block, packet, radar, treemap, …) need the Mermaid version bundled with Mermaid Next.
- ZenUML is intentionally omitted (separate extension).

## KOReader highlight styles

`default.md`, `compact.md`, `academic.md`, `colorer-callout.md`, `power-user.md` are **not** note templates. They are output styles for the KOReader Highlights Importer plugin (Mustache syntax: `{{highlight}}`, `{{chapter}}`, `{{pageno}}`). Point the plugin's template setting at one of them; `power-user.md` lists every variable available.

## Placeholder syntax

| Syntax | Filled by | Used in |
|---|---|---|
| `{{date:YYYY-MM-DD}}`, `{{title}}` | Core Templates / Daily Notes | Project, Idea, Experiment, Concept, Meeting, Daily Note, … |
| `{{VALUE:name}}`, `{{DATE:YYYY-MM-DD}}` | QuickAdd (`quickAddApi.format`); `VALUE`s are set by the script in `params.variables` | Paper, Book, Article, Video, GitHub Repo, Movie |
| `{{ zt.title }}`, `{% suffix %}` | ZotLit (Liquid) | `02_Sources/Papers/zotlit-*.liquid.md`, not this folder |
| `{{highlight}}`, `{{#note}}…{{/note}}` | KOReader Highlights Importer (Mustache) | the five highlight styles above |

Templates with `{{VALUE:...}}` will render literally if opened through Core Templates — always create those note types through their QuickAdd choice.

## Adding a new note type

1. Copy the closest template, keep the frontmatter `type` / `status` keys.
2. Add a QuickAdd choice (type **Template**, target folder) — or a script in `Scripts/` if the note needs external data.
3. If the Dashboard should see it, add a Dataview query keyed on its `type`.
