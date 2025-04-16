
// Mock data for demonstration purposes

// Transaction types and categories
export type TransactionType = 'income' | 'expense' | 'investment';
export type TransactionCategory = 
  | 'salary' | 'dividend' | 'gift'  // income categories
  | 'food' | 'transportation' | 'utilities' | 'entertainment' | 'housing' | 'healthcare' | 'other'  // expense categories
  | 'stocks' | 'bonds' | 'realEstate' | 'crypto';  // investment categories

// Transaction interface
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string;
  userId: string;
}

// Account interface
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  userId: string;
}

// Financial Goal interface
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId: string;
}

// Investment interface
export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'realEstate' | 'crypto' | 'other';
  amount: number;
  expectedGrowthRate: number;
  date: string;
  userId: string;
}

// Generate mock transactions
export const generateMockTransactions = (userId: string): Transaction[] => {
  return [
    {
      id: '1',
      amount: 5000,
      type: 'income',
      category: 'salary',
      description: 'Monthly Salary',
      date: '2023-04-01',
      userId,
    },
    {
      id: '2',
      amount: 75,
      type: 'expense',
      category: 'food',
      description: 'Grocery Shopping',
      date: '2023-04-03',
      userId,
    },
    {
      id: '3',
      amount: 200,
      type: 'expense',
      category: 'utilities',
      description: 'Electricity Bill',
      date: '2023-04-05',
      userId,
    },
    {
      id: '4',
      amount: 1000,
      type: 'investment',
      category: 'stocks',
      description: 'Technology ETF',
      date: '2023-04-10',
      userId,
    },
    {
      id: '5',
      amount: 120,
      type: 'expense',
      category: 'entertainment',
      description: 'Concert Tickets',
      date: '2023-04-15',
      userId,
    },
    {
      id: '6',
      amount: 300,
      type: 'income',
      category: 'dividend',
      description: 'Quarterly Dividend',
      date: '2023-04-15',
      userId,
    },
    {
      id: '7',
      amount: 500,
      type: 'investment',
      category: 'bonds',
      description: 'Government Bonds',
      date: '2023-04-20',
      userId,
    },
    {
      id: '8',
      amount: 150,
      type: 'expense',
      category: 'transportation',
      description: 'Car Maintenance',
      date: '2023-04-22',
      userId,
    },
  ];
};

// Generate mock accounts
export const generateMockAccounts = (userId: string): Account[] => {
  return [
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 4500,
      userId,
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 12500,
      userId,
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 32000,
      userId,
    },
    {
      id: '4',
      name: 'Credit Card',
      type: 'credit',
      balance: -2300,
      userId,
    },
  ];
};

// Generate mock financial goals
export const generateMockGoals = (userId: string): FinancialGoal[] => {
  return [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 15000,
      currentAmount: 12500,
      deadline: '2023-12-31',
      userId,
    },
    {
      id: '2',
      name: 'Down Payment',
      targetAmount: 50000,
      currentAmount: 20000,
      deadline: '2025-06-30',
      userId,
    },
    {
      id: '3',
      name: 'Vacation',
      targetAmount: 5000,
      currentAmount: 2500,
      deadline: '2023-08-31',
      userId,
    },
  ];
};

// Generate mock investments
export const generateMockInvestments = (userId: string): Investment[] => {
  return [
    {
      id: '1',
      name: 'S&P 500 ETF',
      type: 'stocks',
      amount: 10000,
      expectedGrowthRate: 7,
      date: '2022-01-15',
      userId,
    },
    {
      id: '2',
      name: 'Corporate Bonds',
      type: 'bonds',
      amount: 5000,
      expectedGrowthRate: 3.5,
      date: '2022-06-10',
      userId,
    },
    {
      id: '3',
      name: 'Rental Property',
      type: 'realEstate',
      amount: 150000,
      expectedGrowthRate: 5,
      date: '2021-08-22',
      userId,
    },
  ];
};

// Tax calculation helper function (extremely simplified)
export const calculateEstimatedTax = (
  salary: number,
  otherIncome: number,
  deductions: number,
  filingStatus: 'single' | 'married' | 'head'
): { 
  totalTax: number, 
  effectiveRate: number, 
  breakdown: { name: string, amount: number }[] 
} => {
  const totalIncome = salary + otherIncome;
  const taxableIncome = Math.max(0, totalIncome - deductions);
  
  let totalTax = 0;
  let federalTax = 0;
  let stateTax = 0;
  let medicareTax = 0;
  let socialSecurityTax = 0;
  
  // Very simplified tax calculation
  // Federal tax (simplified progressive bracket)
  if (filingStatus === 'single') {
    if (taxableIncome <= 10000) {
      federalTax = taxableIncome * 0.10;
    } else if (taxableIncome <= 40000) {
      federalTax = 1000 + (taxableIncome - 10000) * 0.12;
    } else if (taxableIncome <= 85000) {
      federalTax = 4600 + (taxableIncome - 40000) * 0.22;
    } else if (taxableIncome <= 165000) {
      federalTax = 14500 + (taxableIncome - 85000) * 0.24;
    } else if (taxableIncome <= 210000) {
      federalTax = 33700 + (taxableIncome - 165000) * 0.32;
    } else if (taxableIncome <= 520000) {
      federalTax = 47900 + (taxableIncome - 210000) * 0.35;
    } else {
      federalTax = 157500 + (taxableIncome - 520000) * 0.37;
    }
  } else {
    // Simplified for married and head of household
    federalTax = taxableIncome * 0.18;
  }
  
  // State tax (simplified flat rate)
  stateTax = taxableIncome * 0.05;
  
  // Medicare (fixed rate)
  medicareTax = totalIncome * 0.0145;
  
  // Social Security (fixed rate with cap)
  socialSecurityTax = Math.min(totalIncome, 147000) * 0.062;
  
  totalTax = federalTax + stateTax + medicareTax + socialSecurityTax;
  const effectiveRate = totalTax / totalIncome * 100;
  
  return {
    totalTax,
    effectiveRate,
    breakdown: [
      { name: 'Federal Income Tax', amount: federalTax },
      { name: 'State Income Tax', amount: stateTax },
      { name: 'Medicare', amount: medicareTax },
      { name: 'Social Security', amount: socialSecurityTax },
    ]
  };
};

// Investment growth calculator
export const calculateInvestmentGrowth = (
  principal: number,
  rate: number,
  years: number,
  additionalContributions: number = 0,
  contributionFrequency: 'monthly' | 'yearly' = 'monthly'
): { 
  finalAmount: number,
  totalInterest: number,
  yearlyBreakdown: { year: number, amount: number, interest: number }[]
} => {
  let currentAmount = principal;
  const yearlyBreakdown = [];
  let totalInterest = 0;
  
  const annualRate = rate / 100;
  const periodsPerYear = contributionFrequency === 'monthly' ? 12 : 1;
  const contributionPerPeriod = additionalContributions;
  
  for (let year = 1; year <= years; year++) {
    let yearlyInterest = 0;
    
    for (let period = 1; period <= periodsPerYear; period++) {
      // Calculate interest for this period
      const periodRate = annualRate / periodsPerYear;
      const interestThisPeriod = currentAmount * periodRate;
      
      yearlyInterest += interestThisPeriod;
      currentAmount += interestThisPeriod;
      
      // Add contribution if any
      if (contributionPerPeriod > 0) {
        currentAmount += contributionPerPeriod;
      }
    }
    
    totalInterest += yearlyInterest;
    
    yearlyBreakdown.push({
      year,
      amount: currentAmount,
      interest: yearlyInterest,
    });
  }
  
  return {
    finalAmount: currentAmount,
    totalInterest,
    yearlyBreakdown,
  };
};
