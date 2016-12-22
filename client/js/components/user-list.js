import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserMovie from './user-movie';
import Episode from './episode'

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      text: this.props.listName
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    console.log("editing")
    this.setState({edit: true});
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    let path = `/${this.props.list}`
    this.props.dispatch(actions.editList(path, this.state.text));
    this.setState({edit: false})
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

   let editor = "";
   if (this.state.edit) {
      editor = (<form onSubmit={this.onSubmit}><input onChange={this.onChange} value={this.state.text} type="text" /><button type="submit"> Save Name </button></form>)
   }

    return (
      <div className="userList">
        <div><h2>{this.props.listName}</h2><button onClick={this.onClick}>Edit List Name</button></div>
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