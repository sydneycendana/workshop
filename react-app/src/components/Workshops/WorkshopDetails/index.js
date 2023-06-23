import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchWorkshopById } from "../../../store/workshops";
import "./WorkshopDetails.css";

const WorkshopDetails = () => {
  const dispatch = useDispatch();
  const workshop = useSelector((state) => state.workshops.workshopDetails);

  const { workshopId } = useParams();

  useEffect(() => {
    // Fetch workshop data when the component mounts
    dispatch(fetchWorkshopById(workshopId));
  }, [dispatch, workshopId]);

  if (!workshop) {
    return <div>Loading...</div>; // Display a loading state while data is being fetched
  }

  return (
    <div className="page-container">
      <div className="workshop-details-container">
        <img
          src={workshop.preview_image_url}
          alt={workshop.name}
          style={{ width: "400px", height: "400px" }}
        />
        <div>
          <p>{workshop.reviews.length} reviews</p>
          <h2>{workshop.name}</h2>
          <p>{workshop.formatted_address}</p>
          <p>{workshop.phone_number}</p>
        </div>
      </div>

      <h3>Reviews:</h3>
      {workshop.reviews &&
        workshop.reviews.map((review) => (
          <div key={review.id}>
            <p>Review by: {review.user_first_name}</p>
            <p>Description: {review.description}</p>
            <p>Noise Level: {review.noise_level}</p>
            <p>Pet Friendliness: {review.pet_friendliness}</p>
            <p>Wifi: {review.wifi}</p>
            {/* Render images here if available */}
          </div>
        ))}
    </div>
  );
};

export default WorkshopDetails;
