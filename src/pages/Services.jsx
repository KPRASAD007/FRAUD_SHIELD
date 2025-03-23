import React from 'react';

function Services() {
  return (
    <div className="content">
      <h2>Our Services</h2>
      <p>Explore how FRAUD_SHIELD protects your transactions with cutting-edge solutions.</p>

      <section className="section">
        <h3>Fraud Detection</h3>
        <p>
          Our advanced AI analyzes transaction data in real-time to identify suspicious patterns, such as unusual spending or unauthorized access attempts. We minimize false positives while catching fraud early.
        </p>
      </section>

      <section className="section">
        <h3>Risk Assessment</h3>
        <p>
          We provide detailed risk scoring for every transaction, helping businesses prioritize which activities need closer scrutiny. This ensures efficient resource allocation and proactive fraud prevention.
        </p>
      </section>

      <section className="section">
        <h3>Identity Verification</h3>
        <p>
          Protect against identity theft with our robust verification tools. We cross-check user data against multiple sources to ensure only legitimate customers complete transactions.
        </p>
      </section>

      <section className="section">
        <h3>Custom Solutions</h3>
        <p>
          Every business is unique. We offer tailored fraud prevention strategies, integrating seamlessly with your payment systems and workflows to address your specific needs.
        </p>
      </section>
    </div>
  );
}

export default Services;