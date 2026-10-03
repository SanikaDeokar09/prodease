console.log("JS is running!");

// ---------------------------
//  VARIABLES & BASE DATA
// ---------------------------

const managerPassword = 'manager123';
const baseSalaryPerEmployee = 50000;

let employees = [
  {id:'E001', name:'Alice', survey: null, sessions: [], productivity: 0},
  {id:'E002', name:'Bob', survey: null, sessions: [], productivity: 0},
  {id:'E003', name:'Carlos', survey: null, sessions: [], productivity: 0}
];

let currentUser = null;
let sessionTimer = null;
let sessionStartTime = null;
let currentSessionDuration = 0;

const roleSelectEl = document.getElementById('roleSelect');
const employeeIdDiv = document.getElementById('employeeIdDiv');
const managerPwdDiv = document.getElementById('managerPwdDiv');

// ---------------------------
// ROLE SELECTOR TOGGLE
// ---------------------------

roleSelectEl.addEventListener('change', () => {
  if (roleSelectEl.value === 'employee') {
    employeeIdDiv.classList.remove('hidden');
    managerPwdDiv.classList.add('hidden');
  } else {
    employeeIdDiv.classList.add('hidden');
    managerPwdDiv.classList.remove('hidden');
  }
});

// ---------------------------
// LOGIN HANDLER
// ---------------------------

document.getElementById('loginBtn').addEventListener('click', () => {
  const role = roleSelectEl.value;

  if (role === 'employee') {
    const empId = document.getElementById('employeeIdInput').value.trim();
    const emp = employees.find(e => e.id === empId);

    if (emp) {
      currentUser = emp;
      showEmployeeDashboard();
      startFaceAPI();
    } else {
      alert('Invalid employee ID');
    }

  } else {
    const pwd = document.getElementById('managerPwdInput').value;
    if (pwd === managerPassword) {
      currentUser = {role:'manager'};
      showManagerDashboard();
    } else {
      alert('Invalid manager password');
    }
  }
});

// ---------------------------
// TAB SWITCHING
// ---------------------------

function showTab(tabId) {
  let tabs = document.querySelectorAll('.tabContent');
  tabs.forEach(t => t.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// ---------------------------
// EMPLOYEE DASHBOARD VIEW
// ---------------------------

function showEmployeeDashboard() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('managerDashboard').classList.add('hidden');
  document.getElementById('employeeDashboard').classList.remove('hidden');

  showTab('surveyTab');
  loadEmployeeSurvey();
  loadSessionHistory();
  updateProductivityAndSalary();
}

// ---------------------------
// LOAD SURVEY IF EXISTS
// ---------------------------

function loadEmployeeSurvey() {
  if (!currentUser.survey) {
    document.getElementById('surveyForm').reset();
    return;
  }

  document.getElementById('aiUsage').value = currentUser.survey.aiUsage;
  document.getElementById('technostress').value = currentUser.survey.technostress;
  document.getElementById('engagement').value = currentUser.survey.engagement;
  document.getElementById('comments').value = currentUser.survey.comments;
}

// ---------------------------
// SURVEY SUBMIT
// ---------------------------

document.getElementById('surveyForm').addEventListener('submit', e => {
  e.preventDefault();

  currentUser.survey = {
    aiUsage: document.getElementById('aiUsage').value,
    technostress: document.getElementById('technostress').value,
    engagement: document.getElementById('engagement').value,
    comments: document.getElementById('comments').value.trim()
  };

  saveData();
  alert('Survey saved successfully!');
});

// ---------------------------
// SESSION BUTTONS & TIMER
// ---------------------------

const startSessionBtn = document.getElementById('startSessionBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const saveSessionBtn = document.getElementById('saveSessionBtn');
const timerDisplay = document.getElementById('timerDisplay');

startSessionBtn.addEventListener('click', () => {
  if (!document.getElementById('taskType').value) {
    alert("Select a task type before starting session");
    return;
  }

  startSessionBtn.disabled = true;
  endSessionBtn.disabled = false;
  saveSessionBtn.disabled = true;

  sessionStartTime = new Date();
  timerDisplay.textContent = "Session started...";

  sessionTimer = setInterval(updateTimer, 1000);
});

endSessionBtn.addEventListener('click', () => {
  if (!sessionStartTime) return;

  clearInterval(sessionTimer);

  currentSessionDuration = (new Date() - sessionStartTime) / 60000;
  timerDisplay.textContent = `Session ended. Duration: ${currentSessionDuration.toFixed(1)} min`;

  endSessionBtn.disabled = true;
  saveSessionBtn.disabled = false;
  startSessionBtn.disabled = true;
});

// ---------------------------
// UTIL: UPDATE TIMER
// ---------------------------

function updateTimer() {
  let elapsed = (new Date() - sessionStartTime) / 1000;
  let mins = Math.floor(elapsed / 60);
  let secs = Math.floor(elapsed % 60);

  timerDisplay.textContent = `Session running: ${mins}m ${secs}s`;
}
// ---------------------------
// SAVE SESSION
// ---------------------------

saveSessionBtn.addEventListener('click', () => {
  const taskType = document.getElementById('taskType').value;
  const outputDetails = document.getElementById('outputDetails').value.trim();
  const errorCount = parseInt(document.getElementById('errorCount').value) || 0;

  if (!taskType) {
    alert('Please select a task type');
    return;
  }

  let qualityScore = Math.max(0, 100 - errorCount * 10);
  let productivityScore = (qualityScore * currentSessionDuration) || 0;

  currentUser.sessions.push({
    date: new Date().toISOString(),
    taskType,
    duration: currentSessionDuration,
    outputDetails,
    errorCount,
    qualityScore,
    productivityScore
  });

  saveData();
  alert('Session saved!');
  resetSessionForm();
  updateProductivityAndSalary();
  loadSessionHistory();
});

// ---------------------------
// RESET SESSION FORM
// ---------------------------

function resetSessionForm() {
  document.getElementById('taskType').value = "";
  document.getElementById('outputDetails').value = "";
  document.getElementById('errorCount').value = 0;

  timerDisplay.textContent = "";
  saveSessionBtn.disabled = true;
  startSessionBtn.disabled = false;
  endSessionBtn.disabled = true;

  sessionStartTime = null;
  clearInterval(sessionTimer);
}

// ---------------------------
// LOAD SESSION HISTORY
// ---------------------------

function loadSessionHistory() {
  let tbody = document.querySelector('#sessionHistoryTable tbody');
  tbody.innerHTML = '';

  currentUser.sessions.forEach(s => {
    let row = document.createElement('tr');

    row.innerHTML = `
      <td>${new Date(s.date).toLocaleString()}</td>
      <td>${s.taskType}</td>
      <td>${s.duration.toFixed(1)}</td>
      <td>${s.qualityScore}</td>
      <td>${s.productivityScore.toFixed(1)}</td>
    `;

    tbody.appendChild(row);
  });
}

// ---------------------------
// PRODUCTIVITY & SALARY UPDATE
// ---------------------------

function updateProductivityAndSalary() {
  let totalProd = currentUser.sessions.reduce((a, b) => a + b.productivityScore, 0);
  let avgProd = currentUser.sessions.length ? totalProd / currentUser.sessions.length : 0;

  currentUser.productivity = avgProd;

  document.getElementById('avgProductivity').textContent = avgProd.toFixed(1);
  document.getElementById('calculatedSalary').textContent =
    (baseSalaryPerEmployee * (avgProd / 100)).toFixed(2);

  saveData();
}

// ---------------------------
// MANAGER DASHBOARD
// ---------------------------

function showManagerDashboard() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('employeeDashboard').classList.add('hidden');
  document.getElementById('managerDashboard').classList.remove('hidden');

  let tbody = document.querySelector('#employeeSummaryTable tbody');
  tbody.innerHTML = '';

  employees.forEach(e => {
    let totalProd = e.sessions.reduce((a, b) => a + b.productivityScore, 0);
    let avgProd = e.sessions.length ? totalProd / e.sessions.length : 0;
    e.productivity = avgProd;

    let avgQuality = e.sessions.length ?
      e.sessions.reduce((a, b) => a + b.qualityScore, 0) / e.sessions.length : 0;

    let totalHours = e.sessions.reduce((a, b) => a + b.duration, 0);
    let lastSession = e.sessions.length ? new Date(e.sessions[e.sessions.length - 1].date)
      .toLocaleDateString() : 'N/A';

    let salary = (baseSalaryPerEmployee * (avgProd / 100)).toFixed(2);
    let engagement = e.survey ? e.survey.engagement : 'N/A';
    let technostress = e.survey ? e.survey.technostress : 'N/A';

    let tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${avgProd.toFixed(1)}</td>
      <td>${avgQuality.toFixed(1)}</td>
      <td>${(totalHours / 60).toFixed(1)}</td>
      <td>${lastSession}</td>
      <td>${engagement}</td>
      <td>${technostress}</td>
      <td>₹${salary}</td>
      <td><span class="clickable" onclick="showEmployeeDetails('${e.id}')">View Details</span></td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById('employeeDetails').classList.add('hidden');
}

// ---------------------------
// EMPLOYEE DETAILS POPUP
// ---------------------------

function showEmployeeDetails(empId) {
  let emp = employees.find(e => e.id === empId);
  if (!emp) return alert('Employee not found');

  let salary = (baseSalaryPerEmployee * (emp.productivity / 100)).toFixed(2);

  let html = `
    <p><strong>ID:</strong> ${emp.id}</p>
    <p><strong>Name:</strong> ${emp.name}</p>
  `;

  if (emp.survey) {
    html += `
      <h4>Survey Data</h4>
      <p>AI Usage: ${emp.survey.aiUsage}</p>
      <p>Technostress: ${emp.survey.technostress}</p>
      <p>Engagement: ${emp.survey.engagement}</p>
      <p>Comments: ${emp.survey.comments}</p>
    `;
  } else {
    html += "<p>No survey data submitted.</p>";
  }

  if (emp.sessions.length) {
    html += `
      <h4>Session History</h4>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Task</th><th>Duration (min)</th><th>Quality</th><th>Productivity</th>
          </tr>
        </thead>
        <tbody>
    `;

    emp.sessions.forEach(s => {
      html += `
        <tr>
          <td>${new Date(s.date).toLocaleString()}</td>
          <td>${s.taskType}</td>
          <td>${s.duration.toFixed(1)}</td>
          <td>${s.qualityScore}</td>
          <td>${s.productivityScore.toFixed(1)}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
  } else {
    html += "<p>No session data yet.</p>";
  }

  html += `<h4>Estimated Salary: ₹${salary}</h4>`;

  document.getElementById('employeeDetailContent').innerHTML = html;
  document.getElementById('employeeDetails').classList.remove('hidden');
}

// ---------------------------
// HIDE EMPLOYEE DETAILS
// ---------------------------

function hideEmployeeDetails() {
  document.getElementById('employeeDetails').classList.add('hidden');
}
// ---------------------------
// SAVE & LOAD DATA (LocalStorage)
// ---------------------------

function saveData() {
  localStorage.setItem('employeesData', JSON.stringify(employees));
}

function loadData() {
  let data = localStorage.getItem('employeesData');
  if (data) employees = JSON.parse(data);
}

// ---------------------------
// DOWNLOAD CSV (Manager)
// ---------------------------

function managerDownloadCSV() {
  let allData =
    "EmployeeID,Name,AI Usage,Technostress,Engagement,Comments,Task,Date,Duration(min),Quality,Productivity\n";

  employees.forEach(e => {
    let maxSessions = Math.max(1, e.sessions.length);

    for (let i = 0; i < maxSessions; i++) {
      let s = e.sessions[i] || {
        date: '',
        taskType: '',
        duration: '',
        qualityScore: '',
        productivityScore: ''
      };

      allData += `${e.id},${e.name},${e.survey ? e.survey.aiUsage : ''},${
        e.survey ? e.survey.technostress : ''
      },${e.survey ? e.survey.engagement : ''},${
        e.survey ? e.survey.comments.replace(/\n/g, ' ') : ''
      },${s.taskType},${s.date},${s.duration},${s.qualityScore},${s.productivityScore}\n`;
    }
  });

  const blob = new Blob([allData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'research_data.csv';
  a.click();

  URL.revokeObjectURL(url);
}

// ---------------------------
// LOGOUT
// ---------------------------

function logout() {
  currentUser = null;

  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('employeeDashboard').classList.add('hidden');
  document.getElementById('managerDashboard').classList.add('hidden');
  document.getElementById('employeeDetails').classList.add('hidden');

  clearInterval(sessionTimer);
  resetSessionForm();
}

// ---------------------------
// FACIAL STRESS DETECTION
// ---------------------------

async function startFaceAPI() {
const MODEL_URL = "https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/";

  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    console.log("Models Loaded Successfully");
  } catch (err) {
    console.error("Model Load Error:", err);
  }

  startWebcam();
}


async function startWebcam() {

  const video = document.getElementById("webcam");

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    });

  video.addEventListener("playing", () => {
  setInterval(async () => {

    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();

    console.log("Detection:", detection);   // <-- correct place

    if (!detection || !detection.expressions) {
      document.getElementById("stressLevel").textContent = "Unknown";
      return;
    }

      const e = detection.expressions;
      const angry   = e.angry   || 0;
const fear    = e.fear    || 0;
const disgust = e.disgust || 0;
const sad     = e.sad     || 0;

const stressVal = (angry + fear + disgust + sad) * 100;


      document.getElementById("stressLevel").textContent = `${stressVal.toFixed(0)}%`;
    }, 1000);
  });
}
// ---------------------------
// INITIAL DATA LOAD
// ---------------------------

window.onload = () => {
  loadData();

  if (roleSelectEl.value === 'employee') {
    employeeIdDiv.classList.remove('hidden');
    managerPwdDiv.classList.add('hidden');
  } else {
    employeeIdDiv.classList.add('hidden');
    managerPwdDiv.classList.remove('hidden');
  }
};
