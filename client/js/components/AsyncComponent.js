import Loadable from 'react-loadable';
import { LoadingSpinner } from './LoadingSpinner';

export default function AsyncComponent(opts) {
  return Loadable(Object.assign({
    loading: LoadingSpinner,
    delay: 200,
    timeout: 1000,
  }, opts));
};
