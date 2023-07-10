import { calculateNewAverages } from "../utils";
import { CREATE_REVIEW, EDIT_REVIEW, DELETE_REVIEW } from "./reviews";
import { EDIT_VOTE, CREATE_VOTE, DELETE_VOTE } from "./votes";

const CHECK_PLACE_EXISTENCE = "checkPlaceExistence";
const GET_WORKSHOP_DETAILS = "getWorkshop";
const GET_FEATURED_WORKSHOPS = "getFeaturedWorkshops";
const CREATE_WORKSHOP = "createWorkshop";
const EDIT_WORKSHOP = "editWorkshop";
const DELETE_WORKSHOP = "deleteWorkshop";

const checkPlaceExistence = (workshopId) => ({
  type: CHECK_PLACE_EXISTENCE,
  workshopId,
});

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

const editWorkshop = (payload) => ({
  type: EDIT_WORKSHOP,
  payload,
});

const deleteWorkshop = (payload) => ({
  type: DELETE_WORKSHOP,
  payload,
});

export const fetchPlaceExistence = (lat, lng) => async (dispatch) => {
  const response = await fetch("/api/workshops/check-place-existence", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(checkPlaceExistence(data.workshop_id));
    return data.workshop_id;
  }
};

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

export const editWorkshopThunk = (id, formData) => async (dispatch) => {
  const workshopResponse = await fetch(`/api/workshops/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (workshopResponse.ok) {
    const data = await workshopResponse.json();
    dispatch(editWorkshop(data));
    return data;
  }
};

export const deleteWorkshopThunk = (id) => async (dispatch) => {
  const workshopResponse = await fetch(`/api/workshops/${id}`, {
    method: "DELETE",
  });

  if (workshopResponse.ok) {
    const data = await workshopResponse.json();
    dispatch(deleteWorkshop(data));
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
    case EDIT_WORKSHOP:
      return {
        ...state,
        workshopDetails: {
          ...state.workshopDetails,
          preview_image_url: action.payload.preview_image_url,
        },
      };

    case CREATE_REVIEW: {
      const updatedWorkshopDetails = {
        ...state.workshopDetails,
        reviews: [...state.workshopDetails.reviews, action.payload],
      };

      const newAverages = calculateNewAverages(
        updatedWorkshopDetails.reviews,
        action.payload
      );
      const updatedWorkshopDetailsWithAverages = {
        ...updatedWorkshopDetails,
        ...newAverages,
      };

      return {
        ...state,
        workshopDetails: updatedWorkshopDetailsWithAverages,
      };
    }

    case EDIT_REVIEW: {
      const updatedReview = action.payload;

      const updatedWorkshopDetails = {
        ...state.workshopDetails,
        reviews: state.workshopDetails.reviews.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        ),
      };

      const newAverages = calculateNewAverages(
        updatedWorkshopDetails.reviews,
        updatedReview
      );
      const updatedWorkshopDetailsWithAverages = {
        ...updatedWorkshopDetails,
        ...newAverages,
      };

      return {
        ...state,
        workshopDetails: updatedWorkshopDetailsWithAverages,
      };
    }

    case DELETE_REVIEW: {
      const { payload: reviewId } = action;

      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReviews = updatedWorkshopDetails.reviews.filter(
        (review) => review.id !== reviewId
      );

      updatedWorkshopDetails.reviews = updatedReviews;

      return {
        ...state,
        workshopDetails: updatedWorkshopDetails,
      };
    }

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
      const { reviewId } = action.payload;

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
