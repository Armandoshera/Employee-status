import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DOMPurify from 'dompurify'; // Import DOMPurify to sanitize the HTML
import { MdDelete } from "react-icons/md";

const ItemType = 'EMPLOYEE';

const EmployeeTable = ({ job, deleteJobEmployee, editEmployee, index, moveEmployee }) => {
    const { id, name, category, assigned, status, notes, statusEmployee } = job;

    // Function to sanitize HTML (using DOMPurify)
    const sanitizeHtml = (html) => {
        return DOMPurify.sanitize(html);
    };

    // Drag and Drop hooks
    const [, drag] = useDrag({
        type: ItemType,
        item: { id, index }
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (item) => {
            if (item.index !== index) {
                moveEmployee(item.index, index);
                item.index = index; // Update index after moving one item in list 
            }
        }
    });

    const statusColors = {
        New: 'orange',
        'In Progress': '#f2e166',
        'On Hold': '#c2b13e',
        Cancelled: 'rgb(254, 76, 74)',
        Completed: 'rgb(76, 175, 80)'
    };

    // Function to get color for both status and statusEmployee
    const getStatusColor = (status) => statusColors[status] || 'white';

    return (
        <tr ref={(node) => drag(drop(node))} style={{ cursor: 'move', textAlign: 'center', borderBottom: "1px solid gainsboro", height: '40px' }}>
            <td style={{ textAlign: "center", padding: '5px', fontSize: '14px' }}>{id}</td>
            <td style={{ textAlign: "center", padding: '5px', fontSize: '14px' }}>{name}</td>
            <td style={{ textAlign: "center", padding: '5px', fontSize: '14px' }}>{category}</td>
            <td style={{ textAlign: "center", padding: '5px', fontSize: '14px' }}>{assigned}</td>

            <td style={{ textAlign: "-webkit-center", padding: '5px' }}>
                {/* Static data for status */}
                <p
                    style={{
                        backgroundColor: getStatusColor(status),
                        padding: '5px',
                        borderRadius: '6px',
                        width: '100px',
                        textAlign: '-webkit-center',
                        color: '#ffffff',
                        fontSize: '12px',
                        margin:'0px',
                        marginTop:'0px',
                        marginBottom:'0px',
                    }}
                >
                    {status}
                </p>

                {/* Dynamic data for status */}
                <p
                    style={{
                        backgroundColor: getStatusColor(statusEmployee),
                        padding: '3px 5px',
                        borderRadius: '6px',
                        width: '100px',
                        textAlign: '-webkit-center',
                        color: '#ffffff',
                        fontSize: '10px',
                        margin:'0px',
                        marginTop:'0px',
                        marginBottom:'0px',
                    }}
                >
                    {statusEmployee}
                </p>
            </td>

            {/* Notes Column with Sanitized HTML */}
            <td style={{ textAlign: "start", padding: '5px', fontSize: '14px' }}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(notes), 
                    }}
                />
            </td>

            <td style={{ padding: '5px',width:'70px' }}>
                <button className='editEmployee' onClick={() => editEmployee(id)} style={{ fontSize: '12px', padding: '4px 8px' }}>Edit</button> &nbsp;
                <button className='delete-btn' onClick={() => deleteJobEmployee(id)} style={{ fontSize: '12px', padding: '4px 8px' }}><MdDelete /></button>
            </td>
        </tr>
    );
};

export default EmployeeTable;
