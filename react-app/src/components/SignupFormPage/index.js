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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const validateField = (fieldName, value, text) => {
    let error = "";

    if (value.trim() === "") {
      error = `${text} is required`;
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email address";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    const isEmailValid = validateField("email", email, "Email");
    const isFirstNameValid = validateField(
      "first_name",
      first_name,
      "First name"
    );
    const isLastNameValid = validateField("last_name", last_name, "Last name");
    const isPasswordValid = validateField("password", password, "Password");

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
          {isSubmitted && errors.first_name && (
            <div className="error-message">{errors.first_name}</div>
          )}

          <input
            type="text"
            value={last_name}
            placeholder="last name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {isSubmitted && errors.last_name && (
            <div className="error-message">{errors.last_name}</div>
          )}

          <input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isSubmitted && errors.email && (
            <div className="error-message">{errors.email}</div>
          )}

          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSubmitted && errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
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
