import React from 'react';
import MenuBase from '../MenuBase';
import Filter from './filter';

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
        technboalde {this.props.project}
      </MenuBase>
    );
  }
}

export default View;
