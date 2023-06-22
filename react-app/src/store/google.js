// Constants
const LOAD_AUTOCOMPLETE_SUGGESTIONS = "search/loadAutocompleteSuggestions";

// Action creators
const loadAutocompleteSuggestions = (suggestions) => ({
  type: LOAD_AUTOCOMPLETE_SUGGESTIONS,
  payload: suggestions,
});

// Thunk action
export const fetchAutocompleteSuggestions = (inputText) => async (dispatch) => {
  try {
    const response = await fetch(`/api/google/autocomplete?input=${inputText}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      dispatch(loadAutocompleteSuggestions(data));
    } else {
      throw new Error("Failed to fetch autocomplete suggestions");
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
};

// Initial state
const initialState = {
  autocompleteSuggestions: [],
};

// Reducer
export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AUTOCOMPLETE_SUGGESTIONS:
      return {
        ...state,
        autocompleteSuggestions: action.payload,
      };
    default:
      return state;
  }
}
