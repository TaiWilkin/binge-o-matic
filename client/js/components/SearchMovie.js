import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class SearchMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
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
  }

  onDelete() {
    this.props.dispatch(actions.deleteMovie(`/${this.props.list}/shows/${this.props.id}`));
  }

  renderButtons() {
    if (!this.props.userMovies.find(movie => movie.id === this.props.id)) {
      return (<div className="card-actions">
        <button onClick={this.onClick}>Add to List</button>
      </div>);
    }
    return (<div className="card-actions">
      <button onClick={this.onDelete}>Remove from List</button>
    </div>);
  }

  renderImage() {
    if (!this.props.poster_path) {
      return (<div className="no-image" />);
    }
    return (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} alt='poster' />);
  }

  render() {
    let onList = '';

    if (this.props.userMovies.find(movie => movie.id === this.props.id)) {
      onList = 'onList';
    }

    return (
      <li id={this.props.id} className={onList}>
        {this.renderImage()}
        <h2>{this.props.title}</h2>
        <p>{this.props.release_date}</p>
        {this.renderButtons()}
      </li>
  );
  }
}

const mapStateToProps = (state) => ({
  list: state.list,
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(SearchMovie);
