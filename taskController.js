const Task = require('../models/Task');

exports.getProjectTasks = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { status, priority, search, page = 1, limit = 5 } = req.query;

        let query = { assignedTo: userId }; 

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
          
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email') 
            .sort({ createdAt: -1 })             
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: tasks,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    }