import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUpload, FaCreditCard, FaUniversity } from 'react-icons/fa';
import paymentSecurity from '../assets/payment-security.png';
import { logout } from '../store/authSlice'; // Import logout from authSlice
import { addFraudResult } from '../store/transactionSlice'; // Import addFraudResult from transactionSlice

const transactionSchema = z.object({
  accountDetails: z.string().nonempty('Account details are required'),
  bankName: z.string().nonempty('Bank name is required'),
  csvFile: z.any().refine((file) => file instanceof File, 'Please upload a CSV file'),
});

function TransactionSubmission() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('csvFile', data.csvFile);
    formData.append('accountDetails', data.accountDetails);
    formData.append('bankName', data.bankName);

    try {
      const response = await fetch('http://localhost:5001/api/auth/check-fraud', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Fraud check failed');
      }
      dispatch(addFraudResult(result));
      toast.success('Transaction submitted successfully!');
      reset();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      if (err.message.includes('Invalid token')) {
        dispatch(logout());
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue('csvFile', file);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">Submit Transaction</h2>
      {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-6">{error}</p>}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden"
      >
        {/* Note: If payment-security is not an image, remove the img tag */}
        <img src={paymentSecurity} alt="Payment Security" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="accountDetails" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaCreditCard className="inline mr-2" /> Account Details
              </label>
              <input
                type="text"
                id="accountDetails"
                {...register('accountDetails')}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account details"
              />
              {errors.accountDetails && <p className="mt-1 text-sm text-red-600">{errors.accountDetails.message}</p>}
            </div>
            <div>
              <label htmlFor="bankName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaUniversity className="inline mr-2" /> Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                {...register('bankName')}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
              />
              {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>}
            </div>
            <div>
              <label htmlFor="csvFile" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaUpload className="inline mr-2" /> Upload CSV
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {errors.csvFile && <p className="mt-1 text-sm text-red-600">{errors.csvFile.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isLoading || isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Transaction'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default TransactionSubmission;