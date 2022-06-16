import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

import React from "react";

function Offers() {
  // Set component level state
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchListings = async () => {
      // eslint-disable-next-line no-unused-vars
      const listings = collection(db, "listings");

      try {
        // Get reference
        // eslint-disable-next-line no-unused-vars
        const listingsRef = collection(db, "listings");

        // Query -> look in the url
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute the query
        const querySnap = await getDocs(q);

        // Assign empty array to listings to push to
        let listings = [];

        // Loop through the querySnap
        const result = querySnap.forEach((doc) => {
          // console.log(doc.data());
          // Add to listings array
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // console.log(result);
        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
