import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchNearbySuggestions, fetchPlaceDetails } from "../../store/google";
import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";
import "./Homepage.css";

function NearbySearch({ onSuggestionClick }) {
  const dispatch = useDispatch();

  const ulRef = useRef();
  const debounceTimeoutRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const autocompleteSuggestions = useSelector(
    (state) => state.google.autocompleteSuggestions
  );

  useEffect(() => {
    if (inputText.length > 2) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(fetchNearbySuggestions(inputText));
      }, 300);
    }
  }, [inputText, dispatch]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSuggestionClick = async (placeId) => {
    setInputText("");
    const placeDetails = await dispatch(fetchPlaceDetails(placeId));
    onSuggestionClick(placeDetails);
  };

  return (
    <div className="nearby-search-container">
      <div className="search-heading-container">
        <h4>Let's get out of the house</h4>
        <p>find a place to work near you</p>
      </div>
      <div>
        <div
          className="autocomplete-input"
          style={{ width: "400px", marginTop: "50px" }}
        >
          <input
            type="text"
            value={inputText}
            onChange={handleChange}
            placeholder="city, town or postcode"
          />
          <Arrow />
        </div>
        {inputText && (
          <ul
            ref={ulRef}
            className="autocomplete-results"
            style={{ width: "400px" }}
          >
            {autocompleteSuggestions &&
              autocompleteSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="autocomplete-result"
                  onClick={() => handleSuggestionClick(suggestion.place_id)}
                >
                  <div>{suggestion.name}</div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NearbySearch;
