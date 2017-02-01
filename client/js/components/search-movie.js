import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class SearchMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.list === 1) {
      return alert("Please select a list before adding items.");
    }
    console.log("adding", this.props);
    let movie = {
      "id": this.props.id,
      "title": this.props.title,
      "release_date": this.props.release_date,
      "poster_path": this.props.poster_path,
      "media_type": this.props.media_type 
    }
    this.props.dispatch(actions.addMovie(movie, this.props.list));
  }

  render() {
    let img = `https://image.tmdb.org/t/p/w92${this.props.poster_path}`;

    const alreadyOnListStyling = {
      backgroundColor: this.props.isOnUserList ? "lightgrey" : "none"
    };

    if (!this.props.poster_path) {
      img = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Clapboard.svg/1000px-Clapboard.svg.png";
    }

    return (
    <li className="movie" id={this.props.id} style={alreadyOnListStyling}>
      <h4>{this.props.title}</h4>
      <img src={img} />
      <p>{this.props.release_date}</p>
      <button onClick={this.onClick}>Add</button>
    </li>
  );
  }
}

const mapStateToProps = (state, props) => ({
  list: state.list
});

export default connect(mapStateToProps)(SearchMovie);
