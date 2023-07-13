import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createWorkshopThunk } from "../../../store/workshops";

import { ReactComponent as Add } from "../../../assets/icons/add.svg";
import "./CreateWorkshop.css";

const CreateWorkshopForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const placeDetails = useSelector((state) => state.google.placeDetails);

  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // New state to store the temporary image URL

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setErrors(["Please upload a valid image file (jpg, jpeg, png, gif)"]);
        setImage(null);
        setSelectedFileName("");
        return;
      }

      setErrors([]);
      setImage(file);
      setSelectedFileName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    } else {
      setImage(null);
      setSelectedFileName("");
    }
  };

  useEffect(() => {
    if (placeDetails.length === 0) {
      history.push("/");
    }
  }, [placeDetails, history]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrors(["Please upload an image"]);
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("place_id", placeDetails.place_id);
    formData.append("name", placeDetails.name);
    formData.append("lat", placeDetails.latitude);
    formData.append("lng", placeDetails.longitude);
    formData.append("formatted_address", placeDetails.formatted_address);
    formData.append("phone_number", placeDetails.phone_number);
    formData.append("image", image);

    await dispatch(createWorkshopThunk(formData))
      .then((createdWorkshop) => {
        history.push(`/workshops/${createdWorkshop.id}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <div className="page-container" style={{ margin: "50px auto" }}>
      <div className="create-workshop-container">
        <form onSubmit={handleSubmit} className="create-workshop-form">
          <h5>Want to add this place as a workshop?</h5>
          <div className="create-workshop-details">
            <div> {placeDetails.name}</div>
            <div>{placeDetails.formatted_address}</div>
            <div> {placeDetails.phone_number}</div>
          </div>
          <div className="create-workshop-upload-image-container">
            <h6>Just upload an image:</h6>
            <div className="create-workshop-image-container">
              <label htmlFor="upload-file" className="create-workshop-button">
                <input
                  type="file"
                  id="upload-file"
                  onChange={handleImageUpload}
                  className="hidden-file-input"
                />
                <Add className="add-button" />
              </label>

              {imageUrl && (
                <div className="workshop-image-preview">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                </div>
              )}

              <div>{selectedFileName}</div>
            </div>
            <div className="error-message">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          </div>
          <button type="submit" className="add-review-submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshopForm;
