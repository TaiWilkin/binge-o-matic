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

  componentDidMount() {
    this.props.dispatch(actions.getHidden(this.props.list));
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

  onHide() {
    this.onCheck();
    this.props.dispatch(actions.hideEpisodes(this.props.list, this.props.id));
    this.props.dispatch(actions.getHidden(this.props.list));
  }

  addSeasons() {
    const path = `/${this.props.list}/${this.props.id}`;
    this.props.dispatch(actions.getSeasons(path));
    this.props.dispatch(actions.markWatched(path, { watched: true }));
  }

  addEpisodes() {
    const {
      adult,
      backdrop_path,
      episode,
      genre_ids,
      id,
      list,
      list_id,
      media_type,
      number,
      original_language,
      original_title,
      overview,
      owner,
      parent_season,
      parent_show,
      popularity,
      poster_path,
      release_date,
      show_id,
      title,
      video,
      vote_average,
      vote_count,
      watched
    } = this.props;
    const season = {
      adult,
      backdrop_path,
      episode,
      genre_ids,
      id,
      list,
      list_id,
      media_type,
      number,
      original_language,
      original_title,
      overview,
      owner,
      parent_season,
      parent_show,
      popularity,
      poster_path,
      release_date,
      show_id,
      title,
      video,
      vote_average,
      vote_count,
      watched
    };
    this.props.dispatch(actions.getEpisodes(season));
    const path = `/${list}/${id}`;
    this.props.dispatch(actions.markWatched(path, { watched: true }));
  }

  renderWatched() {
    if (this.props.watched == true) {
      return <button className="drop" onClick={this.onCheck}>MARK AS UNWATCHED</button>;
    }
      return <button className="drop" onClick={this.onCheck}>MARK AS WATCHED</button>;
  }

  renderButtons() {
    const watched = this.renderWatched();
    const deleteButton = (this.props.owner) ? <button className="drop" onClick={this.onClick}>DELETE</button> : null;
    const hideEpisodes = (this.props.owner && this.props.watched) ? <button className="drop" onClick={this.onHide.bind(this)}>HIDE EPISODES</button> : null;
    const showEpisodes = (this.props.owner && !this.props.watched) ? <button className="drop" onClick={this.addEpisodes}>SHOW EPISODES</button> : null;
      switch (this.props.media_type) {
        case 'movie':
          return (<div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>);
        case 'tv':
          return (<div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            <button className="drop" onClick={this.addSeasons}>SHOW SEASONS</button>
            {watched}
          </div>);
        case 'season':
          return (<div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {showEpisodes}
            {hideEpisodes}
            {watched}
          </div>);
        case 'episode':
          return (<div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>);
        default:
          return (<div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>);
      }
  }

  render() {
    if (this.props.media_type === 'season' && (this.props.number === 0 || !this.props.number)) {
      return null;
    }
    if (this.props.hidden.includes(this.props.parent_season)) {
      return null;
    }
    const title = this.props.title;
    let img = (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} alt='poster' />);
    let details = '';
    if (this.props.media_type === 'season' && this.props.number) {
      details = `Season ${this.props.number}`;
    }
    if (this.props.media_type === 'episode') {
      details = `Episode ${this.props.number}: ${this.props.episode}`;
      img = (<img src={`https://image.tmdb.org/t/p/w185${this.props.poster_path}`} alt='poster' />);
    }
    if (!this.props.poster_path) {
      img = (<div className="no-image" />);
    }
    const classes = (this.props.watched == true) ? `${this.props.media_type} watched` : this.props.media_type;
    return (
      <li id={this.props.id} className={classes}>
        <div className="circle" />
        {img}
        <h2>{title}</h2>
        <p>{details}</p>
        <p>{this.props.release_date}</p>
        {this.renderButtons()}
      </li>
  );
  }
}

const mapStateToProps = (state) => ({
  list: state.list,
  userMovies: state.userMovies,
  hidden: state.hidden
});

export default connect(mapStateToProps)(UserMovie);
