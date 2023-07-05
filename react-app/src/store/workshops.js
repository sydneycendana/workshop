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

    case EDIT_VOTE: {
      const { review_id, vote_type } = action.payload;

      console.log("Review ID:", review_id);
      console.log("Reviews Array:", state.workshopDetails.reviews);

      // 1. Find the index of the review within the reviews array
      const reviewIndex = state.workshopDetails.reviews.findIndex(
        (review) => review.id === review_id
      );

      // 2. Create a copy of the workshopDetails object and the review object
      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReview = { ...updatedWorkshopDetails.reviews[reviewIndex] };

      // 3. Update the total_votes in the copied review object based on the new vote type
      updatedReview.total_votes += vote_type;

      updatedReview.votes = updatedReview.votes || {};

      // 4. Update the votes object within the copied review object to reflect the new vote type
      updatedReview.votes.userVoteType = vote_type;

      // 5. Replace the old review object with the updated review object within the copied workshopDetails object
      updatedWorkshopDetails.reviews[reviewIndex] = updatedReview;

      // 6. Return the updated workshopDetails object as the new state
      return {
        ...state,
        workshopDetails: updatedWorkshopDetails,
      };
    }

    case DELETE_VOTE: {
      const { reviewId, voteId } = action.payload;
      console.log("Review ID:", reviewId);
      console.log("Reviews Array:", state.workshopDetails.reviews);

      // Find the index of the review within the reviews array
      const reviewIndex = state.workshopDetails.reviews.findIndex(
        (review) => review.id === reviewId
      );

      if (reviewIndex === -1) {
        // Review not found, return the current state
        return state;
      }
      // Create a copy of the workshopDetails object and the review object
      const updatedWorkshopDetails = { ...state.workshopDetails };
      const updatedReview = { ...updatedWorkshopDetails.reviews[reviewIndex] };

      // Get the previous vote type
      const previousVoteType = updatedReview.votes?.userVoteType || 0;

      // Subtract the previous vote type from the total_votes in the copied review object
      updatedReview.total_votes -= previousVoteType;

      // Reset the userHasVoted, userVoteType, and voteId values to their initial state
      updatedReview.votes = {
        userHasVoted: false,
        userVoteType: null,
        voteId: null,
      };

      // Replace the old review object with the updated review object within the copied workshopDetails object
      updatedWorkshopDetails.reviews[reviewIndex] = updatedReview;

      // Return the updated workshopDetails object as the new state
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
