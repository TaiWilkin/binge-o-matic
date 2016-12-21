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
        let movies = action.movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
  });
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
          media_type: movie.media_type,
          title: movie.name || movie.title,
          poster_path: movie.poster_path,
          release_date: movie.first_air_date || movie.release_date
        };
    });
    movies = movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
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
            let movies = action.movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
  });
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
            let movies = action.movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
  });
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
  else if (action.type === actions.ADD_MOVIE_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  } else if (action.type === actions.GET_SEASONS_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.GET_SEASONS_SUCCESS) {
        let movies = action.movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
  });
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        userMovies: movies,
      }
      );
  } else if (action.type === actions.GET_SEASONS_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  } else if (action.type === actions.GET_EPISODES_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.GET_EPISODES_SUCCESS) {
        let movies = action.movies.sort(function(a,b){
    return (new Date(a.release_date) - new Date(b.release_date));
  });
    console.log(movies);
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
  else if (action.type === actions.GET_EPISODES_ERROR) {
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
