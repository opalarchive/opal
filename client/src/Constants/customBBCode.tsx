import React, { FunctionComponent, ComponentClass } from "react";
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
} from "@material-ui/core";

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

type PureTagNode = {
  tag: string | ComponentClass<any> | FunctionComponent<any>;
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

type UrlProps = {
  href: string;
};

const Url: FunctionComponent<UrlProps> = ({ href, children }) => (
  <Link href={href}>{children}</Link>
);

type TableProps = {
  elevated: boolean;
};

const Table: FunctionComponent<TableProps> = ({ elevated, children }) => (
  <TableContainer
    style={{ backgroundColor: "#F0F8FF" }}
    component={elevated ? Paper : "div"}
  >
    <MuiTable>{children}</MuiTable>
  </TableContainer>
);

const TableCell: FunctionComponent<{}> = ({ children }) => (
  <MuiTableCell style={{ backgroundColor: "" }}>{children}</MuiTableCell>
);

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

    const uniqueAttribute = getUniqueAttribute(node.attrs);
    return {
      tag: Table,
      attrs: {
        elevated: !!uniqueAttribute && uniqueAttribute === "string",
      },
      content: node.content,
    };
  },
  thead: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: TableHead,
      attrs: {},
      content: node.content,
    };
  },
  tbody: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: TableBody,
      attrs: {},
      content: node.content,
    };
  },
  tr: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: TableRow,
      attrs: {},
      content: node.content,
    };
  },
  td: (node: Node): Node => {
    if (typeof node === "string") return node;

    return {
      tag: TableCell,
      attrs: {},
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
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody",
];

// you probably want to allow the custom tags you make
// if you want to disable them, just comment it out
Object.keys(customBBCode).forEach((tag) => {
  if (!allowedBBCodeTags.includes(tag)) allowedBBCodeTags.push(tag);
});

export { allowedBBCodeTags };
export default createPreset(customBBCode);
