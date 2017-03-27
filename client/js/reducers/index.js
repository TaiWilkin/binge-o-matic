import 'isomorphic-fetch';
import * as actions from '../actions';

const initialState = {
  userMovies: [],
  searchMovies: [],
  loading: false,
  error: null,
  lists: [],
  list: 37,
  listName: 'Marvel Demo',
  filter: 'all',
  page: 'about',
  loggedIn: null,
  userLists: []
};

const sortMovies = (movies) => {
  const sortedMovies = movies.sort((a, b) => {
    let result = (new Date(a.release_date) - new Date(b.release_date));
    if (result === 0) {
      if (a.media_type === 'tv') {
        result = -1;
      } else if (b.media_type === 'tv') {
        result = 1;
      } else if (a.media_type === 'season') {
        result = -1;
      } else if (b.media_type === 'season') {
        result = 1;
      }
    }
    if (result === 0) {
      result = a.episode - b.episode;
    }
    return result;
  });
  return sortedMovies;
};

const moviesReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.FETCH_MOVIES_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.FETCH_MOVIES_SUCCESS:
    {
    const movies = sortMovies(action.movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: movies
      }
      );
    }
  case actions.FETCH_MOVIES_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.SEARCH_MOVIES_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.SEARCH_MOVIES_SUCCESS:
    {
    let movies = action.movies.results.map(movie => {
      return {
        id: movie.id,
        media_type: movie.media_type,
        title: movie.name || movie.title,
        poster_path: movie.poster_path,
        release_date: movie.first_air_date || movie.release_date
      };
    });
    movies = sortMovies(movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        searchMovies: movies,
      }
      );
    }
  case actions.SEARCH_MOVIES_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.DELETE_MOVIE_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.DELETE_MOVIE_SUCCESS:
    {
    const movies = sortMovies(action.movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: movies,
        page: 'about'
      }
      );
    }
  case actions.DELETE_MOVIE_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.ADD_MOVIE_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.ADD_MOVIE_SUCCESS:
    {
    const movies = sortMovies(action.movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: movies,
      }
      );
    }
  case actions.ADD_MOVIE_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.GET_SEASONS_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.GET_SEASONS_SUCCESS:
    {
    const movies = sortMovies(action.movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: movies,
      }
      );
    }
  case actions.GET_SEASONS_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.GET_EPISODES_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.GET_EPISODES_SUCCESS:
    {
   const movies = sortMovies(action.movies);
   return Object.assign(
    {},
    state,
    {
      loading: false,
      error: null,
      userMovies: movies,
    }
    );
  }
 case actions.GET_EPISODES_ERROR:
  return Object.assign(
    {},
    state,
    {
      loading: false,
      error: action.error
    }
    );
  case actions.SET_LIST:
    {
    let listIndex = -1;
    state.lists.forEach((list, i) => {
      if (parseInt(list.id, 10) === parseInt(action.id, 10)) {
        listIndex = i;
      }
    });
    const listName = state.lists[listIndex] ?
        state.lists[listIndex].name : 'Select or Create a List';
    const newList = {
      list: action.id,
      listName
    };
    return Object.assign({}, state, newList);
  }
  case actions.RESET_LIST:
    return Object.assign({}, state, initialState);
  case actions.GET_LISTS_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.GET_LISTS_SUCCESS:
   return Object.assign(
    {},
    state,
    {
      loading: false,
      error: null,
      lists: action.lists,
    }
    );
  case actions.GET_LISTS_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.ADD_LIST_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.ADD_LIST_SUCCESS:
    {
    let lists = state.lists.slice();
    lists = [...lists, action.list];
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        list: action.list.id,
        lists,
        listName: action.list.name,
        userMovies: []
      }
      );
    }
  case actions.ADD_LIST_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.EDIT_LIST_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.EDIT_LIST_SUCCESS:
    {
    const newList = action.list[0];
    let index = -1;
    state.lists.forEach((list, i) => {
      if (newList.id === list.id) {
        index = i;
      }
    });
    const before = state.lists.slice(0, index);
    const after = state.lists.slice(index + 1);
    const updateLists = [...before, newList, ...after];
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        list: newList.id,
        listName: newList.name,
        lists: updateLists
      }
      );
    }
  case actions.EDIT_LIST_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.DELETE_LIST_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.DELETE_LIST_SUCCESS:
   return Object.assign(
    {},
    state,
    {
      loading: false,
      error: null,
      lists: action.lists,
      listName: 'Select or Create a List',
      list: 0,
      userMovies: []
    }
    );
 case actions.DELETE_LIST_ERROR:
  return Object.assign(
    {},
    state,
    {
      loading: false,
      error: action.error
    }
    );
  case actions.MARK_WATCHED_REQUEST:
    return Object.assign({}, state, { loading: true });
  case actions.MARK_WATCHED_SUCCESS:
    {
    let index = -1;
    let editShow = {};
    state.userMovies.forEach((show, i) => {
      if (action.item.id === show.id) {
        index = i;
        editShow = show;
      }
    });
    editShow.watched = action.item.watched;
    const before = state.userMovies.slice(0, index);
    const after = state.userMovies.slice(index + 1);
    const updateMovies = [...before, editShow, ...after];
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: updateMovies
      }
      );
    }
  case actions.MARK_WATCHED_ERROR:
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  case actions.FILTER_SEARCH:
    return Object.assign({}, state, { filter: action.filter });
  case actions.SET_PAGE:
    return Object.assign({}, state, { page: action.page });
  case actions.LOGGED_IN:
    return Object.assign({}, state, { loggedIn: action.status });
  case actions.USER_LISTS_FETCH:
    return Object.assign({}, state, { userLists: [], loading: true });
  case actions.USER_LISTS_FETCH_SUCCESS:
    return Object.assign({}, state, { userLists: action.lists, loading: false });
  default:
    return state;
  }
};

export default moviesReducer;
