import { useState, useEffect, useCallback } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import "./App.css";
const API_URL = "http://localhost:5000/api/employees";
const SERVER_ERROR = "Cannot connect to the server. Is the backend running?";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  // READ: runs once when the page opens
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setEmployees(data);
      } catch {
        showMessage(SERVER_ERROR, "error");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [showMessage]);

  // CREATE and UPDATE
  const handleSave = async (data) => {
    try {
      const isEdit = Boolean(editing);
      const url = isEdit ? API_URL + "/" + editing.id : API_URL;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || "Something went wrong", "error");
        return;
      }

      if (isEdit) {
        setEmployees(employees.map((e) => (e.id === result.id ? result : e)));
        showMessage("Employee updated successfully!");
      } else {
        setEmployees([...employees, result]);
        showMessage("Employee added successfully!");
      }

      setShowForm(false);
      setEditing(null);
    } catch {
      showMessage(SERVER_ERROR, "error");
    }
  };

  // DELETE
  const handleDelete = async (emp) => {
    if (!window.confirm("Delete " + emp.name + "?")) return;

    try {
      const response = await fetch(API_URL + "/" + emp.id, { method: "DELETE" });

      if (!response.ok) {
        showMessage("Could not delete employee", "error");
        return;
      }

      setEmployees(employees.filter((e) => e.id !== emp.id));
      showMessage("Employee deleted successfully!");
    } catch {
      showMessage(SERVER_ERROR, "error");
    }
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  const count = (dept) => employees.filter((e) => e.department === dept).length;

  return (
    <div className="page">
      {message && (
        <div className={"toast " + messageType}>
          {messageType === "error" ? "✕" : "✓"} {message}
        </div>
      )}

      <div className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your workforce and employee information.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
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

      {loading ? (
        <div className="empty">Loading employees...</div>
      ) : (
        <EmployeeTable
          employees={filtered}
          onEdit={(emp) => {
            setEditing(emp);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <EmployeeForm
          employee={editing}
          employees={employees}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

export default App;