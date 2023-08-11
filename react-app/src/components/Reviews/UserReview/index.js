import React, { useState } from "react";
import OpenModalButton from "../../OpenModalButton";
import ImageModal from "../../ImageModal";
import { ReactComponent as Noise } from "../../../assets/icons/noise.svg";
import { ReactComponent as Pet } from "../../../assets/icons/pet.svg";
import { ReactComponent as Wifi } from "../../../assets/icons/wifi.svg";
import { ReactComponent as More } from "../../../assets/icons/more.svg";
import { ReactComponent as Upvote } from "../../../assets/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../assets/icons/downvote.svg";
import EditReview from "../EditReview";
import DeleteReview from "../DeleteReview";

const UserReview = ({ userReview }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  return (
    <div
      key={userReview.id}
      className="user-review-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      <div className="review">
        <div className="review-wrapper">
          <div className="review-container">
            <p>
              By {userReview.user_first_name} on{" "}
              {new Date(userReview.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="review-ratings-container">
              <div className="rating-container">
                <Noise />
                <p>{userReview.noise_level}</p>
              </div>
              <div className="rating-container">
                <Pet />
                <p>{userReview.pet_friendliness}</p>
              </div>
              <div className="rating-container">
                <Wifi />
                <p>{userReview.wifi}</p>
              </div>
            </div>
            <p>{userReview.description}</p>
            <div className="review-images-container">
              {userReview.images &&
                userReview.images.map((image) => (
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
            <Upvote />
            {userReview.total_votes}
            <Downvote className="thumbs-down-icon" />
          </div>
        </div>
        <div>
          <div className="actions-container">
            {isHovered && (
              <button
                className="dropdown-button"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                <More />
              </button>
            )}
            {isDropdownVisible && (
              <div className="dropdown-menu">
                <OpenModalButton
                  buttonText="Edit"
                  modalComponent={<EditReview userReview={userReview} />}
                  buttonClassName="edit-workshop-button"
                />
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReview userReview={userReview} />}
                  buttonClassName="edit-workshop-button"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
