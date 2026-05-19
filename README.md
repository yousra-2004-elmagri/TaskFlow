* feature/dashboard — Tableau de bord personnel
Espace analytique résumant l'activité de l'utilisateur connecté sur TaskFlow.

* Technique & API
**Route** : `GET /api/dashboard` (un seul appel Axios au chargement).
**Back-end** : Pipeline d'agrégation MongoDB (`$match`, `$group`, `$count`).
**Tri des tâches** : Priorité décroissante, puis date limite croissante.
**Calcul du retard** : Date limite dépassée ET statut différent de "terminé".
