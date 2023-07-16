import React from "react";

const ImageModal = ({ imageUrl }) => {
  return (
    <div className="image-modal">
      <img
        src={imageUrl}
        alt="Review"
        className="modal-image"
        style={{
          width: "400px",
          height: "400px",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
};

export default ImageModal;
