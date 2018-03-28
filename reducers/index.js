import { combineReducers } from 'redux';
import { ADD_CURRENT_LOCATION_INFO } from '../actions/actions';

function currentLocationInfo(state = [], action) {
  switch (action.type) {
    case ADD_CURRENT_LOCATION_INFO:
      return { ...state, currentPlaceInfo: action.json };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  currentLocationInfo,
});

export default rootReducer;
