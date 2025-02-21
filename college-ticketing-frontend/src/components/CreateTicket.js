import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTicket = () => {
  const [ticket, setTicket] = useState({ title: "", description: "", department_id: "" });
  const [departments, setDepartments] = useState([]);

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_departments", { withCredentials: true });
        setDepartments(response.data);  // Set the list of departments
      } catch (error) {
        alert("Error fetching departments!");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/create_ticket", ticket, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      setTicket({ title: "", description: "", department_id: "" });
    } catch (error) {
      alert(error.response?.data?.error || "Error creating ticket!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="form-control mb-2"
          onChange={handleChange}
          value={ticket.title}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          onChange={handleChange}
          value={ticket.description}
          required
        />
        
        {/* Department Dropdown */}
        <select
          name="department_id"
          className="form-control mb-2"
          onChange={handleChange}
          value={ticket.department_id}
          required
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary">Submit Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
