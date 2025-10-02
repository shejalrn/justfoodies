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

// Test Sanity connection
router.get('/test', async (req, res) => {
  try {
    const { createClient } = require('@sanity/client');
    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
      dataset: process.env.SANITY_DATASET || 'production',
      token: process.env.SANITY_TOKEN,
      useCdn: false,
      apiVersion: '2023-05-03'
    });
    
    // Check what data exists
    const allData = await client.fetch('*[_type in ["category", "menuItem"]][0...5] { _type, _id, title, image }');
    const categories = await client.fetch('*[_type == "category"][0...2]');
    const menuItems = await client.fetch('*[_type == "menuItem"][0...2] { _id, title, image, "imageUrl": image.asset->url }');
    
    res.json({ 
      status: 'success', 
      message: 'Sanity connection working',
      allData,
      categories,
      menuItems,
      dataCount: {
        categories: categories.length,
        menuItems: menuItems.length
      },
      config: {
        projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
        dataset: process.env.SANITY_DATASET || 'production',
        hasToken: !!process.env.SANITY_TOKEN
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack,
      config: {
        projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
        dataset: process.env.SANITY_DATASET || 'production',
        hasToken: !!process.env.SANITY_TOKEN
      }
    });
  }
});

module.exports = router;