import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchWorkshopById } from "../../../store/workshops";
import { editVoteThunk, createVoteThunk } from "../../../store/votes";
import OpenModalButton from "../../OpenModalButton";
import AddReview from "../../Reviews/AddReview";
import { ReactComponent as Upvote } from "../../../assets/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../assets/icons/downvote.svg";

import "./WorkshopDetails.css";

const WorkshopDetails = () => {
  const { workshopId } = useParams();
  const dispatch = useDispatch();

  const workshop = useSelector((state) => state.workshops.workshopDetails);
  const user = useSelector((state) => state.session.user);

  const [loading, setLoading] = useState(true);

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
  const userReview = workshop.reviews.find(
    (review) => user && user.id && review.user_id === user.id
  );

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
      <h3 className="reviews-section-title">Reviews</h3>
      {!userReview && (
        <OpenModalButton
          buttonText="Add review"
          modalComponent={<AddReview workshopId={workshopId} />}
        />
      )}
      <div className="line"></div>

      {userReview && (
        <div key={userReview.id}>
          <div className="review-container">
            <p>
              By {userReview.user_first_name} on{" "}
              {new Date(userReview.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>Description: {userReview.description}</p>
            <p>Noise Level: {userReview.noise_level}</p>
            <p>Pet Friendliness: {userReview.pet_friendliness}</p>
            <p>Wifi: {userReview.wifi}</p>
            {/* Render images here if available */}
          </div>
          <div className="votes-container">
            <Upvote />
            {userReview.total_votes}
            <Downvote className="thumbs-down-icon" />
          </div>
          <div className="line"></div>
        </div>
      )}
      {workshop.reviews &&
        workshop.reviews
          .filter((review) => !(userReview && review.id === userReview.id)) // Exclude the user's review from the list
          .map((review) => {
            let userVoteType = review.votes.userVoteType;

            const handleUpvote = () => {
              if (userVoteType === 1) {
                return; // User has already upvoted, do nothing
              }

              if (userVoteType === -1) {
                dispatch(editVoteThunk(review.votes.voteId, 1)); // User had previously downvoted, edit the vote
              } else {
                dispatch(createVoteThunk(review.id, 1)); // User hasn't voted, create a new upvote
              }
            };

            const handleDownvote = () => {
              if (userVoteType === -1) {
                return; // User has already downvoted, do nothing
              }

              if (userVoteType === 1) {
                dispatch(editVoteThunk(review.votes.voteId, -1)); // User had previously upvoted, edit the vote
              } else {
                dispatch(createVoteThunk(review.id, -1)); // User hasn't voted, create a new downvote
              }
            };

            return (
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
                <div className="votes-container">
                  <Upvote
                    className={
                      userVoteType === 1 ? "highlighted-thumbs-up-icon" : ""
                    }
                    onClick={handleUpvote}
                  />
                  {review.total_votes}
                  <Downvote
                    className={
                      userVoteType === -1 ? "highlighted-thumbs-down-icon" : ""
                    }
                    onClick={handleDownvote}
                  />
                </div>
                <div className="line"></div>
              </div>
            );
          })}
    </div>
  );
};

export default WorkshopDetails;
