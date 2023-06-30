import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../../store/reviews";

const AddReview = ({ workshopId }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [description, setDescription] = useState("");
  const [wifi, setWifi] = useState("");
  const [petFriendliness, setPetFriendliness] = useState("");
  const [noiseLevel, setNoiseLevel] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (wifi === "") {
      validationErrors.wifi = "Wifi rating is required.";
    }
    if (petFriendliness === "") {
      validationErrors.petFriendliness = "Pet friendliness rating is required.";
    }
    if (noiseLevel === "") {
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
      history.push(`/workshops/${workshopId}`);
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div>
        <label>Wifi:</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={wifi}
          onChange={(event) => setWifi(event.target.value)}
          required
        />
        {errors.wifi && <div>{errors.wifi}</div>}
      </div>
      <div>
        <label>Pet Friendliness:</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={petFriendliness}
          onChange={(event) => setPetFriendliness(event.target.value)}
          required
        />
        {errors.petFriendliness && <div>{errors.petFriendliness}</div>}
      </div>
      <div>
        <label>Noise Level:</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={noiseLevel}
          onChange={(event) => setNoiseLevel(event.target.value)}
          required
        />
        {errors.noiseLevel && <div>{errors.noiseLevel}</div>}
      </div>
      <div>
        <label>Image 1:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(0, event)}
        />
        {images[0] && <img src={URL.createObjectURL(images[0])}></img>}
      </div>
      <div>
        <label>Image 2:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(1, event)}
        />
        {images[1] && <img src={URL.createObjectURL(images[1])}></img>}
      </div>
      <div>
        <label>Image 3:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(2, event)}
        />
        {images[2] && <img src={URL.createObjectURL(images[2])}></img>}
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReview;
