import api from './api';

// Description: Get user settings
// Endpoint: GET /api/settings
// Request: {}
// Response: { email, accountSize, defaultLotSize, timezone, currency, defaultPairs }
export const getUserSettings = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: 'trader@example.com',
        accountSize: 10000,
        defaultLotSize: 1.0,
        timezone: 'EST',
        currency: 'USD',
        defaultPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update user settings
// Endpoint: PUT /api/settings
// Request: { accountSize, defaultLotSize, timezone, currency, defaultPairs }
// Response: { success: boolean }
export const updateUserSettings = async (data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/settings', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Export user data
// Endpoint: GET /api/settings/export
// Request: {}
// Response: { success: boolean, data: any }
export const exportUserData = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        trades: [],
        settings: {},
        exportDate: new Date().toISOString(),
      };
      const csv = JSON.stringify(data, null, 2);
      const blob = new Blob([csv], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      resolve({ success: true });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings/export');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete user account
// Endpoint: DELETE /api/settings/account
// Request: {}
// Response: { success: boolean }
export const deleteAccount = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete('/api/settings/account');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};