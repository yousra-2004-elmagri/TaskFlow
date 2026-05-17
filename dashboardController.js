const mongoose = require('mongoose');
const Task = require('../models/Task'); 


exports.getDashboardStats = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const stats = await Task.aggregate([
            
        
            {
                $match: { assignedTo: new mongoose.Types.ObjectId(userId) }
            },

          
            {
                $facet: {
                    totalTasks: [
                        { $count: "count" }
                    ],
                    
                    completedTasks: [
                        { $match: { status: "terminé" } },
                        { $count: "count" }
                    ],
                  
                    lateTasks: [
                        { 
                            $match: { 
                                status: { $ne: "terminé" }, 
                                dueDate: { $lt: new Date() } 
                            } 
                        },
                        { $count: "count" }
                    ],

                    recentHighPriority: [
                        { $match: { priority: "haute", status: { $ne: "terminé" } } },
                        { $sort: { dueDate: 1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ]);

      
        const result = stats[0];

        const dashboardData = {
            total: result.totalTasks[0]?.count || 0,
            completed: result.completedTasks[0]?.count || 0,
            late: result.lateTasks[0]?.count || 0,
            recentTasks: result.recentHighPriority || []
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error("Erreur Dashboard Aggregation:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques du tableau de bord."
        });
    }
};