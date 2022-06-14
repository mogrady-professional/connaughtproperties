import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

import React from "react";

function SignIn() {
  // Component Level State
  const [showPassword, setShowPassword] = useState(false);
  /*
    Form Data state -> object
    Email password as state
*/
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Destructure formData
  const { email, password } = formData;

  // Initialize the navigate
  const navigate = useNavigate();

  // Initialize the function -> update form data state
  const onChange = (e) => {
    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    // console.log(formData);
  };

  // Login Functionality
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
        console.log("User logged in successfully");
      }
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
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon
                  fill="#fffff"
                  width="34px"
                  height="34px"
                ></ArrowRightIcon>
              </button>
            </div>
          </form>
          {/* Google OAuth Component */}
          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
