import React from 'react';

function Enquiry() {
  return (
    <div className="content">
      <h2>Contact Us</h2>
      <p>Have questions or need assistance? Reach out to FRAUD_SHIELD today!</p>

      <section className="section">
        <h3>Get in Touch</h3>
        <p>
          Whether you’re a business looking to secure your transactions or an individual seeking more information, we’re here to help. Fill out the form below or contact us directly.
        </p>
        <form className="enquiry-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Your Email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" placeholder="Your Message" rows="5"></textarea>
          </div>
          <button type="submit" className="submit-button">Send Enquiry</button>
        </form>
      </section>

      <section className="section">
        <h3>Contact Details</h3>
        <p>Email: support@fraudshield.com</p>
        <p>Phone: +1-800-FRAUD-SHIELD (372-8374)</p>
        <p>Address: 123 Security Lane, Tech City, TC 45678</p>
      </section>
    </div>
  );
}

export default Enquiry;