import { Marked } from "marked";
import hls from "highlight.js";
import { kebabCase } from "lodash";
import { jetbrains } from "../_fonts";

const myMDParser = new Marked({
  gfm: true,
  renderer: {
    heading({ text, tokens, depth }) {
      const html = this.parser.parseInline(tokens) as string;
      const titleName = kebabCase(text);

      return `
      <h${depth} class="blog-heading${depth} blog-heading" id="${titleName}">
        <a name="${titleName}" class="blog-anchor blog-heading-anchor" href="#${titleName}">
          ${html}
        </a>
      </h${depth}>`;
    },
    paragraph({ tokens }) {
      const html = this.parser.parseInline(tokens) as string;
      return `<p class="blog-para">${html}</p>`;
    },
    link({ href, tokens, title }) {
      const html = this.parser.parseInline(tokens) as string;
      return `<a href="${href}" title="${title || ""}" class="blog-anchor" target="_blank" rel="noopener noreferrer">${html}</a>`;
    },
    em({ tokens }) {
      const html = this.parser.parseInline(tokens) as string;
      return `<em class="blog-em">${html}</em>`;
    },
    strong({ tokens }) {
      const html = this.parser.parseInline(tokens) as string;
      return `<strong class="blog-strong">${html}</strong>`;
    },
    codespan({ text }) {
      return `<code class="blog-codespan ${jetbrains.className}">${text}</code>`;
    },
    code({ text, lang }) {
      const hl = lang
        ? hls.highlight(text, { language: lang })
        : hls.highlightAuto(text);
      return `<pre class="blog-codeblock ${jetbrains.className}"><code>${hl.value}</code></pre>`;
    },
    listitem({ tokens, task, checked }) {
      const html = tokens
        .map((token) =>
          token.type === "list"
            ? // @ts-expect-error This might bring an error, let's hope not.
              this.list(token)
            : this.parser.parseInline([token]),
        )
        .join("");

      return `<li class="blog-list-item">${task ? this.checkbox({ checked: checked || true }) : ""} ${html}</li>`;
    },
    list({ items, ordered, start }) {
      const tag: "ol" | "ul" = ordered ? "ol" : "ul";
      const listItems = items.map((item) => this.listitem(item)).join("");
      return `<${tag} class="blog-${tag}" start="${start}">${listItems}</${tag}>`;
    },
    checkbox({ checked }) {
      return `<input class="blog-checkbox" type="checkbox" ${checked ? "checked" : ""} disabled ></input>`;
    },
  },
});

export default myMDParser;
