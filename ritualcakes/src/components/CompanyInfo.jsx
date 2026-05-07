import React from 'react';

function CompanyInfo() {
  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg lg:p-8 lg:mt-16 shadow-lg">
      {/* Privacy Policy */}
      <section className="mb-12 pb-10 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-4 text-darkcustombg1">Privacy Policy</h1>
        <p className="text-gray-700 text-lg">
          Ritual Cakes respects your privacy. Any personal information collected through orders, registration, or inquiries is used only for order fulfillment, customer support, and service improvement.
          We do not share, sell, or trade information with marketers. You can request to review, change, or delete your data at any time.
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Data is securely encrypted and stored.</li>
          <li>No unsolicited communications or marketing.</li>
          <li>Third-party sharing only for payment/delivery processing.</li>
          <li>Compliance with Indian IT Act & GDPR where relevant.</li>
          <li>Only essential cookies are used for site functionality.</li>
        </ul>
      </section>
      {/* Terms & Conditions */}
      <section className="mb-12 pb-10 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-4 text-darkcustombg1">Terms & Conditions</h1>
        <p className="text-gray-700 text-lg">
          Placing an order with Ritual Cakes means acceptance of our baking timelines, delivery/pickup terms, payment and cancellation policies, and basic expectations of hand-crafted design. Allergy concerns must be communicated in advance.
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Sales subject to confirmation and product availability.</li>
          <li>Custom cakes require minimum 24 hours' notice; event orders accepted subject to staff approval.</li>
          <li>Pick-up/delivery windows depend on selected slot and address.</li>
          <li>Designs, color, and appearance may have natural variation.</li>
          <li>Cancellation/refund requests accepted up to 24 hours before scheduled fulfillment (some exceptions for large event orders).</li>
          <li>Payments are securely processed through trusted payment partners.</li>
        </ul>
      </section>
      {/* Company Information */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-darkcustombg1">Company Information</h1>
        <p className="text-gray-700 text-lg mb-4">
          <strong>Ritual Cakes</strong><br />
          Shop no.:1, Uma Imperial, Dronagiri Sec.:48<br />
          Dronagiri, Uran-400702, Raigad, Maharashtra, India
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-bold text-darkcustombg1">Contact:</span>{' '}
          <a href="tel:+918169296802" className="text-darkcustombg1">+91 8169296802</a>,{' '}
          <a href="tel:+917021482775" className="text-darkcustombg1 ml-2">+91 7021482775</a>
          <br />
          <span className="font-bold text-darkcustombg1">Email:</span>{' '}
          <a href="mailto:ritualcakes2019@gmail.com" className="text-darkcustombg1">ritualcakes2019@gmail.com</a>
        </p>
        <p className="mt-4 text-gray-700 text-lg">
          <span className="font-bold text-darkcustombg1">Established:</span> 2019<br />
          <span className="font-bold text-darkcustombg1">Founder:</span> Jyoti Joshi<br />
          <span className="font-bold text-darkcustombg1">Co-Founder:</span> Jitendera Joshi<br />
          <span className="font-bold text-darkcustombg1">Business Status:</span> Local bakery, direct-to-customer, home-style and custom celebration cakes<br />
          <span className="font-bold text-darkcustombg1">Website:</span> <a href="https://ritualcakes.vercel.app/" className="text-darkcustombg1">ritualcakes.vercel.app</a>
        </p>
        <p className="mt-4 text-gray-700 text-lg">
          <span className="font-bold text-darkcustombg1">Business Hours:</span> 10:00 am &ndash; 10:30 pm, all days<br />
        </p>
      </section>
    </div>
  );
}

export default CompanyInfo;
