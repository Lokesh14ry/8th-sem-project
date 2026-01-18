import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addRequest, filterRequest } from "../utils/requestSlice";
import { calculateAge } from "../utils/helper";

const Requests = () => {
  const requests = useSelector((state) => state.request);
  const dispatch = useDispatch();

  const handleRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(filterRequest(_id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/request/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error("ERROR: " + err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (requests.length === 0)
    return (
      <h1 className="text-center my-10 font-extrabold text-4xl">no requests</h1>
    );

  return (
    <div>
      {requests.map((request) => {
        const {
          _id,
          firstName,
          lastName,
          photoURL,
          dob,
          gender,
          about,
          skills,
        } = request.fromUserId;
        const age = calculateAge(dob);
        const skillsString =
          skills.length > 0 ? skills.join(",  ") : "No skills listed";

        return (
          <div className="bg-base-300 w-1/2 mx-auto m-5 p-4" key={_id}>
            <div className="">
              <img className="rounded-full w-30 h-30" src={photoURL} />
            </div>
            <h1 className="font-extrabold text-2xl">
              {firstName + " " + lastName}
            </h1>
            <span>{age ? age + ", " + gender : gender}</span>
            <p>{skillsString}</p>
            <p>{about}</p>
            <div className="flex justify-center gap-5">
              <button
                onClick={() => handleRequest("accepted", request._id)}
                className="btn btn-secondary cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => handleRequest("rejected", request._id)}
                className="btn btn-primary cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
