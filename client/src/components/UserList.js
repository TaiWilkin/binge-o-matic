import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import QueryHandler from './QueryHandler';
import listQuery from '../queries/List';
import UserMovie from './UserMovie';

class UserList extends Component {
  renderMovies(media, isOwner) {
      const hideChildrenOf = media.filter(movie => !movie.show_children).map(movie => movie.id);
      return media.map(movie => {
         return (
           <UserMovie
             key={movie.id}
             isOwner={isOwner}
             {...movie}
             hideChildrenOf={hideChildrenOf}
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
          if (!data.list.media || !data.list.media.length) {
            if (!isOwner) {
              return (
                <main>
                  {this.renderHeader(data.list, isOwner)}
                  <p>No content in list</p>
                </main>
              );
            } else {
              return <Redirect to={`/lists/${data.list.id}/search`} />
            }
          }
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
