import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import MenuBase from '../../MenuBase';
import Filter from './filter';
import Problem from './problem';

import * as ROUTES from '../../../Constants/routes';
import Details from './Details';
import { arrToRGBString, camelToTitle, lerp, lowerBound } from '../../../Constants';

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
      },
    }

    this.getCategoryColor = this.getCategoryColor.bind(this);
    this.getDifficultyColor = this.getDifficultyColor.bind(this);
  }

  getCategoryColor(category) {
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

  problemProps(prob, ind, uuid, vote, authUser) {
    return {
      key: ind,
      ind: ind,
      uuid: uuid,
      text: prob.text,
      category: { name: camelToTitle(prob.category), color: arrToRGBString(this.getCategoryColor(prob.category)) },
      difficulty: { name: prob.difficulty, color: arrToRGBString(this.getDifficultyColor(prob.difficulty)) },
      author: prob.author,
      tags: prob.tags,
      votes: !!prob.votes ? Object.values(prob.votes).reduce((a, b) => a + b) : 0,
      myVote: !!prob.votes ? prob.votes[authUser.displayName] : 0,
      vote: direction => vote(ind, direction),
      authUser: authUser
    };
  }

  render() {
    const { problems, uuid, vote, fail, authUser } = this.props;

    const loadBackground = "rgb(0, 0, 0, 0.025)";

    return (
      <MenuBase
        width={20}
        right
        background={loadBackground}
        Sidebar={Filter}
        authUser={authUser}
      >
        <Switch>
          <Route
            exact
            path={ROUTES.PROJECT_VIEW.replace(':uuid', uuid)}
            render={_ => {
              return problems.map((prob, ind) => <Problem {...{ ...this.problemProps(prob, ind, uuid, vote, authUser), repliable: true }} />)
            }}
          />
          <Route
            exact
            path={ROUTES.PROJECT_PROBLEM.replace(':uuid', uuid)}
            render={_ => {
              const ProblemDetails = withRouter((props) => {
                const ind = parseInt(props.match.params.ind);

                return <Details {...{
                  ...this.problemProps(problems[ind], ind, uuid, vote, authUser),
                  repliable: false,
                  fail,
                  loadBackground,
                }} />
              });
              return <ProblemDetails />;
            }}
          />
        </Switch>
      </MenuBase>
    );
  }
}

export default View;
