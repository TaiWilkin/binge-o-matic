import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import QueryHandler from "./QueryHandler";
import listQuery from "../queries/List";
import UserMovie from "./UserMovie";
import UserListHeader from "./UserListHeader";
import ListHeader from "./ListHeader";

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
    return isOwner ? (
      <UserListHeader
        push={this.props.history.push}
        onToggleWatched={() =>
          this.setState({ hideWatched: !this.state.hideWatched })
        }
        hideWatched={this.state.hideWatched}
        id={this.props.match.params.id}
        name={list.name}
      />
    ) : (
      <ListHeader name={list.name} push={this.props.history.push} />
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
