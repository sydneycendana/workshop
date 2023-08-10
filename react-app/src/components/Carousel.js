import React from "react";
import AliceCarousel from "react-alice-carousel";
import { ReactComponent as Left } from "../assets/icons/left.svg";
import "react-alice-carousel/lib/alice-carousel.css";
import "../index.css";

const MyCarousel = ({ workshop }) => {
  const renderPrevButton = ({ isDisabled }) => (
    <button
      style={{
        position: "absolute",
        top: "50%",
        left: "-30px",
        transform: "translateY(-50%) rotate(180deg)",
        zIndex: 1,
      }}
      className="arrow-button"
      disabled={isDisabled}
    >
      <Left />
    </button>
  );

  const renderNextButton = ({ isDisabled }) => (
    <button
      style={{
        position: "absolute",
        top: "50%",
        right: "-30px",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
      className="arrow-button"
      disabled={isDisabled}
    >
      <Left />
    </button>
  );

  const renderReviewImages = () => {
    if (workshop.reviews && workshop.reviews.length > 0) {
      return workshop.reviews.flatMap((review) =>
        review.images
          ? review.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={review.description}
                className="workshop-details-image"
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
              />
            ))
          : []
      );
    } else {
      return null;
    }
  };

  const carouselItems = [
    <img
      src={workshop.preview_image_url}
      alt={workshop.name}
      className="workshop-details-image"
      style={{ width: "400px", height: "400px", objectFit: "cover" }}
    />,
    ...(renderReviewImages() || []),
  ];

  return (
    <AliceCarousel
      items={carouselItems}
      autoPlay={false}
      //   autoPlayInterval={3000}
      infinite={true}
      // stagePadding={{
      //   paddingLeft: 20,
      //   paddingRight: 20,
      // }}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
      dotsDisabled={true}
    />
  );
};

export default MyCarousel;
