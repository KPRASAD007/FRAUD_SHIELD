import React from 'react';

function Home() {
  return (
    <div className="content">
      <h2>Welcome to FRAUD_SHIELD</h2>
      <p>Protect yourself from financial fraud with our advanced detection tools.</p>
      <div className="section">
        <h3>Why Choose Us?</h3>
        <ul>
          <li><strong>Real-time Monitoring:</strong> Track transactions as they happen.</li>
          <li><strong>Secure Access:</strong> Login with confidence using OTP verification.</li>
          <li><strong>Expert Support:</strong> Reach out anytime via our enquiry page.</li>
        </ul>
      </div>
      <div className="section">
        <h3>Get Started</h3>
        <p>Sign up today to secure your accounts and monitor your transactions.</p>
      </div>
    </div>
  );
}

export default Home;