const express = require('express');
const { getBlogs, getBlog, getBlogCategories } = require('../services/blogService');

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (tag) filters.tag = tag;
    
    const blogs = await getBlogs(filters);
    res.json(blogs);
  } catch (error) {
    console.error('Blog fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getBlogCategories();
    res.json(categories);
  } catch (error) {
    console.error('Blog categories error:', error);
    res.status(500).json({ error: 'Failed to fetch blog categories' });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await getBlog(req.params.slug);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Blog fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

module.exports = router;