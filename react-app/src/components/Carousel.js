import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const MyCarousel = ({ workshop }) => {
  const renderPrevButton = ({ isDisabled }) => (
    <button
      style={{
        position: "absolute",
        top: "50%",
        left: "20px",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
      disabled={isDisabled}
    >
      Previous
    </button>
  );

  const renderNextButton = ({ isDisabled }) => (
    <button
      style={{
        position: "absolute",
        top: "50%",
        right: "20px",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
      disabled={isDisabled}
    >
      Next
    </button>
  );

  return (
    <AliceCarousel
      items={[
        <img
          src={workshop.preview_image_url}
          alt={workshop.name}
          style={{ width: "400px", height: "400px" }}
        />,
        ...workshop.reviews.flatMap((review) =>
          review.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={review.description}
              style={{ width: "400px", height: "400px" }}
            />
          ))
        ),
      ]}
      autoPlay={false}
      autoPlayInterval={3000}
      infinite={true}
      stagePadding={{
        paddingLeft: 20,
        paddingRight: 20,
      }}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
    />
  );
};

export default MyCarousel;
