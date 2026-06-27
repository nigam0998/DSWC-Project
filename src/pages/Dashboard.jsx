import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
 TrendingUp,
 Users,
 AlertTriangle,
 ClipboardList,
 CalendarClock,
 ArrowRight,
 Zap,
 Target,
 FlaskConical,
} from 'lucide-react';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 RadialLinearScale,
 Filler,
 Tooltip,
 Legend,
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import ComicCard from '../components/UI/ComicCard';
import ActionBadge from '../components/UI/ActionBadge';
import SpeechBubble from '../components/UI/SpeechBubble';
import StatBadge from '../components/UI/StatBadge';
import {
 getAttendancePercentage,
 identifyRiskSubjects,
 calculateAcademicHealth,
 getUpcomingDeadlines,
} from '../data/predictionEngine';

ChartJS.register(
 CategoryScale, LinearScale, PointElement, LineElement,
 RadialLinearScale, Filler, Tooltip, Legend
);

export default function Dashboard() {
 const { student, subjects, cgpaHistory } = useStudent();
 const { user } = useAuth();
 const userName = user?.name ? user.name.split(' ')[0] : student.name.split(' ')[0];

 const overallAttendance = useMemo(() => {
  const total = subjects.reduce((s, sub) => s + sub.totalClasses, 0);
  const attended = subjects.reduce((s, sub) => s + sub.attendedClasses, 0);
  return total > 0 ? (attended / total) * 100 : 0;
 }, [subjects]);

 const risks = useMemo(() => identifyRiskSubjects(), []);
 const health = useMemo(() => calculateAcademicHealth(), []);
 const deadlines = useMemo(() => getUpcomingDeadlines(60), []);
 const criticalRisks = risks.filter(r => r.riskLevel === 'critical');
 const pendingAssignments = deadlines.filter(d => d.type === 'assignment');

 // CGPA Chart
 const cgpaChartData = {
  labels: cgpaHistory.map(h => `Sem ${h.semester}`),
  datasets: [
   {
    label: 'CGPA',
    data: cgpaHistory.map(h => h.cgpa),
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 3,
    pointBackgroundColor: '#FF6B35',
    pointBorderColor: '#1D1D2C',
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 9,
    fill: true,
    tension: 0.3,
   },
   {
    label: 'SGPA',
    data: cgpaHistory.map(h => h.sgpa),
    borderColor: '#004E89',
    backgroundColor: 'rgba(0, 78, 137, 0.05)',
    borderWidth: 3,
    pointBackgroundColor: '#004E89',
    pointBorderColor: '#1D1D2C',
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 9,
    fill: true,
    tension: 0.3,
    borderDash: [5, 5],
   },
  ],
 };

 const cgpaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
   legend: {
    labels: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 13 },
     color: '#1D1D2C',
     usePointStyle: true,
    },
   },
   tooltip: {
    backgroundColor: '#1D1D2C',
    titleFont: { family: "'Bangers'", size: 16 },
    bodyFont: { family: "'Comic Neue'", weight: 'bold', size: 14 },
    padding: 12,
    cornerRadius: 8,
    borderColor: '#FF6B35',
    borderWidth: 2,
   },
  },
  scales: {
   y: {
    min: 6,
    max: 10,
    ticks: {
     font: { family: "'JetBrains Mono'", weight: 'bold', size: 12 },
     color: '#4A4A5A',
    },
    grid: { color: 'rgba(29,29,44,0.08)' },
   },
   x: {
    ticks: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 13 },
     color: '#4A4A5A',
    },
    grid: { display: false },
   },
  },
 };

 // Radar Chart
 const radarData = {
  labels: subjects.map(s => s.shortName),
  datasets: [
   {
    label: 'Attendance %',
    data: subjects.map(s => getAttendancePercentage(s)),
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderColor: '#FF6B35',
    borderWidth: 2,
    pointBackgroundColor: '#FF6B35',
    pointBorderColor: '#1D1D2C',
    pointBorderWidth: 2,
   },
   {
    label: 'Performance %',
    data: subjects.map(s => {
     const current = s.internalMarks + s.midTermMarks + s.assignmentMarks;
     const max = s.maxInternalMarks + s.maxMidTermMarks + s.maxAssignmentMarks;
     return (current / max) * 100;
    }),
    backgroundColor: 'rgba(0, 78, 137, 0.2)',
    borderColor: '#004E89',
    borderWidth: 2,
    pointBackgroundColor: '#004E89',
    pointBorderColor: '#1D1D2C',
    pointBorderWidth: 2,
   },
  ],
 };

 const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
   r: {
    min: 0,
    max: 100,
    ticks: {
     stepSize: 20,
     font: { family: "'JetBrains Mono'", size: 10 },
     color: '#8888A0',
     backdropColor: 'transparent',
    },
    pointLabels: {
     font: { family: "'Bangers'", size: 14 },
     color: '#1D1D2C',
    },
    grid: { color: 'rgba(29,29,44,0.1)' },
   },
  },
  plugins: {
   legend: {
    labels: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 13 },
     color: '#1D1D2C',
     usePointStyle: true,
    },
   },
   tooltip: {
    backgroundColor: '#1D1D2C',
    titleFont: { family: "'Bangers'", size: 14 },
    bodyFont: { family: "'JetBrains Mono'", weight: 'bold', size: 13 },
    padding: 10,
    cornerRadius: 8,
   },
  },
 };

 return (
  <div>
   {/* Hero Section */}
   <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
    <div>
     <motion.h1
      className="page-header__title"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
     >
      Welcome back, {userName}!
     </motion.h1>
     <motion.p
      className="page-header__subtitle"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
     >
      {student.branch} • {student.year} • Semester {student.semester}
     </motion.p>
    </div>
    <motion.div
     initial={{ opacity: 0, scale: 0 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    >
     <StatBadge
      value={student.cgpa}
      label="Current CGPA"
      color="primary"
      size={90}
      decimals={2}
     />
    </motion.div>
   </div>

   {/* Quick Stats Grid */}
   <div className="stat-grid mb-8">
    <ComicCard delay={0.1}>
     <div className="stat-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="stat-card__icon stat-card__icon--primary">
       <Users size={24} />
      </div>
      <div className="stat-card__content">
       <div className="stat-card__value" style={{ color: overallAttendance < 75 ? 'var(--comic-danger)' : 'var(--comic-ink)' }}>
        {overallAttendance.toFixed(1)}%
       </div>
       <div className="stat-card__title">Overall Attendance</div>
      </div>
     </div>
    </ComicCard>

    <ComicCard delay={0.2}>
     <div className="stat-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="stat-card__icon stat-card__icon--secondary">
       <TrendingUp size={24} />
      </div>
      <div className="stat-card__content">
       <div className="stat-card__value">{student.cgpa}</div>
       <div className="stat-card__title">Current CGPA</div>
      </div>
     </div>
    </ComicCard>

    <ComicCard delay={0.3} variant={pendingAssignments.length > 2 ? 'danger' : ''}>
     <div className="stat-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="stat-card__icon stat-card__icon--accent">
       <ClipboardList size={24} />
      </div>
      <div className="stat-card__content">
       <div className="stat-card__value">{pendingAssignments.length}</div>
       <div className="stat-card__title">Pending Assignments</div>
      </div>
     </div>
     {pendingAssignments.length > 2 && <ActionBadge type="pow" label="HURRY!" />}
    </ComicCard>

    <ComicCard delay={0.4} variant={criticalRisks.length > 0 ? 'danger' : 'success'}>
     <div className="stat-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
      <div className={`stat-card__icon ${criticalRisks.length > 0 ? 'stat-card__icon--danger' : 'stat-card__icon--success'}`}>
       <AlertTriangle size={24} />
      </div>
      <div className="stat-card__content">
       <div className="stat-card__value" style={{ color: criticalRisks.length > 0 ? 'var(--comic-danger)' : 'var(--comic-success)' }}>
        {criticalRisks.length}
       </div>
       <div className="stat-card__title">Risk Subjects</div>
      </div>
     </div>
     {criticalRisks.length > 0 && <ActionBadge type="zap" label="ALERT!" />}
    </ComicCard>
   </div>

   {/* Academic Health Score */}
   <ComicCard className="mb-8" delay={0.5}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div style={{
       width: 80,
       height: 80,
       borderRadius: '50%',
       border: `4px solid ${health.score >= 70 ? 'var(--comic-success)' : health.score >= 50 ? 'var(--comic-accent)' : 'var(--comic-danger)'}`,
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       fontFamily: 'var(--font-mono)',
       fontSize: 'var(--text-3xl)',
       fontWeight: 700,
       boxShadow: 'var(--shadow-sm)',
       background: 'var(--comic-surface)',
      }}>
       {health.score}
      </div>
      <div>
       <h4 style={{ margin: 0 }}>Academic Health Score</h4>
       <span className="comic-tag comic-tag--success" style={{
        background: health.status === 'excellent' ? 'var(--comic-success)' :
         health.status === 'good' ? 'var(--comic-primary)' :
         health.status === 'average' ? 'var(--comic-accent)' :
         'var(--comic-danger)',
        color: health.status === 'average' ? 'var(--comic-ink)' : '#fff',
       }}>
        {health.status.toUpperCase()}
       </span>
      </div>
     </div>

     <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      {Object.entries(health.breakdown).map(([key, data]) => (
       <div key={key} style={{ textAlign: 'center' }}>
        <div style={{
         fontFamily: 'var(--font-mono)',
         fontWeight: 700,
         fontSize: 'var(--text-lg)',
        }}>
         {data.score}/{data.max}
        </div>
        <div style={{
         fontSize: 'var(--text-xs)',
         color: 'var(--comic-ink-muted)',
         fontWeight: 700,
         textTransform: 'capitalize',
        }}>
         {key}
        </div>
       </div>
      ))}
     </div>
    </div>
   </ComicCard>

   {/* Charts Row */}
   <div className="grid grid-2 gap-6 mb-8">
    <ComicCard delay={0.6}>
     <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <TrendingUp size={24} /> CGPA Trend
     </h3>
     <div className="chart-container chart-container--md">
      <Line data={cgpaChartData} options={cgpaChartOptions} />
     </div>
    </ComicCard>

    <ComicCard delay={0.7}>
     <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <Target size={24} /> Subject Performance
     </h3>
     <div className="chart-container chart-container--md">
      <Radar data={radarData} options={radarOptions} />
     </div>
    </ComicCard>
   </div>

   {/* Risk Alerts & Deadlines Row */}
   <div className="grid grid-2 gap-6 mb-8">
    {/* Risk Alerts */}
    <ComicCard delay={0.8}>
     <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <AlertTriangle size={20} color="var(--comic-danger)" />
      Risk Alerts ({criticalRisks.length})
     </h4>
     {criticalRisks.length === 0 ? (
      <SpeechBubble>
       <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span>All clear!</span>
        <div>
         <strong>No critical risks detected.</strong>
         <p style={{ margin: 0, color: 'var(--comic-ink-muted)', fontSize: 'var(--text-sm)' }}>
          Keep it up!
         </p>
        </div>
       </div>
      </SpeechBubble>
     ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
       {risks.filter(r => r.riskLevel !== 'low').slice(0, 4).map((risk, i) => (
        <motion.div
         key={risk.subjectId}
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.9 + i * 0.1 }}
         style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: risk.riskLevel === 'critical' ? 'rgba(230, 57, 70, 0.08)' : 'rgba(252, 191, 73, 0.1)',
          border: `2px solid ${risk.riskLevel === 'critical' ? 'var(--comic-danger)' : 'var(--comic-accent)'}`,
          borderRadius: 'var(--border-radius-sm)',
         }}
        >
         <span style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: risk.color,
          border: '2px solid var(--comic-outline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          flexShrink: 0,
         }}>
          {risk.shortName}
         </span>
         <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{risk.subjectName}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--comic-ink-muted)' }}>
           {risk.riskFactors[0]}
          </div>
         </div>
         <span className={`comic-tag comic-tag--${risk.riskLevel === 'critical' ? 'danger' : 'accent'}`}>
          {risk.riskLevel.toUpperCase()}
         </span>
        </motion.div>
       ))}
      </div>
     )}
    </ComicCard>

    {/* Upcoming Deadlines */}
    <ComicCard delay={0.9}>
     <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <ClipboardList size={20} color="var(--comic-primary)" />
      Upcoming Deadlines
     </h4>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {deadlines.slice(0, 5).map((deadline, i) => (
       <motion.div
        key={deadline.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 + i * 0.1 }}
        style={{
         display: 'flex',
         alignItems: 'center',
         gap: 'var(--space-3)',
         padding: 'var(--space-3) var(--space-4)',
         background: deadline.isOverdue ? 'rgba(230, 57, 70, 0.06)' : 'var(--comic-bg)',
         border: `2px solid ${deadline.isOverdue ? 'var(--comic-danger)' : 'var(--comic-outline)'}`,
         borderRadius: 'var(--border-radius-sm)',
        }}
       >
        <span style={{
         fontSize: 'var(--text-xl)',
        }}>
         {deadline.type === 'exam' ? '📝' : ''}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
         <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{deadline.title}</div>
         <div style={{ fontSize: 'var(--text-xs)', color: 'var(--comic-ink-muted)' }}>
          {deadline.subject} • {new Date(deadline.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
         </div>
        </div>
        <span className={`comic-tag ${deadline.isOverdue ? 'comic-tag--danger' : deadline.daysLeft <= 3 ? 'comic-tag--accent' : 'comic-tag--outline'}`}>
         {deadline.isOverdue ? 'OVERDUE' : `${deadline.daysLeft}d left`}
        </span>
       </motion.div>
      ))}
     </div>
    </ComicCard>
   </div>

   {/* Quick Actions */}
   <ComicCard delay={1.0}>
    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
     <Zap size={20} color="var(--comic-accent)" />
     Quick Actions
    </h4>
    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
     <Link to="/simulator" style={{ textDecoration: 'none' }}>
      <motion.button
       className="comic-btn comic-btn--primary"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       <FlaskConical size={18} />
       Simulate Scenario
       <ArrowRight size={16} />
      </motion.button>
     </Link>
     <Link to="/attendance" style={{ textDecoration: 'none' }}>
      <motion.button
       className="comic-btn comic-btn--secondary"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       <Target size={18} />
       Check Attendance
       <ArrowRight size={16} />
      </motion.button>
     </Link>
     <Link to="/grades" style={{ textDecoration: 'none' }}>
      <motion.button
       className="comic-btn comic-btn--accent"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >
       <Zap size={18} />
       Grade Calculator
       <ArrowRight size={16} />
      </motion.button>
     </Link>
    </div>
   </ComicCard>
  </div>
 );
}
