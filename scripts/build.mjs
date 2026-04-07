import { promises as fs } from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { marked } from "marked";
import { site } from "../site.config.js";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const markdownOptions = {
  gfm: true,
  breaks: false,
  mangle: false,
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttr = (value = "") => escapeHtml(value).replaceAll("\n", " ");

const escapeScript = (value = "") => String(value).replaceAll("</script>", "<\\/script>");

const stripHtml = (html = "") =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const removeDir = async (dir) => {
  await fs.rm(dir, { recursive: true, force: true });
};

const writeFile = async (filePath, contents) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contents);
};

const readText = async (filePath) => fs.readFile(filePath, "utf8");

const toDate = (value, fallback = null) => {
  if (!value) return fallback;

  const normalizeCalendarDate = (year, month, day) =>
    new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  if (value instanceof Date) {
    return normalizeCalendarDate(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate()
    );
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return normalizeCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : normalizeCalendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
};

const formatDate = (date, options) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    ...options,
  }).format(date);

const formatDateIso = (date) => date.toISOString();

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pageUrl = (pathname) => {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

const relativeHref = (currentPath, targetPath) => {
  if (/^[a-z]+:\/\//i.test(targetPath)) return targetPath;

  const normalize = (value) => (value === "/" ? "/" : pageUrl(value));
  const targetIsDirectory = targetPath === "/" || targetPath.endsWith("/");
  if (normalize(currentPath) === normalize(targetPath)) {
    return targetIsDirectory ? "./" : ".";
  }

  const fromDir = currentPath === "/" ? "." : currentPath.replace(/^\//, "").replace(/\/$/, "");
  const toPath = targetPath === "/" ? "." : targetPath.replace(/^\//, "").replace(/\/$/, "");
  let relativePath = path.posix.relative(fromDir, toPath);

  if (targetIsDirectory && !relativePath.endsWith("/")) {
    relativePath += "/";
  }

  return relativePath || (targetIsDirectory ? "./" : path.posix.basename(toPath));
};

const postUrlFromDateAndSlug = (date, slug) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `/${yyyy}/${mm}/${dd}/${slug}/`;
};

const replaceJekyllPostUrls = (content, postsBySourceSlug) =>
  content.replace(/\{\%\s*post_url\s+([0-9]{4}-[0-9]{2}-[0-9]{2})-([^\s%]+)\s*\%\}/g, (_match, datePart, slugPart) => {
    const key = `${datePart}-${slugPart}`;
    return postsBySourceSlug.get(key) ?? `/`;
  });

const excerptFromHtml = (html) => {
  const stripped = stripHtml(html);
  return stripped.length > 220 ? `${stripped.slice(0, 217).trim()}...` : stripped;
};

const renderMarkdown = (markdown) => {
  const renderer = new marked.Renderer();
  const slugs = new Map();

  renderer.heading = (token) => {
    const base = slugify(stripHtml(String(token.text ?? "")));
    const count = slugs.get(base) ?? 0;
    slugs.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    return `<h${token.depth} id="${id}">${escapeHtml(token.text ?? "")}</h${token.depth}>`;
  };

  renderer.image = (token) => {
    const titleAttr = token.title ? ` title="${escapeAttr(token.title)}"` : "";
    return `<img src="${escapeAttr(token.href)}" alt="${escapeAttr(token.text ?? "")}"${titleAttr} loading="lazy" decoding="async">`;
  };

  const html = marked.parse(markdown, { ...markdownOptions, renderer });
  return html;
};

const rewriteRootRelativeUrls = (html, currentPath) =>
  html.replace(/\b(href|src)=["']\/(?!\/)([^"']+)["']/g, (_match, attr, targetPath) => {
    const value = relativeHref(currentPath, `/${targetPath}`);
    return `${attr}="${value}"`;
  });

const renderNav = (currentPath) => {
  const links = site.nav
    .map((item) => {
      const current = item.href === currentPath ? ' aria-current="page"' : "";
      return `<li><a href="${relativeHref(currentPath, item.href)}"${current}>${escapeHtml(item.title)}</a></li>`;
    })
    .join("");

  return `<header class="site-nav"><nav aria-label="Primary"><ul>${links}</ul></nav></header>`;
};

const renderShell = ({
  title,
  description = site.description,
  content,
  currentPath = "/",
  bodyClass = "",
  math = false,
  inlineCss = "",
  extraHead = "",
  extraBody = "",
}) => {
  const pageTitle = title ? `${title} - ${site.title}` : site.title;
  const mathHead = math
    ? `
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"], ["\\\\[", "\\\\]"]],
      },
      svg: { fontCache: "global" }
    };
  </script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="generator" content="faustware-static-site">
  <link rel="canonical" href="${new URL(currentPath, site.url).href}">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:type" content="${currentPath === "/" ? "website" : "article"}">
  <meta property="og:url" content="${new URL(currentPath, site.url).href}">
  <meta property="og:site_name" content="${escapeAttr(site.title)}">
  <link rel="stylesheet" href="${relativeHref(currentPath, "/styles.css")}">
  <style>${inlineCss}</style>
  <link rel="alternate" type="application/atom+xml" title="${escapeAttr(site.title)}" href="${relativeHref(currentPath, "/atom.xml")}">
  <link rel="alternate" type="application/json" title="${escapeAttr(site.title)}" href="${relativeHref(currentPath, "/feed.json")}">
  <link rel="sitemap" type="application/xml" title="sitemap" href="${relativeHref(currentPath, "/sitemap.xml")}">
  <link rel="icon" href="${relativeHref(currentPath, "/favicon.png")}">
  ${extraHead}
  ${mathHead}
</head>
<body class="${escapeAttr(bodyClass)}">
  <main>
    ${renderNav(currentPath)}
    <section class="content">
      ${content}
    </section>
  </main>
  ${extraBody}
</body>
</html>`;
};

const renderPostPage = (post, inlineCss) => {
  const currentPath = post.url;
  const tags = post.tags.length
    ? ` · ${post.tags
        .map((tag) => `<a href="${relativeHref(currentPath, `/tag/${slugify(tag)}/`)}">${escapeHtml(tag)}</a>`)
        .join(", ")}`
    : "";

  return renderShell({
    title: post.title,
    description: post.description,
    currentPath: post.url,
    inlineCss,
    bodyClass: "post-page",
    math: post.hasMath,
    content: `
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="meta">
          <time datetime="${formatDateIso(post.date)}">${formatDate(post.date, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</time>${tags}
        </p>
        ${rewriteRootRelativeUrls(post.html, post.url)}
      </article>
    `,
  });
};

const renderListingPage = ({ title, description, currentPath, items, emptyText, inlineCss }) =>
  renderShell({
    title,
    description,
    currentPath,
    inlineCss,
    content: `
      <article>
        <h1>${escapeHtml(title)}</h1>
        ${
          description
            ? `<p>${escapeHtml(description)}</p>`
            : ""
        }
        ${
          items.length
            ? `<ol class="tag-list">${items
                .map(
                  (item) => `<li><a href="${relativeHref(currentPath, item.url)}">${escapeHtml(item.title)}</a><time datetime="${formatDateIso(item.date)}">${formatDate(item.date, {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}</time></li>`
                )
                .join("")}</ol>`
            : `<p>${escapeHtml(emptyText)}</p>`
        }
      </article>
    `,
  });

const renderHomePage = (posts, aboutHtml, inlineCss) =>
  renderShell({
    title: "Home",
    description: site.description,
    currentPath: "/",
    inlineCss,
    content: `
      <article class="landing">
        <section class="landing-intro">
          ${aboutHtml}
        </section>
        <section class="landing-writing">
          <h2>Writing</h2>
          <ol class="posts">
            ${posts
              .map(
                (post) => `<li><a href="${relativeHref("/", post.url)}">${escapeHtml(post.title)}</a><time datetime="${formatDateIso(post.date)}">${formatDate(post.date, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}</time></li>`
              )
              .join("")}
          </ol>
        </section>
      </article>
    `,
  });

const renderSearchPage = (inlineCss, searchScript) =>
  renderShell({
    title: "Search",
    description: "Search across the writing archive.",
    currentPath: "/search/",
    inlineCss,
    bodyClass: "search-page",
    extraBody: `<script>${escapeScript(searchScript)}</script>`,
    content: `
      <article class="search-box">
        <h1>Search</h1>
        <p>Search the archive by title, tags, and body text.</p>
        <label for="search-input">Query</label>
        <input id="search-input" data-search-input type="search" placeholder="Search..." autocomplete="off">
        <div data-search-count></div>
        <ol data-search-results></ol>
      </article>
    `,
  });

const renderTagPage = (tag, posts, inlineCss) =>
  renderShell({
    title: `Tag: ${tag}`,
    description: `Posts tagged ${tag}.`,
    currentPath: `/tag/${slugify(tag)}/`,
    inlineCss,
    content: `
      <article>
        <h1>Tag: ${escapeHtml(tag)}</h1>
        <ol class="tag-list">
          ${posts
            .map(
              (post) => `<li><a href="${relativeHref(`/tag/${slugify(tag)}/`, post.url)}">${escapeHtml(post.title)}</a><time datetime="${formatDateIso(post.date)}">${formatDate(post.date, {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}</time></li>`
            )
            .join("")}
        </ol>
      </article>
    `,
  });

const renderAboutPage = (_page, inlineCss) =>
  renderShell({
    title: "About",
    description: site.description,
    currentPath: "/about/",
    inlineCss,
    extraHead: '<meta http-equiv="refresh" content="0; url=/">',
    content: `
      <article>
        <h1>About</h1>
        <p>This page moved to the homepage. <a href="/">Go there instead.</a></p>
      </article>
    `,
  });

const renderNotFoundPage = (inlineCss) =>
  renderShell({
    title: "404: Page not found",
    description: "Page not found.",
    currentPath: "/404.html",
    inlineCss,
    content: `
      <article>
        <h1>404: Page not found</h1>
        <p>Sorry, we've misplaced that URL or it's pointing to something that doesn't exist.</p>
      </article>
    `,
  });

const buildFeedJson = ({ posts }) =>
  JSON.stringify(
    {
      version: "https://jsonfeed.org/version/1",
      title: site.title,
      home_page_url: site.url,
      feed_url: `${site.url}/feed.json`,
      description: site.description,
      items: posts.map((post) => ({
        id: new URL(post.url, site.url).href,
        title: post.title,
        content_text: post.excerpt,
        content_html: post.html,
        url: new URL(post.url, site.url).href,
        tags: post.tags,
        date_published: formatDateIso(post.date),
        date_modified: formatDateIso(post.date),
      })),
    },
    null,
    2
  );

const buildAtomXml = ({ posts }) => {
  const updated = posts[0]?.date ?? new Date();
  const entries = posts
    .map(
      (post) => `
  <entry>
    <title>${escapeHtml(post.title)}</title>
    <link href="${new URL(post.url, site.url).href}"/>
    <id>${new URL(post.url, site.url).href}</id>
    <updated>${formatDateIso(post.date)}</updated>
    <content type="html">${escapeHtml(post.html)}</content>
  </entry>`
    )
    .join("");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeHtml(site.title)}</title>
  <link href="${site.url}/atom.xml" rel="self"/>
  <link href="${site.url}/"/>
  <updated>${formatDateIso(updated)}</updated>
  <id>${site.url}</id>
  <author>
    <name>${escapeHtml(site.author.name)}</name>
  </author>${entries}
</feed>`;
};

const buildSitemap = ({ pages, posts, tags }) => {
  const urls = [
    { loc: `${site.url}/`, lastmod: pages.home?.date ?? posts[0]?.date },
    { loc: `${site.url}/about/`, lastmod: pages.about?.date ?? posts[0]?.date },
    { loc: `${site.url}/search/`, lastmod: pages.search?.date ?? posts[0]?.date },
    ...posts.map((post) => ({ loc: new URL(post.url, site.url).href, lastmod: post.date })),
    ...Array.from(tags, ([tag, items]) => ({ loc: `${site.url}/tag/${slugify(tag)}/`, lastmod: items[0]?.date })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .filter((entry) => entry.lastmod)
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${formatDateIso(entry.lastmod)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
};

const copyFile = async (source, target) => {
  await ensureDir(path.dirname(target));
  await fs.copyFile(source, target);
};

const copyDirectory = async (sourceDir, targetDir) => {
  const files = await fg(["**/*"], { cwd: sourceDir, dot: true, onlyFiles: true });
  for (const file of files) {
    await copyFile(path.join(sourceDir, file), path.join(targetDir, file));
  }
};

const readCollection = async (dir, type) => {
  const files = await fg(["*.md"], { cwd: dir, onlyFiles: true });
  const entries = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = await readText(filePath);
    const parsed = matter(raw);
    const baseName = path.basename(file, ".md");
    const dateMatch = type === "post" ? baseName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/) : null;
    const date = type === "post" ? toDate(parsed.data.date ?? dateMatch?.[1]) : null;
    const slug = type === "post" ? dateMatch?.[2] ?? slugify(parsed.data.title ?? baseName) : slugify(baseName);

    const entry = {
      filePath,
      type,
      slug,
      date,
      title: parsed.data.title ?? baseName,
      tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      description: parsed.data.description ?? "",
      body: parsed.content.trim(),
    };

    entries.push(entry);
  }

  return entries;
};

const buildSite = async () => {
  await removeDir(distDir);
  await ensureDir(distDir);

  const [inlineCss, searchScript] = await Promise.all([
    readText(path.join(rootDir, "styles.css")),
    readText(path.join(rootDir, "search.js")),
  ]);

  const [postSources, pageSources] = await Promise.all([
    readCollection(path.join(rootDir, "_posts"), "post"),
    readCollection(path.join(rootDir, "_pages"), "page"),
  ]);

  const postsBySourceSlug = new Map();

  const posts = postSources
    .filter((post) => post.date)
    .sort((a, b) => b.date - a.date)
    .map((post) => {
      const url = postUrlFromDateAndSlug(post.date, post.slug);
      postsBySourceSlug.set(`${post.date.toISOString().slice(0, 10)}-${post.slug}`, url);
      return {
        ...post,
        url,
      };
    });

  const renderedPosts = posts.map((post) => {
    const content = replaceJekyllPostUrls(post.body, postsBySourceSlug);
    const html = renderMarkdown(content);
    return {
      ...post,
      html,
      excerpt: post.description || excerptFromHtml(html),
      hasMath: /\$(?:[^$]|\n)+\$|\\\[/m.test(content),
    };
  });

  const pages = {};
  const renderedPages = pageSources.map((page) => {
    const content = replaceJekyllPostUrls(page.body, postsBySourceSlug);
    const html = renderMarkdown(content);
    const url = pageUrl(`/${page.slug}`);
    const rendered = {
      ...page,
      url,
      html,
      excerpt: page.description || excerptFromHtml(html),
    };

    pages[page.slug] = rendered;
    return rendered;
  });

  const tags = new Map();
  for (const post of renderedPosts) {
    for (const tag of post.tags) {
      const key = tag;
      const list = tags.get(key) ?? [];
      list.push(post);
      tags.set(key, list);
    }
  }

  for (const [tag, items] of tags) {
    items.sort((a, b) => b.date - a.date);
    const tagDir = path.join(distDir, "tag", slugify(tag));
    await writeFile(path.join(tagDir, "index.html"), renderTagPage(tag, items, inlineCss));
  }

  await writeFile(path.join(distDir, "index.html"), renderHomePage(renderedPosts, pages.about.html, inlineCss));
  await writeFile(path.join(distDir, "about", "index.html"), renderAboutPage(pages.about, inlineCss));
  await writeFile(path.join(distDir, "search", "index.html"), renderSearchPage(inlineCss, searchScript));
  await writeFile(path.join(distDir, "404.html"), renderNotFoundPage(inlineCss));
  await writeFile(path.join(distDir, "atom.xml"), buildAtomXml({ posts: renderedPosts }));
  await writeFile(path.join(distDir, "feed.json"), buildFeedJson({ posts: renderedPosts }));
  await writeFile(path.join(distDir, "sitemap.xml"), buildSitemap({ pages, posts: renderedPosts, tags }));
  await writeFile(path.join(distDir, "robots.txt"), `User-agent: *\nSitemap: ${site.url}/sitemap.xml\n`);

  for (const post of renderedPosts) {
    await writeFile(path.join(distDir, post.url.slice(1), "index.html"), renderPostPage(post, inlineCss));
  }

  const searchIndex = renderedPosts.map((post) => ({
    title: post.title,
    url: post.url,
    description: post.excerpt,
    tags: post.tags,
    date: formatDateIso(post.date),
    text: stripHtml(post.html).toLowerCase(),
  }));

  await writeFile(path.join(distDir, "search.json"), JSON.stringify(searchIndex, null, 2));

  await copyFile(path.join(rootDir, "search.js"), path.join(distDir, "search.js"));
  await copyFile(path.join(rootDir, "styles.css"), path.join(distDir, "styles.css"));
  await copyFile(path.join(rootDir, "favicon.png"), path.join(distDir, "favicon.png"));
  await copyDirectory(path.join(rootDir, "images"), path.join(distDir, "images"));
};

buildSite().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
