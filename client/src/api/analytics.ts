import api from './api';

// Description: Get strategy performance by setup
// Endpoint: GET /api/analytics/strategy
// Request: {}
// Response: { chartData: Array, tableData: Array }
export const getStrategyPerformance = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        chartData: [
          { setup: 'Breakout', winRate: 62.5, pnl: 1250 },
          { setup: 'FVG', winRate: 55.0, pnl: 850 },
          { setup: 'Support/Resistance', winRate: 58.0, pnl: 920 },
          { setup: 'Trend Following', winRate: 60.0, pnl: 1100 },
          { setup: 'Scalp', winRate: 45.0, pnl: -200 },
        ],
        tableData: [
          {
            setup: 'Breakout',
            trades: 24,
            winRate: 62.5,
            profitFactor: 2.45,
            avgWin: 125.50,
            avgLoss: 51.25,
            totalPnl: 1250,
          },
          {
            setup: 'FVG',
            trades: 20,
            winRate: 55.0,
            profitFactor: 1.95,
            avgWin: 110.75,
            avgLoss: 56.75,
            totalPnl: 850,
          },
          {
            setup: 'Support/Resistance',
            trades: 19,
            winRate: 58.0,
            profitFactor: 2.15,
            avgWin: 118.50,
            avgLoss: 55.00,
            totalPnl: 920,
          },
          {
            setup: 'Trend Following',
            trades: 22,
            winRate: 60.0,
            profitFactor: 2.35,
            avgWin: 130.00,
            avgLoss: 55.25,
            totalPnl: 1100,
          },
          {
            setup: 'Scalp',
            trades: 15,
            winRate: 45.0,
            profitFactor: 0.85,
            avgWin: 75.00,
            avgLoss: 88.50,
            totalPnl: -200,
          },
        ],
        expectancy: 125.50,
        winRate: 58.5,
        avgWin: 112.75,
        avgLoss: 52.50,
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/analytics/strategy');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get emotion impact analysis
// Endpoint: GET /api/analytics/emotion
// Request: {}
// Response: { chartData: Array, bestEmotion: string, worstEmotion: string }
export const getEmotionAnalysis = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        chartData: [
          { emotion: 'Disciplined', winRate: 65, avgPnl: 145 },
          { emotion: 'FOMO', winRate: 35, avgPnl: -85 },
          { emotion: 'Greedy', winRate: 40, avgPnl: -45 },
          { emotion: 'Fearful', winRate: 50, avgPnl: 25 },
          { emotion: 'Confident', winRate: 62, avgPnl: 125 },
          { emotion: 'Hesitant', winRate: 48, avgPnl: 15 },
        ],
        bestEmotion: 'Disciplined',
        bestEmotionWinRate: 65,
        worstEmotion: 'FOMO',
        worstEmotionWinRate: 35,
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/analytics/emotion');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get session analysis
// Endpoint: GET /api/analytics/session
// Request: {}
// Response: { chartData: Array, tableData: Array }
export const getSessionAnalysis = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        chartData: [
          { session: 'Asian', pnl: 450 },
          { session: 'London', pnl: 1200 },
          { session: 'New York', pnl: 800 },
        ],
        tableData: [
          {
            session: 'Asian',
            trades: 15,
            winRate: 53.3,
            avgWin: 95.50,
            avgLoss: 60.00,
            totalPnl: 450,
          },
          {
            session: 'London',
            trades: 35,
            winRate: 62.9,
            avgWin: 125.75,
            avgLoss: 48.50,
            totalPnl: 1200,
          },
          {
            session: 'New York',
            trades: 30,
            winRate: 56.7,
            avgWin: 110.25,
            avgLoss: 55.00,
            totalPnl: 800,
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/analytics/session');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get pair performance
// Endpoint: GET /api/analytics/pairs
// Request: {}
// Response: { pairs: Array<{ pair, trades, winRate, profitFactor, totalPnl, avgWin, avgLoss }> }
export const getPairPerformance = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          pair: 'EUR/USD',
          trades: 28,
          winRate: 60.7,
          profitFactor: 2.25,
          totalPnl: 1050,
          avgWin: 118.50,
          avgLoss: 52.75,
        },
        {
          pair: 'GBP/USD',
          trades: 22,
          winRate: 59.1,
          profitFactor: 2.10,
          totalPnl: 820,
          avgWin: 112.25,
          avgLoss: 53.50,
        },
        {
          pair: 'USD/JPY',
          trades: 18,
          winRate: 55.6,
          profitFactor: 1.85,
          totalPnl: 480,
          avgWin: 105.00,
          avgLoss: 56.75,
        },
        {
          pair: 'AUD/USD',
          trades: 15,
          winRate: 60.0,
          profitFactor: 2.15,
          totalPnl: 620,
          avgWin: 115.50,
          avgLoss: 53.75,
        },
        {
          pair: 'USD/CHF',
          trades: 12,
          winRate: 58.3,
          profitFactor: 2.05,
          totalPnl: 480,
          avgWin: 110.00,
          avgLoss: 53.75,
        },
      ]);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/analytics/pairs');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};