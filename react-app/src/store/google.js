// Constants
const LOAD_AUTOCOMPLETE_SUGGESTIONS = "search/loadAutocompleteSuggestions";
const LOAD_NEARBY_SUGGESTIONS = "search/loadNearbySuggestions";
const LOAD_PLACE_DETAILS = "search/loadPlaceDetails";
const LOAD_NEARBY_WORKSHOPS = "search/loadNearbyWorkshops";

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

const loadNearbyWorkshops = (payload) => ({
  type: LOAD_NEARBY_WORKSHOPS,
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
      return data;
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
      return data;
    } else {
      throw new Error("Failed to fetch place details");
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
};

export const fetchNearbyWorkshops = (lat, lng) => async (dispatch) => {
  try {
    if (!lat || !lng) {
      throw new Error("Latitude and longitude are required.");
    }

    const response = await fetch(`/api/workshops/nearby?lat=${lat}&lng=${lng}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadNearbyWorkshops(data));
      return data;
    } else {
      throw new Error("Failed to fetch nearby workshops");
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
  nearbyWorkshops: [],
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
    case LOAD_NEARBY_WORKSHOPS:
      return {
        ...state,
        nearbyWorkshops: action.payload,
      };
    default:
      return state;
  }
}
