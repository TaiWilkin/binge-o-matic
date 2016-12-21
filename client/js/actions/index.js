

const userUrl = "http://localhost:8080/movies";
const seasonsUrl = "http://localhost:8080/seasons";
const episodesUrl = "http://localhost:8080/episodes";
const listsUrl = "http://localhost:8080/lists";

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
  dispatch(fetchMoviesRequest())

  fetch(listsUrl + '/' + listId)
  .then(res => {
    console.log('fetchMoviesRequest');
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
    console.log('searchMoviesRequest');
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
    console.log('deleteMovieRequest');
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
    console.log('addMovieRequest');
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

export const getSeasons = (id) => (dispatch) => {
  dispatch(getSeasonsRequest())

  fetch(seasonsUrl + '/' + id, {method: 'post'})
  .then(res => {
    console.log('getSeasonsRequest');
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
  })
}

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
  dispatch(getEpisodesRequest())

  fetch(episodesUrl + '/' + season.parent_show + '/' + season.number, 
          {method: 'post',           
          headers: {  
            "Content-type": "application/json; charset=utf-8"  
          },  
          body: JSON.stringify(season)
        })
  .then(res => {
    console.log('getEpisodesRequest');
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
  })
}

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
  dispatch(getListsRequest())

  fetch(listsUrl)
  .then(res => {
    console.log('getListsRequest');
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
  })
}

export const SET_LIST = 'SET_LIST';
export const setList = (id) => ({
  type: SET_LIST,
  id
});
