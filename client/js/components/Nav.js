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
        return <li className="right"><button onClick={() => firebase.auth().signOut()}>Logout</button></li>;
      case false:
        return <li className="right"><button onClick={() => {this.props.dispatch(actions.setPage('login'));}}>Login/Signup</button></li>;
      default:
        return null;
    }
  }

  renderMyLists() {
    switch (this.props.loggedIn) {
      case true: {
        const options = this.props.userLists.map(list =>
          (<button
            onClick={(e) => { e.preventDefault(); this.handleChange(list.id); this.props.dispatch(actions.setPage('home')); }}
            key={list.id} value={list.id} className="dropdown-btn"
          >{list.name}</button>));
          return (
            <li className="dropdown">
              <button className="dropbtn">My Lists</button>
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
      (<button onClick={(e) => { e.preventDefault(); this.handleChange(list.id); this.handleChange(list.id); this.props.dispatch(actions.setPage('home')); } } key={list.id} value={list.id} className="dropdown-btn">{list.name}</button>));
    return (
      <nav>
        <ul className="nav">
          <li><button onClick={() => { this.props.dispatch(actions.setPage('about')); }}>About</button></li>
          <li className="dropdown">
              <button className="dropbtn">Watchlists</button>
              <div className="dropdown-content">
                {options}
              </div>
          </li>
          {this.renderMyLists()}
          <li><button onClick={() => { this.props.dispatch(actions.setPage('newList')); }}>New List</button></li>
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
