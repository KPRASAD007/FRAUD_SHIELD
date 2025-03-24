import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">About Us</h2>

      {/* Mission Statement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h3>
        <p className="text-gray-700 dark:text-gray-300">
          At Fraud Shield, our mission is to protect your financial transactions by leveraging advanced fraud detection
          technology. We aim to provide a secure and reliable platform for individuals and businesses alike.
        </p>
      </motion.section>

      {/* Team Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">John Doe</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">CEO & Founder</p>
          <p className="text-gray-700 dark:text-gray-300">
            John has over 15 years of experience in cybersecurity and is passionate about protecting users from financial fraud.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Jane Smith</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">CTO</p>
          <p className="text-gray-700 dark:text-gray-300">
            Jane leads our tech team with a focus on building scalable and secure fraud detection systems.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default About;