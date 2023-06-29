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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setSelectedFileName(file.name);
  };

  useEffect(() => {
    if (placeDetails.length === 0) {
      history.push("/");
    }
  }, [placeDetails, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("place_id", placeDetails.place_id);
    formData.append("name", placeDetails.name);
    formData.append("lat", placeDetails.latitude);
    formData.append("lng", placeDetails.longitude);
    formData.append("formatted_address", placeDetails.formatted_address);
    formData.append("phone_number", placeDetails.phone_number);
    formData.append("image", image);

    const createdWorkshop = await dispatch(createWorkshopThunk(formData))
      .then((createdWorkshop) => {
        history.push(`/workshops/${createdWorkshop.id}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <div className="page-container">
      <div className="create-workshop-container">
        <h5>Found a new workshop?</h5>
        <form onSubmit={handleSubmit} className="create-workshop-form">
          <div>Name: {placeDetails.name}</div>
          <div>{placeDetails.formatted_address}</div>
          <div>Phone Number: {placeDetails.phone_number}</div>
          <label htmlFor="upload-file" className="custom-file-upload">
            <input
              type="file"
              id="upload-file"
              onChange={handleImageUpload}
              className="hidden-file-input"
            />
            Choose File
          </label>
          <div>{selectedFileName}</div>
          <button type="submit" className="create-workshop-button">
            <Add className="add-button" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshopForm;
