import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const branches = [
 'Computer Science & Engineering',
 'Information Technology',
 'Electronics & Communication',
 'Electrical Engineering',
 'Mechanical Engineering',
 'Civil Engineering',
];

export default function Register() {
 const { register } = useAuth();
 const navigate = useNavigate();
 const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  branch: 'Computer Science & Engineering',
  semester: '5',
 });
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const passwordChecks = [
  { label: 'At least 6 characters', met: form.password.length >= 6 },
  { label: 'Contains a number', met: /\d/.test(form.password) },
  { label: 'Passwords match', met: form.password && form.password === form.confirmPassword },
 ];

 const allChecksMet = passwordChecks.every(c => c.met);

 const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  if (!form.name || !form.email || !form.password) {
   setError('Please fill in all required fields.');
   return;
  }
  if (!allChecksMet) {
   setError('Please fix the password requirements below.');
   return;
  }

  setLoading(true);
  setTimeout(() => {
   const result = register(form.name, form.email, form.password, form.branch, form.semester);
   if (result.success) {
    navigate('/app');
   } else {
    setError(result.message);
   }
   setLoading(false);
  }, 800);
 };

 return (
  <div className="auth-page">
   <div className="auth-page__bg" />
   <motion.div
    className="auth-card auth-card--wide"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
   >
    <Link to="/" className="auth-card__logo">
     <Zap size={22} />
     <span>AcadTwin</span>
    </Link>

    <h2 className="auth-card__title">Create your account</h2>
    <p className="auth-card__subtitle">Start predicting your academic future</p>

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
     <div className="auth-form-grid">
      <div className="auth-field">
       <label className="comic-label">Full Name</label>
       <input
        type="text"
        className="comic-input"
        placeholder="Arjun Sharma"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        autoFocus
       />
      </div>

      <div className="auth-field">
       <label className="comic-label">Email Address</label>
       <input
        type="email"
        className="comic-input"
        placeholder="you@university.edu"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
       />
      </div>

      <div className="auth-field">
       <label className="comic-label">Branch</label>
       <select
        className="comic-select"
        value={form.branch}
        onChange={(e) => setForm({ ...form, branch: e.target.value })}
       >
        {branches.map(b => <option key={b} value={b}>{b}</option>)}
       </select>
      </div>

      <div className="auth-field">
       <label className="comic-label">Semester</label>
       <select
        className="comic-select"
        value={form.semester}
        onChange={(e) => setForm({ ...form, semester: e.target.value })}
       >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
         <option key={s} value={s}>Semester {s}</option>
        ))}
       </select>
      </div>

      <div className="auth-field">
       <label className="comic-label">Password</label>
       <div className="auth-field__password-wrap">
        <input
         type={showPassword ? 'text' : 'password'}
         className="comic-input"
         placeholder="Create a password"
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

      <div className="auth-field">
       <label className="comic-label">Confirm Password</label>
       <input
        type={showPassword ? 'text' : 'password'}
        className="comic-input"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
       />
      </div>
     </div>

     {/* Password strength */}
     {form.password && (
      <div className="auth-card__checks">
       {passwordChecks.map((check, i) => (
        <div key={i} className={`auth-card__check ${check.met ? 'met' : ''}`}>
         <Check size={14} />
         <span>{check.label}</span>
        </div>
       ))}
      </div>
     )}

     <button
      type="submit"
      className="comic-btn comic-btn--primary w-full"
      disabled={loading}
      style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}
     >
      {loading ? 'Creating account...' : 'Create Account'}
      {!loading && <ArrowRight size={16} />}
     </button>
    </form>

    <p className="auth-card__footer">
     Already have an account?{' '}
     <Link to="/login">Sign in</Link>
    </p>
   </motion.div>
  </div>
 );
}
