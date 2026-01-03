import api from './api';

// Description: Get dashboard statistics
// Endpoint: GET /api/trades/dashboard-stats
// Request: { filterMistakes?: boolean }
// Response: { totalPL: number, winRate: number, profitFactor: number, expectancy: number, wins: number, losses: number, accountSize: number }
export const getDashboardStats = async (filterMistakes: boolean = false) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPL: 2450.75,
        winRate: 58.5,
        profitFactor: 2.15,
        expectancy: 125.50,
        wins: 47,
        losses: 33,
        accountSize: 10000,
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/trades/dashboard-stats', { params: { filterMistakes } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get equity curve data
// Endpoint: GET /api/trades/equity-curve
// Request: { filterMistakes?: boolean }
// Response: { data: Array<{ date: string, balance: number }> }
export const getEquityCurveData = async (filterMistakes: boolean = false) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [];
      let balance = 10000;
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        balance += Math.random() * 200 - 50;
        data.push({
          date: date.toLocaleDateString(),
          balance: Math.max(balance, 9500),
        });
      }
      resolve(data);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/trades/equity-curve', { params: { filterMistakes } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get recent trades
// Endpoint: GET /api/trades/recent
// Request: {}
// Response: { trades: Array<Trade> }
export const getRecentTrades = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: '1',
          pair: 'EUR/USD',
          direction: 'LONG',
          entryPrice: 1.0850,
          exitPrice: 1.0920,
          pnl: 350.50,
          status: 'CLOSED',
          entryTime: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: '2',
          pair: 'GBP/USD',
          direction: 'SHORT',
          entryPrice: 1.2650,
          exitPrice: 1.2580,
          pnl: 280.75,
          status: 'CLOSED',
          entryTime: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          _id: '3',
          pair: 'USD/JPY',
          direction: 'LONG',
          entryPrice: 110.50,
          exitPrice: 110.25,
          pnl: -125.00,
          status: 'CLOSED',
          entryTime: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          _id: '4',
          pair: 'AUD/USD',
          direction: 'LONG',
          entryPrice: 0.7250,
          exitPrice: 0.7320,
          pnl: 175.25,
          status: 'CLOSED',
          entryTime: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          _id: '5',
          pair: 'EUR/USD',
          direction: 'SHORT',
          entryPrice: 1.0900,
          exitPrice: null,
          pnl: 0,
          status: 'OPEN',
          entryTime: new Date(Date.now() - 432000000).toISOString(),
        },
      ]);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/trades/recent');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get all trades with pagination
// Endpoint: GET /api/trades
// Request: { page?: number, limit?: number }
// Response: { trades: Array<Trade>, total: number }
export const getAllTrades = async (page: number = 1, limit: number = 50) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const trades = [];
      for (let i = 0; i < 20; i++) {
        trades.push({
          _id: `trade-${i}`,
          pair: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'][Math.floor(Math.random() * 5)],
          direction: Math.random() > 0.5 ? 'LONG' : 'SHORT',
          entryPrice: 1.0 + Math.random() * 0.1,
          exitPrice: 1.0 + Math.random() * 0.1,
          stopLoss: 0.95 + Math.random() * 0.05,
          takeProfit: 1.15 + Math.random() * 0.05,
          lotSize: Math.random() * 2 + 0.5,
          commission: Math.random() * 10,
          pnl: Math.random() * 500 - 250,
          status: Math.random() > 0.3 ? 'CLOSED' : 'OPEN',
          entryTime: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
          setupTags: ['Breakout', 'FVG', 'Support/Resistance'].slice(0, Math.floor(Math.random() * 3) + 1),
          emotionTags: ['Disciplined', 'FOMO', 'Confident'].slice(0, Math.floor(Math.random() * 3) + 1),
          notes: 'Sample trade note',
        });
      }
      resolve(trades);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/trades', { params: { page, limit } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new trade
// Endpoint: POST /api/trades
// Request: { pair, direction, entryPrice, exitPrice, stopLoss, takeProfit, lotSize, commission, entryTime, setupTags, emotionTags, notes }
// Response: { success: boolean, trade: Trade }
export const createTrade = async (data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        trade: {
          _id: `trade-${Date.now()}`,
          ...data,
          pnl: 0,
          status: 'OPEN',
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/trades', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update a trade
// Endpoint: PUT /api/trades/:id
// Request: { pair, direction, entryPrice, exitPrice, stopLoss, takeProfit, lotSize, commission, entryTime, setupTags, emotionTags, notes }
// Response: { success: boolean, trade: Trade }
export const updateTrade = async (id: string, data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        trade: {
          _id: id,
          ...data,
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/trades/${id}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete a trade
// Endpoint: DELETE /api/trades/:id
// Request: {}
// Response: { success: boolean }
export const deleteTrade = async (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/trades/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get calendar data for a month
// Endpoint: GET /api/trades/calendar/:year/:month
// Request: {}
// Response: { days: { [day: number]: { pnl: number, trades: number, status: 'profit' | 'loss' | 'none' } } }
export const getCalendarData = async (year: number, month: number) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const days: any = {};
      for (let i = 1; i <= 31; i++) {
        if (Math.random() > 0.5) {
          const pnl = Math.random() * 500 - 250;
          days[i] = {
            pnl,
            trades: Math.floor(Math.random() * 5) + 1,
            status: pnl > 0 ? 'profit' : 'loss',
          };
        }
      }
      resolve({ days });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/trades/calendar/${year}/${month}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get trades for a specific day
// Endpoint: GET /api/trades/day/:date
// Request: {}
// Response: { trades: Array<Trade> }
export const getDayTrades = async (date: Date) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const trades = [];
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        trades.push({
          _id: `trade-${i}`,
          pair: ['EUR/USD', 'GBP/USD', 'USD/JPY'][Math.floor(Math.random() * 3)],
          direction: Math.random() > 0.5 ? 'LONG' : 'SHORT',
          entryPrice: 1.0 + Math.random() * 0.1,
          exitPrice: 1.0 + Math.random() * 0.1,
          pnl: Math.random() * 500 - 250,
          status: 'CLOSED',
          entryTime: date.toISOString(),
        });
      }
      resolve(trades);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/trades/day/${date.toISOString().split('T')[0]}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};