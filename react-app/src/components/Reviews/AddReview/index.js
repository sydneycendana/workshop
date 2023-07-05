import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import MySlider from "../../MySlider";
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
    newImages[index] = selectedFile;
    setImages(newImages);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-container">
      <h3 className="review-form-title">Add Review</h3>
      <div>
        <div>
          <MySlider
            value={parseFloat(wifi)}
            onChange={(event, value) => setWifi(value)}
            name="Wifi"
            required
          />
          {errors.wifi && <div>{errors.wifi}</div>}
        </div>
        <div>
          <MySlider
            value={parseFloat(petFriendliness)}
            onChange={(event, value) => setPetFriendliness(value)}
            name="Pet Friendliness"
            required
          />
          {errors.petFriendliness && <div>{errors.petFriendliness}</div>}
        </div>
        <div>
          <MySlider
            value={parseFloat(noiseLevel)}
            onChange={(event, value) => setNoiseLevel(value)}
            name="Noise Level"
            required
          />
          {errors.noiseLevel && <div>{errors.noiseLevel}</div>}
        </div>
      </div>
      <div className="add-review-description-container">
        <label>Tell us more:</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
          {images[0] && (
            <img
              className="preview-image"
              src={URL.createObjectURL(images[0])}
            ></img>
          )}
          {images[1] && (
            <img
              className="preview-image"
              src={URL.createObjectURL(images[1])}
            ></img>
          )}
          {images[2] && (
            <img
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
