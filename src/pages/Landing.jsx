import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 ArrowRight,
 BarChart3,
 Brain,
 CalendarCheck,
 GraduationCap,
 LineChart,
 Shield,
 Sparkles,
 Target,
 TrendingUp,
 Users,
 Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
 {
  icon: Brain,
  title: 'Digital Twin Model',
  desc: 'A virtual replica of your academic journey that evolves with every class, assignment, and exam.',
  color: 'var(--comic-primary)',
 },
 {
  icon: LineChart,
  title: 'Scenario Simulator',
  desc: 'Ask "what if?" — skip classes, change study hours, predict final marks — and see the impact instantly.',
  color: 'var(--comic-secondary)',
 },
 {
  icon: Target,
  title: 'Grade Predictor',
  desc: 'Know exactly how many marks you need in your finals to hit your target grade.',
  color: 'var(--comic-success)',
 },
 {
  icon: CalendarCheck,
  title: 'Attendance Forecasting',
  desc: 'Find out how many classes you can safely skip without dropping below the threshold.',
  color: 'var(--comic-accent-dark)',
 },
 {
  icon: Shield,
  title: 'Risk Detection',
  desc: 'Automatically flags subjects where your attendance or performance is dangerously low.',
  color: 'var(--comic-danger)',
 },
 {
  icon: Sparkles,
  title: 'Smart Recommendations',
  desc: 'Personalized action items, study plans, and priority focus areas tailored to your profile.',
  color: '#7C3AED',
 },
];

const stats = [
 { value: '8+', label: 'Prediction Models' },
 { value: '6', label: 'Dashboard Views' },
 { value: '100%', label: 'Client-Side' },
 { value: '∞', label: 'Scenarios' },
];

const fadeUp = {
 hidden: { opacity: 0, y: 30 },
 visible: (i = 0) => ({
  opacity: 1,
  y: 0,
  transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
 }),
};

export default function Landing() {
 const { isAuthenticated } = useAuth();

 return (
  <div className="landing">
   {/* Navbar */}
   <nav className="landing-nav">
    <div className="landing-nav__inner">
     <Link to="/" className="landing-nav__logo">
      <Zap size={22} />
      <span>AcadTwin</span>
     </Link>
     <div className="landing-nav__links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      {isAuthenticated ? (
       <Link to="/app" className="comic-btn comic-btn--primary comic-btn--sm">
        Go to Dashboard
       </Link>
      ) : (
       <>
        <Link to="/login" className="comic-btn comic-btn--outline comic-btn--sm">
         Log In
        </Link>
        <Link to="/register" className="comic-btn comic-btn--primary comic-btn--sm">
         Get Started
        </Link>
       </>
      )}
     </div>
    </div>
   </nav>

   {/* Hero */}
   <section className="landing-hero">
    <div className="landing-hero__content">
     <motion.div
      className="landing-hero__badge"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
     >
      <Sparkles size={14} />
      Predictive Academic Intelligence
     </motion.div>

     <motion.h1
      className="landing-hero__title"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
     >
      Your Academic Future,{' '}
      <span className="landing-hero__highlight">Simulated.</span>
     </motion.h1>

     <motion.p
      className="landing-hero__desc"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
     >
      Academic Digital Twin creates a virtual model of your academic journey.
      Predict grades, simulate decisions, track attendance risks, and get
      personalized recommendations — all before consequences become real.
     </motion.p>

     <motion.div
      className="landing-hero__actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
     >
      <Link to={isAuthenticated ? '/app' : '/register'} className="comic-btn comic-btn--primary comic-btn--lg">
       {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
       <ArrowRight size={18} />
      </Link>
      <a href="#features" className="comic-btn comic-btn--outline comic-btn--lg">
       Explore Features
      </a>
     </motion.div>

     {/* Stats */}
     <motion.div
      className="landing-hero__stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.55 }}
     >
      {stats.map((s, i) => (
       <div key={i} className="landing-hero__stat">
        <span className="landing-hero__stat-value">{s.value}</span>
        <span className="landing-hero__stat-label">{s.label}</span>
       </div>
      ))}
     </motion.div>
    </div>

    {/* Hero Visual */}
    <motion.div
     className="landing-hero__visual"
     initial={{ opacity: 0, x: 60 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ duration: 0.7, delay: 0.3 }}
    >
     <div className="landing-hero__mockup">
      <div className="landing-hero__mockup-bar">
       <span /><span /><span />
      </div>
      <div className="landing-hero__mockup-body">
       <div className="landing-hero__mockup-sidebar">
        {['Dashboard', 'Attendance', 'Grades', 'Simulator', 'Subjects', 'Insights'].map((label, i) => (
         <div key={i} className={`landing-hero__mockup-nav-item ${i === 0 ? 'active' : ''}`}>
          {label}
         </div>
        ))}
       </div>
       <div className="landing-hero__mockup-content">
        <div className="landing-hero__mockup-cards">
         <div className="landing-hero__mockup-card" style={{ borderLeftColor: 'var(--comic-primary)' }}>
          <div className="landing-hero__mockup-card-value">8.12</div>
          <div className="landing-hero__mockup-card-label">CGPA</div>
         </div>
         <div className="landing-hero__mockup-card" style={{ borderLeftColor: 'var(--comic-success)' }}>
          <div className="landing-hero__mockup-card-value">84.2%</div>
          <div className="landing-hero__mockup-card-label">Attendance</div>
         </div>
         <div className="landing-hero__mockup-card" style={{ borderLeftColor: 'var(--comic-danger)' }}>
          <div className="landing-hero__mockup-card-value">2</div>
          <div className="landing-hero__mockup-card-label">At Risk</div>
         </div>
        </div>
        <div className="landing-hero__mockup-chart">
         <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
          <polyline points="0,50 30,40 60,42 90,30 120,25 150,20 180,15 200,10" fill="none" stroke="var(--comic-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="0,50 30,40 60,42 90,30 120,25 150,20 180,15 200,10" fill="url(#heroGrad)" stroke="none"/>
          <defs>
           <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--comic-primary)" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="var(--comic-primary)" stopOpacity="0"/>
           </linearGradient>
          </defs>
         </svg>
        </div>
       </div>
      </div>
     </div>
    </motion.div>
   </section>

   {/* Features */}
   <section className="landing-features" id="features">
    <div className="landing-section-inner">
     <motion.div
      className="landing-section-header"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
     >
      <span className="landing-section-tag">Core Capabilities</span>
      <h2>Everything you need to take control of your academics</h2>
      <p>
       Six powerful modules working together to give you complete visibility
       into your academic trajectory.
      </p>
     </motion.div>

     <div className="landing-features__grid">
      {features.map((f, i) => {
       const Icon = f.icon;
       return (
        <motion.div
         key={i}
         className="landing-feature-card"
         variants={fadeUp}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: '-60px' }}
         custom={i}
        >
         <div className="landing-feature-card__icon" style={{ background: f.color }}>
          <Icon size={22} color="#fff" />
         </div>
         <h3>{f.title}</h3>
         <p>{f.desc}</p>
        </motion.div>
       );
      })}
     </div>
    </div>
   </section>

   {/* How It Works */}
   <section className="landing-how" id="how-it-works">
    <div className="landing-section-inner">
     <motion.div
      className="landing-section-header"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
     >
      <span className="landing-section-tag">How It Works</span>
      <h2>Three steps to smarter academic decisions</h2>
     </motion.div>

     <div className="landing-how__steps">
      {[
       {
        step: '01',
        title: 'Build Your Profile',
        desc: 'Your academic data — attendance, marks, assignments, study hours — forms a living digital twin.',
        icon: Users,
       },
       {
        step: '02',
        title: 'Simulate & Predict',
        desc: 'Ask what-if questions. The engine forecasts attendance, grades, and CGPA impact in real time.',
        icon: BarChart3,
       },
       {
        step: '03',
        title: 'Act on Insights',
        desc: 'Get prioritized recommendations and a study plan optimized for your risk profile.',
        icon: TrendingUp,
       },
      ].map((item, i) => {
       const Icon = item.icon;
       return (
        <motion.div
         key={i}
         className="landing-how__step"
         variants={fadeUp}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: '-60px' }}
         custom={i}
        >
         <div className="landing-how__step-number">{item.step}</div>
         <div className="landing-how__step-icon">
          <Icon size={28} />
         </div>
         <h3>{item.title}</h3>
         <p>{item.desc}</p>
        </motion.div>
       );
      })}
     </div>
    </div>
   </section>

   {/* CTA */}
   <section className="landing-cta">
    <motion.div
     className="landing-cta__inner"
     variants={fadeUp}
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true, margin: '-80px' }}
    >
     <h2>Ready to take control of your academics?</h2>
     <p>
      Create your free account and start simulating your academic future today.
     </p>
     <Link to={isAuthenticated ? '/app' : '/register'} className="comic-btn comic-btn--primary comic-btn--lg">
      {isAuthenticated ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
      <ArrowRight size={18} />
     </Link>
    </motion.div>
   </section>

   {/* Footer */}
   <footer className="landing-footer">
    <div className="landing-footer__inner">
     <div className="landing-footer__brand">
      <Zap size={18} />
      <span>AcadTwin</span>
     </div>
     <p>Academic Digital Twin — A Predictive Academic Performance & Decision Support Platform</p>
     <p className="landing-footer__copy">DSWC Project &copy; {new Date().getFullYear()}</p>
    </div>
   </footer>
  </div>
 );
}
