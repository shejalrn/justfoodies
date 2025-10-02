const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p>By using JustFoodies services, you agree to these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Description</h2>
            <p>JustFoodies is a cloud kitchen food delivery service. We prepare and deliver food to customers within our delivery areas. Orders must be placed through our website or mobile application.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Order Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders placed before 10:00 AM will be delivered the same day</li>
              <li>Orders placed after 10:00 AM will be delivered the next day</li>
              <li>Delivery is available within our specified service areas</li>
              <li>We reserve the right to cancel orders due to unavailability or other circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment is required at the time of order placement</li>
              <li>We accept cash on delivery and online payments</li>
              <li>All prices are inclusive of applicable taxes</li>
              <li>Refunds will be processed according to our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cancellation Policy</h2>
            <p>Orders can be cancelled within 30 minutes of placement. After preparation begins, orders cannot be cancelled. Refunds for cancelled orders will be processed within 5-7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
            <p>JustFoodies shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <p>For questions about these Terms of Service, contact us at infoatjustfood@gmail.com or +91 97678 56258.</p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService