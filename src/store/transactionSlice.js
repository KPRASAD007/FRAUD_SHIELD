import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage for fraudResults
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('fraudResults');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (err) {
    console.error('Error loading fraudResults from localStorage:', err);
    return [];
  }
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    fraudResults: loadState(),
    realTimeAlerts: [],
  },
  reducers: {
    addFraudResult: (state, action) => {
      state.fraudResults.push(action.payload);
      // Save to localStorage
      try {
        localStorage.setItem('fraudResults', JSON.stringify(state.fraudResults));
      } catch (err) {
        console.error('Error saving fraudResults to localStorage:', err);
      }
    },
    addRealTimeAlert: (state, action) => {
      state.realTimeAlerts.push(action.payload);
    },
    clearRealTimeAlerts: (state) => {
      state.realTimeAlerts = [];
    },
  },
});

export const { addFraudResult, addRealTimeAlert, clearRealTimeAlerts } = transactionSlice.actions;
export default transactionSlice.reducer;