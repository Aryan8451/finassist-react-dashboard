
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result) {
        setSuccess(true);
      } else {
        setError('No account found with this email address.');
      }
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-heading">Reset Password</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success ? (
        <div className="space-y-4">
          <Alert className="mb-4 bg-success-light border-success">
            <AlertDescription className="text-success-dark">
              If an account exists with this email, you will receive instructions to reset your password.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Link to="/login">
              <Button variant="outline">Return to Login</Button>
            </Link>
          </div>
        </div>
      ) : (
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
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-primary text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
