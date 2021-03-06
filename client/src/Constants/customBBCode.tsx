import React, { FunctionComponent, ComponentClass, Fragment } from "react";
import { createPreset } from "@bbob/preset";
import {
  Link,
  Table as MuiTable,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
  makeStyles,
} from "@material-ui/core";
import { fromString } from "css-color-converter";

const styles = makeStyles({
  table: {
    backgroundColor: "#F0F8FF",
    "& .MuiTableCell-head": {
      fontWeight: 600,
    },
  },
});

type Attributes = {
  [key: string]: any;
};

type Node =
  | string
  | {
      tag: string | ComponentClass<any> | FunctionComponent<any>;
      attrs?: Attributes;
      content: Node[] | Node;
    };

const emptyNodeArray: Node[] = [];

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

const Bold: FunctionComponent<{}> = ({ children }) => (
  <span style={{ fontWeight: "bold" }}>{children}</span>
);

const Italic: FunctionComponent<{}> = ({ children }) => (
  <span style={{ fontStyle: "italic" }}>{children}</span>
);

const Underline: FunctionComponent<{}> = ({ children }) => (
  <span style={{ textDecoration: "underline" }}>{children}</span>
);

const Strikethrough: FunctionComponent<{}> = ({ children }) => (
  <span style={{ textDecoration: "line-through" }}>{children}</span>
);

const Url: FunctionComponent<{ href: string }> = ({ href, children }) => (
  <Link href={href}>{children}</Link>
);

const Table: FunctionComponent<{}> = ({ children }) => {
  const classes = styles();
  return (
    <TableContainer className={classes.table} component={Paper}>
      <MuiTable>{children}</MuiTable>
    </TableContainer>
  );
};

const TableCell: FunctionComponent<{
  align?: "left" | "right" | "inherit" | "center" | "justify";
}> = ({ align, children }) => (
  <MuiTableCell
    align={align}
    style={{ borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
  >
    {children}
  </MuiTableCell>
);

const Color: FunctionComponent<{ color: string }> = ({ color, children }) => (
  <span style={{ color }}>{children}</span>
);

const FontSize: FunctionComponent<{ size: number }> = ({ size, children }) => (
  <span style={{ fontSize: size }}>{children}</span>
);

const Font: FunctionComponent<{ font: string }> = ({ font, children }) => (
  <span style={{ fontFamily: font }}>{children}</span>
);

const Highlight: FunctionComponent<{ color: string }> = ({
  color,
  children,
}) => <span style={{ backgroundColor: color }}>{children}</span>;

// creates custom bbcode tags/overrides builtin ones
// node is the input, output is what it will render
// node = { tag, attrs, content } renders as
// <tag {...attrs}>{content}</tag> in normal jsx
// note that content can be more nodes or just a string
const customBBCode = {
  b: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: Bold,
      attrs: {},
      content: node.content,
    };
  },
  i: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: Italic,
      attrs: {},
      content: node.content,
    };
  },
  u: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: Underline,
      attrs: {},
      content: node.content,
    };
  },
  s: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: Strikethrough,
      attrs: {},
      content: node.content,
    };
  },
  url: (node: Node): Node => {
    if (typeof node === "string") return node;

    const uniqueAttribute = getUniqueAttribute(node.attrs);
    return {
      tag: Url,
      attrs: {
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
  table: (node: Node): Node => {
    if (typeof node === "string") return node;

    let content: Node | Node[] = [];

    if (Array.isArray(node.content)) {
      node.content = node.content.filter(
        (el: Node) => typeof el !== "string" && el.tag === "row"
      );

      const firstNode: Node | undefined = node.content.shift();

      if (!firstNode) {
        return {
          tag: Fragment,
          attrs: {},
          content: emptyNodeArray,
        };
      }

      content = [
        {
          tag: TableHead,
          attrs: {},
          content: [firstNode],
        },
        {
          tag: TableBody,
          attrs: {},
          content: node.content,
        },
      ];
    } else content = [{ tag: TableHead, attrs: {}, content: [node.content] }];

    return {
      tag: Table,
      attrs: {},
      content: content,
    };
  },
  row: (node: Node): Node => {
    if (typeof node === "string") return node;

    if (typeof node.content === "string")
      return {
        tag: TableRow,
        attrs: {},
        content: emptyNodeArray,
      };
    else if (Array.isArray(node.content))
      node.content = node.content.filter(
        (el: Node) => typeof el !== "string" && el.tag === "cell"
      );
    else if (node.content.tag !== "cell")
      return {
        tag: TableRow,
        attrs: {},
        content: emptyNodeArray,
      };

    return {
      tag: TableRow,
      attrs: {},
      content: node.content,
    };
  },
  cell: (node: Node): Node => {
    if (typeof node === "string") return node;

    const align = getUniqueAttribute(node.attrs) || undefined;

    return {
      tag: TableCell,
      attrs: { align },
      content: node.content,
    };
  },
  rule: (node: Node): Node => ({
    tag: "hr",
    attrs: {},
    content: "",
  }),
  color: (node: Node): Node => {
    if (typeof node === "string") return node;

    const color = getUniqueAttribute(node.attrs) || "black";

    return {
      tag: Color,
      attrs: { color },
      content: node.content,
    };
  },
  size: (node: Node): Node => {
    if (typeof node === "string") return node;

    const size = Math.floor(
      parseFloat(getUniqueAttribute(node.attrs) || "") || 14
    );

    return {
      tag: FontSize,
      attrs: { size },
      content: node.content,
    };
  },
  font: (node: Node): Node => {
    if (typeof node === "string") return node;

    const font = getUniqueAttribute(node.attrs) || "Roboto";

    return {
      tag: Font,
      attrs: { font },
      content: node.content,
    };
  },
  hl: (node: Node): Node => {
    if (typeof node === "string") return node;

    const input =
      fromString(getUniqueAttribute(node.attrs) || "yellow") ||
      fromString("yellow");
    const color = input.toRgbaArray();

    color[3] = 0.5;

    return {
      tag: Highlight,
      attrs: { color: `rgba(${color.join(",")})` },
      content: node.content,
    };
  },
};

let allowedBBCodeTags = [
  "b",
  "i",
  "u",
  "s",
  "url",
  "quote",
  "code",
  "img",
  "list",
  "*",
];

// you probably want to allow the custom tags you make
// if you want to disable them, just comment it out
Object.keys(customBBCode).forEach((tag) => {
  if (!allowedBBCodeTags.includes(tag)) allowedBBCodeTags.push(tag);
});

export { allowedBBCodeTags };
export default createPreset(customBBCode);
