import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import WorkshopsList from "./WorkshopsList/WorkshopsList";
import NearbySearch from "./NearbySearch";
import { fetchNearbyWorkshops } from "../../store/google";

function Homepage() {
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [workshopsListKey, setWorkshopsListKey] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location) {
          await dispatch(
            fetchNearbyWorkshops(location.latitude, location.longitude)
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [location]);

  const handleSuggestionClick = (locationDetails) => {
    setLocation(locationDetails);
    setIsLocationSet(true);
    setWorkshopsListKey(Date.now());
  };

  return (
    <>
      <NearbySearch onSuggestionClick={handleSuggestionClick} />
      <WorkshopsList key={workshopsListKey} isLocationSet={isLocationSet} />
    </>
  );
}

export default Homepage;
