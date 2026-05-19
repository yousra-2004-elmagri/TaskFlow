const validateTask = (req, res, next) => {
  const { title, priority, status } = req.body;

  const validPriorities = ["basse", "moyenne", "haute"];
  const validStatuses = ["à faire", "en cours", "terminé"];

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Le titre est obligatoire" });
  }

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: "Priorité invalide" });
  }

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  next();
};

module.exports = validateTask;