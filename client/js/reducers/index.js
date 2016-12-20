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
    let movies = action.movies.results.map(movie => {
        return {
          id: movie.id,
          title: movie.name || movie.title,
          poster_path: movie.poster_path,
          release_date: movie.first_air_date || movie.release_date
        };
    });
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
  else if (action.type === actions.SEARCH_MOVIES_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  } else if (action.type === actions.DELETE_MOVIE_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.DELETE_MOVIE_SUCCESS) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: action.movies,
      }
      );
  }
  else if (action.type === actions.DELETE_MOVIE_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  } else if (action.type === actions.ADD_MOVIE_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.ADD_MOVIE_SUCCESS) {
    console.log("MOVIES:", action.movies);
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: action.movies,
      }
      );
  }
  else if (action.type === actions.ADD_MOVIE_ERROR) {
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
