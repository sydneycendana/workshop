import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchWorkshopById } from "../../../store/workshops";
import OpenModalButton from "../../OpenModalButton";
import "./WorkshopDetails.css";

const WorkshopDetails = () => {
  const dispatch = useDispatch();
  const workshop = useSelector((state) => state.workshops.workshopDetails);
  const user = useSelector((state) => state.session.user);

  const [loading, setLoading] = useState(true);

  const { workshopId } = useParams();

  useEffect(() => {
    dispatch(fetchWorkshopById(workshopId))
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching workshop details:", error);
        setLoading(false);
      });
  }, [dispatch, workshopId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hasReviews = workshop.reviews && workshop.reviews.length > 0;
  const userHasReviewed = workshop.reviews.some(
    (review) => review.user_id === user.id
  );

  console.log(userHasReviewed);

  return (
    <div className="page-container">
      <div className="workshop-details-container">
        <img
          src={workshop.preview_image_url}
          alt={workshop.name}
          style={{ width: "400px", height: "400px" }}
        />
        <div>
          {hasReviews && (
            <p>
              {workshop.reviews.length}{" "}
              {workshop.reviews.length === 1 ? "review" : "reviews"}
            </p>
          )}

          <h2>{workshop.name}</h2>
          <p>{workshop.formatted_address}</p>
          {workshop.phone_number && <p>{workshop.phone_number}</p>}
        </div>
      </div>
      {workshop.reviews && <h3 className="reviews-section-title">Reviews</h3>}
      <div className="line"></div>

      {workshop.reviews &&
        workshop.reviews.map((review) => (
          <div key={review.id}>
            <div className="review-container">
              <p>
                By {review.user_first_name} on{" "}
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p>Description: {review.description}</p>
              <p>Noise Level: {review.noise_level}</p>
              <p>Pet Friendliness: {review.pet_friendliness}</p>
              <p>Wifi: {review.wifi}</p>
              {/* Render images here if available */}
            </div>
            <div className="line"></div>
          </div>
        ))}
    </div>
  );
};

export default WorkshopDetails;
