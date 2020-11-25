// blame amoler if this is bad 

import katex from "katex";
import 'katex/dist/katex.min.css';
// Eslint doesn't like react being in peerDependencies
import React from "react"; //eslint-disable-line

export const latexify = (string, options) => {
  string = string.split(`\\begin{equation*}`).join('\\\[').split(`\\end{equation*}`).join('\\\]').split(`\\begin{align*}`).join('\\[\\begin{aligned}').split(`\\end{align*}`).join('\\end{aligned}\\]');
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

  const stripDollars = (stringToStrip) =>
    (stringToStrip[0] === "$" && stringToStrip[1] !== "$"
      ? stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2));

  const getDisplay = (stringToDisplay) =>
    (stringToDisplay.match(blockRegularExpression) ? "block" : "inline");

  const renderLatexString = (s, t) => {
    let renderedString;
    try {
      let newOptions = options;
      if (t === "block") {
        newOptions.displayMode = true;
      }
      else {
        newOptions.displayMode = false;
      }
      // returns HTML markup
      renderedString = katex.renderToString(
        s,
        newOptions
      );
    } catch (err) {
      let error = "Couldn't convert " + s + " to a string. Check your syntax.";
      return { error: error, string: s };
    }
    return renderedString;
  };

  const result = [];

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

  const processResult = (resultToProcess) => {
    const newResult = resultToProcess.map((r) => {
      if (r.type === "text") {
        return r.string;
      }
      let rendered = renderLatexString(r.string, r.type);
      if (rendered.error) {
        return rendered;
      }

      return (<span dangerouslySetInnerHTML={{ __html: rendered }} />);
    });

    for (let i = 0; i < newResult.length; i++) {
      if (newResult[i].error) {
        return newResult[i];
      }
    }
    return newResult;
  };
  // Returns list of spans with latex and non-latex strings.
  let toReturn = processResult(result);
  return toReturn;
}

class Latex extends React.Component {

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
    trust: false
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
      trust
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
      trust
    });
    if (!!renderUs.error) {
      return <div style={{ color: "red" }}>Error: {renderUs.error}</div>;
    }
    return (
      <span>
        {renderUs.map((render, index) =>
          <span key={id + index}>
            {(typeof (render) !== 'string') ? render : render.split('\\\\').map((string, idx) =>
              <span key={id + index + idx}>{string}{idx + 1 !== render.split('\\\\').length && <br />}</span>
            )}
          </span>
        )}
      </span>
    );
  }
}

export default Latex;
