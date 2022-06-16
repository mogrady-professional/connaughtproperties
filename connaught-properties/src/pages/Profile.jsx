import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  documentId,
} from "firebase/firestore";
import { db } from "../firebase.config";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth(); // Get the auth object
  const [changeDetails, setChangeDetails] = useState(false); // Change Details; enable form; submit change; update user
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  // Destructure formData
  const { name, email } = formData;

  // useNavigate is a hook that allows us to navigate to a new page
  const navigate = useNavigate();

  // Log out from Firebase
  const onLogout = () => {
    auth.signOut();
    toast.success(`Logged out successfully ${auth.currentUser.displayName}`);
    navigate("/");
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
    // console.log("listings", listings);
  }, [auth.currentUser.uid]);

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

  // Delete Listing from firebase and UI
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted");
    }
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
                disabled={true}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="Home" />
            <p>Sell or rent your home</p>
            <img src={arrowRight} alt="Arrow Right" />
          </Link>
          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listings.map((listing) => {
                  return (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                      onDelete={() => onDelete(listing.id)}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;
