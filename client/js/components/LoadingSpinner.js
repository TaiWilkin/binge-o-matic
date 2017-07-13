// @flow
import React from 'react';

type Props = {
  isLoading: boolean,
  timedOut: boolean,
  pastDelay: boolean,
  error: boolean
}

const LoadingSpinner = ({ isLoading, timedOut, pastDelay, error}: Props) => {
  if (isLoading) {
    if (timedOut) {
      return <div>Loader timed out!</div>;
    } else if (pastDelay) {
      return <div className="spinner"></div>;
    } else {
      return <div></div>;
    }
  } else if (error) {
    return <div>Error! Component failed to load</div>;
  } else {
    return <div></div>;
  }
}

export { LoadingSpinner };
