/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] }] */
/* global window */

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

export default (initialState) => {
  if (typeof window === 'undefined') {
    return createStore(rootReducer, initialState);
  }
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware)));
};

/*
What our state looks like:
{
    currentLocationInfo: {
    }
}
*/
