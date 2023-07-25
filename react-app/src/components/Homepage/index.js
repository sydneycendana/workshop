import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import WorkshopsList from "./WorkshopsList/WorkshopsList";
import NearbySearch from "./NearbySearch";
import { fetchNearbyWorkshops } from "../../store/google";
import { WorkshopContext } from "../../context/WorkshopContext";

function Homepage() {
  const dispatch = useDispatch();
  const { location, setIsLocationSet, setLocation } =
    useContext(WorkshopContext);

  const [workshopsListKey, setWorkshopsListKey] = useState(Date.now());
  const [alertShown, setAlertShown] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location) {
          const response = await dispatch(
            fetchNearbyWorkshops(location.latitude, location.longitude)
          );

          if (response.length === 0) {
            setLocation(null);
            setAlertShown(false);
            if (!alertShown) {
              window.alert("No workshops found");
              setAlertShown(true);
              setLocation(null);
            }
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
  };

  return (
    <>
      <NearbySearch onSuggestionClick={handleSuggestionClick} />
      <WorkshopsList key={workshopsListKey} />
    </>
  );
}

export default Homepage;
