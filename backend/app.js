const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');



const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

app.use(cors()); // allow all origins (demo only)
app.use(express.json());

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helpers
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Basic validation
const validateStudent = (data) => {
  return data.name && data.age && data.course;
};

// CREATE student
app.post('/students', (req, res) => {
  if (!validateStudent(req.body)) {
    return res.status(400).json({ message: 'name, age, course required' });
  }

  const students = readData();
  const newStudent = {
    id: Date.now(),
    name: req.body.name,
    age: req.body.age,
    course: req.body.course
  };

  students.push(newStudent);
  writeData(students);

  res.status(201).json(newStudent);
});

// READ all students
app.get('/students', (req, res) => {
  res.json(readData());
});

// READ one student
app.get('/students/:id', (req, res) => {
  const students = readData();
  const student = students.find(s => s.id == req.params.id);

  if (!student) return res.status(404).json({ message: 'Student not found' });

  res.json(student);
});

// UPDATE student
app.put('/students/:id', (req, res) => {
  const students = readData();
  const index = students.findIndex(s => s.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: 'Student not found' });

  students[index] = { ...students[index], ...req.body };
  writeData(students);

  res.json(students[index]);
});

// DELETE student
app.delete('/students/:id', (req, res) => {
  const students = readData();
  const filtered = students.filter(s => s.id != req.params.id);

  if (students.length === filtered.length) {
    return res.status(404).json({ message: 'Student not found' });
  }

  writeData(filtered);
  res.json({ message: 'Student deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
