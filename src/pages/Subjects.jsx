import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Tooltip,
 Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
 BookOpen,
 Clock,
 AlertTriangle,
 ChevronDown,
 ChevronUp,
 X,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import ComicCard from '../components/UI/ComicCard';
import ProgressBar from '../components/UI/ProgressBar';
import ActionBadge from '../components/UI/ActionBadge';
import {
 getAttendancePercentage,
 calculateTotalMarks,
 getGradeFromPercentage,
 identifyRiskSubjects,
 calculateRequiredMarks,
} from '../data/predictionEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function Subjects() {
 const { subjects, thresholds, weeklyStudyHours, assignments } = useStudent();
 const [expandedSubject, setExpandedSubject] = useState(null);
 const [compareMode, setCompareMode] = useState(false);
 const [compareSubjects, setCompareSubjects] = useState([]);

 const risks = useMemo(() => identifyRiskSubjects(), []);

 const subjectDetails = useMemo(() => {
  return subjects.map(subject => {
   const attendance = getAttendancePercentage(subject);
   const avgPerf = (
    (subject.internalMarks / subject.maxInternalMarks) +
    (subject.midTermMarks / subject.maxMidTermMarks) +
    (subject.assignmentMarks / subject.maxAssignmentMarks)
   ) / 3;
   const estimatedFinal = Math.round(avgPerf * subject.maxFinalMarks);
   const marks = calculateTotalMarks(subject, estimatedFinal);
   const grade = getGradeFromPercentage(marks.percentage);
   const risk = risks.find(r => r.subjectId === subject.id);
   const subAssignments = assignments.filter(a => a.subjectId === subject.id);
   const requiredForA = calculateRequiredMarks(subject, 'A');

   return {
    ...subject,
    attendance,
    marks,
    grade,
    risk,
    estimatedFinal,
    subAssignments,
    requiredForA,
   };
  });
 }, [subjects, risks, assignments]);

 // Study hours chart
 const studyChartData = useMemo(() => {
  if (!weeklyStudyHours || weeklyStudyHours.length === 0) return null;
  return {
   labels: weeklyStudyHours.map(w => w.week),
   datasets: subjects.map(s => ({
    label: s.shortName,
    data: weeklyStudyHours.map(w => w[s.id] || 0),
    backgroundColor: s.color + '80',
    borderColor: s.color,
    borderWidth: 2,
    borderRadius: 3,
   })),
  };
 }, [weeklyStudyHours, subjects]);

 const studyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
   legend: {
    labels: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 11 },
     color: '#1D1D2C',
     usePointStyle: true,
    },
   },
   tooltip: {
    backgroundColor: '#1D1D2C',
    titleFont: { family: "'Bangers'", size: 14 },
    bodyFont: { family: "'JetBrains Mono'", weight: 'bold', size: 12 },
    padding: 10,
    cornerRadius: 8,
    callbacks: {
     label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}h`,
    },
   },
  },
  scales: {
   y: {
    stacked: true,
    ticks: {
     font: { family: "'JetBrains Mono'", size: 11 },
     color: '#4A4A5A',
     callback: (v) => v + 'h',
    },
    grid: { color: 'rgba(29,29,44,0.06)' },
   },
   x: {
    stacked: true,
    ticks: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 12 },
     color: '#4A4A5A',
    },
    grid: { display: false },
   },
  },
 };

 const toggleCompare = (subjectId) => {
  setCompareSubjects(prev => {
   if (prev.includes(subjectId)) return prev.filter(id => id !== subjectId);
   if (prev.length >= 3) return prev;
   return [...prev, subjectId];
  });
 };

 const comparedSubjects = compareSubjects.map(id => subjectDetails.find(s => s.id === id)).filter(Boolean);

 return (
  <div>
   <div className="page-header">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
     <div>
      <motion.h1
       className="page-header__title"
       initial={{ opacity: 0, x: -30 }}
       animate={{ opacity: 1, x: 0 }}
      >
       Subjects 
      </motion.h1>
      <motion.p
       className="page-header__subtitle"
       initial={{ opacity: 0, x: -30 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ delay: 0.1 }}
      >
       Deep dive into individual subject performance
      </motion.p>
     </div>
     <motion.button
      className={`comic-btn ${compareMode ? 'comic-btn--primary' : 'comic-btn--outline'}`}
      onClick={() => {
       setCompareMode(!compareMode);
       setCompareSubjects([]);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
     >
      {compareMode ? 'Exit Compare' : 'Compare Mode'}
     </motion.button>
    </div>
   </div>

   {/* Compare hint */}
   {compareMode && (
    <motion.div
     initial={{ opacity: 0, height: 0 }}
     animate={{ opacity: 1, height: 'auto' }}
     style={{
      padding: 'var(--space-3) var(--space-4)',
      background: 'rgba(0, 78, 137, 0.08)',
      border: '2px solid var(--comic-secondary)',
      borderRadius: 'var(--border-radius-sm)',
      marginBottom: 'var(--space-6)',
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
     }}
    >
     Click on up to 3 subjects to compare. Selected: {compareSubjects.length}/3
    </motion.div>
   )}

   {/* Subject Cards Grid */}
   <div className="stat-grid mb-8">
    {subjectDetails.map((subject, i) => {
     const isExpanded = expandedSubject === subject.id;
     const isSelected = compareSubjects.includes(subject.id);

     return (
      <ComicCard
       key={subject.id}
       delay={0.1 + i * 0.08}
       variant={subject.risk?.riskLevel === 'critical' ? 'danger' : ''}
       onClick={() => {
        if (compareMode) {
         toggleCompare(subject.id);
        } else {
         setExpandedSubject(isExpanded ? null : subject.id);
        }
       }}
       style={{
        borderLeft: `5px solid ${subject.color}`,
        outline: isSelected ? `3px solid ${subject.color}` : 'none',
        outlineOffset: '2px',
       }}
       badge={
        subject.risk?.riskLevel === 'critical'
         ? <ActionBadge type="pow" label="RISK!" />
         : subject.grade.grade === 'A+' || subject.grade.grade === 'A'
         ? <ActionBadge type="wham" label="ACE!" />
         : null
       }
      >
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
         <h4 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{subject.shortName}</h4>
         <div style={{ fontSize: 'var(--text-sm)', color: 'var(--comic-ink-muted)', fontWeight: 700, marginTop: '2px' }}>
          {subject.name}
         </div>
        </div>
        <span className={`comic-tag ${
         subject.grade.grade === 'A+' || subject.grade.grade === 'A' ? 'comic-tag--success' :
         subject.grade.grade === 'B+' || subject.grade.grade === 'B' ? 'comic-tag--primary' :
         'comic-tag--accent'
        }`}>
         {subject.grade.grade}
        </span>
       </div>

       <div style={{ marginTop: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)', marginBottom: '4px' }}>
         <span>Attendance</span>
         <span style={{
          color: subject.attendance < thresholds.minAttendance ? 'var(--comic-danger)' : 'var(--comic-ink)',
          fontFamily: 'var(--font-mono)',
         }}>
          {subject.attendance.toFixed(1)}%
         </span>
        </div>
        <ProgressBar
         value={subject.attendance}
         max={100}
         showMarker={true}
         markerValue={75}
         markerLabel="75%"
         size="sm"
         showLabel={false}
        />
       </div>

       <div style={{ marginTop: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)', marginBottom: '4px' }}>
         <span>Performance</span>
         <span style={{ fontFamily: 'var(--font-mono)' }}>
          {subject.marks.percentage.toFixed(1)}%
         </span>
        </div>
        <ProgressBar
         value={subject.marks.percentage}
         max={100}
         size="sm"
         showLabel={false}
        />
       </div>

       <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-3)',
        fontSize: 'var(--text-xs)',
        color: 'var(--comic-ink-muted)',
        fontWeight: 700,
       }}>
        <span>{subject.credits} credits • {subject.difficulty}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: subject.color }}>
         {compareMode ? (isSelected ? 'Selected ✓' : 'Click to select') : 'Details'}
         {!compareMode && (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
        </span>
       </div>

       {/* Expanded Details */}
       <AnimatePresence>
        {isExpanded && !compareMode && (
         <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ marginTop: 'var(--space-4)', overflow: 'hidden' }}
         >
          <div style={{
           borderTop: 'var(--border-thin)',
           paddingTop: 'var(--space-4)',
          }}>
           {/* Marks Breakdown */}
           <div className="grid grid-2 gap-3 mb-4">
            {[
             { label: 'Internal', value: subject.internalMarks, max: subject.maxInternalMarks },
             { label: 'Mid-Term', value: subject.midTermMarks, max: subject.maxMidTermMarks },
             { label: 'Assignment', value: subject.assignmentMarks, max: subject.maxAssignmentMarks },
             { label: 'Final (Est.)', value: subject.estimatedFinal, max: subject.maxFinalMarks },
            ].map(item => (
             <div key={item.label} style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--comic-bg)',
              borderRadius: 'var(--border-radius-sm)',
              border: 'var(--border-thin)',
             }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>
               {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
               {item.value}/{item.max}
              </div>
             </div>
            ))}
           </div>

           {/* Study hours & instructor */}
           <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--comic-ink-light)', marginBottom: 'var(--space-2)' }}>
            <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Study: {subject.studyHoursPerWeek}h/week • Instructor: {subject.instructor}
           </div>

           {/* Required for A */}
           {subject.requiredForA && (
            <div style={{
             fontSize: 'var(--text-sm)',
             fontWeight: 700,
             color: subject.requiredForA.isAchievable ? 'var(--comic-success)' : 'var(--comic-danger)',
            }}>
             Need <strong>{subject.requiredForA.requiredFinalMarks}/{subject.maxFinalMarks}</strong> in finals for A grade
             {subject.requiredForA.isAchievable ? ' ✓' : ' ✗'}
            </div>
           )}

           {/* Risk factors */}
           {subject.risk?.riskFactors.length > 0 && (
            <div style={{ marginTop: 'var(--space-2)' }}>
             {subject.risk.riskFactors.map((factor, j) => (
              <div key={j} style={{
               fontSize: 'var(--text-xs)',
               color: 'var(--comic-danger)',
               fontWeight: 700,
               display: 'flex',
               alignItems: 'center',
               gap: '4px',
              }}>
               <AlertTriangle size={12} />
               {factor}
              </div>
             ))}
            </div>
           )}
          </div>
         </motion.div>
        )}
       </AnimatePresence>
      </ComicCard>
     );
    })}
   </div>

   {/* Compare Panel */}
   <AnimatePresence>
    {compareMode && comparedSubjects.length >= 2 && (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
     >
      <ComicCard className="mb-8">
       <h4 style={{ marginBottom: 'var(--space-4)' }}>
         Comparison: {comparedSubjects.map(s => s.shortName).join(' vs ')}
       </h4>
       <div style={{ overflowX: 'auto' }}>
        <table className="comic-table">
         <thead>
          <tr>
           <th>Metric</th>
           {comparedSubjects.map(s => (
            <th key={s.id} style={{ color: '#fff' }}>
             <span style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: s.color,
              marginRight: 6,
             }} />
             {s.shortName}
            </th>
           ))}
          </tr>
         </thead>
         <tbody>
          {[
           { label: 'Attendance', key: 'attendance', format: v => v.toFixed(1) + '%' },
           { label: 'Performance', key: 'marks', format: (_, s) => s.marks.percentage.toFixed(1) + '%' },
           { label: 'Grade', key: 'grade', format: (_, s) => s.grade.grade },
           { label: 'Credits', key: 'credits', format: v => v },
           { label: 'Study Hours/Week', key: 'studyHoursPerWeek', format: v => v + 'h' },
           { label: 'Risk Level', key: 'risk', format: (_, s) => s.risk?.riskLevel || 'low' },
          ].map(row => (
           <tr key={row.label}>
            <td><strong>{row.label}</strong></td>
            {comparedSubjects.map(s => (
             <td key={s.id} style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {row.format(s[row.key], s)}
             </td>
            ))}
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </ComicCard>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Study Hours Chart */}
   {studyChartData && (
    <ComicCard delay={0.8}>
     <h4 style={{ marginBottom: 'var(--space-4)' }}>
       Weekly Study Hours
     </h4>
     <div className="chart-container chart-container--lg">
      <Bar data={studyChartData} options={studyChartOptions} />
     </div>
    </ComicCard>
   )}
  </div>
 );
}
