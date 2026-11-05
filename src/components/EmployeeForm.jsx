import { useState } from "react";

function EmployeeForm({ employee, employees, onSave, onCancel }) {
  const [form, setForm] = useState(
    employee || { name: "", email: "", phone: "", dob: "", department: "" }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Enter a valid email";
    else if (
      employees.some(
        (e) =>
          e.email.toLowerCase() === form.email.trim().toLowerCase() &&
          e.id !== (employee && employee.id)
      )
    )
      err.email = "This email already exists";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone))
      err.phone = "Phone must be 10 digits";
    if (!form.dob) err.dob = "Date of birth is required";
    if (!form.department) err.department = "Select a department";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      onSave({ ...form, name: form.name.trim(), email: form.email.trim() });
    }
  };

  return (
    <div className="overlay">
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>

        <label>Employee Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Phone Number</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="10 digit number" />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label>Date of Birth</label>
        <input type="date" name="dob" value={form.dob} onChange={handleChange} />
        {errors.dob && <span className="error">{errors.dob}</span>}

        <label>Department</label>
        <select name="department" value={form.department} onChange={handleChange}>
          <option value="">Select department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        {errors.department && <span className="error">{errors.department}</span>}

        <div className="btn-row">
          <button type="button" className="btn-light" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;