import React from 'react';
import { withRouter } from 'react-router-dom';
import QueryHandler from './QueryHandler';
import { Mutation } from "react-apollo";
import listQuery from '../queries/List';
import addToListMutation from '../mutations/AddToList';
import removeFromListMutation from '../mutations/RemoveFromList';

export class SearchMovie extends React.Component {
  renderButtons(onList) {
    const { id, title, release_date, poster_path, media_type } = this.props;
    if (!onList) {
      return (
        <Mutation
          mutation={addToListMutation}
          refetchQueries={[{ query: listQuery, variables: { id: this.props.match.params.id } }]}
        >
          {(addToList, { loading, error }) => (
          <div className="card-actions">
            <button onClick={e => {
              e.preventDefault();
              addToList({ variables: { id, title, release_date, poster_path, media_type, list: this.props.match.params.id } });
            }}>Add to List</button>
          </div>)}
        </Mutation>
      );
    }
    return (
      <Mutation
        mutation={removeFromListMutation}
        refetchQueries={[{ query: listQuery, variables: { id: this.props.match.params.id } }]}
      >
        {(removeFromList, { loading, error }) => (
          <div className="card-actions">
            <button onClick={e => {
              e.preventDefault();
              removeFromList({ variables: { id, list: this.props.match.params.id } });
            }}>Remove from List</button>
          </div>
        )}
      </Mutation>
    );
  }

  renderImage() {
    if (!this.props.poster_path) {
      return (<div className="no-image" />);
    }
    return (<img src={`https://image.tmdb.org/t/p/w92${this.props.poster_path}`} alt='poster' />);
  }

  render() {
    return (
      <QueryHandler query={listQuery} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error, client }) => {
            let onList = '';
            if (data.list.media.find(movie => movie.media_id === this.props.id)) {
              onList = 'onList';
            }
            return (
              <li id={this.props.id} className={onList}>
                {this.renderImage()}
                <h2>{this.props.title}</h2>
                <p>{this.props.release_date}</p>
                {this.renderButtons(onList)}
              </li>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(SearchMovie);
