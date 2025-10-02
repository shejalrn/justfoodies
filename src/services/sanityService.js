const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Test connection
client.fetch('*[_type == "category"][0]')
  .then(() => console.log('✅ Sanity connection successful'))
  .catch(err => console.error('❌ Sanity connection failed:', err.message));

const getCategories = async () => {
  const query = `*[_type == "category"] | order(position asc) {
    _id,
    name,
    slug,
    position,
    description,
    "image": image.asset->url
  }`;
  return await client.fetch(query);
};

const getMenuItems = async (filters = {}) => {
  let query = `*[_type == "menuItem" && isAvailable == true`;
  
  if (filters.category) {
    query += ` && category->slug.current == "${filters.category}"`;
  }
  
  if (filters.isVeg !== undefined) {
    query += ` && isVeg == ${filters.isVeg}`;
  }
  
  if (filters.search) {
    query += ` && (title match "${filters.search}*" || description match "${filters.search}*")`;
  }
  
  query += `] | order(_createdAt desc) {
    _id,
    title,
    slug,
    sku,
    description,
    price,
    isVeg,
    isAvailable,
    preparationTime,
    spiceLevel,
    tags,
    ingredients,
    allergens,
    nutritionInfo,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    "category": category->{name, slug}
  }`;
  
  return await client.fetch(query);
};

const getMenuItem = async (slug) => {
  const query = `*[_type == "menuItem" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    sku,
    description,
    price,
    isVeg,
    isAvailable,
    preparationTime,
    spiceLevel,
    tags,
    ingredients,
    allergens,
    nutritionInfo,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    "category": category->{name, slug}
  }`;
  return await client.fetch(query);
};

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItem
};