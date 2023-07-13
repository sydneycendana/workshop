import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchWorkshopById } from "../../../store/workshops";
import {
  editVoteThunk,
  createVoteThunk,
  deleteVoteThunk,
} from "../../../store/votes";
import OpenModalButton from "../../OpenModalButton";
import EditWorkshop from "../EditWorkshop";
import DeleteWorkshop from "../DeleteWorkshop";
import EditReview from "../../Reviews/EditReview";
import AddReview from "../../Reviews/AddReview";
import DeleteReview from "../../Reviews/DeleteReview";
import MyCarousel from "../../Carousel";
import ImageModal from "../../ImageModal";
import { ReactComponent as Wifi } from "../../../assets/icons/wifi.svg";
import { ReactComponent as Noise } from "../../../assets/icons/noise.svg";
import { ReactComponent as Pet } from "../../../assets/icons/pet.svg";
import { ReactComponent as More } from "../../../assets/icons/more.svg";
import { ReactComponent as Upvote } from "../../../assets/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../assets/icons/downvote.svg";
import "./WorkshopDetails.css";

const WorkshopDetails = () => {
  const { workshopId } = useParams();
  const dispatch = useDispatch();

  const workshop = useSelector((state) => state.workshops.workshopDetails);
  const user = useSelector((state) => state.session.user);

  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAdminDropdownVisible, setIsAdminDropdownVisible] = useState(false);
  // const [isWorkshopInfoHovered, setIsWorkshopInfoHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
  const userReview =
    user &&
    user.id &&
    workshop.reviews.find((review) => review.user_id === user.id);

  const isAdmin = user?.email === "admin@example.com";

  const handleImageClick = (imageURL) => {
    setSelectedImage(imageURL);
  };

  return (
    <div className="page-container">
      <div className="workshop-details-container">
        <div className="workshop-details-image-container">
          <MyCarousel workshop={workshop} />
        </div>
        <div
          className="workshop-info-container"
          // onMouseEnter={() => setIsWorkshopInfoHovered(true)}
          onMouseLeave={() => {
            // setIsWorkshopInfoHovered(false);
            setIsAdminDropdownVisible(false);
          }}
        >
          {isAdmin && (
            <div className="review-actions-container">
              <button
                className="dropdown-button"
                onClick={() =>
                  setIsAdminDropdownVisible(!isAdminDropdownVisible)
                }
              >
                <More />
              </button>

              {isAdminDropdownVisible && (
                <div className="dropdown-menu">
                  <OpenModalButton
                    buttonText="Edit"
                    modalComponent={<EditWorkshop workshopId={workshopId} />}
                    buttonClassName="edit-workshop-button"
                  />
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteWorkshop workshopId={workshopId} />}
                    buttonClassName="edit-workshop-button"
                  />
                </div>
              )}
            </div>
          )}
          {workshop.average_noise_level !== null &&
            workshop.average_pet_friendliness !== null &&
            workshop.average_wifi !== null && (
              <div className="review-average-ratings-container">
                <div className="rating-container">
                  <Noise />
                  <p>{workshop.average_noise_level}</p>
                </div>
                <div className="rating-container">
                  <Pet />
                  <p>{workshop.average_pet_friendliness}</p>
                </div>
                <div className="rating-container">
                  <Wifi />
                  <p>{workshop.average_wifi}</p>
                </div>
              </div>
            )}

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
        <div className="add-review-button-container">
          <OpenModalButton
            buttonText="Add review"
            modalComponent={<AddReview workshopId={workshopId} />}
            buttonClassName="add-review-button"
          />
        </div>
      )}
      <div className="line"></div>

      {/* ------------ CURRENT USERS REVIEW ------------ */}

      {userReview ? (
        <div
          key={userReview.id}
          className="user-review-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsDropdownVisible(false);
          }}
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
                          onClick={() => handleImageClick(image.url)}
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
              <div className="review-actions-container">
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
      ) : (
        <div></div>
      )}

      {/* ------------ OTHER REVIEWS ------------ */}
      {workshop.reviews &&
        workshop.reviews
          .filter((review) => !(userReview && review.id === userReview.id)) // Exclude the user's review from the list
          .map((review) => {
            let userVoteType = review.votes.userVoteType;

            const handleUpvote = () => {
              if (userVoteType === 1) {
                dispatch(deleteVoteThunk(review.id, review.votes.voteId));
              }

              if (userVoteType === -1) {
                dispatch(editVoteThunk(review.votes.voteId, 1)); // User had previously downvoted, edit the vote
              } else {
                dispatch(createVoteThunk(review.id, 1)); // User hasn't voted, create a new upvote
              }
            };

            const handleDownvote = () => {
              if (userVoteType === -1) {
                dispatch(deleteVoteThunk(review.id, review.votes.voteId));
              }

              if (userVoteType === 1) {
                dispatch(editVoteThunk(review.votes.voteId, -1)); // User had previously upvoted, edit the vote
              } else {
                dispatch(createVoteThunk(review.id, -1)); // User hasn't voted, create a new downvote
              }
            };

            return (
              <div key={review.id}>
                <div key={review.id} className="review-wrapper">
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
                              modalComponent={
                                <ImageModal imageUrl={image.url} />
                              }
                              buttonClassName="review-image-button"
                              onClick={() => handleImageClick(image.url)}
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
                        userVoteType === -1
                          ? "highlighted-thumbs-down-icon"
                          : ""
                      } downvote-icon`}
                      onClick={handleDownvote}
                    />
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default WorkshopDetails;
