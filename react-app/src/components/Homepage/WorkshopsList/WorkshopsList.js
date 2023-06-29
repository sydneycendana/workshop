import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedWorkshops } from "../../../store/workshops";

import { ReactComponent as Wifi } from "../../../assets/icons/wifi.svg";
import { ReactComponent as Pet } from "../../../assets/icons/pet.svg";
import { ReactComponent as Noise } from "../../../assets/icons/noise.svg";

const WorkshopsList = ({ isLocationSet }) => {
  const dispatch = useDispatch();
  const nearbyWorkshops = useSelector((state) => state.google.nearbyWorkshops);
  const featuredWorkshops = useSelector(
    (state) => state.workshops.featuredWorkshops
  );

  useEffect(() => {
    if (nearbyWorkshops.length === 0 && featuredWorkshops.length === 0) {
      dispatch(fetchFeaturedWorkshops());
    }
  }, [dispatch, nearbyWorkshops, featuredWorkshops]);

  const workshopsData =
    nearbyWorkshops.length > 0 ? nearbyWorkshops : featuredWorkshops;

  const isAllRatingsNull = workshopsData.every(
    (workshop) =>
      workshop.average_wifi === null &&
      workshop.average_pet_friendliness === null &&
      workshop.average_noise_level === null
  );

  return (
    <div className="page-container">
      {nearbyWorkshops.length > 0 && <h3>Near</h3>}
      <div className="workshops-grid">
        {workshopsData.map((workshop) => (
          <Link
            to={`/workshops/${workshop.id}`}
            key={workshop.id}
            className="workshop-link"
          >
            <div className="workshop-card">
              <div className="image-container">
                <img
                  className="workshop-image"
                  src={workshop.preview_image_url}
                  alt={workshop.name}
                />
              </div>
              <h3>{workshop.name}</h3>
              <div className="average-ratings-container">
                {isAllRatingsNull ? (
                  <div className="new-rating-container">
                    <span className="new-rating">NEW</span>
                  </div>
                ) : (
                  <>
                    {workshop.average_wifi === null &&
                    workshop.average_pet_friendliness === null &&
                    workshop.average_noise_level === null ? (
                      <div className="new-rating-container">
                        <span className="new-rating">NEW</span>
                      </div>
                    ) : (
                      <>
                        <div className="average-rating-container">
                          {workshop.average_wifi === null ? (
                            <Wifi />
                          ) : (
                            <>
                              <Wifi />
                              {workshop.average_wifi}
                            </>
                          )}
                        </div>
                        <div className="average-rating-container">
                          {workshop.average_pet_friendliness === null ? (
                            <Pet />
                          ) : (
                            <>
                              <Pet />
                              {workshop.average_pet_friendliness}
                            </>
                          )}
                        </div>
                        <div className="average-rating-container">
                          {workshop.average_noise_level === null ? (
                            <Noise />
                          ) : (
                            <>
                              <Noise />
                              {workshop.average_noise_level}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <p>{workshop.formatted_address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkshopsList;
