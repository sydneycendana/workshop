import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWorkshopThunk } from "../../../store/workshops";

const CreateWorkshopForm = () => {
  const dispatch = useDispatch();
  const placeDetails = useSelector((state) => state.google.placeDetails);

  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  console.log(placeDetails);

  const handleSubmit = (e) => {
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

    // Dispatch action with form data
    dispatch(createWorkshopThunk(formData));
  };

  return (
    <div className="page-container">
      <div>Address: {placeDetails.formatted_address}</div>
      <div>Latitude: {placeDetails.latitude}</div>
      <div>Longitude: {placeDetails.longitude}</div>
      <div>Name: {placeDetails.name}</div>
      <div>Phone Number: {placeDetails.phone_number}</div>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageUpload} />
        <button type="submit">Create Workshop</button>
      </form>
    </div>
  );
};

export default CreateWorkshopForm;
