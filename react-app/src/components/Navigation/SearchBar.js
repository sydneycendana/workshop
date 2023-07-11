import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  fetchAutocompleteSuggestions,
  fetchPlaceDetails,
} from "../../store/google";

import { fetchPlaceExistence } from "../../store/workshops";

import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";

function SearchBar() {
  const dispatch = useDispatch();
  const history = useHistory();

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
        dispatch(fetchAutocompleteSuggestions(inputText));
      }, 300);
    } else {
      dispatch(fetchAutocompleteSuggestions(""));
    }
  }, [inputText, dispatch]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSuggestionClick = async (placeId) => {
    setInputText("");
    const details = await dispatch(fetchPlaceDetails(placeId));
    const existingId = await dispatch(
      fetchPlaceExistence(details.latitude, details.longitude)
    );
    if (existingId) {
      history.push(`/workshops/${existingId}`);
    } else {
      history.push("/workshop");
    }
  };

  return (
    <>
      <div className="autocomplete-input">
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="add a new workshop"
        />
        <Arrow />
      </div>
      {inputText && (
        <ul ref={ulRef} className="autocomplete-results">
          {autocompleteSuggestions.length > 0 &&
            autocompleteSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="autocomplete-result"
                onClick={() => handleSuggestionClick(suggestion.place_id)}
              >
                <div>{suggestion.name}</div>
                <div className="autocomplete-suggestion-address">
                  {suggestion.address}
                </div>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}

export default SearchBar;
