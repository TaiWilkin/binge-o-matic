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
          <h2>Your List</h2>
          <ul>
            {movies}
          </ul>
        </div>
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    userMovies: state.userMovies
  });

  export default connect(mapStateToProps)(UserList);
