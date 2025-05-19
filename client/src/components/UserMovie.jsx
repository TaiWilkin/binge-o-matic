import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import addEpisodesMutation from "../mutations/AddEpisodes";
import addSeasonsMutation from "../mutations/AddSeasons";
import hideChildrenMutation from "../mutations/HideChildren";
import deleteListItemMutation from "../mutations/RemoveFromList";
import toggleWatchedMutation from "../mutations/ToggleWatched";
import listQuery from "../queries/List";

class UserMovie extends React.Component {
  renderWatched() {
    if (!this.props.isOwner) return null;
    return (
      <Mutation
        mutation={toggleWatchedMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: this.props.match.params.id } },
        ]}
      >
        {(toggleWatched, { loading, error }) => (
          <button
            className="drop"
            onClick={() => {
              toggleWatched({
                variables: {
                  id: this.props.id,
                  isWatched: !this.props.isWatched,
                  list: this.props.match.params.id,
                },
              });
            }}
          >
            {this.props.isWatched ? "MARK AS UNWATCHED" : "MARK AS WATCHED"}
          </button>
        )}
      </Mutation>
    );
  }

  renderDeleteButton() {
    if (!this.props.isOwner) return null;
    return (
      <Mutation
        mutation={deleteListItemMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: this.props.match.params.id } },
        ]}
      >
        {(deleteListItem, { loading, error }) => (
          <button
            className="drop"
            onClick={() =>
              deleteListItem({
                variables: {
                  id: this.props.media_id,
                  list: this.props.match.params.id,
                },
              })
            }
          >
            DELETE
          </button>
        )}
      </Mutation>
    );
  }

  renderAddSeasons() {
    if (this.props.show_children) {
      return this.renderHideChildren("HIDE SEASONS");
    }
    return (
      <Mutation
        mutation={addSeasonsMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: this.props.match.params.id } },
        ]}
      >
        {(addSeasons, { loading, error }) => (
          <button
            className="drop"
            onClick={() => {
              addSeasons({
                variables: {
                  id: this.props.id,
                  media_id: this.props.media_id,
                  list: this.props.match.params.id,
                },
              });
            }}
          >
            ADD SEASONS
          </button>
        )}
      </Mutation>
    );
  }

  renderAddEpisodes() {
    if (this.props.show_children) {
      return this.renderHideChildren("HIDE EPISODES");
    }
    return (
      <Mutation
        mutation={addEpisodesMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: this.props.match.params.id } },
        ]}
      >
        {(addEpisodes, { loading, error }) => (
          <button
            className="drop"
            onClick={() => {
              addEpisodes({
                variables: {
                  id: this.props.id,
                  season_number: this.props.number,
                  list: this.props.match.params.id,
                  show_id: this.props.parent_show,
                },
              });
            }}
          >
            ADD EPISODES
          </button>
        )}
      </Mutation>
    );
  }

  renderHideChildren(text) {
    return (
      <Mutation
        mutation={hideChildrenMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: this.props.match.params.id } },
        ]}
      >
        {(hideChildren, { loading, error }) => (
          <button
            className="drop"
            onClick={() => {
              hideChildren({
                variables: {
                  id: this.props.id,
                  list: this.props.match.params.id,
                },
              });
            }}
          >
            {text}
          </button>
        )}
      </Mutation>
    );
  }

  renderButtons() {
    const watched = this.renderWatched();
    const deleteButton = this.renderDeleteButton();
    switch (this.props.media_type) {
      case "movie":
        return (
          <div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>
        );
      case "tv":
        return (
          <div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {this.renderAddSeasons()}
            {watched}
          </div>
        );
      case "season":
        return (
          <div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {this.renderAddEpisodes()}
            {watched}
          </div>
        );
      case "episode":
        return (
          <div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>
        );
      default:
        return (
          <div className="card-actions">
            <button className="options">OPTIONS</button>
            {deleteButton}
            {watched}
          </div>
        );
    }
  }

  render() {
    if (
      this.props.hideChildrenOf.includes(this.props.parent_show) ||
      this.props.hideChildrenOf.includes(this.props.parent_season)
    ) {
      return null;
    }
    if (
      this.props.media_type === "season" &&
      (this.props.number === 0 || !this.props.number)
    ) {
      return null;
    }
    const { title } = this.props;
    let img = (
      <img
        src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`}
        alt="poster"
      />
    );
    let details = "";
    if (this.props.media_type === "season" && this.props.number) {
      details = `Season ${this.props.number}`;
    }
    if (this.props.media_type === "episode") {
      details = `Episode ${this.props.number}: ${this.props.episode}`;
      img = (
        <img
          src={`https://image.tmdb.org/t/p/w185${this.props.poster_path}`}
          alt="poster"
        />
      );
    }
    if (!this.props.poster_path) {
      img = <div className="no-image" />;
    }
    const classes = this.props.isWatched
      ? `${this.props.media_type} watched`
      : this.props.media_type;
    return (
      <li id={this.props.id} className={classes}>
        <div className="circle" />
        {img}
        <h2>{title}</h2>
        <p>{details}</p>
        <p>{this.props.release_date}</p>
        {this.renderButtons()}
      </li>
    );
  }
}

export default withRouter(UserMovie);
