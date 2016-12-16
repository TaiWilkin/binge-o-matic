import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/cheese';

class CheeseList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('did mount');
    this.props.dispatch(actions.fetchCheeses());
  }

  render() {
    const cheeses = this.props.cheeses.map(cheese => (
      <li key={cheese._id}>
        {cheese.name}
      </li>
    ));

    return (
      <ul>
        {cheeses}
      </ul>
    );
  }
}

const mapStateToProps = (state, props) => ({
  cheeses: state.cheeses
});

export default connect(mapStateToProps)(CheeseList);
