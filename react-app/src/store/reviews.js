const CREATE_REVIEW = "createReview";

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

      if (images) {
        console.log(images);
        const imageResponses = await Promise.all(
          images.map((image) =>
            fetch(`/api/reviews/${reviewData.id}/images`, {
              method: "POST",
              body: image,
            })
          )
        );

        const imageData = await Promise.all(
          imageResponses.map((response) => response.json())
        );

        reviewData.images = [];

        if (imageData) reviewData.images = imageData;
      }

      dispatch(createReview(reviewData));
      return reviewData;
    }
  };
