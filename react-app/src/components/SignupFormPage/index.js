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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    if (!validateEmail(email)) {
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
        <ul>
          {isSubmitted && emailError && (
            <li className="error-message">{emailError}</li>
          )}
          {errors &&
            Object.values(errors).map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
        </ul>
        <div className="signup-login-input-container">
          <input
            type="text"
            value={first_name}
            placeholder="first name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            value={last_name}
            placeholder="last name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
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
