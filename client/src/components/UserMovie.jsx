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
    const { isOwner, match, isWatched, id } = this.props;
    if (!isOwner) return null;
    return (
      <Mutation
        mutation={toggleWatchedMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(toggleWatched) => (
          <button
            type="button"
            className="drop"
            onClick={() => {
              toggleWatched({
                variables: {
                  id,
                  isWatched: !isWatched,
                  list: match.params.id,
                },
              });
            }}
          >
            {isWatched ? "MARK AS UNWATCHED" : "MARK AS WATCHED"}
          </button>
        )}
      </Mutation>
    );
  }

  renderDeleteButton() {
    const { isOwner, match, media_id } = this.props;

    if (!isOwner) return null;

    return (
      <Mutation
        mutation={deleteListItemMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(deleteListItem) => (
          <button
            type="button"
            className="drop"
            onClick={() =>
              deleteListItem({
                variables: {
                  id: media_id,
                  list: match.params.id,
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
    const { show_children, match, id, media_id } = this.props;
    if (show_children) {
      return this.renderHideChildren("HIDE SEASONS");
    }
    return (
      <Mutation
        mutation={addSeasonsMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(addSeasons) => (
          <button
            type="button"
            className="drop"
            onClick={() => {
              addSeasons({
                variables: {
                  id,
                  media_id,
                  list: match.params.id,
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
    const { show_children, match, id, number, parent_show } = this.props;
    if (show_children) {
      return this.renderHideChildren("HIDE EPISODES");
    }
    return (
      <Mutation
        mutation={addEpisodesMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(addEpisodes) => (
          <button
            type="button"
            className="drop"
            onClick={() => {
              addEpisodes({
                variables: {
                  id,
                  season_number: number,
                  list: match.params.id,
                  show_id: parent_show,
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
    const { match, id } = this.props;
    return (
      <Mutation
        mutation={hideChildrenMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(hideChildren) => (
          <button
            type="button"
            className="drop"
            onClick={() => {
              hideChildren({
                variables: {
                  id,
                  list: match.params.id,
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
    const { media_type } = this.props;
    const watched = this.renderWatched();
    const deleteButton = this.renderDeleteButton();
    switch (media_type) {
      case "movie":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteButton}
            {watched}
          </div>
        );
      case "tv":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteButton}
            {this.renderAddSeasons()}
            {watched}
          </div>
        );
      case "season":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteButton}
            {this.renderAddEpisodes()}
            {watched}
          </div>
        );
      case "episode":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteButton}
            {watched}
          </div>
        );
      default:
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteButton}
            {watched}
          </div>
        );
    }
  }

  render() {
    const {
      hideChildrenOf,
      parent_show,
      parent_season,
      title,
      media_type,
      number,
      poster_path,
      episode,
      isWatched,
      id,
      release_date,
    } = this.props;
    if (
      hideChildrenOf.includes(parent_show) ||
      hideChildrenOf.includes(parent_season)
    ) {
      return null;
    }
    if (media_type === "season" && (number === 0 || !number)) {
      return null;
    }
    let img = (
      <img src={`https://image.tmdb.org/t/p/w92${poster_path}`} alt="poster" />
    );
    let details = "";
    if (media_type === "season" && number) {
      details = `Season ${number}`;
    }
    if (media_type === "episode") {
      details = `Episode ${number}: ${episode}`;
      img = (
        <img
          src={`https://image.tmdb.org/t/p/w185${poster_path}`}
          alt="poster"
        />
      );
    }
    if (!poster_path) {
      img = <div className="no-image" />;
    }
    const classes = isWatched ? `${media_type} watched` : media_type;
    return (
      <li id={id} className={classes}>
        <div className="circle" />
        {img}
        <h2>{title}</h2>
        <p>{details}</p>
        <p>{release_date}</p>
        {this.renderButtons()}
      </li>
    );
  }
}

export default withRouter(UserMovie);
