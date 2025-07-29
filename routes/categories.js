import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
});

// POST /api/categories - Create new category (admin only)
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Error al crear categoría', error: error.message });
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Error al actualizar categoría', error: error.message });
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría desactivada correctamente' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
});

export default router;
