import React from 'react';

function Home() {
  return (
    <div className="content">
      <h2>Welcome to FRAUD_SHIELD</h2>
      <p>Your trusted partner in fraud detection and prevention.</p>

      <section className="section">
        <h3>What is Fraud Detection in Transactions?</h3>
        <p>
          Fraud detection in transactions refers to the process of identifying and preventing unauthorized or illegal activities within financial transactions. These can include credit card fraud, identity theft, money laundering, and phishing scams. With the rise of digital payments and online banking, fraudulent activities have become more sophisticated, costing businesses and individuals billions of dollars annually.
        </p>
        <p>
          Common signs of transaction fraud include unusual spending patterns, multiple failed login attempts, transactions from unfamiliar locations, or sudden high-value transfers. Detecting these requires advanced technology and real-time analysis to stop fraud before it causes significant damage.
        </p>
      </section>

      <section className="section">
        <h3>The Growing Challenge of Transaction Fraud</h3>
        <p>
          In today’s digital economy, fraudsters use techniques like stolen credentials, synthetic identities, and AI-generated phishing attacks to exploit vulnerabilities. Traditional rule-based systems often fail to keep up with these evolving threats, leading to false positives (legitimate transactions flagged as fraud) or missed detections (fraudulent transactions going unnoticed).
        </p>
        <p>
          Businesses face not only financial losses but also reputational damage and regulatory penalties. Consumers lose trust when their data is compromised, making effective fraud detection a critical need for all industries handling transactions—banks, e-commerce, insurance, and more.
        </p>
      </section>

      <section className="section">
        <h3>How FRAUD_SHIELD Helps</h3>
        <p>
          FRAUD_SHIELD leverages cutting-edge artificial intelligence and machine learning to provide a robust solution for fraud detection and prevention. Here’s how we help rectify these problems:
        </p>
        <ul>
          <li>
            <strong>Real-Time Monitoring:</strong> Our system analyzes transactions as they happen, flagging suspicious activity instantly to minimize losses.
          </li>
          <li>
            <strong>Behavioral Analysis:</strong> We track user behavior patterns (e.g., spending habits, login locations) to distinguish legitimate users from fraudsters.
          </li>
          <li>
            <strong>Adaptive AI:</strong> Unlike static rule-based systems, our AI evolves with new fraud patterns, reducing false positives and improving accuracy.
          </li>
          <li>
            <strong>Comprehensive Reporting:</strong> Get detailed insights into flagged transactions, helping you understand risks and comply with regulations.
          </li>
          <li>
            <strong>Seamless Integration:</strong> FRAUD_SHIELD integrates with your existing payment systems, making it easy to deploy without disrupting operations.
          </li>
        </ul>
      </section>

      <section className="section">
        <h3>Why Choose FRAUD_SHIELD?</h3>
        <p>
          Our mission is to protect your business and customers from the devastating effects of fraud. With FRAUD_SHIELD, you gain peace of mind knowing that:
        </p>
        <ul>
          <li>Your transactions are safeguarded 24/7.</li>
          <li>Your customers’ trust is preserved through secure experiences.</li>
          <li>Your bottom line is protected from financial and reputational harm.</li>
        </ul>
        <p>
          Join the growing number of businesses that rely on FRAUD_SHIELD to stay one step ahead of fraudsters. Contact us today to learn more or explore our services!
        </p>
      </section>
    </div>
  );
}

export default Home;