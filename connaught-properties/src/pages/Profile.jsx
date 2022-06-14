import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const auth = getAuth(); // Get the auth object

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Destructure formData
  const { name, email } = formData;

  // useNavigate is a hook that allows us to navigate to a new page
  const navigate = useNavigate();

  // Log out from Firebase
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type="button" className="logOut" onClick={onLogout}>
            Logout
          </button>
        </header>
      </div>
    </>
  );
}

export default Profile;
