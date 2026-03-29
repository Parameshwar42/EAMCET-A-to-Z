import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to structure Google Auth');
      setLoading(false);
    }
  };
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--bg-main)'
  };

  const activeTabStyle = {
    flex: 1, textAlign: 'center', padding: 'var(--space-2)',
    borderBottom: '2px solid var(--primary)', color: 'var(--primary)',
    fontWeight: '600', cursor: 'pointer'
  };
  const inactiveTabStyle = {
    flex: 1, textAlign: 'center', padding: 'var(--space-2)',
    borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)',
    fontWeight: '600', cursor: 'pointer'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <Card padding="p-8" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
           <h2 className="h2" style={{ color: 'var(--primary)' }}>Welcome Back</h2>
           <p className="subtitle">Login to continue your preparation</p>
        </div>



        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <div className="bg-red-100 text-danger p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

            <Input
              label="Email Address"
              type="email"
              icon={<Mail size={18} />}
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              icon={<Lock size={18} />}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary font-semibold hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'} <LogIn size={18}/>
            </Button>
          </form>

          <div className="my-6 relative flex items-center justify-center">
            <hr className="w-full border-color absolute" />
            <span className="bg-bg-card px-3 text-sm text-muted relative z-10 font-semibold">OR</span>
          </div>

          <Button onClick={handleGoogleLogin} variant="outline" fullWidth disabled={loading} className="mb-6 bg-white hover:bg-slate-50 border-slate-200">
             <Chrome size={18} className="text-blue-500 mr-2"/> Continue with Google
          </Button>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
