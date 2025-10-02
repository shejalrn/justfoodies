const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-text mb-8">Shipping & Delivery Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Delivery Areas</h2>
          <p className="text-gray-700 mb-4">
            We currently deliver to the following areas in Pune:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Lohegaon</li>
            <li>Wagholi</li>
            <li>Kharadi</li>
            <li>Viman Nagar (especially DY Patil College area)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Delivery Charges</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-semibold">FREE DELIVERY on all orders!</p>
          </div>
          <p className="text-gray-700">
            We offer complimentary delivery to all our service areas with no minimum order value.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Delivery Timings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Same Day Delivery</h3>
              <p className="text-blue-700">Orders placed before 10:00 AM will be delivered the same day</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Next Day Delivery</h3>
              <p className="text-orange-700">Orders placed after 10:00 AM will be delivered the next day</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Delivery Process</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h4 className="font-semibold text-text">Order Confirmation</h4>
                <p className="text-gray-700">Your order is confirmed and payment is processed</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h4 className="font-semibold text-text">Preparation</h4>
                <p className="text-gray-700">Our chefs start preparing your fresh meal</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h4 className="font-semibold text-text">Quality Check</h4>
                <p className="text-gray-700">Food is packed with care and quality checked</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <h4 className="font-semibold text-text">Out for Delivery</h4>
                <p className="text-gray-700">Your order is dispatched for delivery</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">5</div>
              <div>
                <h4 className="font-semibold text-text">Delivered</h4>
                <p className="text-gray-700">Fresh, hot food delivered to your doorstep</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Order Tracking</h2>
          <p className="text-gray-700 mb-4">
            Track your order in real-time using your order number. You'll receive updates at each stage of preparation and delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Delivery Guidelines</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Please ensure someone is available to receive the order at the delivery address</li>
            <li>Provide accurate contact details and delivery address</li>
            <li>Our delivery partner will call you before reaching your location</li>
            <li>Food will be delivered in hygienic, sealed packaging</li>
            <li>In case of any issues, contact us immediately at +91 97678 56258</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Contact for Delivery Issues</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> +91 97678 56258
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> infoatjustfood@gmail.com
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> Sr no 99, Plot No.90 Lane No.8A, Seven Hills residence, nirgundi road, Lohegaon, Pune - 411047
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ShippingPolicy