import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { useModal } from "../../context/Modal";

import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";

import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const validateEmail = (email) => {
    if (email.trim() === "") {
      setEmailError("Email is required");
      return false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email address");
        return false;
      }
    }
    setEmailError("");
    return true;
  };

  const validateFirstName = (firstName) => {
    if (firstName.trim() === "") {
      setFirstNameError("First name is required");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastName = (lastName) => {
    if (lastName.trim() === "") {
      setLastNameError("Last name is required");
      return false;
    }
    setLastNameError("");
    return true;
  };

  const validatePassword = (password) => {
    if (password.trim() === "") {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    const isEmailValid = validateEmail(email);
    const isFirstNameValid = validateFirstName(first_name);
    const isLastNameValid = validateLastName(last_name);
    const isPasswordValid = validatePassword(password);

    if (
      !isEmailValid ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isPasswordValid
    ) {
      return;
    }

    const data = await dispatch(signUp(first_name, last_name, email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <div className="modal-container">
      <h1 className="modal-title">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-login-input-container">
          <input
            type="text"
            value={first_name}
            placeholder="first name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {isSubmitted && firstNameError && (
            <div className="error-message">{firstNameError}</div>
          )}

          <input
            type="text"
            value={last_name}
            placeholder="last name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {isSubmitted && lastNameError && (
            <div className="error-message">{lastNameError}</div>
          )}

          <input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isSubmitted && emailError && (
            <div className="error-message">{emailError}</div>
          )}

          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSubmitted && passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>
        {errors &&
          Object.values(errors).map((error, idx) => (
            <div key={idx} className="error-message">
              {error}
            </div>
          ))}
        <div className="button-container">
          <button type="submit" className="modal-submit">
            <Arrow />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormPage;
