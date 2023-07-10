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
  (workshopId, review, images) => async (dispatch) => {
    const reviewResponse = await fetch(`/api/workshops/${workshopId}/reviews`, {
      method: "POST",
      body: review,
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
        console.log(imagesForm);

        if (res.ok) {
          const newImageData = await res.json();
          reviewData.images = newImageData[images];
        }
      }

      dispatch(editReview(reviewData));
      return reviewData;
    }
  };

export const editReviewThunk = (review, images) => async (dispatch) => {
  const reviewResponse = await fetch(`/api/reviews/${review.id}`, {
    method: "PUT",
    body: review,
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
      console.log(imagesForm);

      if (res.ok) {
        const newImageData = await res.json();
        reviewData.images = newImageData[images];
      }
    }

    dispatch(createReview(reviewData));
    return reviewData;
  }
};

export const deleteReviewThunk = (id) => async (dispatch) => {
  const reviewResponse = await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  if (reviewResponse.ok) {
    const data = await reviewResponse.json();
    console.log(id);
    dispatch(deleteReview(id));
    return data;
  }
};
