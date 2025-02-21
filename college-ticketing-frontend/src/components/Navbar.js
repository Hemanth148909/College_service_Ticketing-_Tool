import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
      setUser(null); // Clear user state
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark p-3">
      <Link className="navbar-brand" to="/">Ticketing Tool</Link>
      <div>
        {user ? (
          <>
            <span className="text-white mx-2">Hello, {user.username} ({user.role})</span>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-primary mx-2" to="/register">Register</Link>
            <Link className="btn btn-success mx-2" to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
