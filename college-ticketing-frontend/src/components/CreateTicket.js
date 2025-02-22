import React, { useState } from "react";
import axios from "axios";
import "./CreateTicket.css"; // Ensure this CSS file exists in the same folder

const CreateTicket = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("department_id", departmentId);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/create_ticket", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="ticket-container">
            <h2 className="title">Create a Ticket</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department ID:</label>
                    <input id="department" type="text" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fileUpload">Upload Image:</label>
                    <input id="fileUpload" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <button type="submit" className="submit-btn">Submit Ticket</button>
            </form>
        </div>
    );
};

export default CreateTicket;
