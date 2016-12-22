import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserMovie from './user-movie';
import Episode from './episode'

class UserList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const movies = this.props.userMovies
      .map(movie => {
        if (movie.media_type === 'episode') {
        return (<Episode
          key={movie.id}
          {...movie}
        />);
        }
        return (<UserMovie
          key={movie.id}
          {...movie}
        />);
        });

      return (
        <div className="userList">
          <h2>{this.props.listName}</h2>
          <ul>
            {movies}
          </ul>
        </div>
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    userMovies: state.userMovies,
    listName: state.listName
  });

  export default connect(mapStateToProps)(UserList);
