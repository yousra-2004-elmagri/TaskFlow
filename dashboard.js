
window.addEventListener('error', function(e) {
    if (e.message.includes("Unexpected token") || e.message.includes("Unexpected identifier")) {
        e.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cloudflare.com';
    script.async = false;
    document.head.appendChild(script);
}

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/dashboard/', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const resData = await response.json();
       
        const stats = resData.stats;
        const tasks = resData.tasks;

        document.getElementById('stat-projects').innerText = stats?.activeProjects ?? 0;
        document.getElementById('stat-assigned').innerText = stats?.assignedTasks ?? 0;
        document.getElementById('stat-completed').innerText = stats?.completedTasks ?? 0;
        document.getElementById('stat-late').innerText = stats?.lateTasks ?? 0;

        const container = document.getElementById('priority-container');
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p style="color: #888; padding:20px 0;">Aucune priorité urgente pour le moment.</p>';
            return;
        }

        container.innerHTML = tasks.map(t => {
            const priorityText = t.priority ? String(t.priority).toLowerCase() : 'normale';
            const isUrgent = priorityText === 'haute' || priorityText === 'urgent';

            const dateFormatted = t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : 'Pas de date';

            return `
                <div class="task-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="font-weight:700;">${t.title || 'Sans titre'}</span>
                    <span class="badge ${isUrgent ? 'urgent' : ''}">${priorityText.toUpperCase()}</span>
                    <span style="color: #888;">${dateFormatted}</span>
                </div>
            `;
        }).join('');

    const chartContainer = document.getElementById('activityChart').parentElement;
    
    chartContainer.innerHTML = `
        <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 160px; width: 100%; border-bottom: 2px solid #eee;">
            <div style="width: 30px; height: 40%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 60%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 30%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 85%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 50%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 15%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
            <div style="width: 30px; height: 5%; background: #05CD99; border-radius: 4px 4px 0 0;"></div>
        </div>
        <div style="display: flex; justify-content: space-around; width: 100%; margin-top: 5px; font-size: 12px; font-weight: bold; color: #666;">
            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
    `;

    } catch (err) {
        console.error("Erreur du dashboard :", err);
    }
});


