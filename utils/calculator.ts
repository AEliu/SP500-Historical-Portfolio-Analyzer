import { MARKET_DATA } from '../constants';
import { SimulationResult, SimulationParams } from '../types';

export const calculateSimulations = (params: SimulationParams): SimulationResult[] => {
  const { years, amount, stockRatio } = params;
  const results: SimulationResult[] = [];
  
  // We need at least 'years' of data plus 1 prior year for initial stock return calc
  // But our data format is: Year T, Price T. 
  // Return for Year T = (Price T + Div T) / Price T-1 - 1.
  // So if we start investing in 1928, we need 1927 Price and 1928 Price/Div.
  // MARKET_DATA index 0 is 1927.
  
  // Iterate through all possible start years
  // Start index 1 corresponds to 1928 (using 1927 as base)
  for (let i = 1; i <= MARKET_DATA.length - years; i++) {
    const startDataIndex = i;
    const endDataIndex = i + years - 1;
    
    const startYear = MARKET_DATA[startDataIndex].year;
    const endYear = MARKET_DATA[endDataIndex].year;

    let currentBalance = amount;
    const balanceHistory: number[] = [amount];

    for (let j = 0; j < years; j++) {
      const currentIndex = startDataIndex + j;
      const prevIndex = currentIndex - 1;

      const currentYearData = MARKET_DATA[currentIndex];
      const prevYearData = MARKET_DATA[prevIndex];

      // Calculate Stock Return
      // (Price_end + Dividend) / Price_start - 1
      const stockReturn = ((currentYearData.sp500 + currentYearData.dividend) / prevYearData.sp500) - 1;
      
      // Bond Return is directly provided for the year
      const bondReturn = currentYearData.bondReturn;

      // Calculate Portfolio Return for the year (rebalanced annually implies ratio applies to start of year)
      const portfolioReturn = (stockRatio * stockReturn) + ((1 - stockRatio) * bondReturn);

      // Apply return
      currentBalance = currentBalance * (1 + portfolioReturn);
      balanceHistory.push(currentBalance);
    }

    const totalReturn = (currentBalance - amount) / amount;
    const cagr = Math.pow(currentBalance / amount, 1 / years) - 1;

    results.push({
      startYear,
      endYear,
      initialInvestment: amount,
      finalValue: currentBalance,
      totalReturn,
      cagr,
      isLoss: totalReturn < 0,
      history: balanceHistory
    });
  }

  return results;
};