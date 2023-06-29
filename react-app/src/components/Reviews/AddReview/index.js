import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
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
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("IMAGES ARRAY", images);

    const imageList = new FormData();
    images.forEach((image, index) => {
      imageList.append(`image${index}`, image);
    });

    const reviewData = new FormData();
    reviewData.append("description", description);
    reviewData.append("wifi", wifi);
    reviewData.append("pet_friendliness", petFriendliness);
    reviewData.append("noise_level", noiseLevel);

    console.log("FORM DATA", imageList);

    try {
      const createdReview = await dispatch(
        createReviewThunk(workshopId, reviewData, imageList)
      );
      history.push(`/workshops/${workshopId}`);
    } catch (error) {
      if (error.response) {
        const data = await error.response.json();
        if (data && data.errors) setErrors(data.errors);
      } else {
        console.error("Error creating review:", error);
        // Handle other types of errors (e.g., network errors)
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
          required
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
      </div>
      <div>
        <label>Image 1:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(0, event)}
        />
      </div>
      <div>
        <label>Image 2:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(1, event)}
        />
      </div>
      <div>
        <label>Image 3:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageChange(2, event)}
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReview;
