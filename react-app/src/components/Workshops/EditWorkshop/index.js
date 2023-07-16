import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { editWorkshopThunk } from "../../../store/workshops";
import LoadingSpinner from "../../LoadingSpinner";

const EditWorkshop = ({ workshopId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const workshop = useSelector((state) => state.workshops.workshopDetails);

  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (workshop && workshop.preview_image_url) {
      setPreviewImageUrl(workshop.preview_image_url);
    }
  }, [workshop]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setErrors(["Please upload a valid image file (jpg, jpeg, png, gif)"]);
        setImage(null);
        return;
      }

      setErrors([]);
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreviewImageUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrors(["Please upload an image"]);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setIsLoading(true);
      dispatch(editWorkshopThunk(workshopId, formData));
      setTimeout(() => {
        setIsLoading(false);
        closeModal();
      }, 1500);
    } catch (error) {
      if (error.response) {
        console.error("Error creating review:", error);
      } else {
        console.error("Network error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-container">
      <h3 className="review-form-title">Edit Preview Image</h3>
      {previewImageUrl && !isLoading && (
        <div className="workshop-details-image-container">
          <img
            src={previewImageUrl}
            alt="Preview"
            style={{ width: "400px", height: "400px" }}
          />
        </div>
      )}
      {isLoading && <LoadingSpinner />}

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <button type="submit" className="add-review-submit">
        Submit
      </button>
    </form>
  );
};

export default EditWorkshop;
