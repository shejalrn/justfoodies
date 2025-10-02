import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ybaq07b6',
  dataset: 'production',
  token: 'skuB2wlKQnJB717JwxwJvJ9elpDcBge7s7sJIQJYz66fddiQK4atuuCMtuWPjmRr29leMPOPp3Ey2oA8QS36U2xOmqG2qs2A0GSsMa4spmT2F9qaWkuQjjhx3TDkx8IdbuSwKjnaLN7t63GLg82ODxCEpfMgsnSrzwcTcQDvxpUIk8thhMXN',
  useCdn: false
})

const categories = [
  {
    _type: 'category',
    name: 'Thali',
    slug: { current: 'thali' },
    position: 1,
    description: 'Complete traditional Indian meals'
  },
  {
    _type: 'category',
    name: 'Biryani',
    slug: { current: 'biryani' },
    position: 2,
    description: 'Aromatic rice dishes with spices'
  },
  {
    _type: 'category',
    name: 'PG Packs',
    slug: { current: 'pg-packs' },
    position: 3,
    description: 'Budget-friendly meal options'
  }
]

const menuItems = [
  {
    _type: 'menuItem',
    title: 'Veg Thali',
    slug: { current: 'veg-thali' },
    sku: 'VEG-THALI-001',
    description: 'Paneer Makhani, Mix Veg, Dal Tadka, Jeera Rice, Chapati, Salad & Pickle, Papad, Gulab Jamun',
    price: 250,
    isVeg: true,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'medium',
    tags: ['popular', 'traditional'],
    ingredients: ['Paneer', 'Mixed Vegetables', 'Dal', 'Rice', 'Chapati', 'Salad', 'Pickle', 'Papad', 'Gulab Jamun']
  },
  {
    _type: 'menuItem',
    title: 'Non-Veg Thali',
    slug: { current: 'non-veg-thali' },
    sku: 'NON-VEG-THALI-001',
    description: 'Chicken Masala, Jeera Rice, Chapati, Salad, Gulab Jamun',
    price: 350,
    isVeg: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium',
    tags: ['popular', 'traditional'],
    ingredients: ['Chicken', 'Rice', 'Chapati', 'Salad', 'Gulab Jamun']
  },
  {
    _type: 'menuItem',
    title: 'Veg Biryani',
    slug: { current: 'veg-biryani' },
    sku: 'VEG-BIRYANI-001',
    description: 'Aromatic basmati rice cooked with mixed vegetables and spices',
    price: 250,
    isVeg: true,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium',
    tags: ['popular', 'aromatic'],
    ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Biryani Spices', 'Saffron', 'Mint']
  },
  {
    _type: 'menuItem',
    title: 'Chicken Biryani',
    slug: { current: 'chicken-biryani' },
    sku: 'CHICKEN-BIRYANI-001',
    description: 'Aromatic basmati rice cooked with tender chicken and spices',
    price: 350,
    isVeg: false,
    isAvailable: true,
    preparationTime: 40,
    spiceLevel: 'medium',
    tags: ['popular', 'aromatic'],
    ingredients: ['Basmati Rice', 'Chicken', 'Biryani Spices', 'Saffron', 'Mint', 'Fried Onions']
  },
  {
    _type: 'menuItem',
    title: 'PG Pack - Rs 70',
    slug: { current: 'pg-pack-70' },
    sku: 'PG-PACK-70',
    description: '2 chapati + rice + dal + sabzi + salad + papad + pickle',
    price: 70,
    isVeg: true,
    isAvailable: true,
    preparationTime: 15,
    spiceLevel: 'mild',
    tags: ['budget', 'student-friendly'],
    ingredients: ['Chapati', 'Rice', 'Dal', 'Sabzi', 'Salad', 'Papad', 'Pickle']
  },
  {
    _type: 'menuItem',
    title: 'Regular Pack - Rs 120',
    slug: { current: 'regular-pack-120' },
    sku: 'PG-PACK-120',
    description: '3 paratha/chapatis + jeera rice + dal + 2 sabzis + papad + sweet',
    price: 120,
    isVeg: true,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'mild',
    tags: ['value', 'complete-meal'],
    ingredients: ['Paratha/Chapati', 'Jeera Rice', 'Dal', 'Sabzi', 'Papad', 'Sweet']
  }
]

async function seedData() {
  try {
    console.log('Creating categories...')
    const createdCategories = await Promise.all(
      categories.map(category => client.create(category))
    )
    
    console.log('Categories created:', createdCategories.length)

    // Add category references to menu items
    const menuItemsWithCategories = menuItems.map(item => {
      let categoryRef
      if (item.title.includes('Thali')) {
        categoryRef = createdCategories.find(cat => cat.name === 'Thali')._id
      } else if (item.title.includes('Biryani')) {
        categoryRef = createdCategories.find(cat => cat.name === 'Biryani')._id
      } else if (item.title.includes('Pack')) {
        categoryRef = createdCategories.find(cat => cat.name === 'PG Packs')._id
      }

      return {
        ...item,
        category: {
          _type: 'reference',
          _ref: categoryRef
        }
      }
    })

    console.log('Creating menu items...')
    const createdMenuItems = await Promise.all(
      menuItemsWithCategories.map(item => client.create(item))
    )

    console.log('Menu items created:', createdMenuItems.length)
    console.log('Sanity seed data created successfully!')

  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seedData()