import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
  const auth = getAuth(); // Get the auth object
  const [changeDetails, setChangeDetails] = useState(false); // Change Details; enable form; submit change; update user
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
  // Update
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //  update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update display name in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name,
        });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Could not update profile details");
    }
  };

  // Update the formData state
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
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
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>
          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                className="profileEmail"
                disabled="true"
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;
