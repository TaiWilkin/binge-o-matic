import 'isomorphic-fetch';
import firebase from 'firebase';
import _ from 'lodash';

const seasonsUrl = '/seasons';
const episodesUrl = '/episodes';
const listsUrl = '/lists';

export const FETCH_MOVIES_REQUEST = 'FETCH_MOVIES_REQUEST';
export const fetchMoviesRequest = () => ({
  type: FETCH_MOVIES_REQUEST
});

export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const fetchMoviesSuccess = (movies) => ({
  type: FETCH_MOVIES_SUCCESS,
  movies
});

export const FETCH_MOVIES_ERROR = 'FETCH_MOVIES_ERROR';
export const fetchMoviesError = (error) => ({
  type: FETCH_MOVIES_ERROR,
  error
});

export const fetchMovies = (listId) => (dispatch) => {
  dispatch(fetchMoviesRequest());

  fetch(`${listsUrl}/${listId}`)
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(fetchMoviesSuccess(data)))
  .catch(err => {
    console.error('fetchMoviesError', err);
    fetchMoviesError(err);
  });
};

export const SEARCH_MOVIES_REQUEST = 'SEARCH_MOVIES_REQUEST';
export const searchMoviesRequest = () => ({
  type: SEARCH_MOVIES_REQUEST
});

export const SEARCH_MOVIES_SUCCESS = 'SEARCH_MOVIES_SUCCESS';
export const searchMoviesSuccess = (movies) => ({
  type: SEARCH_MOVIES_SUCCESS,
  movies
});

export const SEARCH_MOVIES_ERROR = 'SEARCH_MOVIES_ERROR';
export const searchMoviesError = (error) => ({
  type: SEARCH_MOVIES_ERROR,
  error
});

export const searchMovies = (query) =>
  (dispatch) => {
  dispatch(searchMoviesRequest());

  const searchUrl = `/search/${query}`;
  fetch(searchUrl)
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(searchMoviesSuccess(data)))
  .catch(err => {
    console.error('searchMoviesError', err);
    searchMoviesError(err);
  });
};

export const DELETE_MOVIE_REQUEST = 'DELETE_MOVIE_REQUEST';
export const deleteMovieRequest = () => ({
  type: DELETE_MOVIE_REQUEST
});

export const DELETE_MOVIE_SUCCESS = 'DELETE_MOVIE_SUCCESS';
export const deleteMovieSuccess = (movies) => ({
  type: DELETE_MOVIE_SUCCESS,
  movies
});

export const DELETE_MOVIE_ERROR = 'DELETE_MOVIE_ERROR';
export const deleteMovieError = (error) => ({
  type: DELETE_MOVIE_ERROR,
  error
});

export const deleteMovie = (path) => (dispatch) => {
  dispatch(deleteMovieRequest());

  fetch(listsUrl + path, { method: 'delete' })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(deleteMovieSuccess(data)))
  .catch(err => {
    console.error('deleteMovieError', err);
    deleteMovieError(err);
  });
};

export const ADD_MOVIE_REQUEST = 'ADD_MOVIE_REQUEST';
export const addMovieRequest = () => ({
  type: ADD_MOVIE_REQUEST
});

export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const addMovieSuccess = (movies) => ({
  type: ADD_MOVIE_SUCCESS,
  movies
});

export const ADD_MOVIE_ERROR = 'ADD_MOVIE_ERROR';
export const addMovieError = (error) => ({
  type: ADD_MOVIE_ERROR,
  error
});

export const addMovie = (movie, list) => (dispatch) => {
  dispatch(addMovieRequest());

  fetch(`${listsUrl}/${list}/show`, {
          method: 'post',
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(movie)
        })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(addMovieSuccess(data)))
  .catch(err => {
    console.error('addMovieError', err);
    addMovieError(err);
  });
};


export const GET_SEASONS_REQUEST = 'GET_SEASONS_REQUEST';
export const getSeasonsRequest = () => ({
  type: GET_SEASONS_REQUEST
});

export const GET_SEASONS_SUCCESS = 'GET_SEASONS_SUCCESS';
export const getSeasonsSuccess = (movies) => ({
  type: GET_SEASONS_SUCCESS,
  movies
});

export const GET_SEASONS_ERROR = 'GET_SEASONS_ERROR';
export const getSeasonsError = (error) => ({
  type: GET_SEASONS_ERROR,
  error
});

export const getSeasons = (path) => (dispatch) => {
  dispatch(getSeasonsRequest());

  fetch(seasonsUrl + path, { method: 'post' })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(getSeasonsSuccess(data)))
  .catch(err => {
    console.error('getSeasonsError', err);
    getSeasonsError(err);
  });
};

export const GET_EPISODES_REQUEST = 'GET_EPISODES_REQUEST';
export const getEpisodesRequest = () => ({
  type: GET_EPISODES_REQUEST
});

export const GET_EPISODES_SUCCESS = 'GET_EPISODES_SUCCESS';
export const getEpisodesSuccess = (movies) => ({
  type: GET_EPISODES_SUCCESS,
  movies
});

export const GET_EPISODES_ERROR = 'GET_EPISODES_ERROR';
export const getEpisodesError = (error) => ({
  type: GET_EPISODES_ERROR,
  error
});

export const getEpisodes = (season) => (dispatch) => {
  dispatch(getEpisodesRequest());

  fetch(`${episodesUrl}/${season.list}/${season.parent_show}/${season.number}`,
          { method: 'post',
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(season)
        })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(getEpisodesSuccess(data)))
  .catch(err => {
    console.error('getEpisodesError', err);
    getEpisodesError(err);
  });

  const { currentUser } = firebase.auth();
  return firebase.database().ref(`users/${currentUser.uid}/lists/${season.list}/hidden/${season.id}`)
    .remove();
};

export const GET_LISTS_REQUEST = 'GET_LISTS_REQUEST';
export const getListsRequest = () => ({
  type: GET_LISTS_REQUEST
});

export const GET_LISTS_SUCCESS = 'GET_LISTS_SUCCESS';
export const getListsSuccess = (lists) => ({
  type: GET_LISTS_SUCCESS,
  lists
});

export const GET_LISTS_ERROR = 'GET_LISTS_ERROR';
export const getListsError = (error) => ({
  type: GET_LISTS_ERROR,
  error
});

export const getLists = () => (dispatch) => {
  dispatch(getListsRequest());

  fetch(listsUrl)
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(getListsSuccess(data)))
  .catch(err => {
    console.error('getListsError', err);
    getListsError(err);
  });
};

export const SET_LIST = 'SET_LIST';
export const setList = (id) => ({
  type: SET_LIST,
  id
});

export const RESET_LIST = 'RESET_LIST';
export const resetList = () => ({
    type: RESET_LIST
});

export const ADD_LIST_REQUEST = 'ADD_LIST_REQUEST';
export const addListRequest = () => ({
  type: ADD_LIST_REQUEST
});

export const ADD_LIST_SUCCESS = 'ADD_LIST_SUCCESS';
export const addListSuccess = (list) => ({
  type: ADD_LIST_SUCCESS,
  list
});

export const ADD_LIST_ERROR = 'ADD_LIST_ERROR';
export const addListError = (error) => ({
  type: ADD_LIST_ERROR,
  error
});

export const addList = (list) => (dispatch) => {
  dispatch(addListRequest());

  fetch(`${listsUrl}/${list.name}`, { method: 'post' })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(response => {
    dispatch(addListSuccess(response));
    const { currentUser } = firebase.auth();
    firebase.database().ref(`users/${currentUser.uid}/lists/${response.id}`)
      .set({ name: response.name });
  })
  .catch(err => {
    console.error('addListError', err);
    addListError(err);
  });
};

export const EDIT_LIST_REQUEST = 'EDIT_LIST_REQUEST';
export const editListRequest = () => ({
  type: EDIT_LIST_REQUEST
});

export const EDIT_LIST_SUCCESS = 'EDIT_LIST_SUCCESS';
export const editListSuccess = (list) => ({
  type: EDIT_LIST_SUCCESS,
  list
});

export const EDIT_LIST_ERROR = 'EDIT_LIST_ERROR';
export const editListError = (error) => ({
  type: EDIT_LIST_ERROR,
  error
});

export const editList = (path, name) => (dispatch) => {
  dispatch(editListRequest());
  const body = { "name": name };
  fetch(listsUrl + path,
              { method: 'put',
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(body)
        })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(list => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`users/${currentUser.uid}/lists${path}/name`)
    .set(name);
    dispatch(editListSuccess(list));
  })
  .catch(err => {
    console.error('editListError', err);
    editListError(err);
  });
};

export const DELETE_LIST_REQUEST = 'DELETE_LIST_REQUEST';
export const deleteListRequest = () => ({
  type: DELETE_LIST_REQUEST
});

export const DELETE_LIST_SUCCESS = 'DELETE_LIST_SUCCESS';
export const deleteListSuccess = (lists) => ({
  type: DELETE_LIST_SUCCESS,
  lists
});

export const DELETE_LIST_ERROR = 'DELETE_LIST_ERROR';
export const deleteListError = (error) => ({
  type: DELETE_LIST_ERROR,
  error
});

export const deleteList = (path) => (dispatch) => {
  dispatch(deleteListRequest());
  fetch(listsUrl + path,
              { method: 'delete' })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(list => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`users/${currentUser.uid}/lists${path}`)
    .remove();
    dispatch(deleteListSuccess(list));
  })
  .catch(err => {
    console.error('deleteListError', err);
    deleteListError(err);
  });
};

export const MARK_WATCHED_REQUEST = 'MARK_WATCHED_REQUEST';
export const markWatchedRequest = () => ({
  type: MARK_WATCHED_REQUEST
});

export const MARK_WATCHED_SUCCESS = 'MARK_WATCHED_SUCCESS';
export const markWatchedSuccess = (item) => ({
  type: MARK_WATCHED_SUCCESS,
  item
});

export const MARK_WATCHED_ERROR = 'MARK_WATCHED_ERROR';
export const markWatchedError = (error) => ({
  type: MARK_WATCHED_ERROR,
  error
});

export const markWatched = (path, body) => (dispatch) => {
  dispatch(markWatchedRequest());

  fetch(listsUrl + path,
        { method: 'put',
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(body)
      })
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(list => dispatch(markWatchedSuccess(list)))
  .catch(err => {
    console.error('markWatchedError', err);
    markWatchedError(err);
  });
};

export const FILTER_SEARCH = 'FILTER_SEARCH';
export const filterSearch = (filter) => ({
  type: FILTER_SEARCH,
  filter
});

export const SET_PAGE = 'SET_PAGE';
export const setPage = (page) => ({
  type: SET_PAGE,
  page
});

export const LOGGED_IN = 'LOGGED_IN';
export const loggedIn = (status) => ({
    type: LOGGED_IN,
    status
});

export const USER_LISTS_FETCH = 'USER_LISTS_FETCH';
export const USER_LISTS_FETCH_SUCCESS = 'USER_LISTS_FETCH_SUCCESS';
export const USER_LISTS_FETCH_FAILURE = 'USER_LISTS_FETCH_FAILURE';
export const fetchUserLists = () => {
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: USER_LISTS_FETCH });
    firebase.database().ref(`users/${currentUser.uid}/lists`)
      .on('value', snapshot => {
        let lists = snapshot.val();
        if (lists) {
          lists = _.map(lists, (val, id) => ({
            ...val, id: parseInt(id, 10)
          }))
        } else {
          lists = [];
        }
        dispatch({ type: USER_LISTS_FETCH_SUCCESS, lists });
      });
  };
};

export const HIDE_EPISODES_REQUEST = 'HIDE_EPISODES_REQUEST';
export const HIDE_EPISODES_SUCCESS = 'HIDE_EPISODES_SUCCESS';
export const HIDE_EPISODES_ERROR = 'HIDE_EPISODES_ERROR';
export const hideEpisodes = (list, season) => {
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: HIDE_EPISODES_REQUEST });
    return firebase.database().ref(`users/${currentUser.uid}/lists/${list}/hidden/${season}`)
      .set({ name: 'hide' })
      .then((res) => {
        dispatch({ type: HIDE_EPISODES_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: HIDE_EPISODES_ERROR, error });
      });
  };
};

export const GET_HIDDEN_REQUEST = 'GET_HIDDEN_REQUEST';
export const GET_HIDDEN_SUCCESS = 'GET_HIDDEN_SUCCESS';
export const GET_HIDDEN_ERROR = 'GET_HIDDEN_ERROR';
export const getHidden = (list) => {
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: GET_HIDDEN_REQUEST });
    return firebase.database().ref(`users/${currentUser.uid}/lists/${list}/hidden/`)
      .on('value', snapshot => {
        let seasons = snapshot.val();
        if (seasons) {
          seasons = _.map(seasons, (val, id) => (parseInt(id, 10)));
        } else {
          seasons = [];
        }
        dispatch({ type: GET_HIDDEN_SUCCESS, hidden: seasons });
      });
  };
};
