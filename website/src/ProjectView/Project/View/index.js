import React from 'react';
import MenuBase from '../../MenuBase';
import { arrToRGBString, camelToTitle, lerp, lowerBound } from './constants';
import Filter from './filter';
import Problem from './problem';

class View extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryColors: {
        algebra: [241, 37, 30],
        geometry: [35, 141, 25],
        combinatorics: [21, 52, 224],
        numberTheory: [173, 19, 179],
        miscellaneous: [100, 100, 110]      
      },
      difficultyColors: {
        0: [0, 200, 100],
        25: [0, 200, 255],
        50: [150, 50, 255],
        51: [255, 150, 0],
        75: [255, 0, 0],
        100: [0, 0, 0]
      }
    }

    this.getCategoryColor = this.getCategoryColor.bind(this);
    this.getDifficultyColor = this.getDifficultyColor.bind(this);
  }

  getCategoryColor(category) {
    console.log(category);
    return this.state.categoryColors[category];
  }

  // linearlly interpolate the difficulty color using keyframesque colors
  getDifficultyColor(difficulty) {
    const colors = this.state.difficultyColors;
    const keys = Object.keys(colors).map(key => parseInt(key));

    let top = lowerBound(keys, difficulty);
    const difficultyColor = colors[keys[top]];

    if (top === 0) {
      return difficultyColor;
    }
    return difficultyColor.map((value, ind) => lerp(keys[top - 1], keys[top], colors[keys[top - 1]][ind], colors[keys[top]][ind], difficulty));
  }

  render() {
    const { project, authUser } = this.props;
    return (
      <MenuBase
        width={20}
        right
        background="rgb(0, 0, 0, 0.025)"
        Sidebar={Filter}
        authUser={authUser}
      >
        {project.problems.map((prob, ind) =>
          <Problem
            key={ind}
            ind={ind}
            text={prob.text}
            category={{ name: camelToTitle(prob.category), color: arrToRGBString(this.getCategoryColor(prob.category)) }}
            difficulty={{ name: prob.difficulty, color: arrToRGBString(this.getDifficultyColor(prob.difficulty)) }}
            author={prob.author}
            tags={prob.tags}
            votes={prob.votes.up.length - prob.votes.down.length}
            myVote={prob.votes.up.includes(authUser.uid) - prob.votes.down.includes(authUser.uid)}
            authUser={authUser}
          />
        )}
      </MenuBase>
    );
  }
}

export default View;
