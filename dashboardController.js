const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project'); 

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const now = new Date();

        const totalAssignedResult = await Task.aggregate([
            { $match: { assignedTo: userObjectId } },
            { $count: "totalAssigned" }
        ]);
        const assignedTasks = totalAssignedResult[0]?.totalAssigned || 0;

       
        const detailedStats = await Task.aggregate([
            { $match: { assignedTo: userObjectId } },
            {
                $group: {
                    _id: null,
                    completed: { 
                        $sum: { $cond: [{ $eq: ["$status", "terminé"] }, 1, 0] } 
                    },
                    late: { 
                        $sum: { 
                            $cond: [
                                { 
                                    $and: [
                                        { $ne: ["$status", "terminé"] },
                                        { $lt: ["$dueDate", "$$NOW"] }
                                    ]
                                }, 
                                1, 
                                0
                            ] 
                        }
                    }
                }
            }
        ]);
        const completedTasks = detailedStats[0]?.completed || 0;
        const lateTasks = detailedStats[0]?.late || 0;

       
        const activeProjects = await Project.countDocuments({
            status: 'actif',
            $or: [{ owner: userObjectId }, { members: userObjectId }]
        });

       
        const activeTasks = await Task.find({ 
            assignedTo: userObjectId, 
            status: "en cours" 
        })
        .sort({ priority: -1, dueDate: 1 })
        .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                activeProjects, 
                assignedTasks,
                completedTasks,
                lateTasks
            },
            tasks: activeTasks
        });

    } catch (error) {
        console.error("Erreur Dashboard:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques."
        });
    }
};
