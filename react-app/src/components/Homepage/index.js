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
  const [noWorkshopsFound, setNoWorkshopsFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location) {
          const response = await dispatch(
            fetchNearbyWorkshops(location.latitude, location.longitude)
          );

          if (response.length === 0) {
            setNoWorkshopsFound(true);
          } else {
            setNoWorkshopsFound(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, location]);

  const handleSuggestionClick = (locationDetails) => {
    setLocation(locationDetails);
    setIsLocationSet(true);
    setWorkshopsListKey(Date.now());
    setNoWorkshopsFound(false); // Reset noWorkshopsFound when a new suggestion is clicked
  };

  useEffect(() => {
    if (noWorkshopsFound) {
      window.alert("No workshops found");
    }
  }, [noWorkshopsFound]);

  return (
    <>
      <NearbySearch onSuggestionClick={handleSuggestionClick} />
      <WorkshopsList
        key={workshopsListKey}
        isLocationSet={isLocationSet}
        location={location}
      />
    </>
  );
}

export default Homepage;
