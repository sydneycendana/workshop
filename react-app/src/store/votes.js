export const CREATE_VOTE = "createVote";
export const EDIT_VOTE = "editVote";

const createVote = (payload) => ({
  type: CREATE_VOTE,
  payload,
});

const editVote = (payload) => ({
  type: EDIT_VOTE,
  payload,
});

export const createVoteThunk = (reviewId, vote) => async (dispatch) => {
  const voteResponse = await fetch(`/api/reviews/${reviewId}/votes`, {
    method: "POST",
    body: vote,
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
