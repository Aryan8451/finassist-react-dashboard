
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { calculateInvestmentGrowth } from '@/services/mockData';

const Investments = () => {
  const [investmentType, setInvestmentType] = useState<'stocks' | 'bonds' | 'realEstate'>('stocks');
  const [initialAmount, setInitialAmount] = useState('');
  const [expectedRate, setExpectedRate] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('10');
  const [additionalContributions, setAdditionalContributions] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [showResults, setShowResults] = useState(false);
  const [projectionResults, setProjectionResults] = useState<{
    finalAmount: number;
    totalInterest: number;
    yearlyBreakdown: { year: number; amount: number; interest: number }[];
  } | null>(null);

  // Calculate projection
  const calculateProjection = () => {
    const principal = parseFloat(initialAmount);
    const rate = parseFloat(expectedRate);
    const years = parseInt(timeHorizon);
    const additionalAmount = parseFloat(additionalContributions) || 0;

    if (isNaN(principal) || isNaN(rate) || isNaN(years)) {
      return;
    }

    const results = calculateInvestmentGrowth(
      principal,
      rate,
      years,
      additionalAmount,
      contributionFrequency
    );

    setProjectionResults(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Investment Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Projection</CardTitle>
              <CardDescription>
                Calculate the potential growth of your investments over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment-type">Investment Type</Label>
                <Select
                  value={investmentType}
                  onValueChange={(val: 'stocks' | 'bonds' | 'realEstate') => setInvestmentType(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="bonds">Bonds</SelectItem>
                    <SelectItem value="realEstate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-amount">Initial Investment Amount ($)</Label>
                <Input
                  id="initial-amount"
                  type="number"
                  placeholder="5000"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected-rate">Expected Annual Return (%)</Label>
                  <Input
                    id="expected-rate"
                    type="number"
                    placeholder={
                      investmentType === 'stocks' ? '7' : 
                      investmentType === 'bonds' ? '3' : '5'
                    }
                    value={expectedRate}
                    onChange={(e) => setExpectedRate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-horizon">Time Horizon (Years)</Label>
                  <Input
                    id="time-horizon"
                    type="number"
                    placeholder="10"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-contributions">Additional Contributions ($)</Label>
                <Input
                  id="additional-contributions"
                  type="number"
                  placeholder="200"
                  value={additionalContributions}
                  onChange={(e) => setAdditionalContributions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contribution-frequency">Contribution Frequency</Label>
                <Select
                  value={contributionFrequency}
                  onValueChange={(val: 'monthly' | 'yearly') => setContributionFrequency(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={calculateProjection}>
                Calculate Projection
              </Button>
            </CardContent>
          </Card>

          {/* Investment Tips Based on Type */}
          <Card>
            <CardHeader>
              <CardTitle>
                {investmentType === 'stocks' ? 'Stock Investment Tips' :
                 investmentType === 'bonds' ? 'Bond Investment Tips' :
                 'Real Estate Investment Tips'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {investmentType === 'stocks' && (
                <>
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Historical Performance</h3>
                    <p>The S&P 500 has historically returned about 10% annually before inflation, or about 7% after inflation.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Investment Strategies</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Consider low-cost index funds for diversification</li>
                      <li>Dollar-cost averaging can reduce timing risk</li>
                      <li>Reinvest dividends to maximize compound growth</li>
                      <li>Maintain a long-term perspective despite market volatility</li>
                    </ul>
                  </div>
                </>
              )}

              {investmentType === 'bonds' && (
                <>
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Income Stability</h3>
                    <p>Bonds typically offer more stable returns than stocks, with government bonds being among the safest investments.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Investment Strategies</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Consider bond ladder strategies to manage interest rate risk</li>
                      <li>Municipal bonds may offer tax advantages</li>
                      <li>Corporate bonds offer higher yields with increased risk</li>
                      <li>Bond ETFs and mutual funds provide diversification</li>
                    </ul>
                  </div>
                </>
              )}

              {investmentType === 'realEstate' && (
                <>
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Income & Appreciation</h3>
                    <p>Real estate can provide both rental income and property appreciation, with average historical returns of 5-10% annually.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Investment Strategies</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Location is critical for long-term appreciation</li>
                      <li>REITs offer real estate exposure without direct ownership</li>
                      <li>Consider property management costs in return calculations</li>
                      <li>Leverage (mortgages) can amplify returns but increases risk</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-success" />
              Investment Projection Results
            </DialogTitle>
            <DialogDescription>
              Based on your inputs, here's how your investment could grow over time.
            </DialogDescription>
          </DialogHeader>

          {projectionResults && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Final Amount</h4>
                  <p className="text-2xl font-bold text-success">${projectionResults.finalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-accent/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Interest Earned</h4>
                  <p className="text-2xl font-bold text-success">${projectionResults.totalInterest.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Yearly Breakdown</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-medium">Year</th>
                        <th className="py-2 px-4 text-right text-sm font-medium">Balance</th>
                        <th className="py-2 px-4 text-right text-sm font-medium">Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectionResults.yearlyBreakdown.map((year) => (
                        <tr key={year.year} className="border-t">
                          <td className="py-2 px-4">{year.year}</td>
                          <td className="py-2 px-4 text-right">${year.amount.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right text-success">${year.interest.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-info/10 p-4 rounded-lg text-info-dark">
                <h4 className="font-medium mb-1">Important Note</h4>
                <p className="text-sm">
                  This projection is based on a constant rate of return. Actual investment returns may vary and are not guaranteed.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowResults(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investments;
