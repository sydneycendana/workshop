import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormPage from "../SignupFormPage";
import LoginFormModal from "../LoginFormPage";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      {sessionUser ? (
        <li className="navbar-search">
          <SearchBar />
        </li>
      ) : (
        <li className="navbar-button">
          <OpenModalButton
            buttonText="Get Started"
            modalComponent={<SignupFormPage />}
          />
        </li>
      )}
      <li>
        <NavLink exact to="/" className="logo-link">
          Workshop
        </NavLink>
      </li>
      {isLoaded && sessionUser ? (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      ) : (
        <li className="navbar-button inverted-button">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
