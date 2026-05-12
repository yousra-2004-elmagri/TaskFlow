const Activity = require ('../models/Activity');
exports.getActivitiesByProject = async (req, res) => {
     try { 
        const {projectId} = req.params;
        const activities = await Activity.find({ projet: projectId })
    .populate('utilisateur', 'name email')
    .sort({timestamp: -1});
    res.status(200).json(activities);
} catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique", error});
}
};