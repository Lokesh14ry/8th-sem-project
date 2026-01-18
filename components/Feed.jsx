import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addFeed } from "../utils/feedSlice";
import UserCard, { recommendedUserCard } from "./UserCard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const loggedInUser = useSelector((state) => state.user);

  const RecommendedUserCard = recommendedUserCard(UserCard);
  // console.log(loggedInUser?.user?.skills);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/feed/`, {
        params: { page, limit: 10 },
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
      // console.log(res?.data);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFeed(); // Fetch feed whenever page or user changes
  }, [page, loggedInUser?.user?.skills]);

  const handleNextPage = () => {
    setPage((prev) => prev + 1); // Fetch next set of users
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1)); // Fetch previous set, min page 1
  };

  if (!feed) return null; // Wait for initial fetch

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : feed.length === 0 ? (
        <h1 className="text-center">No More Users in DevTinder Application</h1>
      ) : (
        <>
          {loggedInUser?.user?.skills.length <= 0 && (
            <div role="alert" className="alert mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info h-6 w-6 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                For improved matchmaking and networking, add skills in your
                profile
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((user) => {
              console.log(user);

              return user?.recommendationScore > 0 ? (
                <RecommendedUserCard key={user._id} user={user} />
              ) : (
                <UserCard key={user._id} user={user} />
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="btn btn-primary"
            >
              Previous
            </button>
            <button onClick={handleNextPage} className="btn btn-primary">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;
