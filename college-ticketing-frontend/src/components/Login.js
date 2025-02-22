import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Custom styles

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
    setError("");  
    setSuccess(""); 

    try {
      const res = await axios.post("http://localhost:5000/login", user, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setUser(res.data);
      setSuccess("✅ Login Successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      setError("❌ Invalid Credentials! Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔑 Login</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">🚀 Login</button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
