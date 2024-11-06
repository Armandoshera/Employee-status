import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaFilePdf } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EmployeeCreate from './employeeCreate';
import DOMPurify from 'dompurify';
import './style.css';

const statusColors = {
    New: 'orange',
    'In Progress': '#f2e166',
    'On Hold': '#c2b13e',
    Cancelled: 'rgb(254, 76, 74)',
    Completed: 'rgb(76, 175, 80)'
};

const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
};

const EmployeeDashbord = () => {
    const [employeeDashbord, setEmployeeDashbord] = useState([
        { id: 1, name: "New", category: "test1", status: "New", assigned: "test1", notes: "notes" },
        { id: 2, name: "In Progress", category: "test2", status: "New", assigned: "test2", notes: "Lorem Ipsum is simply dummy" },
        { id: 3, name: "On Hold", category: "test3", status: "On Hold", assigned: "test3", notes: "notes" },
        { id: 4, name: "Cancelled", category: "test4", status: "Cancelled", assigned: "test4", notes: "nonotesnotestes" },
        { id: 5, name: "Completed", category: "test5", status: "Completed", assigned: "test5", notes: "Lorem Ipsum is simply dummy" },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const addEmployee = (newEmployee) => {
        const employeeWithId = { ...newEmployee, id: employeeDashbord.length + 1 };
        setEmployeeDashbord([...employeeDashbord, employeeWithId]);
        closeModal();
    };
    
    const updateEmployee = (updatedEmployee) => {
        const updatedEmployeeList = employeeDashbord.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
        setEmployeeDashbord(updatedEmployeeList);
    };
    
    

    const deleteJobEmployee = (jobId) => {
        const updatedJobs = employeeDashbord.filter((job) => job.id !== jobId);
        setEmployeeDashbord(updatedJobs);
    };

    const editEmployee = (id) => {
        const employee = employeeDashbord.find((emp) => emp.id === id);
        setEmployeeToEdit(employee);
        openModal();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["ID", "Task Title", "Category", "Assigned To", "Status", "Notes"];
        const tableRows = [];

        employeeDashbord.forEach(employee => {
            const employeeData = [
                employee.id,
                employee.name,
                employee.category,
                employee.assigned,
                employee.status,
                employee.notes
            ];
            tableRows.push(employeeData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
        doc.text("Employee Dashboard", 14, 15);
        doc.save("employee_dashboard.pdf");
    };

    const filteredEmployees = employeeDashbord.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columnDefs = [
        {
            headerName: "ID",
            field: "id",
            sortable: true,
            filter: true,
            width: 120,
            rowDrag: true,  // Enable row drag and drop 
        },
        { headerName: "Task Title", field: "name", sortable: true, filter: true ,width: 140, },
        { headerName: "Category", field: "category", sortable: true, filter: true,width: 140, },
        { headerName: "Assigned To", field: "assigned", sortable: true, filter: true ,width: 140,},
        {
            headerName: "Status",
            field: "status",
            sortable: true,
            filter: true,
            width: 140,
            cellStyle: (params) => ({
                backgroundColor: statusColors[params.value] || 'default',
                borderRadius: '8px',
                padding: '4px',
                color: 'white',
                textAlign: 'center',
                height: '30px',
                lineHeight: '22px',
                margin: '2px',
                marginTop: '5px',
            }),
            cellRenderer: (params) => `${params.value}`,
        },
        
        {
            headerName: "Notes",
            field: "notes",
            sortable: true,
            filter: true,
            width: 515,
            cellRenderer: (params) => (
                <div className="test" style={{ display: 'flex', alignItems: 'center', height: '100%' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(params.value) }} />
            ),
        },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params) => (
                <div>
                    <button className='editEmployee' onClick={() => editEmployee(params.data.id)} style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Edit
                    </button>&nbsp;
                    <button className='delete-btn' onClick={() => deleteJobEmployee(params.data.id)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                        <MdDelete />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '10px' }}>
            <div className="container">
                <div className="container-employee" style={{ padding: "5px" }}>
                    {Object.keys(statusColors).map((status) => (
                        <div
                            key={status}
                            style={{
                                width: '22%',
                                textAlign: 'center',
                                borderRadius: '8px',
                                marginLeft: '10px',
                                backgroundColor: statusColors[status],
                                padding: '10px',
                                color: '#ffffff',
                                height: '85px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <h1 style={{ margin: '0px', fontWeight: 'bold' }}>
                                {filteredEmployees.filter(emp => emp.status === status).length}
                            </h1>
                            <p>{status}</p>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            {/* Search */}
                            <IoMdSearch className="search-icon" />
                            <input
                                className="input-search"
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="export-pdf" onClick={exportToPDF}>
                                <FaFilePdf />
                            </button> &nbsp;
                            <button className="create-btn" onClick={openModal}>Create</button>
                        </div>
                    </div>
                    <br />
                    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                        <AgGridReact
                            rowData={filteredEmployees}
                            columnDefs={columnDefs}
                            pagination={false}
                            domLayout="autoHeight"
                            rowDragManaged={true}
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && <EmployeeCreate closeModal={closeModal} addEmployee={addEmployee} updateEmployee={updateEmployee} employeeToEdit={employeeToEdit} />}
        </div>
    );
};

export default EmployeeDashbord;
