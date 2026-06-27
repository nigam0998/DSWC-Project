import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 ArcElement,
 Tooltip,
 Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { GraduationCap, Target, Calculator, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import ComicCard from '../components/UI/ComicCard';
import ProgressBar from '../components/UI/ProgressBar';
import SpeechBubble from '../components/UI/SpeechBubble';
import ActionBadge from '../components/UI/ActionBadge';
import StatBadge from '../components/UI/StatBadge';
import {
 calculateTotalMarks,
 getGradeFromPercentage,
 calculateRequiredMarks,
 predictCGPAWithGradeChanges,
 calculateSGPA,
} from '../data/predictionEngine';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Grades() {
 const { subjects, student, gradingScale } = useStudent();
 const [selectedSubject, setSelectedSubject] = useState(null);
 const [targetGrade, setTargetGrade] = useState('A');
 const [finalMarks, setFinalMarks] = useState({});

 // Calculate current marks for each subject
 const subjectMarks = useMemo(() => {
  return subjects.map(subject => {
   const estimatedFinalPerf = (
    (subject.internalMarks / subject.maxInternalMarks) +
    (subject.midTermMarks / subject.maxMidTermMarks) +
    (subject.assignmentMarks / subject.maxAssignmentMarks)
   ) / 3;
   const estimatedFinal = Math.round(estimatedFinalPerf * subject.maxFinalMarks);
   const userFinal = finalMarks[subject.id];
   const usedFinal = userFinal !== undefined ? userFinal : estimatedFinal;
   const marks = calculateTotalMarks(subject, usedFinal);
   const grade = getGradeFromPercentage(marks.percentage);

   return {
    ...subject,
    ...marks,
    ...grade,
    estimatedFinal,
    userFinal: userFinal !== undefined ? userFinal : null,
    usedFinal,
   };
  });
 }, [subjects, finalMarks]);

 // CGPA prediction
 const cgpaPrediction = useMemo(() => {
  const marksMap = {};
  subjectMarks.forEach(s => {
   marksMap[s.id] = s.usedFinal;
  });
  return predictCGPAWithGradeChanges(subjects, marksMap);
 }, [subjectMarks, subjects]);

 // Required marks calculator
 const requiredMarksResult = useMemo(() => {
  if (!selectedSubject) return null;
  return calculateRequiredMarks(selectedSubject, targetGrade);
 }, [selectedSubject, targetGrade]);

 // Bar chart
 const barChartData = {
  labels: subjectMarks.map(s => s.shortName),
  datasets: [
   {
    label: 'Internal',
    data: subjectMarks.map(s => (s.internal / s.maxInternalMarks) * 100),
    backgroundColor: '#FF6B35',
    borderColor: '#1D1D2C',
    borderWidth: 2,
    borderRadius: 4,
   },
   {
    label: 'Mid-Term',
    data: subjectMarks.map(s => (s.midTerm / s.maxMidTermMarks) * 100),
    backgroundColor: '#004E89',
    borderColor: '#1D1D2C',
    borderWidth: 2,
    borderRadius: 4,
   },
   {
    label: 'Assignment',
    data: subjectMarks.map(s => (s.assignment / s.maxAssignmentMarks) * 100),
    backgroundColor: '#2DC653',
    borderColor: '#1D1D2C',
    borderWidth: 2,
    borderRadius: 4,
   },
   {
    label: 'Final (Est.)',
    data: subjectMarks.map(s => (s.usedFinal / s.maxFinalMarks) * 100),
    backgroundColor: '#FCBF49',
    borderColor: '#1D1D2C',
    borderWidth: 2,
    borderRadius: 4,
   },
  ],
 };

 const barChartOptions = {
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
    min: 0,
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
     font: { family: "'Bangers'", size: 14 },
     color: '#1D1D2C',
    },
    grid: { display: false },
   },
  },
 };

 // CGPA gauge doughnut
 const gaugeData = {
  labels: ['CGPA', 'Remaining'],
  datasets: [
   {
    data: [cgpaPrediction.predictedCGPA, 10 - cgpaPrediction.predictedCGPA],
    backgroundColor: [
     cgpaPrediction.change >= 0 ? '#2DC653' : '#E63946',
     'rgba(29,29,44,0.08)',
    ],
    borderColor: ['#1D1D2C', 'transparent'],
    borderWidth: [2, 0],
    circumference: 270,
    rotation: 225,
    cutout: '75%',
   },
  ],
 };

 const gaugeOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
   legend: { display: false },
   tooltip: { enabled: false },
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
     Grades & CGPA 
    </motion.h1>
    <motion.p
     className="page-header__subtitle"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: 0.1 }}
    >
     Track your academic performance and predict future grades
    </motion.p>
   </div>

   {/* CGPA Prediction Cards */}
   <div className="grid grid-3 gap-6 mb-8">
    <ComicCard delay={0.1}>
     <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '160px', margin: '0 auto' }}>
       <Doughnut data={gaugeData} options={gaugeOptions} />
       <div style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
       }}>
        <div style={{
         fontFamily: 'var(--font-mono)',
         fontSize: 'var(--text-3xl)',
         fontWeight: 700,
         color: cgpaPrediction.change >= 0 ? 'var(--comic-success)' : 'var(--comic-danger)',
        }}>
         {cgpaPrediction.predictedCGPA.toFixed(2)}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--comic-ink-muted)', fontWeight: 700 }}>
         Predicted
        </div>
       </div>
      </div>
      <h5 style={{ marginTop: 'var(--space-2)' }}>Predicted CGPA</h5>
     </div>
    </ComicCard>

    <ComicCard delay={0.2}>
     <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <StatBadge
       value={cgpaPrediction.predictedSGPA}
       label="Predicted SGPA"
       color="secondary"
       decimals={2}
      />
     </div>
    </ComicCard>

    <ComicCard delay={0.3} variant={cgpaPrediction.change >= 0 ? 'success' : 'danger'}>
     <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-2)' }}>
      <TrendingUp size={32} style={{ margin: '0 auto', color: cgpaPrediction.change >= 0 ? 'var(--comic-success)' : 'var(--comic-danger)' }} />
      <div style={{
       fontFamily: 'var(--font-mono)',
       fontSize: 'var(--text-4xl)',
       fontWeight: 700,
       color: cgpaPrediction.change >= 0 ? 'var(--comic-success)' : 'var(--comic-danger)',
      }}>
       {cgpaPrediction.change >= 0 ? '+' : ''}{cgpaPrediction.change.toFixed(2)}
      </div>
      <div style={{ fontWeight: 700, color: 'var(--comic-ink-muted)', fontSize: 'var(--text-sm)' }}>
       CGPA Change
      </div>
      {cgpaPrediction.change >= 0 && <ActionBadge type="wham" label="NICE!" />}
     </div>
    </ComicCard>
   </div>

   {/* Grade Summary Table */}
   <ComicCard className="mb-8" delay={0.4}>
    <h4 style={{ marginBottom: 'var(--space-4)' }}>
      Grade Summary
    </h4>
    <div style={{ overflowX: 'auto' }}>
     <table className="comic-table">
      <thead>
       <tr>
        <th>Subject</th>
        <th>Internal</th>
        <th>Mid-Term</th>
        <th>Assignment</th>
        <th>Final (Est.)</th>
        <th>Total %</th>
        <th>Grade</th>
        <th>Adjust Final</th>
       </tr>
      </thead>
      <tbody>
       {subjectMarks.map((s, i) => (
        <motion.tr
         key={s.id}
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.5 + i * 0.05 }}
        >
         <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
           <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: s.color,
            border: '2px solid var(--comic-outline)',
            flexShrink: 0,
           }} />
           <strong>{s.shortName}</strong>
          </div>
         </td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>
          {s.internal}/{s.maxInternalMarks}
         </td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>
          {s.midTerm}/{s.maxMidTermMarks}
         </td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>
          {s.assignment}/{s.maxAssignmentMarks}
         </td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>
          {s.usedFinal}/{s.maxFinalMarks}
         </td>
         <td>
          <span style={{
           fontFamily: 'var(--font-mono)',
           fontWeight: 700,
           color: s.percentage >= 80 ? 'var(--comic-success)' : s.percentage >= 60 ? 'var(--comic-primary)' : 'var(--comic-danger)',
          }}>
           {s.percentage.toFixed(1)}%
          </span>
         </td>
         <td>
          <span className={`comic-tag ${
           s.grade === 'A+' || s.grade === 'A' ? 'comic-tag--success' :
           s.grade === 'B+' || s.grade === 'B' ? 'comic-tag--primary' :
           s.grade === 'F' ? 'comic-tag--danger' : 'comic-tag--accent'
          }`}>
           {s.grade}
          </span>
         </td>
         <td>
          <input
           type="number"
           className="comic-input"
           style={{ width: '80px', padding: '4px 8px', fontSize: 'var(--text-sm)' }}
           min="0"
           max={s.maxFinalMarks}
           placeholder={s.estimatedFinal.toString()}
           value={finalMarks[s.id] !== undefined ? finalMarks[s.id] : ''}
           onChange={(e) => {
            const val = e.target.value;
            setFinalMarks(prev => ({
             ...prev,
             [s.id]: val === '' ? undefined : Math.min(s.maxFinalMarks, Math.max(0, parseInt(val) || 0)),
            }));
           }}
          />
         </td>
        </motion.tr>
       ))}
      </tbody>
     </table>
    </div>
   </ComicCard>

   {/* Charts & Calculator Row */}
   <div className="grid grid-2 gap-6 mb-8">
    {/* Bar Chart */}
    <ComicCard delay={0.6}>
     <h4 style={{ marginBottom: 'var(--space-4)' }}>
       Component-wise Performance
     </h4>
     <div className="chart-container chart-container--lg">
      <Bar data={barChartData} options={barChartOptions} />
     </div>
    </ComicCard>

    {/* Required Marks Calculator */}
    <ComicCard delay={0.7}>
     <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <Target size={22} />
      Marks Needed Calculator
     </h4>

     <div style={{ marginBottom: 'var(--space-4)' }}>
      <label className="comic-label">Select Subject</label>
      <select
       className="comic-select"
       value={selectedSubject?.id || ''}
       onChange={(e) => setSelectedSubject(subjects.find(s => s.id === e.target.value))}
      >
       <option value="">Choose a subject...</option>
       {subjects.map(s => (
        <option key={s.id} value={s.id}>{s.shortName} — {s.name}</option>
       ))}
      </select>
     </div>

     <div style={{ marginBottom: 'var(--space-4)' }}>
      <label className="comic-label">Target Grade</label>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
       {Object.keys(gradingScale).filter(g => g !== 'F').map(grade => (
        <motion.button
         key={grade}
         className={`comic-btn comic-btn--sm ${targetGrade === grade ? 'comic-btn--primary' : 'comic-btn--outline'}`}
         onClick={() => setTargetGrade(grade)}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
        >
         {grade}
        </motion.button>
       ))}
      </div>
     </div>

     <AnimatePresence mode="wait">
      {requiredMarksResult && (
       <motion.div
        key={`${selectedSubject?.id}-${targetGrade}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
       >
        <SpeechBubble>
         {requiredMarksResult.isAchievable ? (
          <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Award size={24} color="var(--comic-success)" />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}>
             Achievable! 
            </strong>
           </div>
           <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
            You need <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--comic-primary)', fontSize: 'var(--text-xl)' }}>
             {requiredMarksResult.requiredFinalMarks}
            </strong> / {requiredMarksResult.maxFinalMarks} marks in the final exam to get a{' '}
            <span className="comic-tag comic-tag--success">{targetGrade}</span> grade.
           </p>
           <ProgressBar
            value={requiredMarksResult.requiredFinalMarks}
            max={requiredMarksResult.maxFinalMarks}
            label={`${requiredMarksResult.requiredFinalMarks}/${requiredMarksResult.maxFinalMarks}`}
            color="primary"
            className="mt-4"
           />
          </div>
         ) : (
          <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <AlertCircle size={24} color="var(--comic-danger)" />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--comic-danger)' }}>
             Not achievable 
            </strong>
           </div>
           <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
            Even with perfect marks ({requiredMarksResult.maxFinalMarks}/{requiredMarksResult.maxFinalMarks}),
            you'd still be <strong style={{ color: 'var(--comic-danger)' }}>{requiredMarksResult.shortfall} marks short</strong> for a{' '}
            <span className="comic-tag comic-tag--danger">{targetGrade}</span> grade.
            Try aiming for a lower grade.
           </p>
          </div>
         )}
        </SpeechBubble>
       </motion.div>
      )}
     </AnimatePresence>

     {!selectedSubject && (
      <div style={{
       textAlign: 'center',
       padding: 'var(--space-6)',
       color: 'var(--comic-ink-muted)',
      }}>
       <Calculator size={40} strokeWidth={1.5} />
       <p style={{ fontWeight: 700, marginTop: 'var(--space-2)' }}>Select a subject to calculate</p>
      </div>
     )}
    </ComicCard>
   </div>

   {/* Grade Point Breakdown */}
   <ComicCard delay={0.8}>
    <h4 style={{ marginBottom: 'var(--space-4)' }}>
      Grade Point Breakdown (Predicted)
    </h4>
    <div style={{ overflowX: 'auto' }}>
     <table className="comic-table">
      <thead>
       <tr>
        <th>Subject</th>
        <th>Credits</th>
        <th>Grade</th>
        <th>Grade Point</th>
        <th>Credit × GP</th>
       </tr>
      </thead>
      <tbody>
       {subjectMarks.map(s => (
        <tr key={s.id}>
         <td><strong>{s.shortName}</strong></td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>{s.credits}</td>
         <td>
          <span className={`comic-tag ${
           s.grade === 'A+' || s.grade === 'A' ? 'comic-tag--success' :
           s.grade === 'B+' || s.grade === 'B' ? 'comic-tag--primary' :
           'comic-tag--accent'
          }`}>
           {s.grade}
          </span>
         </td>
         <td style={{ fontFamily: 'var(--font-mono)' }}>{s.gradePoint}</td>
         <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          {s.credits * s.gradePoint}
         </td>
        </tr>
       ))}
       <tr style={{ background: 'var(--comic-bg-alt)' }}>
        <td><strong>Total</strong></td>
        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
         {subjectMarks.reduce((s, sub) => s + sub.credits, 0)}
        </td>
        <td></td>
        <td></td>
        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
         {subjectMarks.reduce((s, sub) => s + sub.credits * sub.gradePoint, 0)}
        </td>
       </tr>
      </tbody>
     </table>
    </div>
   </ComicCard>
  </div>
 );
}
