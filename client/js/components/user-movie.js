import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class UserMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.dispatch(actions.deleteMovie(this.props.id));
  }

  render() {
    let img = `https://image.tmdb.org/t/p/w300${this.props.poster_path}`;
    return (
    <li className="movie" id={this.props.id}>
      <h4>{this.props.title}</h4>
      <img src={img} />
      <p>{this.props.release_date}</p>
      <button onClick={this.onClick}>
        Delete
      </button>
    </li>
  );
  }
}


export default connect()(UserMovie);
