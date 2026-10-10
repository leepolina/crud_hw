const BASE_URL = " http://localhost:1111";
const getStudentsBtn = document.querySelector("#get-students-btn");
const studentsTableBody = document.querySelector("#students-table tbody");
const addStudentForm = document.querySelector("#add-student-form");

async function getStudents() {
  try {
    const response = await fetch(`${BASE_URL}/students`);
    if (!response.ok) {
      throw new Error("Couldn't get students info");
    }
    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error(error);
    alert("Error to get students");
  }
}

function renderStudents(students) {
  studentsTableBody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${student.id}</td>
  <td>${student.name}</td>
  <td>${student.age}</td>
  <td>${student.course}</td>
  <td>${student.skills.join(", ")}</td>
  <td>${student.email}</td>
  <td>${student.isEnrolled ? "Added" : "Not added"}</td>
  <td>
    <button class="update-btn" data-id="${student.id}">
      Оновити
    </button>
    <button class="delete-btn" data-id="${student.id}">
      Видалити
    </button>
  </td>
`;

    studentsTableBody.appendChild(row);
  });
}

async function addStudent(event) {
  event.preventDefault();

  const student = {
    name: document.querySelector("#name").value,
    age: Number(document.querySelector("#age").value),
    course: document.querySelector("#course").value,
    skills: document
      .querySelector("#skills")
      .value.split(",")
      .map((skill) => skill.trim()),
    email: document.querySelector("#email").value,
    isEnrolled: document.querySelector("#isEnrolled").checked,
  };

  try {
    const response = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error("Couldn't add a student");
    }

    const newStudent = await response.json();
    console.log("Added student:", newStudent);
    addStudentForm.reset();
    await getStudents();
  } catch (error) {
    console.error(error);
    alert("Error to add student");
  }
}

async function updateStudent(id) {
  const newName = prompt("Enter new student's name:");
  if (!newName) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    if (!response.ok) {
      throw new Error("Couldn't update a student");
    }
    const updatedStudent = await response.json();
    console.log("Updated student:", updatedStudent);
    await getStudents();
  } catch (error) {
    console.error(error);
    alert("Error to update a student");
  }
}

async function deleteStudent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
  );
  if (!confirmDelete) {
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Couldn't delete a student");
    }

    console.log("Student was deleted successfully!");

    await getStudents();
  } catch (err) {
    console.err(err);
    alert("Error to delete a student");
  }
}

getStudentsBtn.addEventListener("click", getStudents);
addStudentForm.addEventListener("submit", addStudent);
studentsTableBody.addEventListener("click", (event) => {
  const id = Number(event.target.dataset.id);
  if (event.target.classList.contains("update-btn")) {
    updateStudent(id);
  }
  if (event.target.classList.contains("delete-btn")) {
    deleteStudent(id);
  }
});
