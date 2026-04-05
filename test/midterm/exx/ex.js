const tableBody = document.getElementById("table-body");
const form = document.getElementById("student-form");

let students = [];
let nextId = 1;

/* ================= โหลด JSON ================= */
fetch("ex.json")
  .then((res) => res.json())
  .then((data) => {
    students = data.students;
    nextId = students.length + 1;
    renderTable();
  });

/* ================= render table ================= */
function renderTable() {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.major}</td>
      <td>${student.gpa}</td>
      <td>
        <button onclick="editStudent(${index})">แก้ไข</button>
        <button onclick="deleteStudent(${index})">ลบ</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

/* ================= เพิ่มข้อมูล ================= */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const newStudent = {
    id: nextId++,
    name: document.getElementById("name").value,
    major: document.getElementById("major").value,
    gpa: document.getElementById("gpa").value,
  };
  students.push(newStudent);
  renderTable();
  form.reset();
});

/* ================= ลบแถว ================= */
function deleteStudent(index) {
  if (confirm("ต้องการลบข้อมูลนี้หรือไม่?")) {
    students.splice(index, 1);
    renderTable();
  }
}

/* ================= แก้ไขข้อมูล ================= */
function editStudent(index) {
  const student = students[index];

  const newName = prompt("แก้ไขชื่อ", student.name);
  const newMajor = prompt("แก้ไขสาขา", student.major);
  const newGpa = prompt("แก้ไข GPA", student.gpa);

  if (newName && newMajor && newGpa) {
    student.name = newName;
    student.major = newMajor;
    student.gpa = newGpa;
    renderTable();
  }
}
