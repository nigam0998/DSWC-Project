import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
 const { login } = useAuth();
 const navigate = useNavigate();
 const [form, setForm] = useState({ email: '', password: '' });
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  if (!form.email || !form.password) {
   setError('Please fill in all fields.');
   return;
  }

  setLoading(true);
  setTimeout(() => {
   const result = login(form.email, form.password);
   if (result.success) {
    navigate('/app');
   } else {
    setError(result.message);
   }
   setLoading(false);
  }, 600);
 };

 return (
  <div className="auth-page">
   <div className="auth-page__bg" />
   <motion.div
    className="auth-card"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
   >
    <Link to="/" className="auth-card__logo">
     <Zap size={22} />
     <span>AcadTwin</span>
    </Link>

    <h2 className="auth-card__title">Welcome back</h2>
    <p className="auth-card__subtitle">Sign in to access your academic dashboard</p>

    {error && (
     <motion.div
      className="auth-card__error"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
     >
      {error}
     </motion.div>
    )}

    <form onSubmit={handleSubmit} className="auth-card__form">
     <div className="auth-field">
      <label className="comic-label">Email Address</label>
      <input
       type="email"
       className="comic-input"
       placeholder="you@university.edu"
       value={form.email}
       onChange={(e) => setForm({ ...form, email: e.target.value })}
       autoFocus
      />
     </div>

     <div className="auth-field">
      <label className="comic-label">Password</label>
      <div className="auth-field__password-wrap">
       <input
        type={showPassword ? 'text' : 'password'}
        className="comic-input"
        placeholder="Enter your password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
       />
       <button
        type="button"
        className="auth-field__toggle"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
       >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
       </button>
      </div>
     </div>

     <button
      type="submit"
      className="comic-btn comic-btn--primary w-full"
      disabled={loading}
      style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}
     >
      {loading ? 'Signing in...' : 'Sign In'}
      {!loading && <ArrowRight size={16} />}
     </button>
    </form>

    <p className="auth-card__footer">
     Don't have an account?{' '}
     <Link to="/register">Create one</Link>
    </p>
   </motion.div>
  </div>
 );
}
