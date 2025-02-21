import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({ username: "", password: "", role: "student" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", user, { headers: { "Content-Type": "application/json" } });
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" className="form-control mb-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="form-control mb-2" onChange={handleChange} required />
        <select name="role" className="form-control mb-2" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="department">Department</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;