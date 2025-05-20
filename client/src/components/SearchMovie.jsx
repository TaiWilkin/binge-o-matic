import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import addToListMutation from "../mutations/AddToList";
import removeFromListMutation from "../mutations/RemoveFromList";
import listQuery from "../queries/List";
import QueryHandler from "./QueryHandler";

class SearchMovie extends React.Component {
  renderButtons(onList) {
    const { id, title, release_date, poster_path, media_type, match } =
      this.props;
    if (!onList) {
      return (
        <Mutation
          mutation={addToListMutation}
          refetchQueries={[
            { query: listQuery, variables: { id: match.params.id } },
          ]}
        >
          {(addToList) => (
            <div className="card-actions">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addToList({
                    variables: {
                      id,
                      title,
                      release_date,
                      poster_path,
                      media_type,
                      list: match.params.id,
                    },
                  });
                }}
              >
                Add to List
              </button>
            </div>
          )}
        </Mutation>
      );
    }
    return (
      <Mutation
        mutation={removeFromListMutation}
        refetchQueries={[
          { query: listQuery, variables: { id: match.params.id } },
        ]}
      >
        {(removeFromList) => (
          <div className="card-actions">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                removeFromList({
                  variables: { id, list: match.params.id },
                });
              }}
            >
              Remove from List
            </button>
          </div>
        )}
      </Mutation>
    );
  }

  renderImage() {
    const { poster_path } = this.props;
    if (!poster_path) {
      return <div className="no-image" />;
    }
    return (
      <img src={`https://image.tmdb.org/t/p/w92${poster_path}`} alt="poster" />
    );
  }

  render() {
    const { match, id, title, release_date } = this.props;
    return (
      <QueryHandler query={listQuery} variables={{ id: match.params.id }}>
        {({ data }) => {
          let onList = "";
          if (data.list.media.find((movie) => movie.media_id === id)) {
            onList = "onList";
          }
          return (
            <li id={id} className={onList}>
              {this.renderImage()}
              <h2>{title}</h2>
              <p>{release_date}</p>
              {this.renderButtons(onList)}
            </li>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(SearchMovie);
