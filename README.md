### 🔍 Fonctionnalité 6 — Filtrage, recherche et pagination

Implémentation d'un système de recherche et de pagination dynamique pour les tâches de l'utilisateur.

*   **Backend (`taskRoutes.js`, `taskController.js`)** :
    *   Route sécurisée `GET /api/tasks/my-tasks` (avec JWT).
    *   Recherche par mot-clé dans `title` et `description` via `$regex` et `$or`.
    *   Filtre optionnel par statut (`à faire`, `en cours`, `terminé`).
    *   Pagination Mongoose optimisée avec `.skip()` et `.limit()`.
    *   Retour JSON standardisé (`data`, `total`, `page`, `totalPages`).

*   **Frontend (`filtrage.html`, `filtrage.js`)** :
    *   Interface avec barre de recherche, filtre par statut et boutons de page.
    *   Requêtes asynchrones complexes gérées avec **Axios** (Query Params).
    *   Rendu dynamique de la liste des tâches et gestion du bouton de page actif.
    *   Déclenchement automatique au chargement et lors de l'appui sur `Entrée`.
