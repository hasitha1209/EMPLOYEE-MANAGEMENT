function EmployeeTable({ employees, onEdit, onDelete }) {
  if (employees.length === 0) {
    return <div className="empty">No employees found.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>
                <span className="avatar">{emp.name.charAt(0).toUpperCase()}</span>
                {emp.name}
              </td>
              <td>{emp.email}</td>
              <td><span className={"badge " + emp.department}>{emp.department}</span></td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(emp)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(emp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;