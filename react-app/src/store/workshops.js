const GET_WORKSHOP_DETAILS = "tasks/getWorkshop";

const getWorkshop = (payload) => ({
  type: GET_WORKSHOP_DETAILS,
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

const initialState = {
  workshopDetails: {},
};

const workshopReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORKSHOP_DETAILS:
      return {
        ...state,
        workshopDetails: action.payload,
      };
    default:
      return state;
  }
};

export default workshopReducer;
