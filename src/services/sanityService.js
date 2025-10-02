const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'ybaq07b6',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

const builder = imageUrlBuilder(client);
const urlFor = (source) => {
  if (!source) return null;
  return builder.image(source).auto('format').fit('max');
};

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
    image
  }`;
  const categories = await client.fetch(query);
  return categories.map(cat => ({
    ...cat,
    image: cat.image ? urlFor(cat.image).width(400).height(300).url() : null
  }));
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
    image,
    gallery,
    "category": category->{name, slug}
  }`;
  
  const items = await client.fetch(query);
  return items.map(item => ({
    ...item,
    image: item.image ? urlFor(item.image).width(600).height(400).url() : null,
    gallery: item.gallery ? item.gallery.map(img => urlFor(img).width(800).height(600).url()) : []
  }));
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
    image,
    gallery,
    "category": category->{name, slug}
  }`;
  const item = await client.fetch(query);
  if (!item) return null;
  
  return {
    ...item,
    image: item.image ? urlFor(item.image).width(800).height(600).url() : null,
    gallery: item.gallery ? item.gallery.map(img => urlFor(img).width(1200).height(800).url()) : []
  };
};

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItem
};