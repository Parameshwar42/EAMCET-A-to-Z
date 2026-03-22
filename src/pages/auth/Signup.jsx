import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Mail, Phone, Lock, ChevronRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 'var(--space-4)', backgroundColor: 'var(--bg-main)'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <Card padding="p-8" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
           <h2 className="h2" style={{ color: 'var(--primary)' }}>Create Account</h2>
           <p className="subtitle mb-6 text-center">Join 10,000+ students cracking TS/AP EAMCET</p>
        </div>
        
        {error && <div className="bg-red-100 text-danger p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input 
            label="Full Name" 
            icon={<User size={18}/>} 
            placeholder="e.g. Ravi Teja" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            label="Email Address" 
            type="email" 
            icon={<Mail size={18}/>} 
            placeholder="ravi@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Phone Number" 
            type="tel" 
            icon={<Phone size={18}/>} 
            placeholder="+91 90000 00000" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            icon={<Lock size={18}/>} 
            placeholder="Min. 8 characters" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-xs text-muted mb-2">By signing up, you agree to our Terms and Privacy Policy.</div>
          
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} <ChevronRight size={18} />
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Login</Link>
        </div>
      </Card>
    </div>
  );
}
