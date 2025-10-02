import { Link } from 'react-router-dom'
import { Clock, Star, Truck, Plus } from 'lucide-react'
import { useQuery } from 'react-query'
import api from '../utils/api'
import { useCart } from '../utils/CartContext'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'

const Home = () => {
  const { addItem } = useCart()

  const { data: popularItems } = useQuery(
    'popular-items',
    () => api.get('/api/sanity/menu-items?limit=3').then(res => res.data.items)
  )

  const handleAddToCart = (item) => {
    addItem({
      id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg
    })
    toast.success(`${item.title} added to cart!`)
  }
  return (
    <div>
      <SEO 
        title="JustFoodies - Cloud Kitchen | Fresh Food Delivery in Pune"
        description="Order fresh, delicious food from JustFoodies Cloud Kitchen. Fast delivery in Pune with authentic flavors and quality ingredients. Free delivery available."
        keywords="cloud kitchen pune, food delivery pune, online food order, fresh food, home delivery, indian food, veg food, non veg food, lohegaon, wagholi, kharadi, viman nagar"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh] py-12 lg:py-20">
            {/* Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                Delicious Food,<br className="hidden sm:block" /> 
                <span className="text-primary">Delivered Fresh</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0 opacity-90">
                Experience authentic Indian cuisine from our cloud kitchen. 
                Fresh ingredients, traditional recipes, and modern convenience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/menu" className="bg-accent hover:bg-accent/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-colors">
                  Order Now
                </Link>
                <Link to="/corporate" className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-colors">
                  Corporate Catering
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 lg:mt-12">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                  <div className="text-xs md:text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">30min</div>
                  <div className="text-xs md:text-sm opacity-80">Avg Delivery</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">4.8★</div>
                  <div className="text-xs md:text-sm opacity-80">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/hero-food.jpg" 
                    alt="Delicious Indian Food"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2RmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzRiYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkp1c3RGb29kaWVzPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNkZTkyNWIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZWxpY2lvdXMgRm9vZDwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RGVsaXZlcmVkIEZyZXNoPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white text-primary p-3 md:p-4 rounded-xl shadow-lg hidden sm:block">
                  <div className="text-lg md:text-xl font-bold">₹70</div>
                  <div className="text-xs md:text-sm">Starting from</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 md:p-4 rounded-xl shadow-lg hidden sm:block">
                  <div className="text-lg md:text-xl font-bold">FREE</div>
                  <div className="text-xs md:text-sm">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JustFoodies?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick preparation and delivery within 30-45 minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">Fresh ingredients and authentic recipes for the best taste</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your order status in real-time from kitchen to doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">We Deliver To</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Current Delivery Areas</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Lohegaon</li>
                    <li>• Wagholi</li>
                    <li>• Kharadi</li>
                    <li>• Viman Nagar</li>
                    <li className="bg-primary/10 px-2 py-1 rounded font-semibold text-primary">• DY Patil College, Viman Nagar ⭐</li>
                    <li>• Kalyani Nagar</li>
                    <li>• Koregaon Park</li>
                    <li>• Hadapsar</li>
                    <li>• Mundhwa</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Same Day Delivery</h3>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Order before 10:00 AM</strong> for same day delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Orders placed after 10 AM will be delivered the next day
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>• Delivery Time: 12:00 PM - 2:00 PM</p>
                    <p className="text-green-600 font-semibold">• FREE Delivery - No charges!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Items</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {popularItems?.map(item => (
              <div key={item._id} className="card">
                <Link to={`/product/${item.slug.current}`}>
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/product/${item.slug.current}`}>
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
                    onClick={() => handleAddToCart(item)}
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
            )) || (
              // Fallback while loading
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/menu" className="btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">RS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rajesh Sharma</h4>
                  <p className="text-sm text-gray-600">Software Engineer, Pune</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "Amazing food quality! The veg thali reminds me of home-cooked meals. 
                Delivery is always on time and the packaging is excellent."
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">PK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Priya Kulkarni</h4>
                  <p className="text-sm text-gray-600">Student, DY Patil College</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "Perfect for students! The PG pack is so affordable and filling. 
                Tastes just like ghar ka khana. Highly recommend to all my friends!"
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">AM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Amit Mehta</h4>
                  <p className="text-sm text-gray-600">Business Owner, Kharadi</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "Ordered for office lunch multiple times. The chicken biryani is 
                outstanding! Great service for corporate orders. Keep it up!"
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 bg-primary/10 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-primary">4.8/5</span>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home