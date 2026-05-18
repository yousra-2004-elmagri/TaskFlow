const mongoose = require('mongoose');
const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Task.aggregate([
            { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
            {
                $facet: {
                    stats: [
                        {
                            $group: {
                                _id: null,
                                totalAssigned: { $sum: 1 },
                                completed: { 
                                    $sum: { $cond: [{ $eq: ["$status", "terminé"] }, 1, 0] } 
                                },
                                late: { 
                                    $sum: { 
                                        $cond: [
                                            { 
                                                $and: [
                                                    { $ne: ["$status", "terminé"] },
                                                    { $lt: ["$dueDate", new Date()] }
                                                ]
                                            }, 
                                            1, 
                                            0
                                        ] 
                                    }
                                }
                            }
                        }
                    ],
                    priorityTasks: [
                        { 
                            $match: { 
                                priority: "haute", 
                                status: { $ne: "terminé" } 
                            } 
                        },
                        { $sort: { dueDate: 1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ]);

        const result = stats[0] || {};
        const statData = result.stats?.[0] || {};

        res.status(200).json({
            success: true,
            stats: {
                activeProjects: 3, 
                assignedTasks: statData.totalAssigned || 0,
                completedTasks: statData.completed || 0,
                lateTasks: statData.late || 0
            },
            tasks: result.priorityTasks || []
        });

    } catch (error) {
        console.error("Erreur Dashboard:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques."
        });
    }
};