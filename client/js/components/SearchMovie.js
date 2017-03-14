import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class SearchMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const movie = {
      "id": this.props.id,
      "title": this.props.title,
      "release_date": this.props.release_date,
      "poster_path": this.props.poster_path,
      "media_type": this.props.media_type
    };
    this.props.dispatch(actions.addMovie(movie, this.props.list));
    this.props.dispatch(actions.setPage('home'));
  }

  render() {
    let img = `https://image.tmdb.org/t/p/w92${this.props.poster_path}`;

    if (!this.props.poster_path) {
      img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Clapboard.svg/1000px-Clapboard.svg.png';
    }

    return (
      <li id={this.props.id}><div>
        <img src={img} alt="poster" />
        <p>{this.props.title} ({this.props.release_date})</p>
        <div className="list-options">
          <button onClick={this.onClick}>Add to List</button>
        </div>
      </div></li>
  );
  }
}

const mapStateToProps = (state) => ({
  list: state.list
});

export default connect(mapStateToProps)(SearchMovie);
