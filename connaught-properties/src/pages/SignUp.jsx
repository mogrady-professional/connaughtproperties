import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

import React from "react";

function SignUp() {
  // Component Level State
  const [showPassword, setShowPassword] = useState(false);
  /*
    Form Data state -> object
    Email password as state
*/
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // Destructure formData
  const { name, email, password } = formData;

  // Initialize the navigate
  const navigate = useNavigate();

  // Initialize the function -> update form data state
  const onChange = (e) => {
    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // console.log(formData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      // Register user; returns promise
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Get user info
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        // update displayName
        displayName: name,
      });
      // redirect user
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              email={name}
              onChange={onChange}
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              email={email}
              name="email"
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                name="password"
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt="Show Password"
                className="showPassword"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon
                  fill="#fffff"
                  width="34px"
                  height="34px"
                ></ArrowRightIcon>
              </button>
            </div>
          </form>
          {/* Google OAuth Component */}
          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
