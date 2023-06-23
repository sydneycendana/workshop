import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  fetchAutocompleteSuggestions,
  fetchPlaceDetails,
} from "../../store/google";

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
    if (inputText.length > 3) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(fetchAutocompleteSuggestions(inputText));
      }, 300);
    }
  }, [inputText, dispatch]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSuggestionClick = async (placeId) => {
    setInputText("");
    await dispatch(fetchPlaceDetails(placeId));
    history.push("/workshop");
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
