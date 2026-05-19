*feature/filtrage — Filtrage, recherche et pagination

Moteur de recherche et navigation pour filtrer les tâches d'un projet depuis l'interface.

*Technique & API

**Route** : `GET /api/projects/:id/tasks` (avec paramètres *query params*).

**Recherche** : Recherche textuelle par mot-clé avec `$regex` (option `i` insensible à la casse).

**Filtres dynamiques** : Filtrage conditionnel Mongoose par statut, priorité et membre assigné.

**Pagination & UI** : Réponse JSON (`data`, `total`, `page`, `totalPages`) pour piloter les contrôles de navigation.
