const GET_WORKSHOP_DETAILS = "tasks/getWorkshop";
const GET_FEATURED_WORKSHOPS = "tasks/getFeaturedWorkshops";
const CREATE_WORKSHOP = "tasks/createWorkshop";

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

export const createWorkshopThunk =
  (placeDetails, image) => async (dispatch) => {
    const workshopData = {
      placeDetails: placeDetails,
      image: image,
    };

    const workshopResponse = await fetch(`/api/workshops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workshopData),
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
    default:
      return state;
  }
};

export default workshopReducer;
