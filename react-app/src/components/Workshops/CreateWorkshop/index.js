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

    const formData = new FormData();
    formData.append("preview_image", previewImage);
    formData.append("placeDetails", JSON.stringify(placeDetails));

    dispatch(createWorkshop(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={placeDetails.name} readOnly />
      <input
        type="text"
        name="formatted_address"
        value={placeDetails.formatted_address}
        readOnly
      />
      <input
        type="text"
        name="phone_number"
        value={placeDetails.phone_number}
        readOnly
      />
      <input type="file" onChange={handlePreviewImageChange} />
      <button type="submit">Create Workshop</button>
    </form>
  );
};

export default CreateWorkshopForm;
