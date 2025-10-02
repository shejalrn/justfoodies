import { Building, Users, Calendar, CheckCircle } from 'lucide-react'

const Corporate = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Corporate Catering</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Elevate your corporate events, meetings, and office meals with our premium catering services. 
            Fresh, delicious, and professionally delivered.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Corporate Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Office Meals</h3>
              <p className="text-gray-600">
                Daily meal solutions for your office. Healthy, fresh, and delivered on time.
              </p>
            </div>
            <div className="card text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Event Catering</h3>
              <p className="text-gray-600">
                Corporate events, conferences, and meetings. Customized menus for any occasion.
              </p>
            </div>
            <div className="card text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Bulk Orders</h3>
              <p className="text-gray-600">
                Large quantity orders with special pricing. Perfect for team lunches and parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Us for Corporate Catering?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Reliable Delivery</h4>
                    <p className="text-gray-600">On-time delivery guaranteed for all corporate orders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Customized Menus</h4>
                    <p className="text-gray-600">Tailored menus to suit dietary preferences and budgets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Volume Discounts</h4>
                    <p className="text-gray-600">Special pricing for bulk orders and regular clients</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Professional Service</h4>
                    <p className="text-gray-600">Dedicated account manager for seamless coordination</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <img 
                src="/catering-corp.png" 
                alt="Corporate Catering" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2RmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZmlsbD0iIzRiYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvcnBvcmF0ZSBDYXR0ZXJpbmc8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkp1c3RGb29kaWVzPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Corporate Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Basic Package</h3>
              <div className="text-3xl font-bold text-primary mb-4">₹150<span className="text-sm text-gray-600">/person</span></div>
              <ul className="space-y-2 mb-6">
                <li>• Main course + Rice</li>
                <li>• Bread (2 pieces)</li>
                <li>• Salad & Pickle</li>
                <li>• Minimum 20 orders</li>
              </ul>
              <button className="btn-primary w-full">Choose Package</button>
            </div>
            <div className="card border-2 border-primary">
              <div className="bg-primary text-white px-3 py-1 rounded-full text-sm w-fit mb-4">Most Popular</div>
              <h3 className="text-xl font-semibold mb-4">Premium Package</h3>
              <div className="text-3xl font-bold text-primary mb-4">₹250<span className="text-sm text-gray-600">/person</span></div>
              <ul className="space-y-2 mb-6">
                <li>• Complete Thali</li>
                <li>• 2 Main courses</li>
                <li>• Rice + Bread</li>
                <li>• Dessert included</li>
                <li>• Minimum 15 orders</li>
              </ul>
              <button className="btn-primary w-full">Choose Package</button>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Executive Package</h3>
              <div className="text-3xl font-bold text-primary mb-4">₹350<span className="text-sm text-gray-600">/person</span></div>
              <ul className="space-y-2 mb-6">
                <li>• Premium Thali</li>
                <li>• 3 Main courses</li>
                <li>• Biryani + Bread</li>
                <li>• Dessert + Beverage</li>
                <li>• Minimum 10 orders</li>
              </ul>
              <button className="btn-primary w-full">Choose Package</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our corporate catering team to discuss your requirements and get a customized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Call Us: +91 97678 56258
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Corporate