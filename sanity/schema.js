// Sanity Schema for JustFoodies CMS
// This file defines the content structure for Sanity Studio

export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    },
    {
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'Display order (lower numbers appear first)'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }
  ],
  orderings: [
    {
      title: 'Position',
      name: 'positionAsc',
      by: [
        { field: 'position', direction: 'asc' }
      ]
    }
  ]
}

export const menuItem = {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit - unique identifier'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }]
    },
    {
      name: 'price',
      title: 'Price (₹)',
      type: 'number'
    },
    {
      name: 'isVeg',
      title: 'Vegetarian',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of main ingredients'
    },
    {
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dairy', value: 'dairy' },
          { title: 'Nuts', value: 'nuts' },
          { title: 'Gluten', value: 'gluten' },
          { title: 'Soy', value: 'soy' },
          { title: 'Eggs', value: 'eggs' }
        ]
      }
    },
    {
      name: 'nutritionInfo',
      title: 'Nutrition Information',
      type: 'object',
      fields: [
        {
          name: 'calories',
          title: 'Calories',
          type: 'number'
        },
        {
          name: 'protein',
          title: 'Protein (g)',
          type: 'number'
        },
        {
          name: 'carbs',
          title: 'Carbohydrates (g)',
          type: 'number'
        },
        {
          name: 'fat',
          title: 'Fat (g)',
          type: 'number'
        }
      ]
    },
    {
      name: 'preparationTime',
      title: 'Preparation Time (minutes)',
      type: 'number'
    },
    {
      name: 'spiceLevel',
      title: 'Spice Level',
      type: 'string',
      options: {
        list: [
          { title: 'Mild', value: 'mild' },
          { title: 'Medium', value: 'medium' },
          { title: 'Hot', value: 'hot' },
          { title: 'Extra Hot', value: 'extra-hot' }
        ]
      }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Popular', value: 'popular' },
          { title: 'New', value: 'new' },
          { title: 'Healthy', value: 'healthy' },
          { title: 'Comfort Food', value: 'comfort-food' },
          { title: 'Traditional', value: 'traditional' },
          { title: 'Fusion', value: 'fusion' }
        ]
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'image',
      isVeg: 'isVeg',
      isAvailable: 'isAvailable'
    },
    prepare(selection) {
      const { title, price, media, isVeg, isAvailable } = selection
      return {
        title: title,
        subtitle: `₹${price} • ${isVeg ? '🟢 Veg' : '🔴 Non-Veg'} • ${isAvailable ? '✅ Available' : '❌ Unavailable'}`,
        media: media
      }
    }
  }
}

export const addon = {
  name: 'addon',
  title: 'Add-on',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'price',
      title: 'Price (₹)',
      type: 'number'
    },
    {
      name: 'isVeg',
      title: 'Vegetarian',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'categories',
      title: 'Available for Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ]
    }
  ]
}

export const special = {
  name: 'special',
  title: 'Special Offer',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage', value: 'percentage' },
          { title: 'Fixed Amount', value: 'fixed' }
        ]
      }
    },
    {
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number'
    },
    {
      name: 'minOrderAmount',
      title: 'Minimum Order Amount',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime'
    },
    {
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    }
  ]
}

export const blog = {
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Recipes', value: 'recipes'},
          {title: 'Food Tips', value: 'food-tips'},
          {title: 'Health & Nutrition', value: 'health-nutrition'},
          {title: 'Company News', value: 'company-news'}
        ]
      }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'JustFoodies Team'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60)
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160)
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      subtitle: 'category'
    }
  }
}

// Export schema types
export const schemaTypes = [category, menuItem, addon, special, blog]