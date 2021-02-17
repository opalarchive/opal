import { createPreset } from "@bbob/preset";

type Attributes = {
  [key: string]: string;
};

type Node =
  | string
  | {
      tag: string;
      attrs?: Attributes;
      content: Node[] | Node;
    };

// gets the unique attribute, i.e. if the bbcode is
// [tag=foo]bar[/tag], it will return foo
// note that this may be undefined, for example in [b]baz[/b]
const getUniqueAttribute = (attrs?: Attributes) => {
  if (!attrs) return undefined;
  if (typeof attrs === "string") {
    return attrs;
  }
  return Object.keys(attrs).reduce(
    (res, key) => (attrs[key] === key ? attrs[key] : ""),
    ""
  );
};

// creates custom bbcode tags/overrides builtin ones
// node is the input, output is what it will render
// node = { tag, attrs, content } renders as
// <tag {...attrs}>{content}</tag> in normal jsx
// note that content can be more nodes or just a string
const customBBCode = {
  url: (node: Node): Node => {
    if (typeof node === "string") return node;

    const uniqueAttribute = getUniqueAttribute(node.attrs);
    return {
      tag: "a",
      attrs: {
        className: "bbcode-link MuiTypography-colorPrimary", // emulate mui Link
        href: !!uniqueAttribute
          ? uniqueAttribute
          : typeof node.content === "string"
          ? node.content
          : "",
        target: "_blank",
        rel: "noopener",
      },
      content: node.content,
    };
  },
  quote: (node: Node): Node => {
    if (typeof node === "string") return node;

    const uniqueAttribute = getUniqueAttribute(node.attrs);

    return {
      tag: "blockquote",
      attrs: {},
      content: [
        {
          tag: "p",
          attrs: { className: "bbcode-quote-author" },
          content: `${!!uniqueAttribute ? uniqueAttribute : "Quote"}: `,
        },
        {
          tag: "p",
          attrs: {},
          content: node.content,
        },
      ],
    };
  },
};

let allowedBBCodeTags = ["b", "i", "u", "s", "url", "img", "quote", "code"];

// you probably want to allow the custom tags you make
// if you want to disable them, just comment it out
Object.keys(customBBCode).forEach((tag) => {
  if (!allowedBBCodeTags.includes(tag)) allowedBBCodeTags.push(tag);
});

export { allowedBBCodeTags };
export default createPreset(customBBCode);
