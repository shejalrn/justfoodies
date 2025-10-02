const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes your name, phone number, email address, delivery address, and payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your food orders</li>
              <li>Communicate with you about your orders</li>
              <li>Provide customer support</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with delivery partners to fulfill your orders and with payment processors to handle transactions securely.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Payment information is processed through secure, encrypted channels.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at infoatjustfood@gmail.com or call +91 97678 56258.</p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy