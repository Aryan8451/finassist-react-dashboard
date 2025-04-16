
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  BellIcon,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  Menu,
  PieChart,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { 
  generateMockAccounts, 
  generateMockTransactions, 
  generateMockGoals, 
  Account, 
  Transaction, 
  FinancialGoal 
} from '@/services/mockData';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  
  // Load mock data on component mount
  useEffect(() => {
    if (user) {
      setAccounts(generateMockAccounts(user.id));
      setTransactions(generateMockTransactions(user.id));
      setGoals(generateMockGoals(user.id));
    }
  }, [user]);
  
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate income and expenses for the current month
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const currentDate = new Date();
    return transactionDate.getMonth() === currentDate.getMonth() &&
           transactionDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-6">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">FinAssist</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-3 bg-sidebar-accent text-sidebar-accent-foreground rounded-md">
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/transactions" className="flex items-center px-4 py-3 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md">
            <CreditCard className="mr-3 h-5 w-5" />
            <span>Transactions</span>
          </Link>
          
          <Link to="/investments" className="flex items-center px-4 py-3 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md">
            <TrendingUp className="mr-3 h-5 w-5" />
            <span>Investments</span>
          </Link>
          
          <Link to="/tax-calculator" className="flex items-center px-4 py-3 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md">
            <BarChart3 className="mr-3 h-5 w-5" />
            <span>Tax Calculator</span>
          </Link>
          
          <div className="pt-4 pb-2">
            <div className="px-4 py-2 text-xs text-sidebar-foreground/60 uppercase">
              Account
            </div>
          </div>
          
          <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md">
            <User className="mr-3 h-5 w-5" />
            <span>Profile</span>
          </Link>
          
          <Link to="/settings" className="flex items-center px-4 py-3 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Link>
          
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-destructive hover:bg-destructive/10 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="px-4 py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Page title - only on mobile */}
            <div className="md:hidden">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            
            {/* Welcome message - only on desktop */}
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold">Welcome back, {user?.firstName}!</h1>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-foreground/80 hover:text-foreground">
                <BellIcon className="h-5 w-5" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50">
              <nav className="px-2 py-3 space-y-1">
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md font-medium bg-primary/10 text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/transactions" 
                  className="block px-3 py-2 rounded-md font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transactions
                </Link>
                <Link 
                  to="/investments" 
                  className="block px-3 py-2 rounded-md font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Investments
                </Link>
                <Link 
                  to="/tax-calculator" 
                  className="block px-3 py-2 rounded-md font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tax Calculator
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-3 py-2 rounded-md font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-destructive hover:bg-destructive/10"
                >
                  Logout
                </button>
              </nav>
            </div>
          )}
        </header>
        
        {/* Main dashboard content */}
        <main className="flex-1 p-6">
          {/* Welcome message - only on mobile */}
          <div className="md:hidden mb-6">
            <h1 className="text-xl font-semibold">Welcome back, {user?.firstName}!</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          
          {/* Quick stats cards */}
          <div className="dashboard-grid mb-8">
            {/* Total Balance */}
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
              </CardContent>
            </Card>
            
            {/* Monthly Income */}
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-dark">${monthlyIncome.toLocaleString()}</div>
                <div className="flex items-center mt-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>3.2% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Expenses */}
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning-dark">${monthlyExpenses.toLocaleString()}</div>
                <div className="flex items-center mt-1 text-xs text-warning">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>2.1% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Savings Rate */}
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info-dark">
                  {monthlyIncome > 0 
                    ? `${Math.round((monthlyIncome - monthlyExpenses) / monthlyIncome * 100)}%` 
                    : '0%'}
                </div>
                <div className="flex items-center mt-1 text-xs text-info">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>On track to meet goals</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Financial goals */}
          <h2 className="text-xl font-semibold mb-4">Financial Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {goals.map(goal => {
              const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              return (
                <Card key={goal.id} className="stat-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{goal.name}</CardTitle>
                    <CardDescription>
                      Target: ${goal.targetAmount.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">${goal.currentAmount.toLocaleString()}</span>
                        <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-value" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Target date: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Add new goal card */}
            <Card className="stat-card border-dashed bg-transparent hover:bg-secondary/20 cursor-pointer flex flex-col items-center justify-center">
              <CardContent className="py-8 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Add New Goal</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Set up a new financial goal to track your progress
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Accounts and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accounts Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Accounts</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          account.type === 'checking' ? 'bg-info/20 text-info' :
                          account.type === 'savings' ? 'bg-success/20 text-success' :
                          account.type === 'investment' ? 'bg-purple/20 text-purple' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {account.type === 'checking' ? <Wallet className="h-5 w-5" /> :
                           account.type === 'savings' ? <PieChart className="h-5 w-5" /> :
                           account.type === 'investment' ? <TrendingUp className="h-5 w-5" /> :
                           <CreditCard className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${account.balance < 0 ? 'text-destructive' : ''}`}>
                        ${account.balance.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Link to="/transactions">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'income' ? 'bg-success/20 text-success' :
                          transaction.type === 'expense' ? 'bg-warning/20 text-warning' :
                          'bg-purple/20 text-purple'
                        }`}>
                          {transaction.type === 'income' ? <TrendingUp className="h-5 w-5" /> :
                           transaction.type === 'expense' ? <TrendingDown className="h-5 w-5" /> :
                           <DollarSign className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground capitalize">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="flex items-end flex-col">
                        <div className={`font-bold ${
                          transaction.type === 'income' ? 'text-success' :
                          transaction.type === 'expense' ? 'text-warning' :
                          'text-purple'
                        }`}>
                          {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                          ${transaction.amount.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
