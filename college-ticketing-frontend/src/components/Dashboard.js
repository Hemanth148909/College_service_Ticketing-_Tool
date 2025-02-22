import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [ticket, setTicket] = useState({ title: "", description: "", department_id: "" });
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);

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
      fetchTickets();
    } catch (error) {
      alert(error.response?.data?.error || "Error creating ticket!");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🎫 Student Dashboard</h2>

      <div className="ticket-form-container">
        <h4 className="form-title">Create a New Ticket</h4>
        <form onSubmit={handleSubmit} className="ticket-form">
          <input type="text" name="title" placeholder="Enter ticket title..." className="input-field" onChange={handleChange} value={ticket.title} required />
          <textarea name="description" placeholder="Describe your issue..." className="input-field" onChange={handleChange} value={ticket.description} required />
          <select name="department_id" className="input-field" onChange={handleChange} value={ticket.department_id} required>
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
          <button className="submit-button">🚀 Submit Ticket</button>
        </form>
      </div>

      <div className="tickets-container">
        <h4 className="section-title">📌 My Tickets</h4>
        <div className="table-wrapper">
          <table className="tickets-table">
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
                  <td colSpan="4" className="no-tickets">No tickets found.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td className={`status ${ticket.status === 'Pending' ? 'pending' : 'completed'}`}>{ticket.status}</td>
                    <td>{new Date(ticket.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
