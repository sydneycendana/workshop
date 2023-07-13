import React from "react";

import { useModal } from "../context/Modal";
const ImageModal = ({ imageUrl }) => {
  const { closeModal } = useModal();

  return (
    <div className="image-modal">
      <img
        src={imageUrl}
        alt="Review Image"
        className="modal-image"
        style={{
          width: "400px",
          height: "400px",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <p>{imageUrl}</p>
    </div>
  );
};

export default ImageModal;
