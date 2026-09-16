module.exports = {
    entry: createMovie,
    settings: {
        name: "Create Movie",
        author: "OpenAI",
        options: {
            "TMDB Read Access Token": { type: "text", defaultValue: "" },
            "Language": { type: "text", defaultValue: "zh-CN" },
            "Movie Folder": { type: "text", defaultValue: "02_Sources/Movies" },
            "Template Path": { type: "text", defaultValue: "Templates/Movie.md" },
            "Max Cast": { type: "text", defaultValue: "8" }
        }
    }
};

async function createMovie(params, settings) {
    const { app, quickAddApi, obsidian } = params;

    const token = String(settings["TMDB Read Access Token"] || "").trim();
    const language = String(settings["Language"] || "zh-CN").trim();
    const movieFolder = String(settings["Movie Folder"] || "02_Sources/Movies").trim();
    const templatePath = String(settings["Template Path"] || "Templates/Movie.md").trim();
    const maxCast = Math.max(1, parseInt(settings["Max Cast"] || "8", 10) || 8);

    if (!token) {
        new obsidian.Notice("Configure the TMDB Read Access Token in QuickAdd first.");
        return;
    }

    function safeFileName(name) {
        return String(name ?? "")
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ");
    }

    function yamlString(value) {
        return JSON.stringify(String(value ?? ""));
    }

    function yamlArray(values) {
        return JSON.stringify((values || []).map(v => String(v ?? "").trim()).filter(Boolean));
    }

    function extractYear(date) {
        const m = String(date || "").match(/^(\d{4})/);
        return m ? m[1] : "";
    }

    function extractImdbId(input) {
        const m = String(input || "").match(/\b(tt\d{5,})\b/i);
        return m ? m[1].toLowerCase() : "";
    }

    function tmdbImage(path, size = "w500") {
        return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
    }

    async function ensureFolder(folderPath) {
        const parts = folderPath.split("/").filter(Boolean);
        let current = "";
        for (const part of parts) {
            current = current ? `${current}/${part}` : part;
            if (!app.vault.getAbstractFileByPath(current)) {
                await app.vault.createFolder(current);
            }
        }
    }

    async function api(path, query = {}) {
        const qs = new URLSearchParams(query);
        const url = `https://api.themoviedb.org/3${path}${qs.toString() ? "?" + qs.toString() : ""}`;
        const response = await obsidian.requestUrl({
            url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });
        if (response.status >= 400) throw new Error(`TMDB request failed: ${response.status}`);
        return response.json;
    }

    function movieLabel(movie) {
        const year = extractYear(movie.release_date);
        const title = movie.title || movie.original_title || "Untitled";
        const original = movie.original_title && movie.original_title !== movie.title
            ? ` / ${movie.original_title}` : "";
        return `${title}${original}${year ? ` (${year})` : ""}`;
    }

    async function findMovieFromImdb(imdbId) {
        const result = await api(`/find/${encodeURIComponent(imdbId)}`, {
            external_source: "imdb_id",
            language
        });
        const movies = result.movie_results || [];
        if (!movies.length) {
            new obsidian.Notice(`No TMDB movie found for IMDb ID: ${imdbId}`);
            return null;
        }
        if (movies.length === 1) return movies[0];
        return await quickAddApi.suggester(movies.map(movieLabel), movies, "Choose movie");
    }

    async function searchMovie(query) {
        const result = await api("/search/movie", {
            query,
            language,
            include_adult: "false"
        });
        const movies = (result.results || []).slice(0, 20);
        if (!movies.length) {
            new obsidian.Notice(`No movies found for: ${query}`);
            return null;
        }
        return await quickAddApi.suggester(movies.map(movieLabel), movies, "Choose movie");
    }

    const input = await quickAddApi.inputPrompt(
        "Movie title or IMDb URL / ID",
        "Blade Runner 2049 or https://www.imdb.com/title/tt1856101/"
    );
    if (!input) return;

    let selectedMovie = null;
    const imdbInput = extractImdbId(input);

    try {
        selectedMovie = imdbInput
            ? await findMovieFromImdb(imdbInput)
            : await searchMovie(input.trim());
    } catch (error) {
        console.error(error);
        new obsidian.Notice(`TMDB lookup failed: ${error.message}`);
        return;
    }
    if (!selectedMovie) return;

    let details;
    try {
        details = await api(`/movie/${selectedMovie.id}`, {
            language,
            append_to_response: "credits,external_ids"
        });
    } catch (error) {
        console.error(error);
        new obsidian.Notice(`Could not fetch movie details: ${error.message}`);
        return;
    }

    const title = details.title || details.original_title || "Untitled";
    const originalTitle = details.original_title || "";
    const year = extractYear(details.release_date);
    const directors = (details.credits?.crew || []).filter(p => p.job === "Director").map(p => p.name);
    const cast = (details.credits?.cast || []).slice(0, maxCast).map(p => p.name);
    const genres = (details.genres || []).map(g => g.name);
    const countries = (details.production_countries || []).map(c => c.name);
    const companies = (details.production_companies || []).map(c => c.name);

    const imdbId = details.external_ids?.imdb_id || imdbInput || "";
    const tmdbId = details.id;
    const runtime = details.runtime || "";
    const overview = details.overview || "";
    const tagline = details.tagline || "";
    const releaseDate = details.release_date || "";
    const posterUrl = tmdbImage(details.poster_path, "w500");
    const backdropUrl = tmdbImage(details.backdrop_path, "w1280");
    const tmdbUrl = `https://www.themoviedb.org/movie/${tmdbId}`;
    const imdbUrl = imdbId ? `https://www.imdb.com/title/${imdbId}/` : "";

    const status = await quickAddApi.suggester(
        ["To Watch", "Watching", "Watched"],
        ["to-watch", "watching", "watched"],
        "Movie status"
    );
    if (!status) return;

    const suggestedName = `${title}${year ? ` (${year})` : ""}`;
    const noteName = await quickAddApi.inputPrompt(
        "Movie note filename",
        "Confirm or edit filename",
        suggestedName
    );
    if (!noteName) return;

    await ensureFolder(movieFolder);
    const notePath = `${movieFolder}/${safeFileName(noteName)}.md`;

    const existing = app.vault.getAbstractFileByPath(notePath);
    if (existing) {
        new obsidian.Notice(`Movie note already exists: ${noteName}`);
        await app.workspace.getLeaf(false).openFile(existing);
        return;
    }

    const templateFile = app.vault.getAbstractFileByPath(templatePath);
    if (!templateFile) {
        new obsidian.Notice(`Template not found: ${templatePath}`);
        return;
    }

    const template = await app.vault.read(templateFile);

    Object.assign(params.variables, {
        title,
        originalTitle,
        year,
        status,
        directorsYaml: yamlArray(directors),
        castYaml: yamlArray(cast),
        genresYaml: yamlArray(genres),
        countriesYaml: yamlArray(countries),
        companiesYaml: yamlArray(companies),
        runtime: String(runtime),
        releaseDate,
        overview,
        tagline,
        tmdbId: String(tmdbId),
        imdbId,
        tmdbUrl,
        imdbUrl,
        posterUrl,
        backdropUrl,
        titleYaml: yamlString(title),
        originalTitleYaml: yamlString(originalTitle),
        tmdbUrlYaml: yamlString(tmdbUrl),
        imdbUrlYaml: yamlString(imdbUrl),
        posterUrlYaml: yamlString(posterUrl)
    });

    let rendered;
    try {
        rendered = await quickAddApi.format(template, params.variables);
    } catch (error) {
        console.error(error);
        new obsidian.Notice(`Could not render Movie template: ${error.message}`);
        return;
    }

    const file = await app.vault.create(notePath, rendered);
    await app.workspace.getLeaf(false).openFile(file);
    new obsidian.Notice(`Created movie note: ${noteName}`);
}
