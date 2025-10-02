import { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../utils/CartContext'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isVegOnly, setIsVegOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { addItem } = useCart()

  const { data: categories } = useQuery('sanity-categories', () =>
    api.get('/api/sanity/categories').then(res => res.data)
  )

  const { data: menuData, isLoading } = useQuery(
    ['sanity-menu-items', selectedCategory, isVegOnly, searchTerm],
    () => {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (isVegOnly) params.append('isVeg', 'true')
      if (searchTerm) params.append('search', searchTerm)
      
      return api.get(`/api/sanity/menu-items?${params}`).then(res => res.data)
    }
  )

  const handleAddToCart = (item) => {
    addItem(item)
    toast.success(`${item.title} added to cart!`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading menu...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Menu - JustFoodies"
        description="Browse our delicious menu with authentic Indian cuisine. Veg and non-veg options available with fresh ingredients and traditional recipes."
        keywords="menu, indian food, veg food, non veg food, thali, biryani, curry, roti, rice, pune food delivery"
      />
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isVegOnly}
              onChange={(e) => setIsVegOnly(e.target.checked)}
              className="rounded"
            />
            <span>Veg Only</span>
          </label>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === '' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories?.map(category => {
            const categorySlug = category.slug?.current || category.slug || category._id;
            return (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(categorySlug)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === categorySlug
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuData?.items?.map(item => {
          const itemSlug = item.slug?.current || item.slug || item._id;
          return (
            <div key={item._id} className="card">
              <Link to={`/product/${itemSlug}`}>
                <div className="h-48 bg-gray-200 rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        console.log('Image failed to load:', item.image);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg" style={{display: item.image ? 'none' : 'flex'}}>
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🍽️</div>
                      <div className="text-sm">{item.title}</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="flex justify-between items-start mb-2">
                <Link to={`/product/${itemSlug}`}>
                  <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">{item.title}</h3>
                </Link>
              <span className={`px-2 py-1 rounded text-sm ${
                item.isVeg 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">₹{item.price}</span>
              <button
                onClick={() => handleAddToCart({
                  id: item._id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                  isVeg: item.isVeg
                })}
                className="btn-primary flex items-center space-x-1"
                disabled={!item.isAvailable}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            
              {!item.isAvailable && (
                <div className="mt-2 text-red-500 text-sm">Currently unavailable</div>
              )}
            </div>
          );
        })}
      </div>

      {menuData?.items?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No items found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Menu