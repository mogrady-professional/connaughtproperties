import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //  Check if user exists in firestore; or add user
      const docRef = doc(db, "users", user.uid); // Get the user doc
      const docSnap = await getDoc(docRef); // Get the user doc snapshot
      if (!docSnap.exists) {
        // If user does not exist, create user
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: Timestamp(),
        });
        navigate("/");
      } else {
        // If user exists, navigate to profile
        toast.success(`Welcome ${user.displayName}`);
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Could not authorize with Google");
      // console.log(error);
    }
  };

  return (
    <div className="socialLogin">
      <p>
        <strong>
          Sign{" "}
          {location.pathname === "/sign-up"
            ? "Up with Google"
            : "In with Google"}
        </strong>
      </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="Google" />
      </button>
    </div>
  );
}

export default OAuth;
