export const CREATE_VOTE = "createVote";

const createVote = (payload) => ({
  type: CREATE_REVIEW,
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
