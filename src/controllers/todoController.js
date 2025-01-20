const Todo = require('../models/Todo');
const createResponse = (success, message, data = null) => ({ success, message, data });

// Get all todos with pagination
exports.getTodos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; 
        const todos = await Todo.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (!todos.length) {
            return res.status(404).json(createResponse(false, 'No todos found'));
        }

        const total = await Todo.countDocuments();
        res.status(200).json(createResponse(true, 'Todos retrieved successfully', { todos, total, page, limit }));
    } catch (error) {
        res.status(500).json(createResponse(false, 'Server error', error.message));
    }
};

// Create a new todo
exports.createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json(createResponse(false, 'Title is required'));
        }

        // Check for duplicate
        const existingTodo = await Todo.findOne({ title });
        if (existingTodo) {
            return res.status(400).json(createResponse(false, 'Todo with this title already exists'));
        }

        const newTodo = new Todo({ title });
        await newTodo.save();
        res.status(201).json(createResponse(true, 'Todo created successfully', newTodo));
    } catch (error) {
        res.status(400).json(createResponse(false, 'Failed to create todo', error.message));
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        // Check for duplicate title
        if (title) {
            const existingTodo = await Todo.findOne({ title });
            if (existingTodo && existingTodo._id.toString() !== id) {
                return res.status(400).json(createResponse(false, 'Another todo with this title already exists'));
            }
        }

        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTodo) {
            return res.status(404).json(createResponse(false, 'Todo not found'));
        }

        res.status(200).json(createResponse(true, 'Todo updated successfully', updatedTodo));
    } catch (error) {
        res.status(400).json(createResponse(false, 'Failed to update todo', error.message));
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json(createResponse(false, 'Todo not found'));
        }
        res.status(200).json(createResponse(true, 'Todo deleted successfully'));
    } catch (error) {
        res.status(500).json(createResponse(false, 'Failed to delete todo', error.message));
    }
};
