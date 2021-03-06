import React from "react";
import core from "@bbob/core";
import * as html from "@bbob/html";

export interface Node {
  tag: string | React.ComponentClass<any> | React.FunctionComponent<any>;
  attrs?: object;
  content?: (Node | string)[];
}

const isTagNode = (el: Node | string): el is Node =>
  typeof el === "object" && !!el.tag;
const isStringNode = (el: Node | string): el is string =>
  typeof el === "string";

const toAST = (source: string, plugins: any[], options: object) =>
  core(plugins).process(source, {
    ...options,
    render: (input: any) => html.render(input, { stripTags: true }),
  }).tree;

const isNotContentEmpty = (
  content?: (string | Node)[]
): content is (string | Node)[] => !!content && content.length > 0;

function tagToReactElement(node: Node, index: number) {
  return React.createElement(
    node.tag,
    { ...node.attrs, key: index },
    isNotContentEmpty(node.content) ? renderToReactNodes(node.content) : null
  );
}

function renderToReactNodes(
  nodes: (Node | string)[]
): (JSX.Element | string)[] {
  const els: (JSX.Element | string)[] = [];
  [...nodes].forEach((node: string | Node, index: number) => {
    if (isTagNode(node)) els.push(tagToReactElement(node, index));
    else if (isStringNode(node)) els.push(node);
  });

  return els;
}

function render(source: string, plugins: any[], options: object) {
  return renderToReactNodes(toAST(source, plugins, options));
}

export default render;
