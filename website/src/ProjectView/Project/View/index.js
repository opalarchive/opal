import React from 'react';
import MenuBase from '../../MenuBase';
import Filter from './filter';
import Problem from './problem';

class View extends React.Component {
  render() {
    return (
      <MenuBase
        width={20}
        right
        background="rgb(0, 0, 0, 0.025)"
        Sidebar={Filter}
        authUser={this.props.authUser}
      >
        {this.props.project.problems.map((prob, ind) =>
          <Problem
            key={ind}
            ind={ind}
            text={prob}
            category={{ name: "Algebra", color: "rgb(241, 37, 30)" }}
            difficulty={{ name: "0", color: "rgb(0, 200, 100)" }}
            author="Amol Rama"
            tags={["testing", "bruh", "wtf"]}
          />
        )}
      </MenuBase>
    );
  }
}

export default View;
