import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import * as actions from '../actions';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: 1 };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.getLists());
  }

  handleChange(id) {
    this.setState({ id });
    return Promise.resolve(this.props.dispatch(actions.setList(id)))
    .then(() => this.props.dispatch(actions.fetchMovies(id)))
    .catch(error => console.log(error));
  }

  renderLogin() {
    switch (this.props.loggedIn) {
      case true:
        return <li className="right"><a onClick={() => firebase.auth().signOut()}>Logout</a></li>;
      case false:
        return <li className="right"><a onClick={() => {this.props.dispatch(actions.setPage('login'));}}>Login/Signup</a></li>;
      default:
        return null;
    }
  }

  renderMyLists() {
    switch (this.props.loggedIn) {
      case true: {
        const options = this.props.userLists.map(list =>
          (<a
            onClick={(e) => { e.preventDefault(); this.handleChange(list.id); this.props.dispatch(actions.setPage('home')); }}
            key={list.id} value={list.id}
          >{list.name}</a>));
          return (
            <li className="dropdown">
              <a className="dropbtn">My Lists</a>
              <div className="dropdown-content">
                {options}
              </div>
            </li>);
      }
      case false:
        return null;
      default:
        return null;
    }
  }

  render() {
    const options = this.props.lists.map(list =>
      (<a onClick={(e) => { e.preventDefault(); this.handleChange(list.id); this.handleChange(list.id); this.props.dispatch(actions.setPage('home')); } } key={list.id} value={list.id}>{list.name}</a>));
    return (
      <nav>
        <ul className="nav">
          <li className="dropdown">
              <a className="dropbtn">Watchlists</a>
              <div className="dropdown-content">
                {options}
              </div>
          </li>
          {this.renderMyLists()}
          <li><a onClick={() => { this.props.dispatch(actions.setPage('newList')); }}>New List</a></li>
          {this.renderLogin()}
        </ul>
      </nav>
    );
  }
}

  const mapStateToProps = (state, props) => ({
    userMovies: state.userMovies,
    list: state.list,
    lists: state.lists,
    loggedIn: state.loggedIn,
    userLists: state.userLists
  });

export default connect(mapStateToProps)(Nav);
