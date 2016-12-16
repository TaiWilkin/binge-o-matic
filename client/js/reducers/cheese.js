import * as actions from '../actions/cheese';

const initialState = {
  cheeses: [],
  loading: false,
  error: null
};

const cheeseReducer = (state=initialState, action) => {
  if (action.type === actions.FETCH_CHEESES_REQUEST) {
    return Object.assign({}, state, {loading: true});
  }
  else if (action.type === actions.FETCH_CHEESES_SUCCESS) {
    return Object.assign(
      {},
      state,
      {
        loading: false,
        error: null,
        cheeses: action.cheeses
      }
    );
  }
  else if (action.type === actions.FETCH_CHEESES_ERROR) {
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

export default cheeseReducer;
