import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import "./AddReview.css";

const AddReview = ({ workshopId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [description, setDescription] = useState("");
  const [wifi, setWifi] = useState(0);
  const [petFriendliness, setPetFriendliness] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const [wifiHoveredRating, setWifiHoveredRating] = useState(0);
  const [petFriendlinessHoveredRating, setPetFriendlinessHoveredRating] =
    useState(0);
  const [noiseLevelHoveredRating, setNoiseLevelHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (wifi === 0) {
      validationErrors.wifi = "Wifi rating is required.";
    }
    if (petFriendliness === 0) {
      validationErrors.petFriendliness = "Pet friendliness rating is required.";
    }
    if (noiseLevel === 0) {
      validationErrors.noiseLevel = "Noise level rating is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reviewData = new FormData();
    reviewData.append("description", description);
    reviewData.append("wifi", wifi);
    reviewData.append("pet_friendliness", petFriendliness);
    reviewData.append("noise_level", noiseLevel);

    try {
      dispatch(createReviewThunk(workshopId, reviewData, images));
      closeModal();
    } catch (error) {
      if (error.response) {
        console.error("Error creating review:", error);
      } else {
        console.error("Network error:", error);
      }
    }
  };

  const handleImageChange = (index, event) => {
    const selectedFile = event.target.files[0];
    const newImages = [...images];

    if (selectedFile) {
      newImages[index] = selectedFile;
    } else {
      newImages[index] = null;
    }

    setImages(newImages);
  };

  const handleStarHover = (rating, ratingSetter) => {
    ratingSetter(rating);
  };

  const handleStarClick = (ratingSetter, rating, ratingHoverSetter) => {
    ratingSetter(rating);
    ratingHoverSetter(0); // Reset the hovered rating after clicking
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-container">
      <h3 className="review-form-title">How was your visit?</h3>
      <div className="ratings-container">
        <div className="rating-container">
          <h5>Wifi</h5>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((rating) => (
              <svg
                key={rating}
                className={`star ${
                  wifiHoveredRating >= rating || wifi >= rating ? "yellow" : ""
                }`}
                onMouseEnter={() =>
                  handleStarHover(rating, setWifiHoveredRating)
                }
                onMouseLeave={() => handleStarHover(0, setWifiHoveredRating)}
                onClick={() =>
                  handleStarClick(setWifi, rating, setWifiHoveredRating)
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2l3.09 6.32 6.91.96-5 4.86 1.18 6.88L12 17.25l-6.18 3.81 1.18-6.88-5-4.86 6.91-.96L12 2zm0 0" />
              </svg>
            ))}
          </div>
          {errors.wifi && <div>{errors.wifi}</div>}
        </div>
        <div className="rating-container">
          <h5>Pet Friendliness</h5>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((rating) => (
              <svg
                key={rating}
                className={`star ${
                  petFriendlinessHoveredRating >= rating ||
                  petFriendliness >= rating
                    ? "yellow"
                    : ""
                }`}
                onMouseEnter={() =>
                  handleStarHover(rating, setPetFriendlinessHoveredRating)
                }
                onMouseLeave={() =>
                  handleStarHover(0, setPetFriendlinessHoveredRating)
                }
                onClick={() =>
                  handleStarClick(
                    setPetFriendliness,
                    rating,
                    setPetFriendlinessHoveredRating
                  )
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2l3.09 6.32 6.91.96-5 4.86 1.18 6.88L12 17.25l-6.18 3.81 1.18-6.88-5-4.86 6.91-.96L12 2zm0 0" />
              </svg>
            ))}
          </div>
          {errors.petFriendliness && <div>{errors.petFriendliness}</div>}
        </div>
        <div className="rating-container">
          <h5>Noise Level</h5>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((rating) => (
              <svg
                key={rating}
                className={`star ${
                  noiseLevelHoveredRating >= rating || noiseLevel >= rating
                    ? "yellow"
                    : ""
                }`}
                onMouseEnter={() =>
                  handleStarHover(rating, setNoiseLevelHoveredRating)
                }
                onMouseLeave={() =>
                  handleStarHover(0, setNoiseLevelHoveredRating)
                }
                onClick={() =>
                  handleStarClick(
                    setNoiseLevel,
                    rating,
                    setNoiseLevelHoveredRating
                  )
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2l3.09 6.32 6.91.96-5 4.86 1.18 6.88L12 17.25l-6.18 3.81 1.18-6.88-5-4.86 6.91-.96L12 2zm0 0" />
              </svg>
            ))}
          </div>
          {errors.noiseLevel && <div>{errors.noiseLevel}</div>}
        </div>
      </div>
      <div className="add-review-description-container">
        {/* <label>Tell us more:</label> */}
        <textarea
          value={description}
          placeholder="tell us some more"
          onChange={(event) => setDescription(event.target.value)}
          style={{ fontFamily: "var(--font-lato)" }}
        />
      </div>
      <div className="add-reviews-images">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(0, event)}
          />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(1, event)}
          />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(2, event)}
          />
        </div>
        <div className="preview-images-container">
          {images[0] && images[0] !== null && (
            <img
              className="preview-image"
              alt="place"
              src={URL.createObjectURL(images[0])}
            ></img>
          )}
          {images[1] && images[1] !== null && (
            <img
              className="preview-image"
              alt="place"
              src={URL.createObjectURL(images[1])}
            ></img>
          )}
          {images[2] && images[2] !== null && (
            <img
              alt="place"
              className="preview-image"
              src={URL.createObjectURL(images[2])}
            ></img>
          )}
        </div>
      </div>
      <button type="submit" className="add-review-submit">
        Submit Review
      </button>
    </form>
  );
};

export default AddReview;
