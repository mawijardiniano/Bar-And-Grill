const express = require('express')
const router = express.Router();
const { getCategory, addCategory, editCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', getCategory);
router.post('/', addCategory);
router.put('/:id', editCategory);
router.delete('/:id', deleteCategory);

module.exports = router;