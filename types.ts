export interface MarketData {
  year: number;
  sp500: number;
  dividend: number;
  bondReturn: number;
}

export interface SimulationResult {
  startYear: number;
  endYear: number;
  initialInvestment: number;
  finalValue: number;
  totalReturn: number; // Percentage
  cagr: number; // Compound Annual Growth Rate
  isLoss: boolean;
  history: number[]; // Yearly balance tracking
}

export interface SimulationParams {
  amount: number;
  years: number;
  stockRatio: number; // 0 to 1
}