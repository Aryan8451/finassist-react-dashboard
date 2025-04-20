
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
    console.log('Fetching user profile for:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    console.log('User profile data:', data);
    return data;
  };

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            const profileData = await fetchUserProfile(currentSession.user.id);
            if (profileData) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                firstName: profileData.first_name || '',
                lastName: profileData.last_name || '',
                role: profileData.role as UserRole || 'user'
              });
              setIsAuthenticated(true);
            } else {
              console.warn('No profile found for user:', currentSession.user.id);
              // Handle the case where profile data doesn't exist yet
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                firstName: '',
                lastName: '',
                role: 'user'
              });
              setIsAuthenticated(true);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('Existing session:', existingSession);
      setSession(existingSession);
      
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id).then(profileData => {
          if (profileData) {
            setUser({
              id: existingSession.user.id,
              email: existingSession.user.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              role: profileData.role as UserRole || 'user'
            });
            setIsAuthenticated(true);
          } else {
            console.warn('No profile found for existing user:', existingSession.user.id);
            // Handle case of missing profile data
            setUser({
              id: existingSession.user.id,
              email: existingSession.user.email || '',
              firstName: '',
              lastName: '',
              role: 'user'
            });
            setIsAuthenticated(true);
          }
        });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message || 'Failed to log in');
        return false;
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        toast.success('Login successful');
        navigate('/dashboard');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<boolean> => {
    try {
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
        toast.error(error.message || 'Failed to create account');
        return false;
      }

      if (data.user) {
        console.log('Signup successful:', data.user);
        toast.success('Account created successfully');
        navigate('/dashboard');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Unexpected signup error:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/landing');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('Reset password error:', error.message);
        toast.error(error.message || 'Failed to reset password');
        return false;
      }

      toast.success('Password reset email sent');
      return true;
    } catch (err) {
      console.error('Unexpected reset password error:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
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
