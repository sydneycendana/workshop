import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAutocompleteSuggestions } from "../../store/google";

function SearchBar() {
  const dispatch = useDispatch();
  const ulRef = useRef();

  const [inputText, setInputText] = useState(""); // State to hold the user input
  const autocompleteSuggestions = useSelector(
    (state) => state.google.autocompleteSuggestions
  );

  useEffect(() => {
    if (inputText.length > 3) {
      dispatch(fetchAutocompleteSuggestions(inputText));
    }
  }, [inputText, dispatch]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <>
      <input type="text" value={inputText} onChange={handleChange} />
      <ul ref={ulRef}>
        {autocompleteSuggestions && // Check if autocompleteSuggestions exists
          autocompleteSuggestions.map((suggestion, index) => (
            <li key={index}>
              <div>{suggestion.name}</div>
              <div>{suggestion.address}</div>
            </li>
          ))}
      </ul>
    </>
  );
}

export default SearchBar;
