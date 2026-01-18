import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { removeRequest } from "../utils/requestSlice";
import { removeFeed } from "../utils/feedSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async () => {
    await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    dispatch(removeUser());
    dispatch(removeConnection());
    dispatch(removeFeed());
    dispatch(removeRequest());
    return navigate("/login");
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          💻 SkillConnect
        </Link>
      </div>

      {/* Desktop Menu (visible on medium screens and up) */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-xl font-mono">
              Welcome {user.user.firstName}
            </span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src={user.user.photoURL} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="btn btn-outline btn-primary"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle (visible on small screens) */}
      <div className="md:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu (visible when toggled on small screens) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-1/4 bg-base-300 p-4 z-10">
          <ul className="menu menu-vertical">
            {user ? (
              <>
                <li>
                  <Link to="/recommendations">Recommended Users</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline btn-primary w-full"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
