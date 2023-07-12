import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/session";
import { resetState } from "../../store/reset";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormPage";
import SignupFormModal from "../SignupFormPage";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("location");
    dispatch(logout());
    dispatch(resetState());
    history.push("/");
  };

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials;
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <div className="dropdown-container">
      <button onClick={openMenu} className="profile-button">
        <p className="user-initials">
          {user ? getInitials(user.first_name + " " + user.last_name) : ""}
        </p>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <p>Hello, {user.first_name}!</p>
            <li>{user.email}</li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
