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
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      // eslint-disable-next-line no-unused-vars
      const listings = collection(db, "listings");

      // Load 10 listings
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

        // Control on listings array length to retrieve
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Get last doc
        setLastFetchedListing(lastVisible); // Set last doc

        // Loop through the querySnap
        // eslint-disable-next-line no-unused-vars
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

  // Pagination / Load more listings
  const onFetchMoreListings = async () => {
    // eslint-disable-next-line no-unused-vars
    const listings = collection(db, "listings");

    try {
      const listingsRef = collection(db, "listings");

      // this time use startAfter to get the next 10 listings
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute the query
      const querySnap = await getDocs(q);

      // Control on listings array length to retrieve
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // Get last doc
      setLastFetchedListing(lastVisible); // Set last doc

      // Assign empty array to listings to push to
      let listings = [];

      // Loop through the querySnap
      // eslint-disable-next-line no-unused-vars
      const result = querySnap.forEach((doc) => {
        // console.log(doc.data());
        // Add to listings array
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // First 10 listings are already in the state, so we just append the next 10
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch listings");
    }
  };

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
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
