const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

const getBlogs = async (filters = {}) => {
  let query = `*[_type == "blog"`;
  
  if (filters.category) {
    query += ` && category == "${filters.category}"`;
  }
  
  if (filters.tag) {
    query += ` && "${filters.tag}" in tags`;
  }
  
  query += `] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "featuredImage": featuredImage.asset->url,
    category,
    tags,
    author,
    publishedAt,
    seo
  }`;
  
  return await client.fetch(query);
};

const getBlog = async (slug) => {
  const query = `*[_type == "blog" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    "featuredImage": featuredImage.asset->url,
    category,
    tags,
    author,
    publishedAt,
    seo
  }`;
  return await client.fetch(query);
};

const getBlogCategories = async () => {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    category
  }`;
  const blogs = await client.fetch(query);
  const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
  return categories;
};

module.exports = {
  getBlogs,
  getBlog,
  getBlogCategories
};