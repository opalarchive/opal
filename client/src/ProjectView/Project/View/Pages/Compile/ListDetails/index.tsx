import React from "react";
import { Divider, Paper, WithStyles, withStyles } from "@material-ui/core";
import {
  CategoryColors,
  DifficultyColors,
  Problem,
} from "../../../../../../../../.shared/src";
import { HiOutlineViewList } from "react-icons/hi";
import styles from "./index.css";
import {
  getDifficultyColor,
  getMean,
  getMedianSlow,
  getStDev,
} from "../../../../../../Constants";
import Dot from "../../../Embedded/Dot";

interface ListDetailsProps extends WithStyles<typeof styles> {
  problemList: Problem[];
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
}

class ListDetails extends React.Component<ListDetailsProps> {
  render() {
    const {
      problemList,
      categoryColors,
      difficultyColors,
      classes,
    } = this.props;

    const numProbs = problemList.length;
    let categoryList: { [category: string]: number } = {};
    problemList.forEach((prob) => {
      if (!!categoryList[prob.category]) categoryList[prob.category]++;
      else categoryList[prob.category] = 1;
    });

    const difficultyList = problemList.map((prob) => prob.difficulty);
    let difficultyData = {
      Average: { value: getMean(difficultyList), dot: true },
      Median: { value: getMedianSlow(difficultyList), dot: true },
      "Standard Deviation": { value: getStDev(difficultyList), dot: false },
    };

    return (
      <Paper elevation={3} className={classes.root}>
        <div className={classes.title}>
          Details
          <HiOutlineViewList
            style={{
              position: "relative",
              top: "0.25rem",
              marginLeft: "0.4rem",
            }}
          />
        </div>
        <div className={classes.body}>
          <div className={classes.sideBox}>
            {numProbs}&nbsp;Problems
            {numProbs !== 0 && (
              <>
                :
                <ul className={classes.thinList}>
                  {Object.keys(categoryColors).map(
                    (category) =>
                      !!categoryList[category] && (
                        <li key={category}>
                          {categoryList[category]}&nbsp;{category}
                          &nbsp;
                          <Dot color={categoryColors[category]} />
                        </li>
                      )
                  )}
                </ul>
              </>
            )}
          </div>
          {numProbs !== 0 && (
            <>
              <Divider
                className={classes.divider}
                flexItem
                orientation="vertical"
              />
              <div className={classes.sideBox}>
                Difficulty:
                <ul className={classes.thinList}>
                  {Object.entries(difficultyData).map(
                    ([dataPoint, { value, dot }]) => (
                      <li key={dataPoint}>
                        {dataPoint}:&nbsp;
                        {Math.round(value * 10) / 10}
                        {dot && (
                          <>
                            &nbsp;
                            <Dot
                              color={getDifficultyColor(
                                difficultyColors,
                                value
                              )}
                            />
                          </>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ListDetails);
