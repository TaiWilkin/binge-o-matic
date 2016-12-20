import * as actions from '../actions';

const initialState = {
  userMovies: [],
  searchMovies: [],
  loading: false,
  error: null
};

const moviesReducer = (state=initialState, action) => {
  if (action.type === actions.FETCH_MOVIES_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.FETCH_MOVIES_SUCCESS) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: action.movies
      }
    );
  }
  else if (action.type === actions.FETCH_MOVIES_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
    );
  } else if (action.type === actions.SEARCH_MOVIES_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.SEARCH_MOVIES_SUCCESS) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        searchMovies: action.movies.results,
      }
    );
  }
  else if (action.type === actions.SEARCH_MOVIES_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
    );
  }

  return state;
}

export default moviesReducer;
