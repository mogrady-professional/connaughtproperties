import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

function Category() {
  // Set component level state
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  //
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();
  //   console.log(params);

  // Initial fetch of listings
  useEffect(() => {
    const fetchListings = async () => {
      const listings = collection(db, "listings");

      try {
        // Get reference
        const listingsRef = collection(db, "listings");

        // Query -> look in the url (initial limit is 10 ads)
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
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
        const result = querySnap.forEach((doc) => {
          // console.log(doc.data());
          // Add to listings array
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  // Pagination / Load more listings
  const onFetchMoreListings = async () => {
    const listings = collection(db, "listings");

    try {
      const listingsRef = collection(db, "listings");

      // this time use startAfter to get the next 10 listings
      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
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
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
