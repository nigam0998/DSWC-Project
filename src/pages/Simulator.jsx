import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FlaskConical,
 Play,
 RotateCcw,
 Save,
 Trash2,
 ArrowRight,
 AlertTriangle,
 CheckCircle,
 TrendingUp,
 TrendingDown,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import ComicCard from '../components/UI/ComicCard';
import SpeechBubble from '../components/UI/SpeechBubble';
import ProgressBar from '../components/UI/ProgressBar';
import ActionBadge from '../components/UI/ActionBadge';
import {
 simulateScenario,
 getAttendancePercentage,
 getGradeFromPercentage,
 calculateTotalMarks,
} from '../data/predictionEngine';

export default function Simulator() {
 const {
  subjects,
  thresholds,
  saveScenario,
  savedScenarios,
  deleteScenario,
 } = useStudent();

 // Scenario form state
 const [attendanceSkips, setAttendanceSkips] = useState({});
 const [examMarks, setExamMarks] = useState({});
 const [upcomingClasses, setUpcomingClasses] = useState(10);
 const [results, setResults] = useState(null);
 const [scenarioName, setScenarioName] = useState('');
 const [showSaveDialog, setShowSaveDialog] = useState(false);

 // Run simulation
 const runSimulation = useCallback(() => {
  const scenario = {
   attendance: attendanceSkips,
   marks: examMarks,
   upcomingClasses,
  };
  const simResults = simulateScenario(scenario);
  setResults(simResults);
 }, [attendanceSkips, examMarks, upcomingClasses]);

 // Reset
 const resetSimulation = () => {
  setAttendanceSkips({});
  setExamMarks({});
  setResults(null);
  setUpcomingClasses(10);
 };

 // Save
 const handleSave = () => {
  if (scenarioName.trim()) {
   saveScenario(scenarioName.trim());
   setScenarioName('');
   setShowSaveDialog(false);
  }
 };

 // Current data for comparison
 const currentData = useMemo(() => {
  return subjects.map(s => {
   const attendance = getAttendancePercentage(s);
   const avgPerf = (
    (s.internalMarks / s.maxInternalMarks) +
    (s.midTermMarks / s.maxMidTermMarks) +
    (s.assignmentMarks / s.maxAssignmentMarks)
   ) / 3;
   const estimatedFinal = Math.round(avgPerf * s.maxFinalMarks);
   const marks = calculateTotalMarks(s, estimatedFinal);
   const grade = getGradeFromPercentage(marks.percentage);
   return { ...s, attendance, marks, grade, estimatedFinal };
  });
 }, [subjects]);

 return (
  <div>
   <div className="page-header">
    <motion.h1
     className="page-header__title"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
    >
     Scenario Simulator 
    </motion.h1>
    <motion.p
     className="page-header__subtitle"
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: 0.1 }}
    >
     What-if analysis: Simulate different academic decisions and see their impact
    </motion.p>
   </div>

   <div className="grid grid-2 gap-6">
    {/* Scenario Builder */}
    <div>
     <ComicCard delay={0.2}>
      <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
       <FlaskConical size={22} />
       Scenario Builder
      </h4>

      {/* Upcoming classes slider */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
       <label className="comic-label">
        Upcoming Classes Per Subject: {upcomingClasses}
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

      {/* Per-subject controls */}
      {subjects.map((subject, i) => (
       <motion.div
        key={subject.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + i * 0.05 }}
        style={{
         padding: 'var(--space-4)',
         marginBottom: 'var(--space-4)',
         background: 'var(--comic-bg)',
         borderRadius: 'var(--border-radius-sm)',
         borderLeft: `4px solid ${subject.color}`,
         border: 'var(--border-thin)',
         borderLeftWidth: '4px',
         borderLeftColor: subject.color,
        }}
       >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
         <strong style={{ fontFamily: 'var(--font-display)' }}>{subject.shortName}</strong>
         <span style={{ fontSize: 'var(--text-xs)', color: 'var(--comic-ink-muted)' }}>
          ({getAttendancePercentage(subject).toFixed(1)}% att.)
         </span>
        </div>

        <div className="grid grid-2 gap-4">
         <div>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>
           Skip Classes: {attendanceSkips[subject.id] || 0}
          </label>
          <input
           type="range"
           className="comic-slider"
           min="0"
           max={upcomingClasses}
           value={attendanceSkips[subject.id] || 0}
           onChange={(e) => setAttendanceSkips(prev => ({
            ...prev,
            [subject.id]: parseInt(e.target.value),
           }))}
          />
         </div>
         <div>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>
           Expected Final: {examMarks[subject.id] !== undefined ? examMarks[subject.id] : '—'}/{subject.maxFinalMarks}
          </label>
          <input
           type="range"
           className="comic-slider"
           min="0"
           max={subject.maxFinalMarks}
           value={examMarks[subject.id] !== undefined ? examMarks[subject.id] : currentData.find(c => c.id === subject.id)?.estimatedFinal || 0}
           onChange={(e) => setExamMarks(prev => ({
            ...prev,
            [subject.id]: parseInt(e.target.value),
           }))}
          />
         </div>
        </div>
       </motion.div>
      ))}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
       <motion.button
        className="comic-btn comic-btn--primary comic-btn--lg"
        onClick={runSimulation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        <Play size={20} />
        Run Simulation
       </motion.button>
       <motion.button
        className="comic-btn comic-btn--outline"
        onClick={resetSimulation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        <RotateCcw size={18} />
        Reset
       </motion.button>
      </div>
     </ComicCard>
    </div>

    {/* Results Panel */}
    <div>
     <AnimatePresence mode="wait">
      {results ? (
       <motion.div
        key="results"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
       >
        {/* CGPA Impact */}
        <ComicCard
         className="mb-6"
         variant={results.cgpa.change >= 0 ? 'success' : 'danger'}
        >
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h4 style={{ margin: 0 }}> CGPA Impact</h4>
          {results.cgpa.change >= 0 ? (
           <ActionBadge type="wham" label="BOOST!" />
          ) : (
           <ActionBadge type="pow" label="DROP!" />
          )}
         </div>

         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'center' }}>
           <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
            {results.cgpa.currentCGPA}
           </div>
           <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>Current</div>
          </div>

          <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
           <ArrowRight size={28} />
          </motion.div>

          <div style={{ textAlign: 'center' }}>
           <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: results.cgpa.change >= 0 ? 'var(--comic-success)' : 'var(--comic-danger)',
           }}>
            {results.cgpa.predictedCGPA}
           </div>
           <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)' }}>Predicted</div>
          </div>

          <span style={{
           fontFamily: 'var(--font-mono)',
           fontWeight: 700,
           fontSize: 'var(--text-xl)',
           color: results.cgpa.change >= 0 ? 'var(--comic-success)' : 'var(--comic-danger)',
           display: 'flex',
           alignItems: 'center',
           gap: '4px',
          }}>
           {results.cgpa.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
           {results.cgpa.change >= 0 ? '+' : ''}{results.cgpa.change.toFixed(2)}
          </span>
         </div>
        </ComicCard>

        {/* Subject-wise Impact */}
        <ComicCard className="mb-6">
         <h4 style={{ marginBottom: 'var(--space-4)' }}> Subject-wise Impact</h4>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {subjects.map((subject, i) => {
           const attResult = results.attendance[subject.id];
           const gradeResult = results.grades[subject.id];
           const currentAtt = getAttendancePercentage(subject);
           const currentGrade = currentData.find(c => c.id === subject.id)?.grade;

           return (
            <motion.div
             key={subject.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 + i * 0.05 }}
             style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--comic-bg)',
              border: 'var(--border-thin)',
              borderRadius: 'var(--border-radius-sm)',
              borderLeftWidth: '4px',
              borderLeftColor: subject.color,
             }}
            >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <strong style={{ fontFamily: 'var(--font-display)' }}>{subject.shortName}</strong>
              {attResult?.isBelowMinimum && (
               <span className="comic-tag comic-tag--danger" style={{ fontSize: '10px' }}>AT RISK</span>
              )}
             </div>

             <div className="grid grid-2 gap-3">
              {/* Attendance */}
              <div>
               <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)', marginBottom: '4px' }}>
                Attendance
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                 {currentAtt.toFixed(1)}%
                </span>
                <ArrowRight size={14} />
                <span style={{
                 fontFamily: 'var(--font-mono)',
                 fontSize: 'var(--text-sm)',
                 fontWeight: 700,
                 color: attResult?.isBelowMinimum ? 'var(--comic-danger)' : 'var(--comic-success)',
                }}>
                 {attResult?.predicted.toFixed(1)}%
                </span>
               </div>
              </div>

              {/* Grade */}
              <div>
               <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--comic-ink-muted)', marginBottom: '4px' }}>
                Grade
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="comic-tag comic-tag--outline" style={{ fontSize: '10px' }}>
                 {currentGrade?.grade || '—'}
                </span>
                <ArrowRight size={14} />
                <span className={`comic-tag ${
                 gradeResult?.grade === 'A+' || gradeResult?.grade === 'A' ? 'comic-tag--success' :
                 gradeResult?.grade === 'F' ? 'comic-tag--danger' : 'comic-tag--primary'
                }`} style={{ fontSize: '10px' }}>
                 {gradeResult?.grade || '—'}
                </span>
               </div>
              </div>
             </div>
            </motion.div>
           );
          })}
         </div>
        </ComicCard>

        {/* Risk Alerts */}
        {results.risks.length > 0 && (
         <ComicCard className="mb-6" variant="danger">
          <h4 style={{ marginBottom: 'var(--space-4)' }}>
           ️ Risk Alerts ({results.risks.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
           {results.risks.map((risk, i) => (
            <div
             key={i}
             style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: risk.severity === 'critical' ? 'rgba(230,57,70,0.08)' : 'rgba(252,191,73,0.1)',
              borderRadius: 'var(--border-radius-sm)',
              border: `2px solid ${risk.severity === 'critical' ? 'var(--comic-danger)' : 'var(--comic-accent)'}`,
              fontSize: 'var(--text-sm)',
             }}
            >
             <AlertTriangle size={16} color={risk.severity === 'critical' ? 'var(--comic-danger)' : 'var(--comic-accent)'} />
             <span style={{ fontWeight: 700 }}>{risk.message}</span>
            </div>
           ))}
          </div>
         </ComicCard>
        )}

        {/* Save scenario button */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
         {!showSaveDialog ? (
          <motion.button
           className="comic-btn comic-btn--secondary"
           onClick={() => setShowSaveDialog(true)}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
          >
           <Save size={18} />
           Save Scenario
          </motion.button>
         ) : (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
           <input
            className="comic-input"
            style={{ width: '200px' }}
            placeholder="Scenario name..."
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
           />
           <motion.button
            className="comic-btn comic-btn--success comic-btn--sm"
            onClick={handleSave}
            whileTap={{ scale: 0.95 }}
           >
            Save
           </motion.button>
          </div>
         )}
        </div>
       </motion.div>
      ) : (
       <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
       >
        <ComicCard>
         <div style={{
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-4)',
          color: 'var(--comic-ink-muted)',
         }}>
          <motion.div
           animate={{ y: [0, -8, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
          >
           <FlaskConical size={64} strokeWidth={1.5} />
          </motion.div>
          <h4 style={{ marginTop: 'var(--space-4)', color: 'var(--comic-ink-muted)' }}>
           Build Your Scenario
          </h4>
          <p style={{ fontWeight: 700 }}>
           Adjust the sliders on the left to set up your "what-if" scenario,
           then click <strong>Run Simulation</strong> to see the predicted impact.
          </p>
         </div>
        </ComicCard>

        {/* Saved Scenarios */}
        {savedScenarios.length > 0 && (
         <ComicCard className="mt-6">
          <h4 style={{ marginBottom: 'var(--space-4)' }}> Saved Scenarios</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
           {savedScenarios.map((scenario) => (
            <div
             key={scenario.id}
             style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--comic-bg)',
              border: 'var(--border-thin)',
              borderRadius: 'var(--border-radius-sm)',
             }}
            >
             <strong>{scenario.name}</strong>
             <motion.button
              className="comic-btn comic-btn--danger comic-btn--sm"
              onClick={() => deleteScenario(scenario.id)}
              whileTap={{ scale: 0.95 }}
             >
              <Trash2 size={14} />
             </motion.button>
            </div>
           ))}
          </div>
         </ComicCard>
        )}
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   </div>
  </div>
 );
}
