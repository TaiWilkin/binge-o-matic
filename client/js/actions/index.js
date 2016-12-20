
const userUrl = "http://localhost:8080/movies";

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

export const fetchMovies = () => (dispatch) => {
  dispatch(fetchMoviesRequest())

  fetch(userUrl)
  .then(res => {
    console.log('fetchMoviesRequest', res);
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
  })
}

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

export const searchMovies = (query) => {
  return (dispatch) => {
  dispatch(searchMoviesRequest())

  let searchUrl = `http://localhost:8080/search/${query}`
  fetch(searchUrl)
  .then(res => {
    console.log('searchMoviesRequest', res);
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
  })
}
}

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

export const deleteMovie = (id) => (dispatch) => {
  dispatch(deleteMovieRequest())

  fetch(userUrl + '/' + id, {method: 'delete'})
  .then(res => {
    console.log('deleteMovieRequest', res);
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
  })
}

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

export const addMovie = (movie) => (dispatch) => {
  dispatch(addMovieRequest())

  fetch(userUrl, {  
          method: 'post',  
          headers: {  
            "Content-type": "application/json; charset=utf-8"  
          },  
          body: JSON.stringify(movie)
        })
  .then(res => {
    console.log('addMovieRequest', res);
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
  })
}

