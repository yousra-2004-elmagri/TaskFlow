axios.defaults.baseURL = 'http://localhost:3000'; // Modifiez le port si votre API n'utilise pas 3000
const fetchTasks = async (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    const search = document.getElementById('search-input').value.trim();
    const status = document.getElementById('filter-status').value;

    try {
        const res = await axios.get('/api/tasks/my-tasks', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { page, limit: 5, search, status }
        });

        const responseData = res.data;
        // Extraction sécurisée du tableau de tâches
        const tasksList = responseData.data || (Array.isArray(responseData) ? responseData : []);
        const totalPages = responseData.totalPages ?? 1;
        const currentPage = Number(responseData.page ?? page); 

        const list = document.getElementById('tasks-container');
        
        // CORRECTION 1 : Remplacement de "data" par "tasksList"
        list.innerHTML = tasksList.length ? tasksList.map(t => `
            <div class="task-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <div>
                    <div style="font-weight:700;">${t.title || 'Sans titre'}</div>
                    <div style="font-size:12px; color:var(--gray-400); margin-top:4px;">${t.description || 'Aucune description'}</div>
                </div>
                <span class="badge" style="background:var(--bg-main); color:var(--navy-700); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${t.status || 'N/A'}</span>
            </div>
        `).join('') : '<p style="padding:20px; color:var(--gray-400); text-align:center;">Aucune tâche trouvée.</p>';

        renderPagination(currentPage, totalPages);

    } catch (err) {
        console.error(err);
        document.getElementById('tasks-container').innerHTML = 
            '<p style="color:#EE5D50; padding:20px; text-align:center;">Erreur de chargement des tâches.</p>';
    }
};

function renderPagination(currentPage, totalPages) {
    const pagin = document.getElementById('pagination');
    pagin.innerHTML = '';

    // Pas besoin de pagination s'il n'y a qu'une seule page
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = "btn-brand";
        
        // CORRECTION 2 : Comparaison correcte entre l'index de la boucle et la page courante
        if (i === currentPage) {
            btn.style.opacity = "1";
            btn.style.fontWeight = "bold";
        } else {
            btn.style.opacity = "0.6";
        }
        
        btn.onclick = () => fetchTasks(i);
        pagin.appendChild(btn);
    }
}

// Initialisation des écouteurs
document.addEventListener('DOMContentLoaded', () => {
    const filterBtn = document.querySelector('.controls .btn-brand') || document.querySelector('.btn-brand'); 
    if (filterBtn) filterBtn.addEventListener('click', () => fetchTasks(1));
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') fetchTasks(1);
        });
    }

    fetchTasks(1);
});
