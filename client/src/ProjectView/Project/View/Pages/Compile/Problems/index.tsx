import { Paper, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  CategoryColors,
  DifficultyColors,
  Problem,
} from "../../../../../../../../.shared/src";
import ProblemDraggable from "../../../Embedded/ProblemDraggable";
import { AiOutlineEdit } from "react-icons/ai";
import styles from "./index.css";
import { reorderList } from "../../../../../../Firebase";

interface ProblemsProps extends WithStyles<typeof styles> {
  uuid: string;
  currentList: number;
  problemList: Problem[];
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  authUser: firebase.User;
}

interface ProblemState {
  order: number[];
}

class Problems extends React.Component<ProblemsProps, ProblemState> {
  state = {
    order: [] as number[],
  };

  constructor(props: ProblemsProps) {
    super(props);

    this.state = {
      ...this.state,
      order: props.problemList.map((prob) => prob.ind),
    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    if (this.props.currentList === -1) return; // should be impossible, but just as a precaution

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceInd = result.source.index;
    const destInd = result.destination.index;

    const oldOrder = [...this.state.order];
    let newOrder = [...this.state.order];
    const movedProblem = this.state.order[sourceInd];
    newOrder.splice(sourceInd, 1);
    newOrder.splice(destInd, 0, movedProblem);

    this.setState({ order: newOrder }, async () => {
      const attempt = await reorderList(
        this.props.uuid,
        this.props.currentList,
        sourceInd,
        destInd,
        this.props.authUser
      );
      if (!attempt.success) {
        this.setState({ order: oldOrder });
      }
    });
  }

  componentDidUpdate(prevProps: ProblemsProps) {
    // if the current list changes, everything is reset for the new list
    if (this.props.currentList !== prevProps.currentList) {
      this.setState({ order: this.props.problemList.map((prob) => prob.ind) });
    }
  }

  render() {
    const {
      categoryColors,
      difficultyColors,
      currentList,
      classes,
    } = this.props;

    const problemObject = Object.fromEntries(
      this.props.problemList.map((prob) => [prob.ind, prob])
    );

    return (
      <Paper elevation={3} className={classes.root}>
        <div className={classes.title}>
          Problem Order
          <AiOutlineEdit
            style={{
              position: "relative",
              top: "0.25rem",
              marginLeft: "0.4rem",
            }}
          />
        </div>
        {currentList === -1 ? (
          this.state.order.map((probInd) => (
            <ProblemDraggable
              key={probInd}
              ind={probInd}
              title={problemObject[probInd].title}
              author={problemObject[probInd].author}
              category={problemObject[probInd].category}
              difficulty={problemObject[probInd].difficulty}
              categoryColors={categoryColors}
              difficultyColors={difficultyColors}
            />
          ))
        ) : (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {this.state.order.map(
                    (probInd, index) =>
                      problemObject[probInd] && ( // workaround for error when the order updates after the first render directly after the current list changes
                        <Draggable
                          key={probInd}
                          draggableId={"" + probInd}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ProblemDraggable
                              refInner={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              handleProps={provided.dragHandleProps}
                              ind={probInd}
                              title={problemObject[probInd].title}
                              author={problemObject[probInd].author}
                              category={problemObject[probInd].category}
                              difficulty={problemObject[probInd].difficulty}
                              categoryColors={categoryColors}
                              difficultyColors={difficultyColors}
                              style={{ ...provided.draggableProps.style }}
                            />
                          )}
                        </Draggable>
                      )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(Problems);
