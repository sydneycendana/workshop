import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";

import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";

import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  const handleDemoUser = async () => {
    const demoEmail = "johndoe@example.com";
    const demoPassword = "password";
    await dispatch(login(demoEmail, demoPassword));
    closeModal();
  };

  return (
    <div className="modal-container">
      <h1 className="modal-title">Welcome back</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="signup-login-input-container">
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
        <div className="center-button">
          <button className="demo-user-button" onClick={handleDemoUser}>
            Demo User
          </button>
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

export default LoginFormPage;
