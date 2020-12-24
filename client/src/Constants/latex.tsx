// blame amoler if this is bad

import katex from "katex";
import "katex/dist/katex.min.css";
// Eslint doesn't like react being in peerDependencies
import React from "react"; //eslint-disable-line

interface Block {
  string: string;
  type: "text" | "inline" | "block";
}

export const latexify = (string: string, options: katex.KatexOptions) => {
  string = string
    .split(`\\begin{equation*}`)
    .join("\\[")
    .split(`\\end{equation*}`)
    .join("\\]")
    .split(`\\begin{align*}`)
    .join("\\[\\begin{aligned}")
    .split(`\\end{align*}`)
    .join("\\end{aligned}\\]");
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

  const stripDollars = (stringToStrip: string) =>
    stringToStrip[0] === "$" && stringToStrip[1] !== "$"
      ? stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2);

  const getDisplay = (stringToDisplay: string) =>
    stringToDisplay.match(blockRegularExpression) ? "block" : "inline";

  const renderLatexString = (string: string, type: string) => {
    let renderedString;
    try {
      let newOptions = options;
      if (type === "block") {
        newOptions.displayMode = true;
      } else {
        newOptions.displayMode = false;
      }
      // returns HTML markup
      renderedString = katex.renderToString(string, newOptions);
    } catch (err) {
      let error =
        "Couldn't convert " + string + " to a string. Check your syntax.";
      return { error: error, string: string };
    }
    return renderedString;
  };

  const result: Block[] = [];

  const latexMatch = string.match(regularExpression);
  const stringWithoutLatex = string.split(regularExpression);

  if (latexMatch) {
    stringWithoutLatex.forEach((s, index) => {
      result.push({
        string: s,
        type: "text",
      });
      if (latexMatch[index]) {
        result.push({
          string: stripDollars(latexMatch[index]),
          type: getDisplay(latexMatch[index]),
        });
      }
    });
  } else {
    result.push({
      string,
      type: "text",
    });
  }

  const processResult = (resultToProcess: Block[]) => {
    const newResult = resultToProcess.map((r) => {
      if (r.type === "text") {
        return r.string;
      }
      let rendered = renderLatexString(r.string, r.type);

      if (typeof rendered !== "string") {
        return { valid: false, text: rendered.error };
      }
      return { valid: true, text: rendered };
    });

    return newResult;
  };
  // Returns list of spans with latex and non-latex strings.
  let toReturn = processResult(result);
  return toReturn;
};

type LatexElement = {
  valid: boolean;
  text: string;
};

type RenderedElement = string | LatexElement;

const renderElement = (render: RenderedElement) => {
  // if its normal text
  if (typeof render === "string") {
    return render;
  }
  // if the latex compiled without error
  if (render.valid) {
    return <span dangerouslySetInnerHTML={{ __html: render.text }} />;
  }
  return <span style={{ color: "red" }}>Error: {render.text}</span>;
};

type LatexProps = katex.KatexOptions & {
  id?: string;
  children: string;
};

class Latex extends React.Component<LatexProps> {
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

    const renderUs = latexify(children, {
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
    return (
      <span>
        {renderUs.map((render, index) => (
          <span key={id + index}>{renderElement(render)}</span>
        ))}
      </span>
    );
  }
}

export default Latex;
