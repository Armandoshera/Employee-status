import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaTimes } from 'react-icons/fa';

import './style.css';

const EmployeeCreate = ({ closeModal, addEmployee, updateEmployee, employeeToEdit }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [notes, setNotes] = useState("");
    const [assigned, setAssigned] = useState("");
    const [statusEmployee, setStatusEmployee] = useState("New");

    // When editing, pre-fill the form with existing employee details
    useEffect(() => {
        if (employeeToEdit) {
            setName(employeeToEdit.name);
            setCategory(employeeToEdit.category);
            setAssigned(employeeToEdit.assigned);
            setNotes(employeeToEdit.notes || ""); // Ensure notes HTML format
            setStatusEmployee(employeeToEdit.status || "New");
            console.log('employeeToEdit.statusEmployee', employeeToEdit.statusEmployee)
        }
    }, [employeeToEdit]);

    // Handle status change
    const handleStatusChange = (status) => {
        setStatusEmployee(status);
    };

    const statusStyles = {
        New: { backgroundColor: 'orange' },
        'In Progress': { backgroundColor: '#f2e166' },
        'On Hold': { backgroundColor: '#c2b13e' },
        Cancelled: { backgroundColor: 'rgb(254, 76, 74)' },
        Completed: { backgroundColor: 'rgb(76, 175, 80)' },
    };

    const handleSubmit = () => {
        const newEmployee = { name, category, assigned, notes, status: statusEmployee };

        if (employeeToEdit) {
            // If editing, update the employee
            updateEmployee({ ...employeeToEdit, ...newEmployee });
        } else {
            // If creating, add the new employee
            addEmployee({ id: Math.random(), ...newEmployee });
        }

        closeModal();
    };





    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                width: "600px",
                height: "375px",
                zIndex: 1000,
            }}
        >
            {/* Status Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                {["New", "In Progress", "On Hold", "Cancelled", "Completed"].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        style={{
                            width: "120px",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            backgroundColor: statusEmployee === status ? statusStyles[status].backgroundColor : statusStyles[status].backgroundColor,
                            color: "#fff",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease, transform 0.1s ease",
                            clipPath:
                                status === 'New' ? 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 1%, 88% 2%)' :
                                    status === 'Completed' ? 'polygon(120% 0%, 100% 50%, 777% 100%, 0% 100%, 21% 50%, 0% 0%)' :
                                        'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
                        }}
                        className={`status-button ${statusEmployee === status ? 'active' : ''}`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            {/* Form inputs */}
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <div style={{ marginBottom: "14px", width: "50%" }}>
                    <label style={{ fontSize: '13px' }}>Task Title</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "14px", width: "20%" }}>
                    <label style={{ fontSize: '13px' }}>Category</label> <br />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "7px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    >
                        <option>test</option>
                        <option>test 4</option>
                        <option>test 7</option>
                    </select>
                </div>
                <div style={{ marginBottom: "14px", width: "20%" }}>
                    <label style={{ fontSize: '13px' }}>Assigned To</label> <br />
                    <select
                        value={assigned}
                        onChange={(e) => setAssigned(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "7px",
                            marginTop: "4px",
                            borderRadius: "3px",
                            border: "1px solid #ddd",
                        }}
                    >
                        <option>task 1</option>
                        <option>task 2</option>
                        <option>task 3</option>
                    </select>
                </div>
            </div>

            {/* Notes Editor */}
            <label style={{ fontSize: '13px' }}>Note</label>
            <ReactQuill
                style={{ height: '100px', marginTop: '10px' }}
                theme="snow"
                value={notes}
                onChange={setNotes}
            />

            {/* Action buttons */}
            <div style={{ textAlign: "end", marginTop: "75px", display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={closeModal}
                    style={{
                        padding: "8px 20px",
                        marginRight: "10px",
                        backgroundColor: "#FE4C4A",
                        borderRadius: "4px",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Close & Don't Save   <FaTimes style={{ position: 'relative', top: '3px', left: '12px' }} size={13} />
                </button>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    {employeeToEdit ? "Update" : <>Create &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |<IoCheckmarkOutline style={{ fontSize: "16px" }} /></>}
                </button>
            </div>
        </div>
    );
};

export default EmployeeCreate;
