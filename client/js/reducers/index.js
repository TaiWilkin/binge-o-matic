import * as actions from '../actions';

const initialState = {
  userMovies: [],
  searchMovies: [],
  loading: false,
  error: null,
  lists: [],
  list: 1,
  listName: "Your List"
};

const sortMovies = (movies) => {
  movies = movies.sort(function(a,b){
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
  return movies;
}

const moviesReducer = (state=initialState, action) => {
  if (action.type === actions.FETCH_MOVIES_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.FETCH_MOVIES_SUCCESS) {
    let movies = sortMovies(action.movies);
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
  }
  else if (action.type === actions.SEARCH_MOVIES_REQUEST) {
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
  else if (action.type === actions.DELETE_MOVIE_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.DELETE_MOVIE_SUCCESS) {
    let movies = sortMovies(action.movies);
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
  }
  else if (action.type === actions.ADD_MOVIE_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.ADD_MOVIE_SUCCESS) {
    let movies = sortMovies(action.movies);
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
  }
  else if (action.type === actions.GET_SEASONS_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.GET_SEASONS_SUCCESS) {
    let movies = sortMovies(action.movies);
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
  else if (action.type === actions.GET_SEASONS_ERROR) {
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
   let movies = sortMovies(action.movies);
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
  else if (action.type === actions.SET_LIST) {
    let listIndex = -1;
    state.lists.forEach((list, i) => {
      if (parseInt(list.id) === parseInt(action.id)) {
        listIndex = i;
      }
    });
    let newList = {
      list: action.id,
      listName: state.lists[listIndex].name
    }
    return Object.assign({}, state, newList);
  }
  else if (action.type === actions.GET_LISTS_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.GET_LISTS_SUCCESS) {
   return Object.assign(
    {},
    state,
    {
      loading: false,
      error: null,
      lists: action.lists,
    }
    );
  }
  else if (action.type === actions.GET_LISTS_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  }
  else if (action.type === actions.ADD_LIST_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.ADD_LIST_SUCCESS) {
    let lists = state.lists.slice();
    lists = [...lists, action.list];
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        list: action.list.id,
        lists: lists
      }
      );
  }
  else if (action.type === actions.ADD_LIST_ERROR) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: action.error
      }
      );
  }
    else if (action.type === actions.EDIT_LIST_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.EDIT_LIST_SUCCESS) {
    let newList = action.list[0];
    let index = -1
    state.lists.forEach((list, i) => {
      if (newList.id === list.id) {
        index = i;
      }
    })
    let before = state.lists.slice(0, index);
    let after = state.lists.slice(index + 1);
    let updateLists = [...before, newList, ...after]
    console.log(updateLists);
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
  else if (action.type === actions.EDIT_LIST_ERROR) {
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
