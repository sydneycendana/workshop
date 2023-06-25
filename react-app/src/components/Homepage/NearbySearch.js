import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchNearbySuggestions, fetchPlaceDetails } from "../../store/google";

function NearbySearch({ onSuggestionClick }) {
  const dispatch = useDispatch();

  const ulRef = useRef();
  const debounceTimeoutRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const autocompleteSuggestions = useSelector(
    (state) => state.google.autocompleteSuggestions
  );

  useEffect(() => {
    if (inputText.length > 3) {
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
    <>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="search"
        className="autocomplete-input"
      />
      {inputText && (
        <ul ref={ulRef} className="autocomplete-results">
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
    </>
  );
}

export default NearbySearch;
