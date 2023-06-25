// Constants
const LOAD_AUTOCOMPLETE_SUGGESTIONS = "search/loadAutocompleteSuggestions";
const LOAD_NEARBY_SUGGESTIONS = "search/loadNearbySuggestions";
const LOAD_PLACE_DETAILS = "search/loadPlaceDetails";

// Action creators
const loadAutocompleteSuggestions = (suggestions) => ({
  type: LOAD_AUTOCOMPLETE_SUGGESTIONS,
  payload: suggestions,
});

const loadNearbySuggestions = (suggestions) => ({
  type: LOAD_NEARBY_SUGGESTIONS,
  payload: suggestions,
});

const loadPlaceDetails = (payload) => ({
  type: LOAD_PLACE_DETAILS,
  payload,
});

// Thunk action
export const fetchAutocompleteSuggestions = (inputText) => async (dispatch) => {
  try {
    const response = await fetch(`/api/google/autocomplete?input=${inputText}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadAutocompleteSuggestions(data));
    } else {
      throw new Error("Failed to fetch autocomplete suggestions");
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
};

export const fetchNearbySuggestions = (inputText) => async (dispatch) => {
  try {
    const response = await fetch(`/api/google/nearby?input=${inputText}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadNearbySuggestions(data));
    } else {
      throw new Error("Failed to fetch nearby suggestions");
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
};

export const fetchPlaceDetails = (placeId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/google/details?place_id=${placeId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadPlaceDetails(data));
    } else {
      throw new Error("Failed to fetch place details");
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
};

// Initial state
const initialState = {
  autocompleteSuggestions: [],
  placeDetails: [],
};

// Reducer
export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AUTOCOMPLETE_SUGGESTIONS:
      return {
        ...state,
        autocompleteSuggestions: action.payload,
      };
    case LOAD_NEARBY_SUGGESTIONS:
      return {
        ...state,
        autocompleteSuggestions: action.payload,
      };
    case LOAD_PLACE_DETAILS:
      return {
        ...state,
        placeDetails: action.payload,
      };
    default:
      return state;
  }
}
