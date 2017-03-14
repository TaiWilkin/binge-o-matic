import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ListMovie from './ListMovie';
import Episode from './episode';

class PublicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      text: this.props.listName
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChangeList = this.onChangeList.bind(this);
  }

  onClick() {
    this.setState({ edit: true });
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const path = `/${this.props.list}`;
    this.props.dispatch(actions.editList(path, this.state.text));
    this.setState({ edit: false });
  }

  onDelete() {
    const path = `/${this.props.list}`;
    this.props.dispatch(actions.deleteList(path));
  }

  onChangeList() {
    this.props.dispatch(actions.resetList());
    this.props.dispatch(actions.getLists());
  }

  render() {
   const movies = this.props.userMovies
   .map(movie => {
    return (
      <ListMovie
        key={movie.id}
        {...movie}
      />);
  });

    return (
      <main>
         <div className="subheader">
          <h2>{this.props.listName}</h2>
        </div>
        <ul className="watchlist">
          {movies}
        </ul>
      </main>
    );
 }
}

const mapStateToProps = (state, props) => ({
  userMovies: state.userMovies,
  list: state.list,
  listName: state.listName
});

export default connect(mapStateToProps)(PublicList);
