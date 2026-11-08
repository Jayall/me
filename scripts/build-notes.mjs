import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const notesDir = path.join(root, "src", "notes");
const generatedDir = path.join(root, "src", "generated");
const generatedNotesDir = path.join(generatedDir, "notes");
const publicNotesDir = path.join(root, "public", "notes");

const THEOREM_ENVS = {
  theorem: { label: "Theorem", numbered: true },
  lemma: { label: "Lemma", numbered: true },
  corollary: { label: "Corollary", numbered: true },
  proposition: { label: "Proposition", numbered: true },
  definition: { label: "Definition", numbered: true },
  remark: { label: "Remark", numbered: true },
  example: { label: "Example", numbered: true },
  claim: { label: "Claim", numbered: true },
  proof: { label: "Proof", numbered: false },
};

const LIST_ENVS = new Set(["itemize", "enumerate", "description"]);
const CODE_ENVS = new Set(["lstlisting", "verbatim", "Verbatim", "minted", "code"]);
const TABLE_ENVS = new Set(["tabular", "tabularx", "longtable"]);
const FLOAT_ENVS = new Set(["table", "figure"]);
const DISPLAY_ENVS = new Set([
  "equation",
  "equation*",
  "align",
  "align*",
  "gather",
  "gather*",
  "eqnarray",
  "eqnarray*",
  "multline",
  "multline*",
  "displaymath",
  "math",
]);
const WRAPPED_MATH_ENVS = new Set([
  "align",
  "align*",
  "gather",
  "gather*",
  "eqnarray",
  "eqnarray*",
  "multline",
  "multline*",
]);

const IGNORED_COMMANDS =
  /^\s*\\(maketitle|tableofcontents|newpage|clearpage|pagebreak|appendix|documentclass|usepackage|title|author|date|bibliography|bibliographystyle)\b/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripComment(line) {
  let escaped = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "%") return line.slice(0, i);
  }
  return line;
}

function takeBracedAt(text, start) {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i += 1;
  if (text[i] !== "{") return null;
  let depth = 1;
  let value = "";
  i += 1;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\") {
      value += ch + (text[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (ch === "{") {
      depth += 1;
      value += ch;
      i += 1;
      continue;
    }
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return { value, next: i + 1 };
      value += ch;
      i += 1;
      continue;
    }
    value += ch;
    i += 1;
  }
  return null;
}

function takeOptionalAt(text, start) {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i += 1;
  if (text[i] !== "[") return null;
  let depth = 1;
  let value = "";
  i += 1;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\") {
      value += ch + (text[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (ch === "[") {
      depth += 1;
      value += ch;
      i += 1;
      continue;
    }
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) return { value, next: i + 1 };
      value += ch;
      i += 1;
      continue;
    }
    value += ch;
    i += 1;
  }
  return null;
}

function plainText(value) {
  return String(value)
    .replace(/\$[^$]*\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\\[A-Za-z]+\*?(?:\[[^\]]*\])?(?:\{[^{}]*\})?/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return (
    plainText(value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

function uniqueId(base, state) {
  const clean = base || "section";
  let id = clean;
  let n = 2;
  while (state.usedIds.has(id)) {
    id = `${clean}-${n}`;
    n += 1;
  }
  state.usedIds.add(id);
  return id;
}

function rawInline(value) {
  return `<code class="latex-raw-inline" title="Unsupported LaTeX command">${escapeHtml(value)}</code>`;
}

function rawBlock(value, label) {
  return `<div class="latex-raw" role="note"><p class="latex-raw-label">${escapeHtml(label)}</p><pre><code>${escapeHtml(value)}</code></pre></div>`;
}

function renderInlineMath(tex) {
  return `<span class="note-math-inline" data-math-tex="${escapeHtml(tex)}" data-display="false"></span>`;
}

function renderDisplayMath(tex, state, { source = tex, id = "", number = null } = {}) {
  return `<div class="note-math-display"${id ? ` id="${escapeHtml(id)}"` : ""} data-number="${number ?? ""}">
  <div class="note-math-body" data-math-tex="${escapeHtml(tex)}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="${escapeHtml(source)}" aria-label="Copy LaTeX source">copy</button>
</div>`;
}

function formatText(value) {
  return escapeHtml(value)
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/~/g, "&nbsp;")
    .replace(/``/g, "“")
    .replace(/''/g, "”")
    .replace(/`/g, "‘")
    .replace(/'/g, "’");
}

const SIMPLE_COMMANDS = {
  LaTeX: "LaTeX",
  TeX: "TeX",
  ldots: "…",
  dots: "…",
  textendash: "–",
  textemdash: "—",
  textbackslash: "\\",
  S: "§",
  P: "¶",
  copyright: "©",
  newline: "<br />",
  noindent: "",
  centering: "",
  quad: "&nbsp;&nbsp;",
  qquad: "&nbsp;&nbsp;&nbsp;&nbsp;",
};

const FORMAT_COMMANDS = {
  textbf: "strong",
  textit: "em",
  emph: "em",
  texttt: "code",
  underline: "u",
  textsuperscript: "sup",
  textsubscript: "sub",
};

function handleCommand(text, index, state) {
  const rest = text.slice(index);

  if (rest.startsWith("\\\\")) return { html: "<br />", next: index + 2 };
  if (rest.startsWith("\\ ")) return { html: "&nbsp;", next: index + 2 };
  if (rest.startsWith("\\,") || rest.startsWith("\\;") || rest.startsWith("\\:") || rest.startsWith("\\!")) {
    return { html: " ", next: index + 2 };
  }

  const escaped = {
    "\\%": "%",
    "\\&": "&amp;",
    "\\#": "#",
    "\\_": "_",
    "\\$": "$",
    "\\{": "{",
    "\\}": "}",
  };
  for (const [token, value] of Object.entries(escaped)) {
    if (rest.startsWith(token)) return { html: value, next: index + token.length };
  }

  const match = rest.match(/^\\([A-Za-z]+)\*?/);
  if (!match) return { html: escapeHtml(text[index]), next: index + 1 };

  const name = match[1];
  const afterName = index + match[0].length;

  if (SIMPLE_COMMANDS[name] !== undefined) {
    return { html: SIMPLE_COMMANDS[name], next: afterName };
  }

  if (FORMAT_COMMANDS[name]) {
    const arg = takeBracedAt(text, afterName);
    if (arg) {
      if (name === "textsc") {
        return { html: `<span class="small-caps">${renderInline(arg.value, state)}</span>`, next: arg.next };
      }
      const tag = FORMAT_COMMANDS[name];
      return { html: `<${tag}>${renderInline(arg.value, state)}</${tag}>`, next: arg.next };
    }
  }

  if (name === "href") {
    const url = takeBracedAt(text, afterName);
    const label = url ? takeBracedAt(text, url.next) : null;
    if (url && label) {
      return {
        html: `<a href="${escapeHtml(url.value)}">${renderInline(label.value, state)}</a>`,
        next: label.next,
      };
    }
  }

  if (name === "url") {
    const url = takeBracedAt(text, afterName);
    if (url) {
      return {
        html: `<a href="${escapeHtml(url.value)}">${escapeHtml(url.value)}</a>`,
        next: url.next,
      };
    }
  }

  if (name === "footnote") {
    const arg = takeBracedAt(text, afterName);
    if (arg) {
      const n = state.footnotes.length + 1;
      const html = renderInline(arg.value, state);
      state.footnotes.push({ n, html });
      return {
        html: `<sup class="fn-ref" id="fnref-${n}"><a href="#fn-${n}">${n}</a></sup>`,
        next: arg.next,
      };
    }
  }

  if (name === "label") {
    const arg = takeBracedAt(text, afterName);
    if (arg) {
      state.labels[arg.value] = state.labels[arg.value] || { number: "", href: "" };
      return { html: "", next: arg.next };
    }
  }

  if (name === "ref" || name === "eqref") {
    const arg = takeBracedAt(text, afterName);
    if (arg) {
      const token = name === "eqref" ? `@@EQREF:${arg.value}@@` : `@@REF:${arg.value}@@`;
      return { html: token, next: arg.next };
    }
  }

  if (name === "cite" || name === "citep" || name === "citet") {
    const arg = takeBracedAt(text, afterName);
    if (arg) {
      return { html: rawInline(`\\${name}{${arg.value}}`), next: arg.next };
    }
  }

  if (name === "verb") {
    const delimiter = text[afterName];
    if (delimiter && delimiter !== " ") {
      const end = text.indexOf(delimiter, afterName + 1);
      if (end !== -1) {
        return {
          html: `<code>${escapeHtml(text.slice(afterName + 1, end))}</code>`,
          next: end + 1,
        };
      }
    }
  }

  let raw = match[0];
  let cursor = afterName;
  for (let i = 0; i < 2; i += 1) {
    const optional = takeOptionalAt(text, cursor);
    if (optional) {
      raw += text.slice(cursor, optional.next);
      cursor = optional.next;
      continue;
    }
    const braced = takeBracedAt(text, cursor);
    if (braced) {
      raw += text.slice(cursor, braced.next);
      cursor = braced.next;
      continue;
    }
    break;
  }
  return { html: rawInline(raw), next: cursor };
}

function renderInline(text, state) {
  let out = "";
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === "$" && text[i + 1] !== "$") {
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === "\\") {
          j += 2;
          continue;
        }
        if (text[j] === "$") break;
        j += 1;
      }
      if (j < text.length) {
        out += renderInlineMath(text.slice(i + 1, j));
        i = j + 1;
        continue;
      }
    }

    if (ch === "\\" && text[i + 1] === "(") {
      const end = text.indexOf("\\)", i + 2);
      if (end !== -1) {
        out += renderInlineMath(text.slice(i + 2, end));
        i = end + 2;
        continue;
      }
    }

    if (ch === "$") {
      out += "$";
      i += 1;
      continue;
    }

    if (ch === "\\") {
      const handled = handleCommand(text, i, state);
      out += handled.html;
      i = handled.next;
      continue;
    }

    let j = i;
    let buffer = "";
    while (j < text.length && text[j] !== "$" && text[j] !== "\\") {
      buffer += text[j];
      j += 1;
    }
    out += formatText(buffer);
    i = j;
  }

  return out;
}

function extractEnv(lines, startIndex, env) {
  const beginToken = `\\begin{${env}}`;
  const endToken = `\\end{${env}}`;
  const innerLines = [];
  let depth = 1;
  let i = startIndex;
  const firstLine = lines[i];
  const beginPos = firstLine.indexOf(beginToken);
  let cursor = beginPos === -1 ? 0 : beginPos + beginToken.length;

  while (i < lines.length) {
    const text = i === startIndex ? firstLine.slice(cursor) : lines[i];
    let searchFrom = 0;
    let segmentStart = 0;

    while (true) {
      const nextBegin = text.indexOf(beginToken, searchFrom);
      const nextEnd = text.indexOf(endToken, searchFrom);

      if (nextBegin === -1 && nextEnd === -1) {
        innerLines.push(text.slice(segmentStart));
        break;
      }

      if (nextEnd !== -1 && (nextBegin === -1 || nextEnd < nextBegin)) {
        if (depth === 1) {
          innerLines.push(text.slice(segmentStart, nextEnd));
          return {
            innerLines,
            endIndex: i,
            endRest: text.slice(nextEnd + endToken.length),
          };
        }
        innerLines.push(text.slice(segmentStart, nextEnd + endToken.length));
        depth -= 1;
        searchFrom = nextEnd + endToken.length;
        segmentStart = searchFrom;
        continue;
      }

      innerLines.push(text.slice(segmentStart, nextBegin + beginToken.length));
      depth += 1;
      searchFrom = nextBegin + beginToken.length;
      segmentStart = searchFrom;
    }

    i += 1;
    cursor = 0;
  }

  return { innerLines, endIndex: lines.length - 1, endRest: "" };
}

function isBlockStart(line) {
  const trimmed = line.trimStart();
  return (
    /^\\begin\{/.test(trimmed) ||
    /^\\(section|subsection|subsubsection)\b/.test(trimmed) ||
    /^\\\[/.test(trimmed) ||
    /^\$\$/.test(trimmed) ||
    /^\\end\{document\}/.test(trimmed) ||
    IGNORED_COMMANDS.test(trimmed)
  );
}

function collectDisplayMath(lines, startIndex) {
  const start = stripComment(lines[startIndex]).trim();
  const texLines = [];
  let i = startIndex;

  if (start.startsWith("\\[")) {
    const rest = start.slice(2);
    const end = rest.indexOf("\\]");
    if (end !== -1) return { tex: rest.slice(0, end), next: i + 1 };
    texLines.push(rest);
    i += 1;
    while (i < lines.length) {
      const line = stripComment(lines[i]);
      const idx = line.indexOf("\\]");
      if (idx !== -1) {
        texLines.push(line.slice(0, idx));
        return { tex: texLines.join("\n").trim(), next: i + 1 };
      }
      texLines.push(line);
      i += 1;
    }
  } else {
    const rest = start.slice(2);
    const end = rest.indexOf("$$");
    if (end !== -1) return { tex: rest.slice(0, end), next: i + 1 };
    texLines.push(rest);
    i += 1;
    while (i < lines.length) {
      const line = stripComment(lines[i]);
      const idx = line.indexOf("$$");
      if (idx !== -1) {
        texLines.push(line.slice(0, idx));
        return { tex: texLines.join("\n").trim(), next: i + 1 };
      }
      texLines.push(line);
      i += 1;
    }
  }

  return { tex: texLines.join("\n").trim(), next: i + 1 };
}

function renderHeading(line, state) {
  const match = line.match(/^\s*\\(section|subsection|subsubsection)(\*?)\s*/);
  if (!match) return { html: rawBlock(line, "Unsupported heading"), next: 1 };

  const command = match[1];
  let rest = line.slice(match[0].length);
  const optional = takeOptionalAt(rest, 0);
  if (optional) rest = rest.slice(optional.next);

  const titleArg = takeBracedAt(rest, 0);
  if (!titleArg) return { html: rawBlock(line, "Unsupported heading"), next: 1 };

  const title = titleArg.value;
  rest = rest.slice(titleArg.next);
  const labelMatch = rest.match(/\\label\{([^}]+)\}/);
  const label = labelMatch ? labelMatch[1] : null;
  const id = label ? uniqueId(slugify(label), state) : uniqueId(slugify(title), state);
  const level = command === "section" ? 2 : command === "subsection" ? 3 : 4;

  if (label) {
    state.labels[label] = { number: plainText(title), href: id };
  }

  state.headings.push({ id, text: plainText(title) || "Section", level });

  return {
    html: `<h${level} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>${renderInline(title, state)}</h${level}>`,
    next: 1,
  };
}

function splitItems(innerLines) {
  const items = [];
  let current = null;
  let depth = 0;

  for (const line of innerLines) {
    const beginCount = (line.match(/\\begin\{/g) || []).length;
    const endCount = (line.match(/\\end\{/g) || []).length;
    const itemMatch = depth === 0 ? line.match(/^\s*\\item\b(?:\[([^\]]*)\])?\s*/) : null;

    if (itemMatch) {
      if (current) items.push(current);
      current = {
        lines: [line.slice(itemMatch[0].length)],
        label: itemMatch[1] || null,
      };
    } else if (current) {
      current.lines.push(line);
    }

    depth += beginCount - endCount;
  }

  if (current) items.push(current);
  return items;
}

function renderList(env, innerLines, state) {
  const items = splitItems(innerLines);
  const tag = env === "enumerate" ? "ol" : env === "description" ? "dl" : "ul";
  const html = items
    .map((item) => {
      const body = renderBlocks(item.lines, state);
      if (env === "description") {
        return `<dt>${item.label ? renderInline(item.label, state) : ""}</dt><dd>${body}</dd>`;
      }
      return `<li>${body}</li>`;
    })
    .join("\n");

  return `<${tag} class="note-list note-${env}">${html}</${tag}>`;
}

function renderCode(env, innerLines) {
  let language = "";
  let first = innerLines[0] ?? "";

  const optional = takeOptionalAt(first, 0);
  if (optional) {
    const langMatch = optional.value.match(/(?:language|lang)\s*=\s*([A-Za-z0-9_+-]+)/i);
    if (langMatch) language = langMatch[1];
    first = first.slice(optional.next);
  }

  if (env === "minted") {
    const braced = takeBracedAt(first, 0);
    if (braced) {
      language = braced.value.trim();
      first = first.slice(braced.next);
    }
  }

  innerLines[0] = first;
  const code = innerLines.join("\n").replace(/^\n+|\n+$/g, "");
  const caption = language ? `<figcaption>Listing · ${escapeHtml(language)}</figcaption>` : "";
  const className = language ? ` class="language-${escapeHtml(language.toLowerCase())}"` : "";

  return `<figure class="note-code">${caption}<pre><code${className}>${escapeHtml(code)}</code></pre></figure>`;
}

function splitCells(line) {
  const cells = [];
  let current = "";
  let escaped = false;

  for (const ch of line) {
    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      current += ch;
      escaped = true;
      continue;
    }
    if (ch === "&") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function renderTable(env, innerLines, state) {
  let first = innerLines[0] ?? "";
  const optional = takeOptionalAt(first, 0);
  if (optional) first = first.slice(optional.next);

  if (env !== "longtable") {
    const braced = takeBracedAt(first, 0);
    if (braced) first = first.slice(braced.next);
  }
  innerLines[0] = first;

  const rows = [];
  let currentRow = [];
  let hasHead = false;

  for (const rawLine of innerLines) {
    const line = stripComment(rawLine).trim();
    if (!line) continue;

    if (/^\\(?:hline|toprule|midrule|bottomrule|endhead|endfoot|endlastfoot|cline\{[^}]*\})/.test(line)) {
      if (rows.length === 1) hasHead = true;
      continue;
    }

    const parts = line.split(/\\\\/);
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i].trim();
      if (part) currentRow.push(...splitCells(part));
      if (i < parts.length - 1) {
        if (currentRow.length) rows.push(currentRow);
        currentRow = [];
      }
    }
  }

  if (currentRow.length) rows.push(currentRow);

  const bodyRows = rows.filter((row) => row.some((cell) => cell.trim()));
  if (!bodyRows.length) {
    const raw = `\\begin{${env}}\n${innerLines.join("\n")}\n\\end{${env}}`;
    return rawBlock(raw, `Unsupported table: ${env}`);
  }

  const head = hasHead ? bodyRows[0] : null;
  const body = hasHead ? bodyRows.slice(1) : bodyRows;
  const renderRow = (row, tag) =>
    `<tr>${row.map((cell) => `<${tag}>${renderInline(cell, state)}</${tag}>`).join("")}</tr>`;

  const headHtml = head ? `<thead>${renderRow(head, "th")}</thead>` : "";
  const bodyHtml = `<tbody>${body.map((row) => renderRow(row, "td")).join("")}</tbody>`;

  return `<div class="note-table-wrap"><table class="note-table">${headHtml}${bodyHtml}</table></div>`;
}

function renderFloat(env, innerLines, state) {
  let caption = null;
  const cleaned = [];
  const floatLines = [...innerLines];
  const position = takeOptionalAt(floatLines[0] ?? "", 0);
  if (position) floatLines[0] = (floatLines[0] ?? "").slice(position.next);

  for (const rawLine of floatLines) {
    const line = stripComment(rawLine);
    const capMatch = line.match(/\\caption\s*\{/);

    if (capMatch) {
      const braced = takeBracedAt(line, capMatch.index + capMatch[0].length - 1);
      if (braced) {
        caption = braced.value;
        const before = line.slice(0, capMatch.index);
        const after = line.slice(braced.next);
        if (before.trim()) cleaned.push(before);
        if (after.trim()) cleaned.push(after);
        continue;
      }
    }

    if (/^\s*\\(?:centering|hfill)\s*$/.test(line) || /^\s*\\label\{[^}]*\}\s*$/.test(line)) {
      continue;
    }

    cleaned.push(rawLine);
  }

  const body = renderBlocks(cleaned, state);
  const captionHtml = caption ? `<figcaption>${renderInline(caption, state)}</figcaption>` : "";
  return `<figure class="note-figure note-${env}">${body}${captionHtml}</figure>`;
}

function renderTheorem(env, innerLines, state) {
  const definition = THEOREM_ENVS[env];
  let title = null;
  let first = innerLines[0] ?? "";
  const optional = takeOptionalAt(first, 0);

  if (optional) {
    title = optional.value;
    innerLines[0] = first.slice(optional.next);
  }

  let bodyLines = innerLines;
  let label = null;
  let depth = 0;
  bodyLines = bodyLines.map((line) => {
    let cleanedLine = line;
    if (depth === 0 && !/\\begin\{|\\end\{/.test(line)) {
      const labelMatch = line.match(/\\label\{([^}]+)\}/);
      if (labelMatch) {
        label = labelMatch[1];
        cleanedLine = line.replace(/\\label\{[^}]+\}/g, "");
      }
    }
    depth += (line.match(/\\begin\{/g) || []).length - (line.match(/\\end\{/g) || []).length;
    return cleanedLine;
  });

  let number = null;
  if (definition.numbered) {
    state.theoremCounters[env] = (state.theoremCounters[env] || 0) + 1;
    number = state.theoremCounters[env];
  } else {
    state.proofCounter = (state.proofCounter || 0) + 1;
  }

  const idBase = label ? slugify(label) : `${env}-${number ?? state.proofCounter}`;
  const id = uniqueId(idBase, state);
  const labelText = definition.numbered ? `${definition.label} ${number}` : definition.label;

  if (label) state.labels[label] = { number: labelText, href: id };

  const body = renderBlocks(bodyLines, state);
  const qed = env === "proof" ? `<span class="proof-qed" aria-label="end of proof">∎</span>` : "";
  const titleHtml = title ? `<span class="theorem-name">${renderInline(title, state)}</span>` : "";

  return `<div class="theorem-block theorem-${env}" id="${id}">
  <div class="theorem-head"><span class="theorem-label">${escapeHtml(labelText)}</span>${titleHtml}</div>
  <div class="theorem-body">${body}${qed}</div>
</div>`;
}

function renderDisplayEnvironment(env, innerLines, state) {
  let source = innerLines.join("\n").trim();
  let tex = source;
  let label = null;
  const labelMatch = source.match(/\\label\{([^}]+)\}/);

  if (labelMatch) {
    label = labelMatch[1];
    tex = tex.replace(/\\label\{[^}]+\}/g, "");
  }

  const wrapped = WRAPPED_MATH_ENVS.has(env);
  if (wrapped) {
    tex = `\\begin{${env}}\n${tex}\n\\end{${env}}`;
  }

  let number = null;
  if (env === "equation") {
    number = state.equationCounter + 1;
    state.equationCounter = number;
    if (!/\\tag\s*\{/.test(tex)) tex = `${tex} \\tag{${number}}`;
  }

  let id = "";
  if (label) {
    id = uniqueId(slugify(label), state);
    state.labels[label] = { number: number ? String(number) : "", href: id };
  }

  return renderDisplayMath(tex, state, {
    source: wrapped ? tex : source,
    id,
    number,
  });
}

function renderEnvironment(env, innerLines, state) {
  if (env === "document") return renderBlocks(innerLines, state);
  if (LIST_ENVS.has(env)) return renderList(env, innerLines, state);
  if (CODE_ENVS.has(env)) return renderCode(env, innerLines);
  if (TABLE_ENVS.has(env)) return renderTable(env, innerLines, state);
  if (FLOAT_ENVS.has(env)) return renderFloat(env, innerLines, state);
  if (DISPLAY_ENVS.has(env)) return renderDisplayEnvironment(env, innerLines, state);
  if (THEOREM_ENVS[env]) return renderTheorem(env, innerLines, state);

  if (env === "abstract") {
    return `<div class="note-abstract"><p class="note-abstract-label">Abstract</p>${renderBlocks(innerLines, state)}</div>`;
  }
  if (env === "quote" || env === "quotation") {
    return `<blockquote class="note-quote">${renderBlocks(innerLines, state)}</blockquote>`;
  }
  if (env === "center") {
    return `<div class="note-center">${renderBlocks(innerLines, state)}</div>`;
  }
  if (env === "flushleft" || env === "flushright") {
    return `<div class="note-${env}">${renderBlocks(innerLines, state)}</div>`;
  }

  const raw = `\\begin{${env}}\n${innerLines.join("\n")}\n\\end{${env}}`;
  return rawBlock(raw, `Unsupported LaTeX environment: ${env}`);
}

function renderBlocks(lines, state) {
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = stripComment(lines[i]);

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const beginMatch = line.match(/^\s*\\begin\{([^}]+)\}/);
    if (beginMatch) {
      const env = beginMatch[1];
      const extracted = extractEnv(lines, i, env);
      out.push(renderEnvironment(env, extracted.innerLines, state));
      i = extracted.endIndex + 1;
      continue;
    }

    if (/^\s*\\(section|subsection|subsubsection)\b/.test(line)) {
      const heading = renderHeading(line, state);
      out.push(heading.html);
      i += heading.next;
      continue;
    }

    if (/^\s*\\\[/.test(line) || /^\s*\$\$/.test(line)) {
      const display = collectDisplayMath(lines, i);
      out.push(renderDisplayMath(display.tex, state, { source: display.tex }));
      i = display.next;
      continue;
    }

    if (/^\s*\\end\{document\}/.test(line)) {
      i += 1;
      continue;
    }

    if (IGNORED_COMMANDS.test(line)) {
      i += 1;
      continue;
    }

    if (/^\s*\\end\{/.test(line)) {
      out.push(rawBlock(line, "Unexpected \\end"));
      i += 1;
      continue;
    }

    const paragraphLines = [];
    while (i < lines.length) {
      const candidate = stripComment(lines[i]);
      if (!candidate.trim()) break;
      if (isBlockStart(candidate)) break;
      paragraphLines.push(candidate);
      i += 1;
    }

    if (paragraphLines.length) {
      out.push(`<p>${renderInline(paragraphLines.join(" "), state)}</p>`);
    }
  }

  return out.join("\n");
}

function renderFootnotes(state) {
  if (!state.footnotes.length) return "";
  const items = state.footnotes
    .map(
      (footnote) =>
        `<li id="fn-${footnote.n}">${footnote.html} <a class="fn-back" href="#fnref-${footnote.n}" aria-label="Back to reference ${footnote.n}">↩</a></li>`,
    )
    .join("\n");
  return `\n<section class="note-footnotes" aria-label="Footnotes">\n<h2>Footnotes</h2>\n<ol>\n${items}\n</ol>\n</section>`;
}

function resolveReferences(html, state) {
  return html
    .replace(/@@EQREF:([^@]+)@@/g, (_, key) => {
      const target = state.labels[key];
      return target && target.number ? `(${escapeHtml(target.number)})` : "(??)";
    })
    .replace(/@@REF:([^@]+)@@/g, (_, key) => {
      const target = state.labels[key];
      return target ? escapeHtml(target.number || target.href || "??") : "??";
    });
}

function extractMacros(body) {
  const macros = {};
  let cleaned = body.replace(
    /\\newcommand\s*\{\\([A-Za-z]+)\}\s*(?:\[(\d+)\])?\s*\{([\s\S]*?)\}/g,
    (_, name, argc, definition) => {
      macros[`\\${name}`] = definition.trim();
      return "";
    },
  );

  cleaned = cleaned.replace(
    /\\renewcommand\s*\{\\([A-Za-z]+)\}\s*(?:\[(\d+)\])?\s*\{([\s\S]*?)\}/g,
    (_, name, argc, definition) => {
      macros[`\\${name}`] = definition.trim();
      return "";
    },
  );

  cleaned = cleaned.replace(
    /\\DeclareMathOperator\*?\s*\{\\([A-Za-z]+)\}\s*\{([^{}]*)\}/g,
    (_, name, operator) => {
      macros[`\\${name}`] = `\\operatorname{${operator}}`;
      return "";
    },
  );

  return { macros, body: cleaned };
}

function findCommandArg(text, command) {
  const pattern = new RegExp(`\\\\${command}\\b`);
  const match = pattern.exec(text);
  if (!match) return null;

  let cursor = match.index + match[0].length;
  const optional = takeOptionalAt(text, cursor);
  if (optional) cursor = optional.next;
  const arg = takeBracedAt(text, cursor);
  return arg ? arg.value.trim() : null;
}

function extractLatexMeta(text) {
  const begin = text.indexOf("\\begin{document}");
  const preamble = begin === -1 ? text : text.slice(0, begin);
  return {
    title: findCommandArg(preamble, "title"),
    date: findCommandArg(preamble, "date"),
  };
}

function stripDocumentWrapper(text) {
  const beginToken = "\\begin{document}";
  const endToken = "\\end{document}";
  const begin = text.indexOf(beginToken);
  if (begin === -1) return text;

  const start = begin + beginToken.length;
  const end = text.lastIndexOf(endToken);
  return end > start ? text.slice(start, end) : text.slice(start);
}

function parseNote(source, fileName) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const meta = {};
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      bodyStart = i + 1;
      continue;
    }
    const match = line.match(/^\s*%\s*([A-Za-z_-]+)\s*:\s*(.*)$/);
    if (match) {
      const key = match[1].toLowerCase();
      if (["title", "overview", "date", "tags"].includes(key)) {
        meta[key] = match[2].trim();
      }
      bodyStart = i + 1;
      continue;
    }
    break;
  }

  const slug = path.basename(fileName, ".tex");
  const body = lines.slice(bodyStart).join("\n");
  const latexMeta = extractLatexMeta(body);
  return {
    slug,
    title: meta.title || latexMeta.title || slug,
    overview: meta.overview || "",
    date: meta.date || latexMeta.date || "",
    tags: meta.tags
      ? meta.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    body,
  };
}

function estimateReadingMinutes(html) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function hasPandoc() {
  try {
    const result = spawnSync("pandoc", ["--version"], { stdio: "ignore" });
    return result.status === 0;
  } catch {
    return false;
  }
}

function convertWithPandoc(filePath) {
  const result = spawnSync(
    "pandoc",
    [
      filePath,
      "--from=latex",
      "--to=html5",
      "--katex",
      "--shift-heading-level-by=1",
      "--wrap=none",
    ],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
  return result.status === 0 && result.stdout ? result.stdout : null;
}

function normalizePandocHtml(html, state) {
  let output = html
    .replace(/<link[^>]+katex[^>]*>/gi, "")
    .replace(/<script[^>]*katex[^>]*>[\s\S]*?<\/script>/gi, "");

  output = output.replace(/<span class="math inline">\\\(([\s\S]*?)\\\)<\/span>/g, (_, tex) =>
    renderInlineMath(tex),
  );
  output = output.replace(/<span class="math display">\\\[([\s\S]*?)\\\]<\/span>/g, (_, tex) =>
    renderDisplayMath(tex, state),
  );
  output = output.replace(/<div class="math display">\\\[([\s\S]*?)\\\]<\/div>/g, (_, tex) =>
    renderDisplayMath(tex, state),
  );

  output = output.replace(/<section[^>]*class="[^"]*footnotes[^"]*"[^>]*>/g, () =>
    '<section class="note-footnotes" aria-label="Footnotes">',
  );

  output = output.replace(/<div class="(theorem|lemma|corollary|proposition|definition|remark|example|proof)">/g, (_, env) =>
    `<div class="theorem-block theorem-${env}">`,
  );

  output = output.replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, attrs, inner) => {
    const idMatch = attrs.match(/id="([^"]+)"/);
    const text = inner
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    const id = idMatch ? idMatch[1] : uniqueId(slugify(text), state);
    state.headings.push({ id, text: text || "Section", level: Number(level) });
    const cleanAttrs = attrs.replace(/\s*id="[^"]*"/, "");
    return `<h${level}${cleanAttrs} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>${inner}</h${level}>`;
  });

  return output;
}

async function build() {
  await fs.mkdir(notesDir, { recursive: true });
  await fs.rm(generatedNotesDir, { recursive: true, force: true });
  await fs.rm(publicNotesDir, { recursive: true, force: true });
  await fs.mkdir(generatedNotesDir, { recursive: true });
  await fs.mkdir(publicNotesDir, { recursive: true });

  const entries = await fs.readdir(notesDir, { withFileTypes: true });
  const texFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tex"))
    .map((entry) => entry.name)
    .sort();

  const pandoc = hasPandoc();
  const index = [];

  for (const fileName of texFiles) {
    const sourcePath = path.join(notesDir, fileName);
    const source = await fs.readFile(sourcePath, "utf8");
    const note = parseNote(source, fileName);
    const { macros, body: cleanedBody } = extractMacros(note.body);
    const body = stripDocumentWrapper(cleanedBody);

    const state = {
      headings: [],
      labels: {},
      footnotes: [],
      theoremCounters: {},
      equationCounter: 0,
      proofCounter: 0,
      usedIds: new Set(),
    };

    let html;
    const pandocHtml = pandoc ? convertWithPandoc(sourcePath) : null;

    if (pandocHtml) {
      html = normalizePandocHtml(pandocHtml, state);
    } else {
      const lines = body.replace(/\r\n/g, "\n").split("\n");
      html = `${renderBlocks(lines, state)}${renderFootnotes(state)}`;
    }

    html = resolveReferences(html, state);

    const record = {
      slug: note.slug,
      title: note.title,
      overview: note.overview,
      date: note.date,
      tags: note.tags,
      readingMinutes: estimateReadingMinutes(html),
      headings: state.headings,
      macros,
      html,
    };

    await fs.writeFile(
      path.join(generatedNotesDir, `${note.slug}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
      "utf8",
    );
    await fs.copyFile(sourcePath, path.join(publicNotesDir, `${note.slug}.tex`));

    index.push({
      slug: note.slug,
      title: note.title,
      overview: note.overview,
      date: note.date,
      tags: note.tags,
      readingMinutes: record.readingMinutes,
    });
  }

  index.sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.title.localeCompare(b.title));

  await fs.writeFile(
    path.join(generatedDir, "notes.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8",
  );

  const mode = pandoc ? "Pandoc" : "pure-JS fallback (Pandoc not found)";
  console.log(`[notes] converted ${index.length} note(s) with ${mode}`);
  for (const note of index) {
    console.log(`[notes] ${note.slug}: ${note.title}`);
  }
}

build().catch((error) => {
  console.error("[notes] conversion failed");
  console.error(error);
  process.exitCode = 1;
});
