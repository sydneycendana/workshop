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
      <li className="navbar-logo">
        <NavLink exact to="/" className="logo-link">
          Workshop
        </NavLink>
      </li>
      {isLoaded && sessionUser ? (
        <li>
          <div className="profile-button-icon">
            <ProfileButton user={sessionUser} />
          </div>
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
