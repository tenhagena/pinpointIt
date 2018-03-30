// Actions for Create Poll page
export const ADD_CURRENT_LOCATION_INFO = 'ADD_CURRENT_LOCATION_INFO';

// Adds poll options to option list
export function addCurrentLocationInfo(json) {
  return {
    type: ADD_CURRENT_LOCATION_INFO,
    json,
  };
}

