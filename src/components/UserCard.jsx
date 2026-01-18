import React from "react";
import { calculateAge } from "../utils/helper";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoURL, gender, about, skills, dob } =
    user;
  // console.log(firstName);

  const age = calculateAge(dob);
  const skillsString =
    skills.length > 0 ? skills.join(", ") : "No skills listed";
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("ERROR: " + err.message);
    }
  };

  return (
    <div className="flex justify-center py-8">
      <div className="card bg-base-300 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-4xl shadow-xl transform transition hover:scale-105">
        <figure className="px-8 pt-8">
          <img
            className="rounded-3xl w-full h-64 sm:h-72 md:h-80 object-contain"
            src={photoURL}
            alt="Profile"
          />
        </figure>
        <div className="card-body p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-2xl sm:text-3xl md:text-4xl mb-2">
              {firstName + " " + lastName}
            </h2>
            <div className="badge badge-lg badge-primary text-sm sm:text-base md:text-lg w-32">
              {age || gender
                ? `${age}${age && gender ? ", " : ""}${gender}`
                : "New"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">About</h3>
              <p className="text-base sm:text-lg">
                {about || "No about information"}
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Skills</h3>
              <p className="text-base sm:text-lg">{skillsString}</p>
            </div>
          </div>

          <div className="card-actions justify-center mt-6 gap-4">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="btn btn-lg btn-error px-4 sm:px-6 md:px-8 text-base sm:text-lg"
            >
              Ignore
            </button>
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="btn btn-lg btn-success px-4 sm:px-6 md:px-8 text-base sm:text-lg"
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const recommendedUserCard = (UserCard) => {
  return ({ user }) => {
    return (
      <div className="flex flex-col gap-0">
        <label className="font-bold font-mono text-2xl mb-[-10px]">
          Recommended for you
        </label>
        <UserCard user={user} />
      </div>
    );
  };
};
export default UserCard;
