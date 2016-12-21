import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class UserMovie extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.addSeasons = this.addSeasons.bind(this);
    this.addEpisodes = this.addEpisodes.bind(this);
  }

  onClick() {
    this.props.dispatch(actions.deleteMovie(this.props.id));
  }

  addSeasons() {
    this.props.dispatch(actions.getSeasons(this.props.id));
  }

  addEpisodes() {
    this.props.dispatch(actions.getEpisodes(this.props));
  }

  render() {
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
      <h4>{title}</h4>
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


export default connect()(UserMovie);
