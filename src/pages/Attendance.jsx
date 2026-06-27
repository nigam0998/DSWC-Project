import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CalendarCheck, AlertCircle, CheckCircle, MinusCircle, Calculator } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import ComicCard from '../components/UI/ComicCard';
import ProgressBar from '../components/UI/ProgressBar';
import SpeechBubble from '../components/UI/SpeechBubble';
import ActionBadge from '../components/UI/ActionBadge';
import { getAttendancePercentage, predictAttendance, getMaxSkippableClasses } from '../data/predictionEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Attendance() {
 const { subjects, thresholds } = useStudent();
 const [selectedSubject, setSelectedSubject] = useState(null);
 const [classesToSkip, setClassesToSkip] = useState(0);
 const [upcomingClasses, setUpcomingClasses] = useState(10);

 // "Can I Skip?" calculator result
 const skipResult = useMemo(() => {
  if (!selectedSubject) return null;
  return predictAttendance(selectedSubject, classesToSkip, upcomingClasses);
 }, [selectedSubject, classesToSkip, upcomingClasses]);

 // Attendance trend chart data
 const trendChartData = useMemo(() => {
  const colors = subjects.map(s => s.color);
  return {
   labels: Array.from({ length: 10 }, (_, i) => `Class ${(i + 1) * Math.ceil(subjects[0].totalClasses / 10)}`),
   datasets: subjects.map((subject, idx) => {
    const log = subject.attendanceLog || [];
    const step = Math.max(1, Math.floor(log.length / 10));
    const points = [];
    for (let i = 0; i < 10 && i * step < log.length; i++) {
     const slice = log.slice(0, (i + 1) * step);
     const attended = slice.filter(l => l.status === 'present').length;
     points.push((attended / slice.length) * 100);
    }
    return {
     label: subject.shortName,
     data: points,
     borderColor: colors[idx],
     backgroundColor: 'transparent',
     borderWidth: 2.5,
     pointRadius: 3,
     pointHoverRadius: 6,
     pointBackgroundColor: colors[idx],
     pointBorderColor: '#1D1D2C',
     pointBorderWidth: 1.5,
     tension: 0.3,
    };
   }),
  };
 }, [subjects]);

 const trendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
   legend: {
    labels: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 12 },
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
     label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
    },
   },
  },
  scales: {
   y: {
    min: 50,
    max: 100,
    ticks: {
     font: { family: "'JetBrains Mono'", size: 11 },
     color: '#4A4A5A',
     callback: (v) => v + '%',
    },
    grid: { color: 'rgba(29,29,44,0.06)' },
   },
   x: {
    ticks: {
     font: { family: "'Comic Neue'", weight: 'bold', size: 11 },
     color: '#4A4A5A',
    },
    grid: { display: false },
   },
  },
 };

 return (
  <div>
   <div className="page-header">
    <motion.h1
     className="page-header__title"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
    >
     Attendance Tracker
    </motion.h1>
    <motion.p
     className="page-header__subtitle"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: 0.1 }}
    >
     Monitor your attendance across all subjects and predict future scenarios
    </motion.p>
   </div>

   {/* Subject Attendance Cards */}
   <div className="stat-grid mb-8">
    {subjects.map((subject, i) => {
     const percentage = getAttendancePercentage(subject);
     const maxSkip = getMaxSkippableClasses(subject, 10);
     const isCritical = percentage < thresholds.minAttendance;
     const isWarning = percentage < thresholds.safeAttendance;

     return (
      <ComicCard
       key={subject.id}
       delay={0.1 + i * 0.08}
       variant={isCritical ? 'danger' : ''}
       onClick={() => setSelectedSubject(subject)}
       style={{
        cursor: 'pointer',
        borderLeft: `5px solid ${subject.color}`,
       }}
       badge={isCritical ? <ActionBadge type="pow" label="LOW!" /> : null}
      >
       <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
         <h5 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{subject.shortName}</h5>
         <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 'var(--text-2xl)',
          color: isCritical ? 'var(--comic-danger)' : isWarning ? 'var(--comic-warning)' : 'var(--comic-success)',
         }}>
          {percentage.toFixed(1)}%
         </span>
        </div>
        <div style={{
         fontSize: 'var(--text-sm)',
         color: 'var(--comic-ink-muted)',
         marginBottom: 'var(--space-3)',
         fontWeight: 700,
        }}>
         {subject.attendedClasses}/{subject.totalClasses} classes attended
        </div>
        <ProgressBar
         value={percentage}
         max={100}
         showMarker={true}
         markerValue={thresholds.minAttendance}
         markerLabel={`${thresholds.minAttendance}%`}
         size="sm"
        />
       </div>
       <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)',
        color: 'var(--comic-ink-muted)',
        fontWeight: 700,
       }}>
        <span>Can skip: {maxSkip} more</span>
        <span style={{ color: subject.color }}>Click to simulate →</span>
       </div>
      </ComicCard>
     );
    })}
   </div>

   {/* "Can I Skip?" Calculator */}
   <ComicCard className="mb-8" delay={0.6}>
    <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
     <Calculator size={22} color="var(--comic-primary)" />
     <h4 style={{ margin: 0 }}>Can I Skip? Calculator</h4>
    </div>

    <div className="grid grid-2 gap-6">
     {/* Controls */}
     <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
       <label className="comic-label">Select Subject</label>
       <select
        className="comic-select"
        value={selectedSubject?.id || ''}
        onChange={(e) => {
         const sub = subjects.find(s => s.id === e.target.value);
         setSelectedSubject(sub);
         setClassesToSkip(0);
        }}
       >
        <option value="">Choose a subject...</option>
        {subjects.map(s => (
         <option key={s.id} value={s.id}>{s.shortName} — {s.name}</option>
        ))}
       </select>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
       <label className="comic-label">
        Upcoming Classes Remaining: {upcomingClasses}
       </label>
       <input
        type="range"
        className="comic-slider"
        min="1"
        max="20"
        value={upcomingClasses}
        onChange={(e) => setUpcomingClasses(parseInt(e.target.value))}
       />
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
       <label className="comic-label">
        Classes to Skip: {classesToSkip}
       </label>
       <input
        type="range"
        className="comic-slider"
        min="0"
        max={upcomingClasses}
        value={classesToSkip}
        onChange={(e) => setClassesToSkip(parseInt(e.target.value))}
       />
      </div>
     </div>

     {/* Results */}
     <div>
      <AnimatePresence mode="wait">
       {skipResult ? (
        <motion.div
         key={`${selectedSubject?.id}-${classesToSkip}`}
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.3 }}
        >
         <SpeechBubble>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
           {skipResult.canSkip ? (
            <CheckCircle size={28} color="var(--comic-success)" />
           ) : (
            <AlertCircle size={28} color="var(--comic-danger)" />
           )}
           <div>
            <strong style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-display)' }}>
             {skipResult.canSkip ? "Yes, you can skip!" : "No, don't skip!"}
            </strong>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--comic-ink-muted)' }}>
             {skipResult.canSkip
              ? `Skipping ${classesToSkip} class(es) is safe.`
              : `Skipping ${classesToSkip} class(es) will drop you below the minimum.`}
            </p>
           </div>
          </div>
         </SpeechBubble>

         <div className="grid grid-2 gap-4 mt-4">
          <div style={{
           textAlign: 'center',
           padding: 'var(--space-4)',
           background: 'var(--comic-bg)',
           borderRadius: 'var(--border-radius-sm)',
           border: 'var(--border-thin)',
          }}>
           <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
            {skipResult.current.toFixed(1)}%
           </div>
           <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>
            Current
           </div>
          </div>
          <div style={{
           textAlign: 'center',
           padding: 'var(--space-4)',
           background: skipResult.isBelowMinimum ? 'rgba(230,57,70,0.08)' : 'rgba(45,198,83,0.08)',
           borderRadius: 'var(--border-radius-sm)',
           border: `2px solid ${skipResult.isBelowMinimum ? 'var(--comic-danger)' : 'var(--comic-success)'}`,
          }}>
           <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: skipResult.isBelowMinimum ? 'var(--comic-danger)' : 'var(--comic-success)',
           }}>
            {skipResult.predicted.toFixed(1)}%
           </div>
           <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>
            Predicted
           </div>
          </div>
         </div>

         <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--comic-ink-muted)', fontWeight: 700 }}>
          Max skippable: <strong style={{ color: 'var(--comic-primary)' }}>{skipResult.maxSkippable}</strong> classes
          &nbsp;•&nbsp;
          Future total: {skipResult.futureTotal} classes
         </div>
        </motion.div>
       ) : (
        <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--comic-ink-muted)',
          textAlign: 'center',
          gap: 'var(--space-2)',
         }}
        >
         <CalendarCheck size={48} strokeWidth={1.5} />
         <p style={{ fontWeight: 700 }}>Select a subject to start calculating</p>
        </motion.div>
       )}
      </AnimatePresence>
     </div>
    </div>
   </ComicCard>

   {/* Attendance Trend Chart */}
   <ComicCard delay={0.8}>
    <h4 style={{ marginBottom: 'var(--space-4)' }}>
     📈 Attendance Trends Over Time
    </h4>
    <div className="chart-container chart-container--lg">
     <Line data={trendChartData} options={trendChartOptions} />
    </div>
   </ComicCard>
  </div>
 );
}
