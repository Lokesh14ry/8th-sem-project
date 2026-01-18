import axios from "axios";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "male",
    dob: "",
  });
  const [error, setError] = useState("");
  const [signup, setSignup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          `${BASE_URL}/login`,
          { emailId: formData.emailId, password: formData.password },
          { withCredentials: true }
        );

        dispatch(addUser(res.data));
        navigate("/");
      } catch (err) {
        console.error(err?.response?.data || "Login failed");
        setError(err?.response?.data || "Invalid login credentials");
      }
    },
    [formData, dispatch, navigate]
  );

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${BASE_URL}/signup`, formData, {
          withCredentials: true,
        });
        setSignup(false); // Switch to login after successful signup
        navigate("/profile");
      } catch (err) {
        console.error(err?.response?.data || "Signup failed");
        setError(err?.response?.data || "Signup failed");
      }
    },
    [formData]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="w-full max-w-md bg-base-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-4">
          {signup ? "Sign Up" : "Log In"}
        </h2>

        <form onSubmit={signup ? handleSignup : handleLogin}>
          {signup && (
            <>
              <InputField
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <div className="mb-4">
                <label className="block  text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option className="bg-base-100" value="male">
                    male
                  </option>
                  <option className="bg-base-100" value="female">
                    female
                  </option>
                  <option className="bg-base-100" value="others">
                    others
                  </option>
                </select>
              </div>
              <InputField
                label="Date of Birth"
                name="dob"
                type="date"
                placeholder="YYYY-MM-DD"
                value={formData.dob}
                onChange={handleChange}
              />
            </>
          )}

          <InputField
            label="Email"
            name="emailId"
            type="email"
            placeholder="Enter your email"
            value={formData.emailId}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <span className="text-red-500 font-light ml-4">{error}</span>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {signup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          {signup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setSignup(!signup)}
            className="text-blue-500 hover:underline"
          >
            {signup ? "Log in" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-white text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default Login;
