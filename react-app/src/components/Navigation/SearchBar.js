import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAutocompleteSuggestions } from "../../store/google";

function SearchBar() {
  const dispatch = useDispatch();
  const ulRef = useRef();
  const debounceTimeoutRef = useRef(null);

  const [inputText, setInputText] = useState(""); // State to hold the user input
  const autocompleteSuggestions = useSelector(
    (state) => state.google.autocompleteSuggestions
  );

  useEffect(() => {
    if (inputText.length > 3) {
      // Debounce the API call
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(fetchAutocompleteSuggestions(inputText));
      }, 300); // Adjust the debounce delay as needed (e.g., 300ms)
    }
  }, [inputText, dispatch]);

  const handleChange = (event) => {
    setInputText(event.target.value);
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
          {autocompleteSuggestions && // Check if autocompleteSuggestions exists
            autocompleteSuggestions.map((suggestion, index) => (
              <li key={index} className="autocomplete-result">
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
