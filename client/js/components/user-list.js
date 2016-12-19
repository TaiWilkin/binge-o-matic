import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/cheese';
import UserMovie from './user-movie';

class UserList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('did mount');
    this.props.dispatch(actions.fetchCheeses());
  }

  render() {
    const movies = this.props.userMovies.map((movie, index) => (
      <UserMovie key={index} id={movie.id} img={movie.img} title={movie.title} date={movie.date} />
    ));

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
  userMovies: state.cheeses
});

export default connect(mapStateToProps)(UserList);
