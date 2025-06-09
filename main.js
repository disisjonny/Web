const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('error').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('error').textContent = 'An error occurred';
  }
});

// Logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Load Dashboard
if (window.location.pathname.includes('dashboard.html')) {
  fetch(`${API_URL}/students`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalStudents').textContent = data.length;
      const classes = [...new Set(data.map(s => s.class))];
      document.getElementById('totalClasses').textContent = classes.length;
    })
    .catch(() => window.location.href = 'login.html');
}

// Add Student
document.getElementById('addStudentForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentData = {
    full_name: document.getElementById('fullName').value,
    birth_date: document.getElementById('birthDate').value,
    student_id: document.getElementById('studentId').value,
    photo: '', // Handle file upload separately
    nationality: document.getElementById('nationality').value,
    address: document.getElementById('address').value,
    neighborhood: document.getElementById('neighborhood').value,
    class: document.getElementById('class').value,
    grade: document.getElementById('grade').value,
    parent_father: {
      full_name: document.getElementById('fatherName').value,
      birth_date: document.getElementById('fatherBirthDate').value,
      phone: document.getElementById('fatherPhone').value,
      workplace: document.getElementById('fatherWorkplace').value,
      id: document.getElementById('fatherId').value
    },
    parent_mother: {}, // Similar fields
    guardian: {}, // Similar fields
    activities: {
      school: Array.from(document.getElementById('schoolActivities').selectedOptions).map(opt => opt.value),
      external: document.getElementById('externalActivities').value,
      coach_contact: document.getElementById('coachContact').value
    }
  };
  try {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    if (response.ok) {
      window.location.href = 'student-list.html';
    } else {
      alert('Error adding student');
    }
  } catch (err) {
    alert('An error occurred');
  }
});
