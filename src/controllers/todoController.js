const Todo = require('../models/Todo');

// Get all todos
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new todo
exports.createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = new Todo({ title });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
