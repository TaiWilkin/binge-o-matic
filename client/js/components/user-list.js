import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserMovie from './user-movie';
import Episode from './episode';

class UserList extends Component {
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
    if (movie.media_type === 'episode') {
      return (<Episode
        key={movie.id}
        {...movie}
      />);
    }
    return (<UserMovie
      key={movie.id}
      {...movie}
    />);
  });

   let editor = '';
   if (this.state.edit) {
      editor = (
        <form className="editor" onSubmit={this.onSubmit}>
          <label>
            Edit List Name:
            <input
              className="listbar"
              type="text"
              onChange={this.onChange}
              value={this.state.text}
            />
          </label>
            <button className="submit" type="button" onClick={this.onSubmit}>
              Save Name
            </button>
        </form>
      );
    }

    return (
      <div className="userList">
        <div className="edits">
          <h2>{this.props.listName}</h2>
          <button className="submit" onClick={this.onClick}>Edit List Name</button>
          <button className="submit" onClick={this.onDelete}>Delete List</button>
          <button className="submit" onClick={this.onChangeList}>Change List</button>
        </div>
        {editor}
        <ul>
          {movies}
        </ul>
      </div>
    );
 }
}

const mapStateToProps = (state, props) => ({
  userMovies: state.userMovies,
  list: state.list,
  listName: state.listName
});

export default connect(mapStateToProps)(UserList);
