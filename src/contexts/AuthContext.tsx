
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Define user roles
export type UserRole = 'admin' | 'user' | 'guest';

// User interface
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  };

  // Set up auth state listener
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profileData => {
          if (profileData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              role: profileData.role || 'user'
            });
            setIsAuthenticated(true);
          }
        });
      }
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              role: profileData.role || 'user'
            });
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error.message);
      return false;
    }

    navigate('/dashboard');
    return true;
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) {
      console.error('Signup error:', error.message);
      return false;
    }

    navigate('/dashboard');
    return true;
  };

  // Logout function
  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Reset password error:', error.message);
      return false;
    }

    return true;
  };

  const value = {
    user,
    session,
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
