
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try using admin@finassist.com / password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card max-w-md mx-auto mt-12 p-8 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-heading">Welcome Back</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/reset-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Demo credentials: admin@finassist.com / password</p>
      </div>
    </div>
  );
};
