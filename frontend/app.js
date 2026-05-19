const API = "http://localhost:5000/api";

// ===== AUTH =====
function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function showLogin() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

async function register() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  try {
    await axios.post(`${API}/auth/register`, { name, email, password });
    alert("Compte créé! Connectez-vous.");
    showLogin();
  } catch (err) {
    alert(err.response?.data?.message || "Erreur");
  }
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    showDashboard();
  } catch (err) {
    alert(err.response?.data?.message || "Erreur");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.getElementById("dashboard-page").style.display = "none";
  document.getElementById("auth-page").style.display = "flex";
}

function getToken() {
  return localStorage.getItem("token");
}

// ===== DASHBOARD =====
async function showDashboard() {
  document.getElementById("auth-page").style.display = "none";
  document.getElementById("dashboard-page").style.display = "block";
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("user-name").textContent = user.name;
  await loadDashboard();
  await loadProjects();
  await loadNotifications();
}

async function loadDashboard() {
  try {
    const res = await axios.get(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    document.getElementById("stat-projects").textContent = res.data.activeProjects;
    document.getElementById("stat-tasks").textContent = res.data.assignedTasks;
    document.getElementById("stat-done").textContent = res.data.completedTasks;
    document.getElementById("stat-late").textContent = res.data.lateTasks;
  } catch (err) {
    console.log(err);
  }
}

// ===== PROJECTS =====
function showProjectForm() {
  document.getElementById("project-form").style.display = "block";
  restoreProjectDraft();
}

function hideProjectForm() {
  document.getElementById("project-form").style.display = "none";
}

async function loadProjects() {
  try {
    const res = await axios.get(`${API}/projects`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const list = document.getElementById("projects-list");
    list.innerHTML = "";
    res.data.data.forEach(p => {
      list.innerHTML += `
        <div class="project-card">
          <h3>${p.title}</h3>
          <p>${p.description || ""}</p>
          <span class="badge">${p.status}</span>
          <br><br>
          <button class="btn-tasks" onclick="loadTasks('${p._id}', '${p.title}')">📋 Tâches</button>
          <button class="btn-delete" onclick="deleteProject('${p._id}')">🗑 Supprimer</button>
        </div>
      `;
    });
  } catch (err) {
    console.log(err);
  }
}

async function createProject() {
  const title = document.getElementById("proj-title").value;
  const description = document.getElementById("proj-desc").value;
  const deadline = document.getElementById("proj-deadline").value;
  try {
    await axios.post(`${API}/projects`, { title, description, deadline }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    localStorage.removeItem("draft-project");
    hideProjectForm();
    await loadProjects();
  } catch (err) {
    alert(err.response?.data?.message || "Erreur");
  }
}

async function deleteProject(id) {
  if (!confirm("Supprimer ce projet?")) return;
  try {
    await axios.delete(`${API}/projects/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    await loadProjects();
  } catch (err) {
    alert("Erreur");
  }
}

// ===== FONCTIONNALITÉ 7 — BROUILLONS =====
document.addEventListener("input", (e) => {
  if (e.target.closest("#project-form")) {
    const draft = {
      title: document.getElementById("proj-title")?.value,
      desc: document.getElementById("proj-desc")?.value,
      deadline: document.getElementById("proj-deadline")?.value
    };
    localStorage.setItem("draft-project", JSON.stringify(draft));
  }
});

function restoreProjectDraft() {
  const raw = localStorage.getItem("draft-project");
  if (!raw) return;
  const draft = JSON.parse(raw);
  const restore = confirm("لديك مسودة محفوظة، هل تريد استرجاعها؟");
  if (restore) {
    document.getElementById("proj-title").value = draft.title || "";
    document.getElementById("proj-desc").value = draft.desc || "";
    document.getElementById("proj-deadline").value = draft.deadline || "";
  } else {
    localStorage.removeItem("draft-project");
  }
}

// ===== TASKS =====
async function loadTasks(projectId, projectTitle) {
  try {
    const res = await axios.get(`${API}/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const list = document.getElementById("projects-list");
    list.innerHTML = `
      <button onclick="loadProjects()">⬅ Retour</button>
      <h3 style="margin:16px 0">${projectTitle} — Tâches</h3>
      <div class="form-box">
        <input type="text" id="task-title" placeholder="Titre de la tâche">
        <select id="task-priority">
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
        </select>
        <button onclick="createTask('${projectId}')">+ Ajouter</button>
      </div>
      <div id="tasks-list"></div>
    `;
    const tasksList = document.getElementById("tasks-list");
    res.data.forEach(t => {
      tasksList.innerHTML += `
        <div class="task-card">
          <div>
            <strong>${t.title}</strong>
            <span class="badge">${t.priority}</span>
            <span class="badge">${t.status}</span>
          </div>
          <div>
            <select onchange="updateStatus('${t._id}', this.value)">
              <option ${t.status === "à faire" ? "selected" : ""} value="à faire">À faire</option>
              <option ${t.status === "en cours" ? "selected" : ""} value="en cours">En cours</option>
              <option ${t.status === "terminé" ? "selected" : ""} value="terminé">Terminé</option>
            </select>
            <button class="btn-delete" onclick="deleteTask('${t._id}', '${projectId}', '${projectTitle}')">🗑</button>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.log(err);
  }
}

async function createTask(projectId) {
  const title = document.getElementById("task-title").value;
  const priority = document.getElementById("task-priority").value;
  try {
    await axios.post(`${API}/tasks`, { title, priority, project: projectId }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    loadTasks(projectId, "");
  } catch (err) {
    alert("Erreur");
  }
}

async function updateStatus(taskId, status) {
  try {
    await axios.patch(`${API}/tasks/${taskId}/status`, { status }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteTask(taskId, projectId, projectTitle) {
  try {
    await axios.delete(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    loadTasks(projectId, projectTitle);
  } catch (err) {
    console.log(err);
  }
}

// ===== FONCTIONNALITÉ 10 — NOTIFICATIONS =====
let notifications = [];

async function loadNotifications() {
  try {
    const res = await axios.get(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    notifications = res.data;
    updateBadge();
    renderNotifications();
  } catch (err) {
    console.log(err);
  }
}

function updateBadge() {
  const unread = notifications.filter(n => !n.read).length;
  const badge = document.getElementById("notif-badge");
  if (badge) badge.textContent = unread > 0 ? unread : "";
}

function renderNotifications() {
  const container = document.getElementById("notif-list");
  if (!container) return;
  container.innerHTML = "";
  notifications.forEach(n => {
    container.innerHTML += `
      <div class="notif-item ${n.read ? "" : "unread"}" onclick="markAsRead('${n._id}')">
        <span>${n.message}</span>
      </div>
    `;
  });
}

async function markAsRead(id) {
  try {
    await axios.patch(`${API}/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const n = notifications.find(n => n._id === id);
    if (n) n.read = true;
    updateBadge();
    renderNotifications();
  } catch (err) {
    console.log(err);
  }
}

setInterval(loadNotifications, 30000);


window.onload = () => {
  const token = localStorage.getItem("token");
  if (token) {
    showDashboard();
  }
};