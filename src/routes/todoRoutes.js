const express = require('express');
const {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');
const { verifyToken } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.use(verifyToken); 

router.get('/', getTodos); 
router.post('/', createTodo); 
router.put('/:id', updateTodo); 
router.delete('/:id', deleteTodo); 

module.exports = router;
