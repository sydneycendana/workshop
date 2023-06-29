export const CREATE_REVIEW = "createReview";

const createReview = (payload) => ({
  type: CREATE_REVIEW,
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
      console.log(reviewData);

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
