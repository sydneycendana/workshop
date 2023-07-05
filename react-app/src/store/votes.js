export const CREATE_VOTE = "createVote";
export const EDIT_VOTE = "editVote";
export const DELETE_VOTE = "deleteVote";

const createVote = (payload) => ({
  type: CREATE_VOTE,
  payload,
});

const editVote = (payload) => ({
  type: EDIT_VOTE,
  payload,
});

const deleteVote = (reviewId, voteId) => ({
  type: DELETE_VOTE,
  payload: { reviewId, voteId },
});

export const createVoteThunk = (reviewId, voteType) => async (dispatch) => {
  const votePayload = {
    vote_type: voteType,
  };

  const voteResponse = await fetch(`/api/reviews/${reviewId}/votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(votePayload),
  });

  if (voteResponse.ok) {
    const voteData = await voteResponse.json();
    dispatch(createVote(voteData));
    return voteData;
  }
};

export const editVoteThunk = (voteId, voteType) => async (dispatch) => {
  const voteData = { vote_type: voteType }; // Create an object with the vote_type property

  try {
    const voteResponse = await fetch(`/api/votes/${voteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData), // Convert the voteData object to JSON
    });

    if (voteResponse.ok) {
      const updatedVoteData = await voteResponse.json();
      dispatch(editVote(updatedVoteData));
      return updatedVoteData;
    } else {
      // Handle error response if needed
    }
  } catch (error) {
    // Handle network or other errors
  }
};

export const deleteVoteThunk = (reviewId, voteId) => async (dispatch) => {
  try {
    const voteResponse = await fetch(`/api/votes/${voteId}`, {
      method: "DELETE",
    });

    if (!voteResponse.ok) {
      throw new Error("Failed to delete vote");
    }

    dispatch(deleteVote(reviewId, voteId));
  } catch (error) {
    console.log(error);
  }
};
