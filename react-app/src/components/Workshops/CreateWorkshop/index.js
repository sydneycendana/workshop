import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWorkshop } from "path/to/workshopActions";

const CreateWorkshopForm = () => {
  const dispatch = useDispatch();
  const placeDetails = useSelector((state) => state.placeDetails); // Assuming placeDetails is stored in the Redux store

  const [previewImage, setPreviewImage] = useState(null);

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createWorkshop(placeDetails, previewImage));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handlePreviewImageChange} />
      <button type="submit">Create Workshop</button>
    </form>
  );
};

export default CreateWorkshopForm;
