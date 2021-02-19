import React from "react";

import { Paper, WithStyles, withStyles } from "@material-ui/core";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { GrDrag } from "react-icons/gr";
import styles from "./index.css";
import Dot from "../Dot";
import { FiLock } from "react-icons/fi";

interface ProblemProps {
  refInner?: React.Ref<HTMLElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  handleProps?: DraggableProvidedDragHandleProps;
  ind: number;
  title: string;
  category: {
    name: string;
    color: string;
  };
  difficulty: {
    name: number;
    color: string;
  };
  author: string;
  style?: React.CSSProperties;
}

class Problem extends React.PureComponent<
  ProblemProps & WithStyles<typeof styles>
> {
  constructor(props: ProblemProps & WithStyles<typeof styles>) {
    super(props);
  }

  render() {
    const {
      refInner,
      draggableProps,
      handleProps,
      ind,
      title,
      category,
      difficulty,
      author,
      style,
      classes,
    } = this.props;

    return (
      <Paper
        elevation={3}
        className={classes.root}
        {...(!!draggableProps ? draggableProps : {})}
        style={{ ...style }}
        ref={refInner}
      >
        {!!handleProps ? (
          <div className={classes.dragIcon} {...handleProps}>
            <GrDrag size="1.8rem" style={{ display: "block" }} />
          </div>
        ) : (
          <div className={classes.lockIcon}>
            <FiLock size="1.2rem" style={{ display: "block" }} />
          </div>
        )}
        <div className={classes.body}>
          <div className={classes.index}>#{ind + 1}</div>
          <div className={classes.title}>{title}</div>
          <div className={classes.filler} />
          <div className={classes.rightCategory}>
            <Dot
              color={category.color}
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            {category.name}
          </div>
          <div className={classes.rightDifficulty}>
            <Dot
              color={difficulty.color}
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            d-{difficulty.name}
          </div>
        </div>
      </Paper>
    );
  }
}
export default withStyles(styles)(Problem);
