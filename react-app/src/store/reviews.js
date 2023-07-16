export const CREATE_REVIEW = "createReview";
export const EDIT_REVIEW = "editReview";
export const DELETE_REVIEW = "deleteReview";

const createReview = (payload) => ({
  type: CREATE_REVIEW,
  payload,
});

const editReview = (payload) => ({
  type: EDIT_REVIEW,
  payload,
});

const deleteReview = (payload) => ({
  type: DELETE_REVIEW,
  payload,
});

export const createReviewThunk =
  (workshopId, reviewData, images) => async (dispatch) => {
    const reviewResponse = await fetch(`/api/workshops/${workshopId}/reviews`, {
      method: "POST",
      body: reviewData,
    });

    if (reviewResponse.ok) {
      const reviewData = await reviewResponse.json();

      if (images) {
        const imagesForm = new FormData();

        images.forEach((image) => {
          imagesForm.append("images", image);
        });

        const res = await fetch(`/api/reviews/${reviewData.id}/images`, {
          method: "POST",
          body: imagesForm,
        });

        if (res.ok) {
          const newImageData = await res.json();
          reviewData.images = newImageData;
        }
      }

      dispatch(createReview(reviewData));
      return reviewData;
    }
  };

export const editReviewThunk = (id, reviewData) => async (dispatch) => {
  try {
    console.log(reviewData);
    const reviewResponse = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      body: reviewData,
    });

    if (!reviewResponse.ok) {
      throw new Error("Failed to update review");
    }

    const responseData = await reviewResponse.json();
    console.log(responseData);

    dispatch(editReview(responseData));
    return responseData;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReviewThunk = (id) => async (dispatch) => {
  const reviewResponse = await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  if (reviewResponse.ok) {
    const data = await reviewResponse.json();
    dispatch(deleteReview(id));
    return data;
  }
};
