import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Paper, withStyles } from "@material-ui/core";
import { AlignLeft, ArrowDown, ArrowUp, CornerDownRight, MessageSquare, } from "react-feather";
import Latex from "../../../../Constants/latex";
import { Link } from "react-router-dom";
import * as ROUTES from "../../../../Constants/routes";
import generateStyles from "./index.css";
const blankStyles = generateStyles({ name: "", color: "black" }, { name: 0, color: "black" });
class ProblemBase extends React.Component {
    render() {
        const { classes, ind, uuid, text, category, difficulty, author, tags, votes, myVote, problemAction, replyTypes, repliable, authUser, } = this.props;
        const Tag = ({ text }) => {
            return _jsx("span", Object.assign({ className: classes.tag }, { children: text }), void 0);
        };
        return (_jsxs(Paper, Object.assign({ elevation: 3, className: classes.root }, { children: [_jsxs("div", Object.assign({ className: classes.left }, { children: [_jsxs("div", Object.assign({ className: classes.leftIndex }, { children: ["#", ind + 1] }), void 0),
                        _jsxs("div", Object.assign({ className: classes.leftVote }, { children: [_jsx("div", { children: _jsx(ArrowUp, { size: "1.2rem", strokeWidth: 3, className: myVote === 1
                                            ? classes.leftVoteArrowActivated
                                            : classes.leftVoteArrow, onClick: (_) => problemAction(1, "vote") }, void 0) }, void 0),
                                _jsx("div", { children: _jsx("span", Object.assign({ className: classes.leftVoteNumber }, { children: votes }), void 0) }, void 0),
                                _jsx("div", { children: _jsx(ArrowDown, { size: "1.2rem", strokeWidth: 3, className: myVote === -1
                                            ? classes.leftVoteArrowActivated
                                            : classes.leftVoteArrow, onClick: (_) => problemAction(-1, "vote") }, void 0) }, void 0)] }), void 0)] }), void 0),
                _jsxs("div", Object.assign({ className: classes.body }, { children: [_jsx("div", Object.assign({ className: classes.bodyTitle }, { children: "Epic Problem" }), void 0),
                        _jsxs("div", Object.assign({ className: classes.bodyAuthor }, { children: ["Proposed by ", author] }), void 0),
                        _jsx("div", Object.assign({ className: classes.bodyText }, { children: _jsx(Latex, { children: text }, void 0) }), void 0),
                        _jsx("div", { className: classes.bodyFiller }, void 0),
                        _jsxs("div", Object.assign({ className: classes.bodyTags }, { children: ["Tags:", " ", !!tags ? tags.map((tag) => _jsx(Tag, { text: tag }, tag)) : null] }), void 0),
                        repliable ? (_jsx("div", Object.assign({ className: classes.bodyReply }, { children: _jsxs(Link, Object.assign({ className: classes.bodyReplyLink, to: `${ROUTES.PROJECT_VIEW.replace(":uuid", uuid)}/p${ind}` }, { children: [_jsx(CornerDownRight, { className: classes.icon }, void 0), "Reply"] }), void 0) }), void 0)) : null] }), void 0),
                _jsxs("div", Object.assign({ className: classes.right }, { children: [_jsxs("div", Object.assign({ className: classes.rightCategory }, { children: [_jsx("div", { className: `${classes.icon} ${classes.rightDot} ${classes.rightCategoryDot}` }, void 0), category.name] }), void 0),
                        _jsxs("div", Object.assign({ className: classes.rightDifficulty }, { children: [_jsx("div", { className: `${classes.icon} ${classes.rightDot} ${classes.rightDifficultyDot}` }, void 0), "d-", difficulty.name] }), void 0),
                        _jsx("div", { className: classes.rightFiller }, void 0),
                        _jsxs("div", Object.assign({ className: classes.rightComments }, { children: [_jsx(MessageSquare, { className: classes.icon }, void 0), replyTypes.COMMENT, "\u00A0comment", replyTypes.COMMENT === 1 ? "" : "s"] }), void 0),
                        _jsxs("div", Object.assign({ className: classes.rightSolutions }, { children: [_jsx(AlignLeft, { className: classes.icon }, void 0), replyTypes.SOLUTION, "\u00A0solution", replyTypes.SOLUTION === 1 ? "" : "s"] }), void 0)] }), void 0)] }), void 0));
    }
}
const Problem = (props) => {
    const StyledProblem = withStyles(generateStyles(props.category, props.difficulty))(ProblemBase);
    return _jsx(StyledProblem, Object.assign({}, props), void 0);
};
export default Problem;
