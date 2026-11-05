const fs = require("fs");
const os = require("os");
const path = require("path");

const seedPath = path.join(__dirname, "../data/employees.json");

// On Vercel the project files are read-only, so we use a temporary folder there.
const filePath = process.env.VERCEL
  ? path.join(os.tmpdir(), "employees.json")
  : seedPath;

const readEmployees = () => {
  if (!fs.existsSync(filePath)) {
    fs.copyFileSync(seedPath, filePath);
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeEmployees = (employees) => {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
};

const getEmployees = (req, res) => {
  res.json(readEmployees());
};

const addEmployee = (req, res) => {
  const employees = readEmployees();
  const email = (req.body.email || "").trim().toLowerCase();

  if (employees.some((e) => e.email.toLowerCase() === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const numbers = employees.map((e) => Number(e.id.replace("EMP", "")));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  const id = "EMP" + String(next).padStart(3, "0");

  const newEmployee = { id, ...req.body };
  employees.push(newEmployee);
  writeEmployees(employees);

  res.status(201).json(newEmployee);
};

const updateEmployee = (req, res) => {
  const employees = readEmployees();
  const index = employees.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const email = (req.body.email || "").trim().toLowerCase();
  const duplicate = employees.some(
    (e) => e.email.toLowerCase() === email && e.id !== req.params.id
  );
  if (duplicate) {
    return res.status(400).json({ message: "Email already exists" });
  }

  employees[index] = { ...employees[index], ...req.body, id: req.params.id };
  writeEmployees(employees);

  res.json(employees[index]);
};

const deleteEmployee = (req, res) => {
  const employees = readEmployees();
  const exists = employees.some((e) => e.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const updated = employees.filter((e) => e.id !== req.params.id);
  writeEmployees(updated);

  res.json({ message: "Employee deleted successfully" });
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};