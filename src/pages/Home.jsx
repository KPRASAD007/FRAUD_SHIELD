import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Correct path

// Import images from assets/
import heroImage from '../assets/hero-image.jpg';
import realtimeDetectionImage from '../assets/realtime-detection.jpg';
import csvAnalysisImage from '../assets/csv-analysis.jpg';
import secureAccountsImage from '../assets/secure-accounts.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Fraud Shield</h1>
          <p>Protect your finances with cutting-edge fraud detection technology.</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
        <img
          src={heroImage}
          alt="Fraud Protection"
          className="hero-image"
          onError={() => console.log('Hero image failed to load')}
        />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Fraud Shield?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img
              src={realtimeDetectionImage}
              alt="Real-Time Detection"
              className="feature-image"
              onError={() => console.log('Feature image 1 failed to load')}
            />
            <h3>Real-Time Detection</h3>
            <p>Instantly identify suspicious transactions with our AI-powered system.</p>
          </div>
          <div className="feature-card">
            <img
              src={csvAnalysisImage}
              alt="CSV Analysis"
              className="feature-image"
              onError={() => console.log('Feature image 2 failed to load')}
            />
            <h3>CSV Analysis</h3>
            <p>Upload and analyze transaction data effortlessly.</p>
          </div>
          <div className="feature-card">
            <img
              src={secureAccountsImage}
              alt="Secure Accounts"
              className="feature-image"
              onError={() => console.log('Feature image 3 failed to load')}
            />
            <h3>Secure Accounts</h3>
            <p>Manage your accounts with top-tier security.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>99%</h3>
            <p>Detection Accuracy</p>
          </div>
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Transactions Scanned</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Fraud Shield. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;