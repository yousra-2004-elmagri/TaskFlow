// OPTIONNEL : Déscommentez et modifiez la ligne ci-dessous si votre API tourne sur un autre port (ex: 3000)
axios.defaults.baseURL = 'http://localhost:3000';

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // Vérification de la présence du jeton d'authentification
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Appel à l'API avec le jeton dans les en-têtes
        const res = await axios.get('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const { stats, tasks } = res.data;

        // CORRECTION : Sécurisation de l'affichage des compteurs (évite les plantages si l'API renvoie null)
        document.getElementById('stat-projects').innerText = stats?.activeProjects ?? 0;
        document.getElementById('stat-assigned').innerText = stats?.assignedTasks ?? 0;
        document.getElementById('stat-completed').innerText = stats?.completedTasks ?? 0;
        document.getElementById('stat-late').innerText = stats?.lateTasks ?? 0;

        const container = document.getElementById('priority-container');
        
        // CORRECTION : Vérification stricte de l'existence du tableau de tâches
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p style="color: #888; padding:20px 0;">Aucune priorité urgente pour le moment.</p>';
            return;
        }

        // Génération propre du HTML pour chaque tâche
        container.innerHTML = tasks.map(t => {
            // CORRECTION : Gestion sécurisée de la priorité (évite l'erreur .toUpperCase() sur une valeur indéfinie)
            const priorityText = t.priority ? String(t.priority).toLowerCase() : 'normale';
            const isUrgent = priorityText === 'haute' || priorityText === 'urgent';

            // CORRECTION : Gestion sécurisée du formatage de la date
            const dateFormatted = t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : 'Pas de date';

            return `
                <div class="task-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="font-weight:700;">${t.title || 'Sans titre'}</span>
                    <span class="badge ${isUrgent ? 'urgent' : ''}">${priorityText.toUpperCase()}</span>
                    <span style="color: #888;">${dateFormatted}</span>
                </div>
            `;
        }).join('');

         // 4. CRÉATION DU GRAPHIQUE ANIMÉ (CHART.JS)
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Graphique en barres verticales
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Tâches terminées',
                data: [3, 5, 2, 8, 4, 1, 0], // Vos fausses données pour la semaine
                backgroundColor: '#05CD99',  // Couleur verte identique à votre compteur "Terminées"
                borderRadius: 6,             // Coins arrondis sur les barres
                borderSkipped: false
            }]
 },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Cache le texte inutile en haut
            },
            scales: {
                x: { grid: { display: false } }, // Enlève les lignes de fond verticales
                y: { 
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' } // Lignes de fond horizontales très claires
                }
            },
             animation: {
                duration: 1200, // Durée de l'animation en millisecondes (1.2 seconde)
                easing: 'easeOutQuart' // Effet fluide d'apparition
            }
        }
    });

    } catch (err) {
        // Log détaillé dans la console pour vous aider à débugger l'API
        console.error("Erreur lors de la récupération des données du dashboard :", err);
        alert("Impossible de charger le tableau de bord. Vérifiez que votre serveur API est démarré.");
    }
});

