import React from 'react';
import {createStore} from 'redux';

// import * as reducers from 'client.js/reducers/index.js';
// import * as actions from '../client/js/actions/index';

import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
const should = chai.should();


// const testStore = createStore(reducers.numberReducer);

describe('FETCH MOVIES', function() {
  it('should get movies', function() {
  });
});



//     testStore.dispatch(actions.newGame(number));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.guesses.length.should.equal(0);
//     state.proximity.should.equal('Make a Guess!');
//     state.won.should.equal(false);
//   });
// });

// describe('GUESS_NUMBER', function(){
//   it('should record an ICE guess and respond appropriately', function() {
//     const guessedNumber = 100;
//     testStore.dispatch(actions.guessNumber(guessedNumber));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.currentGuess.should.equal(guessedNumber);
//     state.guesses.length.should.equal(1);
//     state.proximity.should.equal('ICE');
//     state.won.should.equal(false);
//   });
//   it('should record an COLD guess and respond appropriately', function() {
//     const guessedNumber = 20;
//     testStore.dispatch(actions.guessNumber(guessedNumber));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.currentGuess.should.equal(guessedNumber);
//     state.guesses.length.should.equal(2);
//     state.proximity.should.equal('COLD');
//     state.won.should.equal(false);
//   });
//   it('should record an HOT guess and respond appropriately', function() {
//     const guessedNumber = 15;
//     testStore.dispatch(actions.guessNumber(guessedNumber));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.currentGuess.should.equal(guessedNumber);
//     state.guesses.length.should.equal(3);
//     state.proximity.should.equal('HOT');
//     state.won.should.equal(false);
//   });
//   it('should record an VERY HOT guess and respond appropriately', function() {
//     const guessedNumber = 10;
//     testStore.dispatch(actions.guessNumber(guessedNumber));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.currentGuess.should.equal(guessedNumber);
//     state.guesses.length.should.equal(4);
//     state.proximity.should.equal('VERY HOT');
//     state.won.should.equal(false);
//   });
//   it('should record a WINNING guess and respond appropriately', function() {
//     const guessedNumber = number;
//     testStore.dispatch(actions.guessNumber(guessedNumber));
//     let state = testStore.getState();
//     state.number.should.equal(number);
//     state.currentGuess.should.equal(guessedNumber);
//     state.guesses.length.should.equal(5);
//     state.proximity.should.equal('WINNER');
//     state.won.should.equal(true);
//   });
// });

