const url = "http://localhost:8080/cheeses";

export const FETCH_CHEESES_REQUEST = 'FETCH_CHEESES_REQUEST';
export const fetchCheesesRequest = () => ({
  type: FETCH_CHEESES_REQUEST
});

export const FETCH_CHEESES_SUCCESS = 'FETCH_CHEESES_SUCCESS';
export const fetchCheesesSuccess = (cheeses) => ({
  type: FETCH_CHEESES_SUCCESS,
  cheeses
});

export const FETCH_CHEESES_ERROR = 'FETCH_CHEESES_ERROR';
export const fetchCheesesError = (error) => ({
  type: FETCH_CHEESES_ERROR,
  error
});

export const fetchCheeses = () => (dispatch) => {
  dispatch(fetchCheesesRequest())

  fetch(url)
  .then(res => {
    console.log('fetchCheesesRequest', res);
    if (!res.ok) {
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
    return res;
  })
  .then(res => res.json())
  .then(data => dispatch(fetchCheesesSuccess(data)))
  .catch(err => {
    console.error('fetchCheesesError', err);
    fetchCheesesError(err);
  })
}
