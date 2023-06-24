import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { createWorkshop } from "path/to/workshopActions";

const CreateWorkshopForm = () => {
  const dispatch = useDispatch();
  const placeDetails = useSelector((state) => state.google.placeDetails); // Assuming placeDetails is stored in the Redux store

  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("image", image);
    formData.append("address", placeDetails.formatted_address);
    formData.append("latitude", placeDetails.latitude);
    formData.append("longitude", placeDetails.longitude);
    formData.append("name", placeDetails.name);
    formData.append("phone_number", placeDetails.phone_number);
    formData.append("place_id", placeDetails.place_id);

    // Dispatch action with form data
    // dispatch(createWorkshop(formData));
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
