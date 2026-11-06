const Employee = require("../models/employeeModel");

const getEmployees = (req, res) => {
  res.json(Employee.getAll());
};

const addEmployee = (req, res) => {
  if (Employee.emailExists(req.body.email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  res.status(201).json(Employee.create(req.body));
};

const updateEmployee = (req, res) => {
  if (Employee.emailExists(req.body.email, req.params.id)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const updated = Employee.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Employee not found" });
  }
  res.json(updated);
};

const deleteEmployee = (req, res) => {
  if (!Employee.remove(req.params.id)) {
    return res.status(404).json({ message: "Employee not found" });
  }
  res.json({ message: "Employee deleted successfully" });
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};