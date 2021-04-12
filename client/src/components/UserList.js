import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import QueryHandler from "./QueryHandler";
import listQuery from "../queries/List";
import UserMovie from "./UserMovie";

const calculateHiddenChildren = (media, hideWatched) => {
  let parentsWithHiddenChildren = media.filter(movie => !movie.show_children);
  if (hideWatched) {
    parentsWithHiddenChildren = parentsWithHiddenChildren.filter(
      movie => movie.isWatched
    );
  }
  return parentsWithHiddenChildren.map(movie => movie.id);
};

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideWatched: true
    };
  }

  renderMovies(media, isOwner) {
    const { hideWatched } = this.state;
    const filteredMedia = hideWatched
      ? media.filter(movie => !movie.isWatched)
      : media;
    const hideChildrenOf = calculateHiddenChildren(media, hideWatched);
    return filteredMedia.map(movie => {
      return (
        <UserMovie
          key={movie.id}
          isOwner={isOwner}
          {...movie}
          hideChildrenOf={hideChildrenOf}
        />
      );
    });
  }

  renderHeader(list, isOwner) {
    if (isOwner) {
      return (
        <div className="header">
          <h2>{list.name}</h2>
          <button
            className="edit-btn"
            onClick={() =>
              this.setState({ hideWatched: !this.state.hideWatched })
            }
          >
            {this.state.hideWatched ? "SHOW WATCHED" : "HIDE WATCHED"}
          </button>
          <button
            className="edit-btn"
            onClick={() =>
              this.props.history.push(
                `/lists/${this.props.match.params.id}/edit`
              )
            }
          >
            EDIT LIST
          </button>
          <button
            className="edit-btn"
            onClick={() =>
              this.props.history.push(
                `/lists/${this.props.match.params.id}/search`
              )
            }
          >
            ADD ITEMS
          </button>
        </div>
      );
    }
    return (
      <div className="header">
        <h2>{list.name}</h2>
      </div>
    );
  }

  render() {
    return (
      <QueryHandler
        query={listQuery}
        variables={{ id: this.props.match.params.id }}
      >
        {({ data, loading, error, client }) => {
          if (!data.list) {
            return <p style={{ color: "red" }}> Error: List not found!</p>;
          }
          const isOwner =
            data.user && data.list.user.toString() === data.user.id.toString();
          if (!data.list.media || !data.list.media.length) {
            if (!isOwner) {
              return (
                <main>
                  {this.renderHeader(data.list, isOwner)}
                  <p>No content in list</p>
                </main>
              );
            } else {
              return <Redirect to={`/lists/${data.list.id}/search`} />;
            }
          }
          return (
            <main>
              {this.renderHeader(data.list, isOwner)}
              <ul className="watchlist">
                {this.renderMovies(data.list.media, isOwner)}
              </ul>
            </main>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(UserList);
