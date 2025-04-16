
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  CalculatorIcon,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LandingPage = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold gradient-heading">FinAssist</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground/80 hover:text-primary font-medium">
                Home
              </Link>
              <a href="#services" className="text-foreground/80 hover:text-primary font-medium">
                Services
              </a>
              <a href="#about" className="text-foreground/80 hover:text-primary font-medium">
                About Us
              </a>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <span>Hi, {user?.firstName}</span>
                      <User size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </div>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {isAuthenticated && (
                <Link to="/dashboard" className="mr-4">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a 
                href="#services"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </a>
              
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
              
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between py-12 md:py-20">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-heading mb-6">
                Smart Financial Solutions for Everyone
              </h1>
              <p className="text-lg text-foreground/80 mb-8 max-w-xl">
                Take control of your finances with intelligent tools that help you plan, save, and invest for a secure future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="font-medium">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#services">
                  <Button variant="outline" size="lg">
                    Explore Services
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-white dark:bg-card p-6 rounded-xl shadow-lg card-gradient">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">Financial Overview</h3>
                  <p className="text-sm text-muted-foreground">Demo Dashboard Preview</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Total Balance</span>
                    <span className="font-bold">$46,700</span>
                  </div>
                  <div className="flex justify-between p-3 bg-success/5 rounded-lg">
                    <span className="font-medium">Monthly Income</span>
                    <span className="font-bold text-success">$5,300</span>
                  </div>
                  <div className="flex justify-between p-3 bg-warning/5 rounded-lg">
                    <span className="font-medium">Monthly Expenses</span>
                    <span className="font-bold text-warning">$3,450</span>
                  </div>
                  <div className="flex justify-between p-3 bg-info/5 rounded-lg">
                    <span className="font-medium">Investments</span>
                    <span className="font-bold text-info">$32,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-heading">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial tools designed to help you achieve your financial goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* AI-Based Financial Planning */}
          <div className="stat-card flex flex-col">
            <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Based Financial Planning</h3>
            <p className="text-muted-foreground flex-grow">
              Get personalized financial advice powered by advanced algorithms that analyze your spending habits and goals.
            </p>
            <div className="mt-4">
              <Link to="/signup">
                <Button variant="link" className="p-0 h-auto font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Smart Retirement Planning */}
          <div className="stat-card flex flex-col">
            <div className="mb-4 p-3 bg-info/10 rounded-full w-14 h-14 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-info" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Retirement Planning</h3>
            <p className="text-muted-foreground flex-grow">
              Plan for your future with intelligent retirement calculators and investment strategies tailored to your timeline.
            </p>
            <div className="mt-4">
              <Link to="/signup">
                <Button variant="link" className="p-0 h-auto font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Advanced Risk Management */}
          <div className="stat-card flex flex-col">
            <div className="mb-4 p-3 bg-success/10 rounded-full w-14 h-14 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Risk Management</h3>
            <p className="text-muted-foreground flex-grow">
              Protect your assets with sophisticated risk assessment tools and personalized insurance recommendations.
            </p>
            <div className="mt-4">
              <Link to="/signup">
                <Button variant="link" className="p-0 h-auto font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Optimized Taxation */}
          <div className="stat-card flex flex-col">
            <div className="mb-4 p-3 bg-warning/10 rounded-full w-14 h-14 flex items-center justify-center">
              <CalculatorIcon className="h-7 w-7 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Optimized Taxation</h3>
            <p className="text-muted-foreground flex-grow">
              Maximize your tax savings with intelligent de.duction finders and year-round tax optimization strategies.
            </p>
            <div className="mt-4">
              <Link to="/signup">
                <Button variant="link" className="p-0 h-auto font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-container bg-secondary/30 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading">About FinAssist</h2>
              <p className="text-lg mb-6">
                FinAssist was founded with a simple mission: make professional financial management accessible to everyone, not just the wealthy.
              </p>
              <p className="mb-6">
                Our team combines expertise in finance, technology, and security to deliver a platform that empowers you to make smart financial decisions with confidence.
              </p>
              <p>
                With user-friendly tools and data-driven insights, we're helping thousands of people reach their financial goals faster than they ever thought possible.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md card-gradient">
                <h3 className="text-xl font-semibold mb-4">Why Choose FinAssist</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span>Personalized financial insights tailored to your unique situation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span>Advanced security to protect your sensitive financial information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span>Intuitive tools that make complex financial concepts simple</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span>Continuous updates with the latest financial strategies and tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your finances?</h2>
          <p className="text-xl mb-8">
            Join thousands of users who are taking control of their financial future with FinAssist.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="font-medium text-primary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FinAssist</h3>
              <p className="text-background/80">
                Smart financial solutions for a brighter future.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-background/80 hover:text-white">Financial Planning</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Retirement Planning</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Risk Management</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Tax Optimization</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-background/80 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Press</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-background/80 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="text-background/80 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-background/20 text-center text-background/60">
            <p>&copy; {new Date().getFullYear()} FinAssist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
