import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import * as actions from '../actions';

import AsyncComponent from './AsyncComponent';

//setup async imports
const NewList = AsyncComponent({
  loader: () => import('./NewList'),
});
const Nav = AsyncComponent({
  loader: () => import('./Nav'),
});
const Login = AsyncComponent({
 loader: () => import('./Login'),
});

const UserList = AsyncComponent({
  loader: () => import('./UserList'),
});
const SearchMovies = AsyncComponent({
  loader: () => import('./SearchMovies'),
});
const Edit = AsyncComponent({
  loader: () => import('./Edit'),
});

const About = AsyncComponent({
  loader: () => import('./About'),
});

class Bingeomatic extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBJEYOUN6R72itj0DTbb5KsMtjH-7cpr2o',
      authDomain: 'binge-o-matic.firebaseapp.com',
      databaseURL: 'https://binge-o-matic.firebaseio.com',
      storageBucket: 'binge-o-matic.appspot.com',
      messagingSenderId: '643020325655'
    });
    this.props.dispatch(actions.fetchMovies(37));
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.dispatch(actions.setPage('about'));
        this.props.dispatch(actions.loggedIn(true));
        this.props.dispatch(actions.fetchUserLists());
      } else {
        this.props.dispatch(actions.setPage('about'));
        this.props.dispatch(actions.loggedIn(false));
        this.props.dispatch({ type: actions.USER_LISTS_FETCH_SUCCESS, lists: [] });
      }
    });
  }

  renderMain() {
    switch (this.props.page) {
      case 'about':
        return <About />;
      case 'home': {
        if (this.props.userMovies.length === 0) {
          return <SearchMovies />;
        }
        return <UserList />;
      }
      case 'login':
        return <Login />;
      case 'newList':
        return <NewList />;
      case 'edit':
        return <Edit />;
      case 'search':
        return <SearchMovies />;
      default:
        return <UserList />;
    }
  }

  render() {
    return (
      <div className="bingomatic">
        <div className="wrapper">
          <header>
            <h1>Binge-<img className="eye" src="../assets/bright-eye.png" alt="o" />-matic</h1>
          </header>
          <Nav />
          {this.renderMain()}
        </div>
        <div className="push" />
        <footer className="footer">
          <img src="https://www.themoviedb.org/assets/23e473036b28a59bd5dcfde9c671b1c5/images/v4/logos/312x276-primary-green.png" alt="poster" />This product uses the TMDb API but is not endorsed or certified by TMDb.
          <p>Icon made by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/">CC 3.0 BY</a></p>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({ userLists, list, page, userMovies }) => {
  return { userLists, list, page, userMovies };
};

export default connect(mapStateToProps)(Bingeomatic);
