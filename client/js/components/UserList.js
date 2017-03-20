import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserMovie from './UserMovie';

class UserList extends Component {
  renderMovies() {
      if (this.props.loading) {
        return <div className="spinner" />;
      }
      return this.props.userMovies.map(movie => {
         return (
           <UserMovie
             key={movie.id}
             owner={this.props.owner}
             {...movie}
           />);
         });
    }

  renderHeader() {
    if (this.props.owner) {
      return (
        <div className="header">
          <h2>{this.props.listName}</h2>
          <button
            className="edit-btn"
            onClick={() => { this.props.dispatch(actions.setPage('edit')); }}
          >EDIT LIST</button>
          <button
            className="edit-btn"
            onClick={() => { this.props.dispatch(actions.setPage('search')); }}
          >ADD ITEMS</button>
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
  const { userMovies, listName, userLists, loading } = state;
  let owner = false;
  if (userLists.find(list => list.id === state.list)) {
    owner = true;
  }
  return {
    userMovies,
    list: state.list,
    listName,
    userLists,
    owner,
    loading
  };
};

export default connect(mapStateToProps)(UserList);
