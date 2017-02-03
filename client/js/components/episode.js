import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
  }

    onCheck() {
    const path = `/${this.props.list}/${this.props.id}`;
    let watched;
    if (this.props.watched == true) {
      watched = false;
    } else {
      watched = true;
    }
    this.props.dispatch(actions.markWatched(path, { watched }));
  }

  render() {
        let check = (<p className="check">&#x2610;</p>);
    if (this.props.watched == true) {
      check = (<p className="check">&#x2611;</p>);
    }
    return (
    <li className="episode" id={this.props.id}>
      <p onClick={this.onCheck}>
        {check}{this.props.title}
        Episode {this.props.number}: {this.props.episode} ({this.props.release_date})
      </p>
    </li>
  );
  }
}

const mapStateToProps = (state, props) => ({
  list: state.list,
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(Episode);
