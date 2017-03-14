import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ListMovie from './ListMovie';
import UserMovie from './UserMovie';

class UserList extends Component {
  renderMovies() {
    if (this.props.userLists.find(list => list.id === this.props.list)) {
      return this.props.userMovies.map(movie => {
         return (
           <UserMovie
             key={movie.id}
             {...movie}
           />);
         });
    }
    return this.props.userMovies.map(movie => {
      return (
        <ListMovie
          key={movie.id}
          {...movie}
        />);
      });
  }

  renderHeader() {
    if (this.props.owner) {
      return (
        <div className="subheader">
          <h2>{this.props.listName}</h2>
          <button
            className="edit-btn"
            onClick={() => { this.props.dispatch(actions.setPage('edit')); }}
          >Edit List</button>
          <button
            className="edit-btn"
            onClick={() => { this.props.dispatch(actions.setPage('search')); }}
          >Add Items</button>
        </div>);
    }
    return (
      <div className="subheader">
       <h2>{this.props.listName}</h2>
     </div>
   );
  }

  render() {
    return (
      <main>
        {this.renderHeader()}
        <ul className="watchlist">
          {this.renderMovies()}
        </ul>
      </main>
    );
 }
}

const mapStateToProps = (state) => {
  const { userMovies, listName, userLists } = state;
  let owner = false;
  if (userLists.find(list => list.id === state.list)) {
    owner = true;
  }
  return {
    userMovies,
    list: state.list,
    listName,
    userLists,
    owner
  };
};

export default connect(mapStateToProps)(UserList);
