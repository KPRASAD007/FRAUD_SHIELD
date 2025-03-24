import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero-image.jpg';
// import csvAnalysis from '../assets/csv-analysisc.jpg';
import realTimeDetection from '../assets/realtime-detection.jpg';
import secureAccounts from '../assets/secure-accounts.jpg';

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gray-100 dark:bg-gray-800 py-20 text-center rounded-lg shadow-lg overflow-hidden"
      >
        <img
          src={heroImage}
          alt="Hero"
          className="hero-image absolute inset-0"
        />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Protect Your Finances with Fraud Shield
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Advanced fraud detection for secure transactions.
          </p>
          <Link
            to={user ? '/dashboard' : '/signup'}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          {/* <img src={csvAnalysis} alt="CSV Analysis" className="feature-image mx-auto mb-4" /> */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">CSV Analysis</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Upload and analyze CSV files to detect fraudulent transactions.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          <img
            src={realTimeDetection}
            alt="Real-Time Detection"
            className="feature-image mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Real-Time Detection</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Monitor transactions in real-time to catch fraud instantly.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          <img
            src={secureAccounts}
            alt="Secure Accounts"
            className="feature-image mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure Accounts</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Keep your accounts safe with advanced security measures.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;