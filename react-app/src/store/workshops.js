import { CREATE_REVIEW } from "./reviews";

const GET_WORKSHOP_DETAILS = "getWorkshop";
const GET_FEATURED_WORKSHOPS = "getFeaturedWorkshops";
const CREATE_WORKSHOP = "createWorkshop";

const getWorkshop = (payload) => ({
  type: GET_WORKSHOP_DETAILS,
  payload,
});

const getFeaturedWorkshops = (payload) => ({
  type: GET_FEATURED_WORKSHOPS,
  payload,
});

const createWorkshop = (payload) => ({
  type: CREATE_WORKSHOP,
  payload,
});

export const fetchWorkshopById = (id) => async (dispatch) => {
  const response = await fetch(`/api/workshops/${id}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getWorkshop(data));
    return data;
  }
};

export const fetchFeaturedWorkshops = () => async (dispatch) => {
  const response = await fetch(`/api/workshops/featured`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getFeaturedWorkshops(data));
    return data;
  }
};

export const createWorkshopThunk = (formData) => async (dispatch) => {
  const workshopResponse = await fetch(`/api/workshops/`, {
    method: "POST",
    body: formData,
  });

  if (workshopResponse.ok) {
    const data = await workshopResponse.json();
    dispatch(createWorkshop(data));
    return data;
  }
};

const initialState = {
  workshopDetails: {},
  featuredWorkshops: [],
};

const workshopReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORKSHOP_DETAILS:
      return {
        ...state,
        workshopDetails: action.payload,
      };
    case GET_FEATURED_WORKSHOPS:
      return {
        ...state,
        featuredWorkshops: action.payload,
      };
    case CREATE_WORKSHOP:
      return {
        ...state,
        workshopDetails: action.payload,
      };
    case CREATE_REVIEW:
      return {
        ...state,
        workshopDetails: {
          ...state.workshopDetails,
          reviews: [...state.workshopDetails.reviews, action.payload],
        },
      };
    default:
      return state;
  }
};

export default workshopReducer;
