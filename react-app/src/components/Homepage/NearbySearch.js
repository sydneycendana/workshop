import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WorkshopContext } from "../../context/WorkshopContext";
import { fetchNearbySuggestions, fetchPlaceDetails } from "../../store/google";
import "./Homepage.css";

function NearbySearch({ onSuggestionClick }) {
  const dispatch = useDispatch();
  const ulRef = useRef();
  const debounceTimeoutRef = useRef(null);
  const { isLocationSet } = useContext(WorkshopContext);

  const [inputText, setInputText] = useState("");
  const [radius, setRadius] = useState(10);
  const [suggestionClicked, setSuggestionClicked] = useState(false);
  const [placeDetails, setPlaceDetails] = useState({});

  const user = useSelector((state) => state.session.user);
  const autocompleteSuggestions = useSelector(
    (state) => state.google.autocompleteSuggestions
  );

  useEffect(() => {
    if (!user || !isLocationSet) {
      setInputText("");
    }
  }, [user, isLocationSet]);

  useEffect(() => {
    if (inputText.length > 2) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(fetchNearbySuggestions(inputText));
      }, 300);
    }
  }, [inputText, dispatch]);

  const handleTextChange = (event) => {
    setInputText(event.target.value);
    setSuggestionClicked(false);
  };

  const handleRadiusChange = async (event) => {
    const newRadius = parseInt(event.target.value);
    setRadius(newRadius);
    await onSuggestionClick(placeDetails, newRadius);
  };

  const handleSuggestionClick = async (placeId) => {
    const newPlaceDetails = await dispatch(fetchPlaceDetails(placeId));
    setPlaceDetails(newPlaceDetails);
    setInputText(newPlaceDetails.name);
    setRadius(radius);
    onSuggestionClick(newPlaceDetails, radius);
    setSuggestionClicked(true);
  };

  return (
    <div className="nearby-search-container">
      <div className="search-heading-container">
        <h4>Let's get out of the house</h4>
        <p>find a place to work near you</p>
      </div>
      <div className="nearby-workshop-input-container">
        <div className="autocomplete-input-wrapper">
          <div className="autocomplete-input">
            <input
              type="text"
              value={inputText}
              onChange={handleTextChange}
              placeholder="city, town or postcode"
            />
          </div>
          {inputText && !suggestionClicked && (
            <div className="results-container">
              <ul
                ref={ulRef}
                className="autocomplete-results nearby-search-results"
              >
                {autocompleteSuggestions &&
                  autocompleteSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="autocomplete-result"
                      onClick={() => handleSuggestionClick(suggestion.place_id)}
                    >
                      <div>
                        {suggestion.name}, {suggestion.address}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div className="radius-input-wrapper">
          <select
            id="number-dropdown"
            value={radius}
            onChange={handleRadiusChange}
          >
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={15}>15 miles</option>
            <option value={20}>20 miles</option>
            <option value={25}>25 miles</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default NearbySearch;
