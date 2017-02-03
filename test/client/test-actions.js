import * as actions from '../../client/js/actions';
require('isomorphic-fetch')
import chai from 'chai';
const should = chai.should();

describe('actions', () => {
  it('should create fetchMoviesRequest', () => {
    const expectedAction = {
      type: actions.FETCH_MOVIES_REQUEST
    }
    actions.fetchMoviesRequest().type.should.equal(expectedAction.type);
  });
  it('should create fetchMoviesSuccess', () => {
    const movies = ["movie"];
    const expectedAction = {
      type: actions.FETCH_MOVIES_SUCCESS,
      movies
    }
    actions.fetchMoviesSuccess(movies).type.should.equal(expectedAction.type);
    actions.fetchMoviesSuccess(movies).movies.should.equal(expectedAction.movies)
  });
  it('should create fetchMoviesError', () => {
    const error = "error";
    const expectedAction = {
      type: actions.FETCH_MOVIES_ERROR,
      error
    }
    actions.fetchMoviesError(error).type.should.equal(expectedAction.type);
    actions.fetchMoviesError(error).error.should.equal(expectedAction.error)
  });
});





