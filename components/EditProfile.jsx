import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  // Individual state variables for each field
  const [firstName, setFirstName] = useState(user.user.firstName);
  const [lastName, setLastName] = useState(user.user.lastName);
  const [about, setAbout] = useState(user.user.about);
  const [gender, setGender] = useState(user.user.gender);
  const [photoURL, setPhotoURL] = useState(user.user.photoURL);
  const [skills, setSkills] = useState(user.user.skills);
  const [dob, setDob] = useState(
    user?.user?.dob
      ? new Date(user.user.dob).toISOString().split("T")[0] // Extract yyyy-MM-dd
      : user?.dob
      ? new Date(user.dob).toISOString().split("T")[0] // Extract yyyy-MM-dd
      : ""
  );
  const [showTost, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  // Handle individual input changes
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleAboutChange = (e) => setAbout(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handlePhotoURLChange = (e) => setPhotoURL(e.target.value);
  const handleDateOfBirthChange = (e) => {
    const value = e.target.value;
    setDob(value || "");
  };

  // Handle skills and interests as comma-separated strings, converting to arrays
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setSkills(skillsArray);
  };

  const saveProfile = async (e) => {
    setError("");
    e.preventDefault();
    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.match(/token=([^;]+)/)?.[1]; // Example token retrieval
      if (!token) {
        setError("User not authenticated. Please log in.");
        return;
      }
      if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        setError("Date of birth is required and must be in YYYY-MM-DD format");
        return;
      }

      const profileData = {
        firstName,
        lastName,
        skills,
        photoURL,
        about,
        gender,
        dob,
      };

      const res = await axios.patch(`${BASE_URL}/profile/edit`, profileData, {
        withCredentials: true,
      });

      dispatch(addUser(res?.data || res?.data?.data));

      setError(null);
      setShowToast(true);
      const i = setInterval(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data || "Failed to update profile.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen gap-40 ">
        <div className="flex items-center justify-center min-h-screen bg-base-100">
          <div className="w-full max-w-md bg-base-300 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-4">
              Edit Profile
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={handlePhotoURLChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter photoURL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills.join(", ")}
                  onChange={handleSkillsChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter skills (e.g., Java, Python)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={handleGenderChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                >
                  <option value="male" className="bg-base-100 text-white">
                    Male
                  </option>
                  <option value="female" className="bg-base-100 text-white">
                    Female
                  </option>
                  <option value="others" className="bg-base-100 text-white">
                    Others
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  About
                </label>
                <input
                  type="textarea"
                  value={about}
                  onChange={handleAboutChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="About"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDateOfBirthChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={saveProfile}
              >
                Update Profile
              </button>
            </form>
            <p className="text-sm text-center text-gray-600 mt-4">
              Back to{" "}
              <a href="#" className="text-blue-500">
                Profile
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="justify-center text-3xl font-bold">User's View</h1>
          <UserCard
            user={{ firstName, lastName, skills, about, photoURL, gender, dob }}
          />
        </div>
      </div>
      {showTost && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
