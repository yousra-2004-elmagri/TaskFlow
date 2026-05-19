const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tasks/my-tasks', (req, res) => {
    res.json({
        data: fakeTasks,
        totalPages: 1,
        page: 1
    });
});

app.get('/api/dashboard', async (req, res) => {
    try {
       
        const stats = await db.getProjectStats();
        const activeTasks = await db.getUpcomingTasks();

        res.json({
            success: true,
            stats: {
                activeProjects: stats.activeProjects,
                assignedTasks: stats.assignedTasks,
                completedTasks: stats.completedTasks,
                lateTasks: stats.lateTasks
            },
            tasks: activeTasks.map(task => ({
                title: task.title,
                priority: task.priority,
                dueDate: task.dueDate 
            }))
        });

    } catch (error) {
        console.error("Erreur de récupération des données:", error);
        res.status(500).json({ 
            success: false, 
            message: "Impossible de charger les données du tableau de bord." 
        });
    }
});

app.get('/api/dashboard/charts', async (req, res) => {
    try {
       
        const tasksByPriority = await db.getTasksCountByPriority(); 
        const monthlyCompletion = await db.getMonthlyCompletedTasks(); 

        res.json({
            success: true,
            priorityChart: {
                labels: ["Haute", "Moyenne", "Basse"],
                datasets: [
                    {
                        label: "Nombre de tâches",
                        data: [
                            tasksByPriority.haute, 
                            tasksByPriority.moyenne, 
                            tasksByPriority.basse
                        ],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] // Couleurs pour le front-end
                    }
                ]
            },
        
            evolutionChart: {
                labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
                datasets: [
                    {
                        label: "Tâches terminées",
                        data: monthlyCompletion,
                        borderColor: "#4BC0C0",
                        fill: false
                    }
                ]
            }
        });

    } catch (error) {
        console.error("Erreur graphiques:", error);
        res.status(500).json({ success: false, message: "Erreur de chargement des graphiques." });
    }
});


app.listen(PORT, () => {
    console.log(`Serveur démarré avec succès sur http://localhost:${PORT}`);
});
