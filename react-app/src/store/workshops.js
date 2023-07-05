import { CREATE_REVIEW } from "./reviews";
import { EDIT_VOTE, CREATE_VOTE, DELETE_VOTE } from "./votes";

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

    case CREATE_VOTE: {
      const { review_id, vote_type } = action.payload;

      const reviewIndex = state.workshopDetails.reviews.findIndex(
        (review) => review.id === review_id
      );

      if (reviewIndex === -1) {
        return state;
      }

      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReview = { ...updatedWorkshopDetails.reviews[reviewIndex] };

      updatedReview.total_votes += vote_type;
      updatedReview.votes = updatedReview.votes || {};

      updatedReview.votes.userVoteType = vote_type;

      updatedWorkshopDetails.reviews[reviewIndex] = updatedReview;

      return {
        ...state,
        workshopDetails: updatedWorkshopDetails,
      };
    }

    case EDIT_VOTE: {
      const { review_id, vote_type } = action.payload;

      const reviewIndex = state.workshopDetails.reviews.findIndex(
        (review) => review.id === review_id
      );

      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReview = { ...updatedWorkshopDetails.reviews[reviewIndex] };

      updatedReview.total_votes += vote_type;

      updatedReview.votes = updatedReview.votes || {};

      updatedReview.votes.userVoteType = vote_type;

      updatedWorkshopDetails.reviews[reviewIndex] = updatedReview;

      return {
        ...state,
        workshopDetails: updatedWorkshopDetails,
      };
    }

    case DELETE_VOTE: {
      const { reviewId, voteId } = action.payload;

      const reviewIndex = state.workshopDetails.reviews.findIndex(
        (review) => review.id === reviewId
      );

      if (reviewIndex === -1) {
        return state;
      }

      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReview = { ...updatedWorkshopDetails.reviews[reviewIndex] };

      const previousVoteType = updatedReview.votes?.userVoteType || 0;

      updatedReview.total_votes -= previousVoteType;

      updatedReview.votes = {
        userHasVoted: false,
        userVoteType: null,
        voteId: null,
      };

      updatedWorkshopDetails.reviews[reviewIndex] = updatedReview;

      return {
        ...state,
        workshopDetails: updatedWorkshopDetails,
      };
    }

    default:
      return state;
  }
};

export default workshopReducer;
