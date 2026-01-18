import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom"; // Add this

const Connections = () => {
  const connections = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this

  const getConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error("ERROR: " + err.message);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (connections.length === 0) return <h1>No Connections</h1>;

  return (
    <>
      <div className="flex justify-center my-10">
        <h1 className="font-extrabold text-5xl">Connections</h1>
      </div>
      <div className="">
        {connections.map((connection) => {
          const { firstName, lastName, photoURL, about, gender, skills, _id } =
            connection;
          const skillsString =
            skills.length > 0 ? skills.join(",  ") : "No skills listed";
          return (
            <div
              key={_id}
              className="flex p-7 bg-base-300 m-5 rounded-4xl w-1/2 mx-auto"
            >
              <div>
                <img className="rounded-full w-30 h-30" src={photoURL} />
              </div>
              <div className="mx-10">
                <h1 className="font-extrabold">{firstName + " " + lastName}</h1>
                <span>{gender}</span>
                <p>{skillsString}</p>
                <p>{about}</p>
                <button
                  onClick={() => navigate(`/chat/${_id}`)} // Add this button
                  className="btn btn-secondary mt-2"
                >
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Connections;
