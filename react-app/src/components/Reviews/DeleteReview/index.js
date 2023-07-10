import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";
import "../../Workshops/DeleteWorkshop/DeleteWorkshop.css";

const DeleteReview = ({ userReview }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  console.log(userReview);

  console.log(userReview.id);

  const workshop = useSelector((state) => state.workshops.workshopDetails);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(deleteReviewThunk(userReview.id));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-container">
      <h3 className="review-form-title">
        Are you sure you want to delete this review?
      </h3>
      <div className="delete-modal-buttons">
        <button className="delete-modal-button" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          type="submit"
          className="delete-modal-button"
          style={{ color: "white", backgroundColor: "var(--color-red)" }}
        >
          Yes, delete
        </button>
      </div>
    </form>
  );
};

export default DeleteReview;
