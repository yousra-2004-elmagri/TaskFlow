window.onload = async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'login.html';

    try {
        const res = await axios.get('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const { stats, tasks } = res.data;

        document.getElementById('stat-projects').innerText = stats.activeProjects;
        document.getElementById('stat-assigned').innerText = stats.assignedTasks;
        document.getElementById('stat-completed').innerText = stats.completedTasks;
        document.getElementById('stat-late').innerText = stats.lateTasks;

        const container = document.getElementById('priority-container');
        container.innerHTML = tasks.map(t => `
            <div class="task-row">
                <span style="font-weight:700;">${t.title}</span>
                <span class="badge ${t.priority === 'haute' ? 'urgent' : ''}">${t.priority.toUpperCase()}</span>
                <span style="color:var(--gray-400);">${new Date(t.dueDate).toLocaleDateString()}</span>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
};