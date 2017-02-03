import * as actions from '../../client/js/actions';
require('isomorphic-fetch')
import chai from 'chai';
const should = chai.should();

describe('actions', () => {
  it('should create an action to increment count', () => {
    const counter = '1'
    const expectedAction = {
      type: 'INCREMENT',
      counter
    }
    actions.incrementCount(counter).type.should.equal(expectedAction.type);
        actions.incrementCount(counter).counter.should.equal(expectedAction.counter)
  });
  it('should create an action to decrement count', () => {
    const counter = '1'
    const expectedAction = {
      type: 'DECREMENT',
      counter
    }
    actions.decrementCount(counter).type.should.equal(expectedAction.type);
        actions.decrementCount(counter).counter.should.equal(expectedAction.counter)
  });
});