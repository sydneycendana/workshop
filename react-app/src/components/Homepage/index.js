import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import WorkshopsList from "../Workshops/WorkshopsList/WorkshopsList";
import NearbySearch from "./NearbySearch";
import { fetchNearbySuggestions } from "../../store/google";

function Homepage() {
  const dispatch = useDispatch();
  const [placeDetails, setPlaceDetails] = useState(null);

  const handleSuggestionClick = (nearbyPlaceDetails) => {
    setPlaceDetails(nearbyPlaceDetails);
    // fetchNearbySuggestions(placeDetails.lat, placeDetails.lng);
  };

  return (
    <>
      <NearbySearch onSuggestionClick={handleSuggestionClick} />
      <WorkshopsList />
    </>
  );
}

export default Homepage;
