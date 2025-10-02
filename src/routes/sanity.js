const express = require('express');
const { getCategories, getMenuItems, getMenuItem } = require('../services/sanityService');

const router = express.Router();

// Get categories from Sanity
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Sanity categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories from Sanity' });
  }
});

// Get menu items from Sanity
router.get('/menu-items', async (req, res) => {
  try {
    const { category, isVeg, search } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (isVeg !== undefined) filters.isVeg = isVeg === 'true';
    if (search) filters.search = search;
    
    const items = await getMenuItems(filters);
    res.json({ items });
  } catch (error) {
    console.error('Sanity menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items from Sanity' });
  }
});

// Get single menu item from Sanity
router.get('/menu-items/:slug', async (req, res) => {
  try {
    const item = await getMenuItem(req.params.slug);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Sanity menu item error:', error);
    res.status(500).json({ error: 'Failed to fetch menu item from Sanity' });
  }
});

module.exports = router;