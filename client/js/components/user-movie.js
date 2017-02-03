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

  render() {
    let check = (<p className="check">&#x2610;</p>);
    if (this.props.watched == true) {
      check = (<p className="check">&#x2611;</p>);
    }
    let add = '';
    let title = this.props.title;
    let img = (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} alt='poster' />);
    if (!this.props.poster_path) {
      img = '';
    }
    if (this.props.media_type === 'tv') {
      add = (<button onClick={this.addSeasons}>Add Seasons</button>);
    }
    if (this.props.media_type === 'season') {
      add = (<button onClick={this.addEpisodes}>Add Episodes</button>);
      title = `${this.props.title}: Season ${this.props.number}`;
    }

    return (
    <li className={this.props.media_type} id={this.props.id}>
      <h4 onClick={this.onCheck}>{check}{title}</h4>

      {img}
      <p>{this.props.release_date}</p>
      <button onClick={this.onClick}>
        Delete
      </button>
      {add}
    </li>
  );
  }
}

const mapStateToProps = (state, props) => ({
  list: state.list,
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(UserMovie);
