import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class UserMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.addSeasons = this.addSeasons.bind(this);
    this.addEpisodes = this.addEpisodes.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  onClick() {
    const path = `/${this.props.list}/shows/${this.props.id}`;
    this.props.dispatch(actions.deleteMovie(path));
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

  addSeasons() {
    const path = `/${this.props.list}/${this.props.id}`;
    this.props.dispatch(actions.getSeasons(path));
  }

  addEpisodes() {
    this.props.dispatch(actions.getEpisodes(this.props));
  }

  renderButtons() {
    switch (this.props.media_type) {
      case 'movie':
        return (<div className="list-options">
          <button onClick={this.onClick}>Delete</button>
        </div>);
      case 'tv':
        return (<div className="list-options">
          <button onClick={this.onClick}>Delete</button>
          <button onClick={this.addSeasons}>Show Seasons</button>
        </div>);
      case 'season':
        return (<div className="list-options">
          <button onClick={this.onClick}>Delete</button>
          <button onClick={this.addEpisodes}>Show Episodes</button>
        </div>);
      case 'episode':
        return (<div className="list-options">
          <button onClick={this.onClick}>Delete</button>
        </div>);
      default:
        return (<div className="list-options">
          <button onClick={this.onClick}>Delete</button>
        </div>);
    }
  }

  render() {
    let title = this.props.title;
    let img = (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} alt='poster' />);
    if (!this.props.poster_path) {
      img = '';
    }
    if (this.props.media_type === 'season') {
      title = `${this.props.title}: Season ${this.props.number}`;
    }
    if (this.props.media_type === 'episode') {
      title = `${this.props.title}: Episode ${this.props.number}: ${this.props.episode}`;
    }
    if (this.props.media_type === 'season' && this.props.number === 0) {
      return null;
    }
    return (
      <li id={this.props.id}><div>
        {img}
        <p>{title} ({this.props.release_date})</p>
        {this.renderButtons()}
      </div></li>
  );
  }
}

const mapStateToProps = (state) => ({
  list: state.list,
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(UserMovie);
