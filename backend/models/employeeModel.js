const fs = require("fs");
const os = require("os");
const path = require("path");
const seedEmployees = require("../data/employees.json");

// Laptop: saved in data/employees.json. Vercel: temporary folder.
const filePath = process.env.VERCEL
  ? path.join(os.tmpdir(), "employees.json")
  : path.join(__dirname, "../data/employees.json");

const readAll = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(seedEmployees, null, 2));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeAll = (employees) => {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
};

const getAll = () => readAll();

const emailExists = (email, ignoreId) => {
  const target = String(email || "").trim().toLowerCase();
  return readAll().some(
    (e) => e.email.toLowerCase() === target && e.id !== ignoreId
  );
};

const create = (data) => {
  const employees = readAll();
  const numbers = employees.map((e) => Number(e.id.replace("EMP", "")));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  const employee = { ...data, id: "EMP" + String(next).padStart(3, "0") };
  employees.push(employee);
  writeAll(employees);
  return employee;
};

const update = (id, data) => {
  const employees = readAll();
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...data, id };
  writeAll(employees);
  return employees[index];
};

const remove = (id) => {
  const employees = readAll();
  if (!employees.some((e) => e.id === id)) return false;
  writeAll(employees.filter((e) => e.id !== id));
  return true;
};

module.exports = { getAll, emailExists, create, update, remove };