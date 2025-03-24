import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
// import csvAnalysis from '../assets/csv-analysisc.jpg';
import realTimeDetection from '../assets/realtime-detection.jpg';
import { FaChartLine, FaClock } from 'react-icons/fa';

function Services() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Services</h2>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
        >
          {/* <img src={csvAnalysis} alt="CSV Analysis" className="feature-image" /> */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              <FaChartLine className="inline mr-2" /> CSV Transaction Analysis
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Upload your transaction data in CSV format and let our system analyze it for potential fraud.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
        >
          <img
            src={realTimeDetection}
            alt="Real-Time Detection"
            className="feature-image"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              <FaClock className="inline mr-2" /> Real-Time Fraud Detection
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Monitor transactions as they happen and get instant alerts for suspicious activity.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Ready to Secure Your Transactions?
        </h3>
        <Link
          to={user ? '/transaction-submission' : '/signup'}
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {user ? 'Submit a Transaction' : 'Sign Up Now'}
        </Link>
      </motion.div>
    </div>
  );
}

export default Services;