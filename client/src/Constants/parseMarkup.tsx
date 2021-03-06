import React from "react";
import katex from "katex";

// there are no types in these two packages
import renderBBCode from "./render";
import bbcodePreset from "@bbob/preset-react";

import "katex/dist/katex.min.css";
import customBBCode, { allowedBBCodeTags } from "./customBBCode";

interface Block {
  string: string;
  type: "text" | "latexInline" | "latexBlock";
}

// parse entire string with latex/bbcode/other markup stuff
export const render = (string: string, katexOptions: katex.KatexOptions) => {
  string = string
    .split(`\\begin{equation*}`)
    .join("\\[")
    .split(`\\end{equation*}`)
    .join("\\]")
    .split(`\\begin{align*}`)
    .join("\\[\\begin{aligned}")
    .split(`\\end{align*}`)
    .join("\\end{aligned}\\]");

  const stripDelimiters = (stringToStrip: string) =>
    stringToStrip[0] === "$" && stringToStrip[1] !== "$"
      ? stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2);

  const getDisplay = (stringToDisplay: string) =>
    stringToDisplay.match(blockLatex) ? "latexBlock" : "latexInline";

  const renderBBCodeString = (string: string): (JSX.Element | string)[] => {
    return renderBBCode(string, [customBBCode(), bbcodePreset()], {
      onlyAllowTags: allowedBBCodeTags,
    });
  };

  // render a string block into string containing html elements for the tex
  // or an object containing an error
  // note that string should still contain $ $, $$ $$, \( \), or \[ \]
  const renderLatexString = (string: string, type: string) => {
    const strippedString = stripDelimiters(string);
    let renderedString: string;
    try {
      const newOptions = {
        ...katexOptions,
        displayMode: type === "latexBlock",
      };
      // returns HTML markup
      renderedString = katex.renderToString(strippedString, newOptions);
    } catch (err) {
      let error =
        "Couldn't convert " + string + " to a string. Check your syntax.";
      return { error: error, string: string };
    }
    return renderedString;
  };

  // matches for $ ... $, $$ ... $$, \( ... \), or \[ ... \]
  const anyLatex = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;

  // matches for $$ ... $$ or \[ ... \]
  const blockLatex = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

  const newLine = /\n/g;

  const tokenize = (string: string) => {
    // array of all string blocks, i.e. all contiguous sections that can be
    // rendered or are normal strings
    const result: Block[] = [];

    const latexMatch = string.match(anyLatex);
    const stringWithoutLatex = string.split(anyLatex);

    // will always be of the form [without, with, without, ... , with, without]
    // so we can always just push the string with latex after the corresponding
    // one without latex
    stringWithoutLatex.forEach((s, index) => {
      // normal text
      result.push({
        string: s,
        type: "text",
      });
      // render and add latex
      if (!!latexMatch && !!latexMatch[index]) {
        result.push({
          string: latexMatch[index],
          type: getDisplay(latexMatch[index]),
        });
      }
    });
    return result;
  };

  const renderResult = (resultToProcess: Block[]) => {
    const newResult: RenderedElement[] = resultToProcess.map((block) => {
      if (block.type === "text") {
        const renderedBBCode = renderBBCodeString(block.string);
        // replace all "\n" with <br />
        return (
          <>
            {renderedBBCode.map((el, ind) => (
              <React.Fragment key={`bbcode-result-${ind}`}>
                {el === "\n" ? <br /> : el}
              </React.Fragment>
            ))}
          </>
        );
      }

      let rendered = renderLatexString(block.string, block.type);

      if (typeof rendered !== "string") {
        return { valid: false, text: rendered.string };
      }
      return { valid: true, text: rendered };
    });

    return newResult;
  };
  // Returns list of spans with latex and non-latex strings.
  let toReturn = renderResult(tokenize(string));
  return toReturn;
};

type LatexElement = {
  valid: boolean;
  text: string;
};

// type checking for if it's a latex element
function hasOwnProperty<O extends {}, K extends PropertyKey>(
  obj: O,
  key: K
): obj is O & Record<K, unknown> {
  return obj.hasOwnProperty(key);
}
function isLatexElement(obj: object): obj is LatexElement {
  return hasOwnProperty(obj, "valid") && hasOwnProperty(obj, "text");
}

type SpecialElement = JSX.Element;
type RenderedElement = LatexElement | SpecialElement;

const processRendered = (render: RenderedElement) => {
  // if its latex
  if (isLatexElement(render)) {
    // if the latex compiled without error
    if (render.valid) {
      return <span dangerouslySetInnerHTML={{ __html: render.text }} />;
    }
    return <span style={{ color: "red" }}>{render.text}</span>;
  }
  // otherwise
  return render;
};

type MarkupProps = katex.KatexOptions & {
  id?: string;
  children: string;
};

class Markup extends React.Component<MarkupProps> {
  static defaultProps = {
    children: "",
    displayMode: false,
    output: "htmlAndMathml",
    leqno: false,
    fleqn: false,
    throwOnError: true,
    errorColor: "#cc0000",
    macros: {},
    minRuleThickness: 0.06,
    colorIsTextColor: false,
    strict: "warn",
    trust: false,
  };

  render() {
    const {
      children,
      displayMode,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      trust,
    } = this.props;
    const id = this.props.id ? this.props.id : "";

    const renderUs = render(children, {
      displayMode,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      trust,
    });
    // combine all the rendered strings
    return (
      <span>
        {renderUs.map((render, index) => (
          <React.Fragment key={id + index}>
            {processRendered(render)}
          </React.Fragment>
        ))}
      </span>
    );
  }
}

export default Markup;
