const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/employees.json");

const getEmployees = (req, res) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const employees = JSON.parse(data);
  res.json(employees);
};

module.exports = { getEmployees };