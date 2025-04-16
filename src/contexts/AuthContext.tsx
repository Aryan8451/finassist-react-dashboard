
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user roles
export type UserRole = 'admin' | 'user' | 'guest';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@finassist.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@finassist.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
  },
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('finassist_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (mock authentication)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('finassist_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = mockUsers.some(u => u.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      role: 'user',
    };
    
    // Add to mock users (in a real app, this would be saved to a database)
    mockUsers.push(newUser);
    
    // Log in the new user
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('finassist_user', JSON.stringify(newUser));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('finassist_user');
  };

  // Password reset function (mocked)
  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const userExists = mockUsers.some(u => u.email === email);
    
    return userExists;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
