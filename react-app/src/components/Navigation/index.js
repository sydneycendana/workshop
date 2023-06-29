import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormPage from "../SignupFormPage";
import LoginFormModal from "../LoginFormPage";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import "./Navigation.css";
// import { useEffect, useRef, useState } from "react";

function Navigation({ isLoaded }) {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const sessionUser = useSelector((state) => state.session.user);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

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
            onItemClick={closeMenu}
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
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
