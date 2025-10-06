import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowLeft, Plus, Clock, Users, Star } from 'lucide-react'
import api from '../utils/api'
import { useCart } from '../utils/CartContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem, getTotalItems } = useCart()
  const [quantity, setQuantity] = useState(1)

  const { data: item, isLoading } = useQuery(
    ['menu-item', slug],
    () => api.get(`/api/sanity/menu-items/${slug}`).then(res => res.data)
  )

  const handleAddToCart = () => {
    if (item) {
      const success = addItem({
        id: item._id,
        title: item.title,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg
      }, quantity)
      
      if (success) {
        toast.success(
          (t) => (
            <div className="flex items-center justify-between w-full">
              <span>{quantity}x {item.title} added to cart</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  navigate('/cart')
                }}
                className="bg-white text-primary px-2 py-1 rounded text-xs font-medium ml-3"
              >
                View Cart ({getTotalItems()})
              </button>
            </div>
          ),
          {
            duration: 4000
          }
        )
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <button onClick={() => navigate('/menu')} className="btn-primary">
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/menu')}
        className="flex items-center space-x-2 text-primary hover:text-primary/80 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Menu</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4">
            {item?.image ? (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <img 
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" 
                  alt={item?.title || 'Food item'}
                  className="w-full h-full object-cover rounded-lg opacity-50"
                />
              </div>
            )}
          </div>
          
          {/* Gallery */}
          {item.gallery && item.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {item.gallery.map((img, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded">
                  <img 
                    src={img} 
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.isVeg 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
            </span>
          </div>

          <p className="text-4xl font-bold text-primary mb-6">₹{item.price}</p>

          <p className="text-gray-600 mb-6">{item.description}</p>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {item.preparationTime && (
              <div className="flex items-center space-x-2">
                <Clock className="text-primary" size={20} />
                <span className="text-sm">{item.preparationTime} mins</span>
              </div>
            )}
            {item.spiceLevel && (
              <div className="flex items-center space-x-2">
                <Star className="text-primary" size={20} />
                <span className="text-sm capitalize">{item.spiceLevel} spice</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <div className="flex flex-wrap gap-1">
                {item.ingredients.map((ingredient, index) => (
                  <span key={index} className="text-sm text-gray-600">
                    {ingredient}{index < item.ingredients.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Allergens:</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Info */}
          {item.nutritionInfo && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Nutrition (per serving):</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {item.nutritionInfo.calories && (
                  <div>Calories: {item.nutritionInfo.calories}</div>
                )}
                {item.nutritionInfo.protein && (
                  <div>Protein: {item.nutritionInfo.protein}g</div>
                )}
                {item.nutritionInfo.carbs && (
                  <div>Carbs: {item.nutritionInfo.carbs}g</div>
                )}
                {item.nutritionInfo.fat && (
                  <div>Fat: {item.nutritionInfo.fat}g</div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="btn-primary flex items-center space-x-2 flex-1"
            >
              <Plus size={16} />
              <span>Add to Cart - ₹{item.price * quantity}</span>
            </button>
          </div>

          {!item.isAvailable && (
            <p className="text-red-500 text-sm mt-2">Currently unavailable</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail