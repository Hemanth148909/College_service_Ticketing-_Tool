import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [ticket, setTicket] = useState({ title: "", description: "", department_id: "" });
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch Tickets and Departments
  useEffect(() => {
    fetchTickets();
    fetchDepartments();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/my_tickets", { withCredentials: true });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departments", { withCredentials: true });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Handle Ticket Input Change
  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  // Submit Ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/create_ticket", ticket, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      setTicket({ title: "", description: "", department_id: "" });
      fetchTickets(); // Refresh tickets list after creating a new one
    } catch (error) {
      alert(error.response?.data?.error || "Error creating ticket!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Dashboard</h2>

      {/* Raise Ticket Form */}
      <div className="card p-3 my-4">
        <h4>Create a New Ticket</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" className="form-control mb-2" onChange={handleChange} value={ticket.title} required />
          <textarea name="description" placeholder="Description" className="form-control mb-2" onChange={handleChange} value={ticket.description} required />
          
          {/* Department Dropdown */}
          <select 
            name="department_id" 
            className="form-control mb-2" 
            onChange={handleChange} 
            value={ticket.department_id}
            required
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          
          <button className="btn btn-primary">Submit Ticket</button>
        </form>
      </div>

      {/* My Tickets Section */}
      <div className="card p-3">
        <h4>My Tickets</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No tickets found.</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
