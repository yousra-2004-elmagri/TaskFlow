const fetchTasks = async (page = 1) => {
    const token = localStorage.getItem('token');
    const search = document.getElementById('search-input').value; 
    const status = document.getElementById('filter-status').value; 

    try {
       const res = await axios.get('/api/tasks/my-tasks', { 
    headers: { 'Authorization': `Bearer ${token}` },
    params: { page, limit: 5, search, status } 
});

        const { data, totalPages, page: currentPage } = res.data; 

        const list = document.getElementById('tasks-container');
        list.innerHTML = data.map(t => `
            <div class="task-row">
                <div>
                    <div style="font-weight:700;">${t.title}</div>
                    <div style="font-size:12px; color:var(--gray-400);">${t.description || ''}</div>
                </div>
                <span class="badge" style="background:var(--bg-main)">${t.status}</span>
            </div>
        `).join('');

        const pagin = document.getElementById('pagination');
        pagin.innerHTML = '';
        for(let i=1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = "btn-brand";
            if (i !== currentPage) btn.style.opacity = "0.4";
            btn.onclick = () => fetchTasks(i);
            pagin.appendChild(btn);
        }
    } catch (err) { console.error(err); }
};

document.getElementById('filter-btn').addEventListener('click', () => fetchTasks(1));
window.onload = () => fetchTasks(1);