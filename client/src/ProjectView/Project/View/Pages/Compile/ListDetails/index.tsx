import React from "react";
import { Divider, Paper, WithStyles, withStyles } from "@material-ui/core";
import { Problem } from "../../../../../../../../.shared";
import { HiOutlineViewList } from "react-icons/hi";
import styles from "./index.css";
import { CategoryColors } from "../../..";
import {
  camelToTitle,
  getMean,
  getMedianSlow,
  getStDev,
  tupleToRGBString,
} from "../../../../../../Constants";
import Dot from "../../../Embedded/Dot";

interface ListDetailsProps extends WithStyles<typeof styles> {
  problemList: Problem[];
  categoryColors: CategoryColors;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
}

class ListDetails extends React.Component<ListDetailsProps> {
  render() {
    const {
      problemList,
      categoryColors,
      getCategoryColor,
      getDifficultyColor,
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
      average: { value: getMean(difficultyList), dot: true },
      median: { value: getMedianSlow(difficultyList), dot: true },
      standardDeviation: { value: getStDev(difficultyList), dot: false },
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
                          {categoryList[category]}&nbsp;{camelToTitle(category)}
                          &nbsp;
                          <Dot
                            color={tupleToRGBString(categoryColors[category])}
                          />
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
                        {camelToTitle(dataPoint)}&nbsp;
                        {Math.round(value * 10) / 10}
                        {dot && (
                          <>
                            &nbsp;
                            <Dot
                              color={tupleToRGBString(
                                getDifficultyColor(value)
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
