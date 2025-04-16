
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
import { ChevronLeft, Calculator } from 'lucide-react';
import { calculateEstimatedTax } from '@/services/mockData';

const TaxCalculator = () => {
  const [salary, setSalary] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single');
  const [showResults, setShowResults] = useState(false);
  const [taxResults, setTaxResults] = useState<{
    totalTax: number;
    effectiveRate: number;
    breakdown: { name: string; amount: number }[];
  } | null>(null);

  const calculateTax = () => {
    const salaryAmount = parseFloat(salary) || 0;
    const otherIncomeAmount = parseFloat(otherIncome) || 0;
    const deductionsAmount = parseFloat(deductions) || 0;

    const results = calculateEstimatedTax(
      salaryAmount,
      otherIncomeAmount,
      deductionsAmount,
      filingStatus
    );

    setTaxResults(results);
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
            <h1 className="text-xl font-semibold">Tax Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tax Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Estimation Tool</CardTitle>
              <CardDescription>
                Calculate your estimated tax liability based on your income and deductions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary ($)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="60000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-income">Other Income ($)</Label>
                <Input
                  id="other-income"
                  type="number"
                  placeholder="5000"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include interest, dividends, rental income, etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deductions">Tax Deductions ($)</Label>
                <Input
                  id="deductions"
                  type="number"
                  placeholder="12000"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Standard deduction or total itemized deductions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filing-status">Filing Status</Label>
                <Select
                  value={filingStatus}
                  onValueChange={(val: 'single' | 'married' | 'head') => setFilingStatus(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                    <SelectItem value="head">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={calculateTax}>
                Calculate Tax Estimate
              </Button>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Savings Tips</CardTitle>
              <CardDescription>
                Strategies to potentially reduce your tax liability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Retirement Contributions</h3>
                <p className="text-muted-foreground">
                  Contributing to tax-advantaged retirement accounts like 401(k)s and IRAs can reduce your taxable income.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Additional Tax Reduction Strategies</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Health Savings Accounts (HSAs) for medical expenses</li>
                  <li>Education credits like the American Opportunity Credit</li>
                  <li>Mortgage interest deductions for homeowners</li>
                  <li>Charitable contributions to eligible organizations</li>
                  <li>Home office deductions for self-employed individuals</li>
                </ul>
              </div>

              <div className="bg-info/10 p-4 rounded-lg text-info-dark">
                <h3 className="font-semibold mb-2">Important Note</h3>
                <p className="text-sm">
                  This calculator provides estimates only. Tax laws change frequently, and individual situations vary. 
                  Consult a qualified tax professional for personalized advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Tax Estimate Results
            </DialogTitle>
            <DialogDescription>
              Based on your inputs, here's your estimated tax liability.
            </DialogDescription>
          </DialogHeader>

          {taxResults && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Tax</h4>
                  <p className="text-2xl font-bold">${taxResults.totalTax.toLocaleString()}</p>
                </div>
                <div className="bg-accent/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Effective Rate</h4>
                  <p className="text-2xl font-bold">{taxResults.effectiveRate.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tax Breakdown</h4>
                <div className="space-y-2">
                  {taxResults.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 bg-accent/30 rounded-lg">
                      <span>{item.name}</span>
                      <span className="font-semibold">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium mb-1">After-Tax Income</h4>
                <div className="flex justify-between">
                  <span>Annual</span>
                  <span className="font-bold">
                    ${((parseFloat(salary) || 0) + (parseFloat(otherIncome) || 0) - taxResults.totalTax).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Monthly</span>
                  <span className="font-bold">
                    ${(((parseFloat(salary) || 0) + (parseFloat(otherIncome) || 0) - taxResults.totalTax) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
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

export default TaxCalculator;
