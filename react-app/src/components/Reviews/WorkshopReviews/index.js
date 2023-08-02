import React from "react";
import { useDispatch } from "react-redux";
import OpenModalButton from "../../OpenModalButton";
import {
  editVoteThunk,
  createVoteThunk,
  deleteVoteThunk,
} from "../../../store/votes";
import ImageModal from "../../ImageModal";
import { ReactComponent as Upvote } from "../../../assets/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../assets/icons/downvote.svg";
import { ReactComponent as Wifi } from "../../../assets/icons/wifi.svg";
import { ReactComponent as Noise } from "../../../assets/icons/noise.svg";
import { ReactComponent as Pet } from "../../../assets/icons/pet.svg";

const Review = ({ review, user }) => {
  console.log(review);

  const dispatch = useDispatch();
  let userVoteType = review.votes.userVoteType;

  console.log(review);

  const handleUpvote = () => {
    if (!user) {
      window.alert("You cannot vote if you are not logged in.");
      return;
    }
    if (userVoteType === 1) {
      dispatch(deleteVoteThunk(review.id, review.votes.voteId));
    }

    if (userVoteType === -1) {
      dispatch(editVoteThunk(review.votes.voteId, 1)); // User had previously downvoted, edit the vote
    } else if (userVoteType === null) {
      dispatch(createVoteThunk(review.id, 1)); // User hasn't voted, create a new upvote
    }
  };

  const handleDownvote = () => {
    if (!user) {
      window.alert("You cannot vote if you are not logged in.");
      return;
    }
    if (userVoteType === -1) {
      dispatch(deleteVoteThunk(review.id, review.votes.voteId));
    }

    if (userVoteType === 1) {
      dispatch(editVoteThunk(review.votes.voteId, -1)); // User had previously upvoted, edit the vote
    } else if (userVoteType === null) {
      dispatch(createVoteThunk(review.id, -1)); // User hasn't voted, create a new upvote
    }
  };

  return (
    <div key={review.id}>
      <div className="review-wrapper">
        <div className="review-container">
          <p>
            By {review.user_first_name} on{" "}
            {new Date(review.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="review-ratings-container">
            <div className="rating-container">
              <Noise />
              <p>{review.noise_level}</p>
            </div>
            <div className="rating-container">
              <Pet />
              <p>{review.pet_friendliness}</p>
            </div>
            <div className="rating-container">
              <Wifi />
              <p>{review.wifi}</p>
            </div>
          </div>
          <p>{review.description}</p>
          <div className="review-images-container">
            {review.images &&
              review.images.map((image) => (
                <div className="review-image-container">
                  <OpenModalButton
                    buttonText={
                      <img
                        key={image.id}
                        src={image.url}
                        alt="review"
                        style={{
                          width: "125px",
                          height: "125px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    }
                    modalComponent={<ImageModal imageUrl={image.url} />}
                    buttonClassName="review-image-button"
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="votes-container">
          <Upvote
            className={`${
              userVoteType === 1 ? "highlighted-thumbs-up-icon" : ""
            } upvote-icon`}
            onClick={handleUpvote}
          />
          {review.total_votes}
          <Downvote
            className={`${
              userVoteType === -1 ? "highlighted-thumbs-down-icon" : ""
            } downvote-icon`}
            onClick={handleDownvote}
          />
        </div>
      </div>
    </div>
  );
};

export default Review;
