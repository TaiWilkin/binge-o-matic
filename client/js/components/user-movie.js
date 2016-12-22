import React from 'react';
import {connect} from 'react-redux';

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
    let path = `/${this.props.list}/shows/${this.props.id}`;
    this.props.dispatch(actions.deleteMovie(path));
  }

  addSeasons() {
    let path = `/${this.props.list}/${this.props.id}`;
    this.props.dispatch(actions.getSeasons(path));
  }

  addEpisodes() {
    this.props.dispatch(actions.getEpisodes(this.props));
  }

  onCheck() {
    let path = `/${this.props.list}/${this.props.id}`;
    let watched = !this.props.watched.toString();
    this.props.dispatch(actions.markWatched(path, {"watched": watched}))
  }

  render() {
    let check = "";
    if (this.props.watched) {
      check = (<input type="checkbox" onChange={this.onCheck} checked/>)
    } else {
      check = (<input type="checkbox" onChange={this.onCheck}/>)
    }
    let add = "";
    let title = this.props.title;
    let img = (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} />);
    if (!this.props.poster_path) {
      img = "";
    }
    if (this.props.media_type === 'tv') {
      add = (<button onClick={this.addSeasons}>Seasons</button>);

    } 
    if (this.props.media_type === 'season') {
      add = (<button onClick={this.addEpisodes}>Episodes</button>);
      title = `${this.props.title}: Season ${this.props.number}`;
    } 
    
    return (
    <li className={this.props.media_type} id={this.props.id}>
      <h4>{check}{title}</h4>

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
