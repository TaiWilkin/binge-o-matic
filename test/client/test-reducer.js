import reducer from '../../client/js/reducers'
require('isomorphic-fetch')
import chai from 'chai';
const should = chai.should();

describe('reducer', () => {
  it('should return the initial state', () => {
    let initState = reducer(undefined, {});
    initState.userMovies.length.should.equal(0);
    initState.searchMovies.length.should.equal(0);
    initState.loading.should.equal(false);
    initState.lists.length.should.equal(0);
    initState.list.should.equal(1);
    initState.listName.should.equal("Select or Create a List");
  })
  it('should handle FETCH_MOVIES_REQUEST', () => {
    let result = reducer([], {
      type: 'FETCH_MOVIES_REQUEST'
    })
    result.loading.should.equal(true);
  })
  it('should handle FETCH_MOVIES_SUCCESS', () => {
    let result = reducer([], {
      type: 'FETCH_MOVIES_SUCCESS',
      movies: ["movie"]
    })
    result.loading.should.equal(false);
    result.userMovies.length.should.equal(1);
  })
  it('should handle FETCH_MOVIES_ERROR', () => {
    let result = reducer([], {
      type: 'FETCH_MOVIES_ERROR',
      error: "error"
    })
    result.loading.should.equal(false);
    result.error.should.equal("error");
  })
  it('should handle SEARCH_MOVIES_SUCCESS', () => {
  	let movie = {
  		id: 123,
  	    media_type: "movie",
  	    title: "Frozen",
  	    poster_path: "/image.png",
  	    release_date: "01/02/2013"
  	}
    let result = reducer([], {
      type: 'SEARCH_MOVIES_SUCCESS',
      movies: {results: [movie]}
    })
    result.loading.should.equal(false);
    result.searchMovies.length.should.equal(1);
    let movieResult = result.searchMovies[0];
    movieResult.should.be.an.object;
    movieResult.id.should.equal(123);
  })
  it('should handle DELETE_MOVIE_SUCCESS', () => {
  	let movie = {
  		id: 123,
  	    media_type: "movie",
  	    title: "Frozen",
  	    poster_path: "/image.png",
  	    release_date: "01/02/2013"
  	}
    let result = reducer([], {
      type: 'DELETE_MOVIE_SUCCESS',
      movies: [movie]
    })
    result.loading.should.equal(false);
    result.userMovies.length.should.equal(1);
    let movieResult = result.userMovies[0];
    movieResult.should.be.an.object;
    movieResult.id.should.equal(123);
  })
});

