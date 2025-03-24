import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fraudResults: [],
  realTimeAlerts: [],
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addFraudResult: (state, action) => {
      state.fraudResults.push(action.payload);
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