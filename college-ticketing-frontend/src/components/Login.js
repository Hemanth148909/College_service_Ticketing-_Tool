import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [user, setLocalUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLocalUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Clear previous errors
    setSuccess(""); // Clear success message

    try {
      const res = await axios.post("http://localhost:5000/login", user, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setUser(res.data); // Update the user state in App.js
      setSuccess("Login Successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000); // Redirect after 1 sec
    } catch (error) {
      setError("Invalid Credentials! Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" className="form-control mb-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="form-control mb-2" onChange={handleChange} required />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
