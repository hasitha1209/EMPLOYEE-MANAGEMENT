import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import "./App.css";

const initialEmployees = [
  { id: "EMP001", name: "Rahul", email: "rahul@gmail.com", phone: "9876543210", dob: "1998-05-12", department: "IT" },
  { id: "EMP002", name: "Priya", email: "priya@gmail.com", phone: "9876543211", dob: "1999-08-21", department: "HR" },
  { id: "EMP003", name: "Amit", email: "amit@gmail.com", phone: "9876543212", dob: "1997-02-03", department: "Finance" },
];

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [nextId, setNextId] = useState(4);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = (data) => {
    if (editing) {
      setEmployees(employees.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      showMessage("Employee updated successfully!");
    } else {
      const id = "EMP" + String(nextId).padStart(3, "0");
      setEmployees([...employees, { ...data, id }]);
      setNextId(nextId + 1);
      showMessage("Employee added successfully!");
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (emp) => {
    if (window.confirm("Delete " + emp.name + "?")) {
      setEmployees(employees.filter((e) => e.id !== emp.id));
      showMessage("Employee deleted successfully!");
    }
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  const count = (dept) => employees.filter((e) => e.department === dept).length;

  return (
    <div className="page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your workforce and employee information.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          + Add Employee
        </button>
      </div>

      <div className="cards">
        <div className="card"><span>Total</span><b>{employees.length}</b></div>
        <div className="card"><span>IT</span><b>{count("IT")}</b></div>
        <div className="card"><span>HR</span><b>{count("HR")}</b></div>
        <div className="card"><span>Finance</span><b>{count("Finance")}</b></div>
      </div>

      <input
        className="search"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <EmployeeTable
        employees={filtered}
        onEdit={(emp) => { setEditing(emp); setShowForm(true); }}
        onDelete={handleDelete}
      />

      {showForm && (
        <EmployeeForm
          employee={editing}
          employees={employees}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

export default App;