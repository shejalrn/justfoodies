const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Refund & Cancellation Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">Order Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders can be cancelled within 30 minutes of placement</li>
              <li>Once food preparation begins, orders cannot be cancelled</li>
              <li>You will receive a confirmation call before preparation starts</li>
              <li>Cancellation requests must be made through our customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Eligibility</h2>
            <p>Refunds are applicable in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Order cancelled within the allowed time frame</li>
              <li>Food quality issues reported within 2 hours of delivery</li>
              <li>Wrong items delivered</li>
              <li>Significant delivery delays (more than 2 hours from promised time)</li>
              <li>Order not delivered due to our operational issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refund requests must be raised within 24 hours of order placement</li>
              <li>Contact our customer support at +91 97678 56258 or infoatjustfood@gmail.com</li>
              <li>Provide order number and reason for refund</li>
              <li>Refunds will be processed to the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Timeline</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cash on Delivery: Refund within 5-7 business days via bank transfer</li>
              <li>Online Payments: Refund within 5-7 business days to original payment method</li>
              <li>Wallet/UPI: Refund within 1-3 business days</li>
              <li>Credit/Debit Cards: Refund within 7-10 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibent mb-3">Non-Refundable Cases</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Change of mind after food preparation has started</li>
              <li>Incorrect address provided by customer</li>
              <li>Customer not available at delivery location</li>
              <li>Refund requests made after 24 hours of order placement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact for Refunds</h2>
            <p>For refund requests or queries:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Phone: +91 97678 56258</li>
              <li>Email: infoatjustfood@gmail.com</li>
              <li>Address: Sr no 99, Plot No.90 Lane No.8A, Seven Hills residence, nirgundi road, Lohegaon, Pune - 411047</li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy