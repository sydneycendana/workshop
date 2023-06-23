import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaceDetails } from "../../store/google";

function PlaceDetailsModal({ suggestion, onClose }) {
  const dispatch = useDispatch();

  const placeDetails = useSelector((state) => state.google.placeDetails);

  // Fetch place details using place_id when the component mounts
  useEffect(() => {
    dispatch(fetchPlaceDetails(suggestion.place_id));
  }, [dispatch, suggestion.place_id]);

  // Render place details in the modal
  return (
    <div className="modal">
      {/* Display the fetched place details */}
      {placeDetails && (
        <div>
          <h2>{placeDetails.name}</h2>
          {/* Display other details as needed */}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default PlaceDetailsModal;
