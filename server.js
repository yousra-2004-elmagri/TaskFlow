const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Autorise vos fichiers HTML locaux à interroger l'API
app.use(cors());
app.use(express.json());

// Simulation de base de données de tâches (Fausses données de test)
const fakeTasks = [
    { title: "Développer le Dashboard", description: "Finaliser l'intégration de Chart.js", status: "en cours" },
    { title: "Corriger les filtres JS", description: "Régler le bug de pagination", status: "à faire" },
    { title: "Tester la connexion API", description: "Vérifier le token de sécurité", status: "terminé" }
];

// Route demandée par votre fichier filtrage.js
app.get('/api/tasks/my-tasks', (req, res) => {
    // Renvoie les données attendues par votre script JS
    res.json({
        data: fakeTasks,
        totalPages: 1,
        page: 1
    });
});

// Lance le serveur sur le port 3000
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré avec succès sur http://localhost:${PORT}`);
});
