import WorkshopsList from "../Workshops/WorkshopsList/WorkshopsList";
import NearbySearch from "./NearbySearch";
import { useState } from "react";

function Homepage() {
  const [placeDetails, setPlaceDetails] = useState(null);

  const handleSuggestionClick = (details) => {
    setPlaceDetails(details);
  };
  return (
    <>
      <NearbySearch onSuggestionClick={handleSuggestionClick} />
      <WorkshopsList />
    </>
  );
}

export default Homepage;
