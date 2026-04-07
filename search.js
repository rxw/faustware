(() => {
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  const count = document.querySelector("[data-search-count]");

  if (!input || !results) return;

  let index = [];

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const tokenize = (value) =>
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);

  const scoreEntry = (entry, queryTokens) => {
    const haystack = `${entry.title} ${entry.description} ${entry.tags.join(" ")} ${entry.text}`.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      if (entry.title.toLowerCase().startsWith(token)) score += 40;
      if (entry.title.toLowerCase().includes(token)) score += 20;
      if (entry.tags.some((tag) => tag.includes(token))) score += 12;
      if (haystack.includes(token)) score += 5;
    }

    return score;
  };

  const render = (query) => {
    const tokens = tokenize(query);
    const matches = tokens.length
      ? index
          .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
          .map(({ entry }) => entry)
      : index.slice(0, 10);

    results.innerHTML = matches.length
      ? matches
          .map(
            (entry) => `
              <li>
                <a href="${escapeHtml(new URL(entry.url, window.location.href).href)}">${escapeHtml(entry.title)}</a>
                <div>${escapeHtml(entry.description)}</div>
              </li>
            `
          )
          .join("")
      : `<li class="search-empty">No results found.</li>`;

    if (count) {
      count.textContent = tokens.length ? `${matches.length} result${matches.length === 1 ? "" : "s"}` : `${index.length} posts`;
    }
  };

  fetch(new URL("../search.json", window.location.href))
    .then((response) => response.json())
    .then((data) => {
      index = Array.isArray(data) ? data : [];
      render(input.value);
    })
    .catch(() => {
      results.innerHTML = `<li class="search-empty">Search index unavailable.</li>`;
      if (count) count.textContent = "";
    });

  input.addEventListener("input", () => render(input.value));
})();
