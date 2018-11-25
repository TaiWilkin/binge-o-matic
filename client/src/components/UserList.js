import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import QueryHandler from './QueryHandler';
import listQuery from '../queries/List';
import UserMovie from './UserMovie';

class UserList extends Component {
  renderMovies(media, isOwner) {
      return media.map(movie => {
         return (
           <UserMovie
             key={movie.id}
             isOwner={isOwner}
             {...movie}
           />);
         });
    }

  renderHeader(list, isOwner) {
    if (isOwner) {
      return (
        <div className="header">
          <h2>{list.name}</h2>
          <button
            className="edit-btn"
            onClick={() => this.props.history.push(`/lists/${this.props.match.params.id}/edit`)}
          >EDIT LIST</button>
          <button
            className="edit-btn"
            onClick={() => this.props.history.push(`/lists/${this.props.match.params.id}/search`)}
          >ADD ITEMS</button>
        </div>);
    }
    return (
      <div className="header">
       <h2>{list.name}</h2>
     </div>
   );
  }

  render() {
    return (
      <QueryHandler query={listQuery} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error, client }) => {
          if (!data.list) {
            return <p style={{ color: 'red' }}> Error: List not found!</p>;
          }
          const isOwner = data.user && data.list.user.toString() === data.user.id.toString();
          return (
          <main>
            {this.renderHeader(data.list, isOwner)}
            <ul className="watchlist">
              {this.renderMovies(data.list.media, isOwner)}
            </ul>
          </main>
        )}}
      </QueryHandler>
    );
 }
}

export default withRouter(UserList);
