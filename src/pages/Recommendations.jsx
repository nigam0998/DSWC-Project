import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend,
} from 'chart.js';
import {
 Lightbulb,
 AlertTriangle,
 AlertCircle,
 BookOpen,
 TrendingUp,
 Calendar,
 Clock,
 Target,
 Award,
 Star,
 Shield,
 Zap,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import ComicCard from '../components/UI/ComicCard';
import SpeechBubble from '../components/UI/SpeechBubble';
import ProgressBar from '../components/UI/ProgressBar';
import ActionBadge from '../components/UI/ActionBadge';
import StatBadge from '../components/UI/StatBadge';
import {
 generateRecommendations,
 calculateAcademicHealth,
 identifyRiskSubjects,
 getAttendancePercentage,
} from '../data/predictionEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Recommendations() {
 const { subjects, student } = useStudent();

 const recommendations = useMemo(() => generateRecommendations(), []);
 const health = useMemo(() => calculateAcademicHealth(), []);
 const risks = useMemo(() => identifyRiskSubjects(), []);

 const priorityIcons = {
  critical: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Lightbulb size={20} />,
 };

 const priorityColors = {
  critical: { bg: 'rgba(230, 57, 70, 0.08)', border: 'var(--comic-danger)', text: 'var(--comic-danger)' },
  warning: { bg: 'rgba(252, 191, 73, 0.1)', border: 'var(--comic-accent)', text: 'var(--comic-warning)' },
  info: { bg: 'rgba(76, 201, 240, 0.08)', border: 'var(--comic-info)', text: 'var(--comic-info)' },
 };

 const categoryIcons = {
  attendance: <Calendar size={16} />,
  performance: <TrendingUp size={16} />,
  assignments: <BookOpen size={16} />,
  study: <Clock size={16} />,
  cgpa: <Target size={16} />,
 };

 // Generate study plan
 const studyPlan = useMemo(() => {
  const totalAvailableHours = 35; // ~5 hours/day
  const riskScores = risks.map(r => ({
   id: r.subjectId,
   shortName: r.shortName,
   color: r.color,
   risk: r.riskLevel === 'critical' ? 3 : r.riskLevel === 'medium' ? 2 : 1,
   currentHours: subjects.find(s => s.id === r.subjectId)?.studyHoursPerWeek || 0,
  }));

  const totalRisk = riskScores.reduce((s, r) => s + r.risk, 0);
  return riskScores.map(r => ({
   ...r,
   suggestedHours: Math.round((r.risk / totalRisk) * totalAvailableHours),
  }));
 }, [risks, subjects]);

 // Achievement badges
 const badges = useMemo(() => {
  const earned = [];
  const avgAttendance = subjects.reduce((s, sub) => s + getAttendancePercentage(sub), 0) / subjects.length;

  if (avgAttendance >= 90) earned.push({ icon: '', label: 'Perfect Attendance', type: 'wham' });
  if (student.cgpa >= 9) earned.push({ icon: '', label: 'Scholar', type: 'zap' });
  if (student.cgpa >= 8) earned.push({ icon: '', label: 'Dean\'s List', type: 'boom' });
  if (health.score >= 80) earned.push({ icon: '', label: 'Healthy Performer', type: 'wham' });
  
  const goodSubjects = risks.filter(r => r.riskLevel === 'low').length;
  if (goodSubjects >= 5) earned.push({ icon: '', label: 'All-Rounder', type: 'zap' });
  if (goodSubjects >= 3) earned.push({ icon: '', label: 'Consistent', type: 'boom' });

  return earned;
 }, [subjects, student, health, risks]);

 return (
  <div>
   <div className="page-header">
    <motion.h1
     className="page-header__title"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
    >
     Smart Recommendations 
    </motion.h1>
    <motion.p
     className="page-header__subtitle"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: 0.1 }}
    >
     Personalized insights and action items to optimize your academic performance
    </motion.p>
   </div>

   {/* Academic Health Meter */}
   <ComicCard className="mb-8" delay={0.2}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
      <div style={{ position: 'relative' }}>
       <StatBadge
        value={health.score}
        label=""
        suffix=""
        color={health.score >= 70 ? 'success' : health.score >= 50 ? 'accent' : 'danger'}
        size={120}
        decimals={0}
       />
      </div>
      <div>
       <h3 style={{ margin: 0 }}>Academic Health</h3>
       <span className={`comic-tag ${
        health.status === 'excellent' ? 'comic-tag--success' :
        health.status === 'good' ? 'comic-tag--primary' :
        health.status === 'average' ? 'comic-tag--accent' :
        'comic-tag--danger'
       }`}>
        {health.status.toUpperCase()}
       </span>
       <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)', color: 'var(--comic-ink-muted)', fontWeight: 700, maxWidth: 300 }}>
        {health.score >= 80 ? "You're doing great! Keep maintaining your performance." :
         health.score >= 60 ? "Good progress, but there's room for improvement in some areas." :
         "You need to take immediate action to improve your academic standing."}
       </p>
      </div>
     </div>

     {/* Health breakdown bars */}
     <div style={{ flex: '0 1 400px', minWidth: '250px' }}>
      {Object.entries(health.breakdown).map(([key, data]) => (
       <div key={key} style={{ marginBottom: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)', marginBottom: '2px' }}>
         <span style={{ textTransform: 'capitalize' }}>{key}</span>
         <span style={{ fontFamily: 'var(--font-mono)' }}>{data.score}/{data.max}</span>
        </div>
        <ProgressBar
         value={data.score}
         max={data.max}
         size="sm"
         showLabel={false}
        />
       </div>
      ))}
     </div>
    </div>
   </ComicCard>

   <div className="grid grid-2 gap-6 mb-8">
    {/* Priority Action Items */}
    <div>
     <ComicCard delay={0.3}>
      <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
       <Zap size={22} color="var(--comic-primary)" />
       Priority Action Items
      </h4>

      {recommendations.length === 0 ? (
       <SpeechBubble>
        <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
         <span style={{ fontSize: 'var(--text-3xl)' }}></span>
         <p style={{ fontWeight: 700, margin: 'var(--space-2) 0 0' }}>
          No urgent actions needed! You're on track.
         </p>
        </div>
       </SpeechBubble>
      ) : (
       <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recommendations.map((rec, i) => {
         const colors = priorityColors[rec.priority] || priorityColors.info;
         return (
          <motion.div
           key={rec.id}
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 + i * 0.08 }}
           style={{
            padding: 'var(--space-4)',
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            borderRadius: 'var(--border-radius-sm)',
           }}
          >
           <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-3)' }}>
            <span style={{ color: colors.text, flexShrink: 0, marginTop: '2px' }}>
             {priorityIcons[rec.priority]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)', flexWrap: 'wrap' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>
               {rec.title}
              </strong>
              {rec.subject && (
               <span className="comic-tag comic-tag--outline" style={{ fontSize: '10px' }}>
                {categoryIcons[rec.category]}
                <span style={{ marginLeft: '4px' }}>{rec.subject}</span>
               </span>
              )}
             </div>
             <p style={{ fontSize: 'var(--text-sm)', color: 'var(--comic-ink-light)', margin: '0 0 var(--space-2)', fontWeight: 700 }}>
              {rec.description}
             </p>
             <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--comic-primary)',
              background: 'rgba(255,107,53,0.08)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid rgba(255,107,53,0.2)',
             }}>
               {rec.action}
             </div>
            </div>
           </div>
          </motion.div>
         );
        })}
       </div>
      )}
     </ComicCard>
    </div>

    {/* Right column */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
     {/* Subject Risk Matrix */}
     <ComicCard delay={0.5}>
      <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
       <Shield size={22} />
       Subject Risk Overview
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
       {risks.map((risk, i) => (
        <motion.div
         key={risk.subjectId}
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.6 + i * 0.05 }}
         style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--comic-bg)',
          border: 'var(--border-thin)',
          borderRadius: 'var(--border-radius-sm)',
          borderLeftWidth: '4px',
          borderLeftColor: risk.color,
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
          fontSize: '11px',
          flexShrink: 0,
         }}>
          {risk.shortName}
         </span>

         <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <strong style={{ fontSize: 'var(--text-sm)' }}>{risk.subjectName}</strong>
           <span className={`comic-tag ${
            risk.riskLevel === 'critical' ? 'comic-tag--danger' :
            risk.riskLevel === 'medium' ? 'comic-tag--accent' :
            'comic-tag--success'
           }`} style={{ fontSize: '10px' }}>
            {risk.riskLevel.toUpperCase()}
           </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--comic-ink-muted)', fontWeight: 700, marginTop: '4px' }}>
           <span>Att: {risk.attendance.toFixed(1)}%</span>
           <span>Perf: {risk.currentPerformance.toFixed(1)}%</span>
           <span>Asg: {risk.pendingAssignments} pending</span>
          </div>
         </div>
        </motion.div>
       ))}
      </div>
     </ComicCard>

     {/* Study Plan */}
     <ComicCard delay={0.7}>
      <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
       <Clock size={22} />
       Suggested Weekly Study Plan
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
       {studyPlan.map((item, i) => (
        <motion.div
         key={item.id}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.8 + i * 0.05 }}
        >
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
           <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: item.color,
            border: '1px solid var(--comic-outline)',
            flexShrink: 0,
           }} />
           <strong style={{ fontSize: 'var(--text-sm)' }}>{item.shortName}</strong>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
           <span style={{ color: 'var(--comic-ink-muted)' }}>{item.currentHours}h</span>
           <span style={{ margin: '0 4px' }}>→</span>
           <span style={{ color: item.suggestedHours > item.currentHours ? 'var(--comic-primary)' : 'var(--comic-success)' }}>
            {item.suggestedHours}h
           </span>
          </div>
         </div>
         <ProgressBar
          value={item.suggestedHours}
          max={Math.max(...studyPlan.map(s => s.suggestedHours))}
          size="sm"
          showLabel={false}
          color={item.risk === 3 ? 'danger' : item.risk === 2 ? 'warning' : 'success'}
         />
        </motion.div>
       ))}
       <div style={{
        marginTop: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--comic-bg)',
        borderRadius: 'var(--border-radius-sm)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        color: 'var(--comic-ink-muted)',
        textAlign: 'center',
       }}>
        Total: {studyPlan.reduce((s, item) => s + item.suggestedHours, 0)}h/week (~{(studyPlan.reduce((s, item) => s + item.suggestedHours, 0) / 7).toFixed(1)}h/day)
       </div>
      </div>
     </ComicCard>

     {/* Achievement Badges */}
     <ComicCard delay={0.9}>
      <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
       <Award size={22} color="var(--comic-accent)" />
       Achievement Badges
      </h4>
      {badges.length === 0 ? (
       <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--comic-ink-muted)' }}>
        <Star size={40} strokeWidth={1.5} />
        <p style={{ fontWeight: 700, marginTop: 'var(--space-2)' }}>
         Keep improving to earn badges!
        </p>
       </div>
      ) : (
       <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        {badges.map((badge, i) => (
         <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 1 + i * 0.1 }}
          style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           gap: 'var(--space-1)',
           padding: 'var(--space-3)',
           background: 'var(--comic-bg)',
           border: 'var(--border-thin)',
           borderRadius: 'var(--border-radius-md)',
           minWidth: '80px',
          }}
         >
          <span style={{ fontSize: 'var(--text-2xl)' }}>{badge.icon}</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', color: 'var(--comic-ink-light)' }}>
           {badge.label}
          </span>
         </motion.div>
        ))}
       </div>
      )}
     </ComicCard>
    </div>
   </div>
  </div>
 );
}
