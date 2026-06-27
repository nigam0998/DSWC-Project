// ============================================
// PREDICTION ENGINE — Academic Digital Twin
// Pure-function prediction algorithms
// ============================================

import studentData from './studentData';

const { gradingScale, thresholds } = studentData;

// ============================================
// 1. ATTENDANCE PREDICTIONS
// ============================================

/**
 * Calculate current attendance percentage for a subject
 */
export function getAttendancePercentage(subject) {
  if (!subject || subject.totalClasses === 0) return 0;
  return (subject.attendedClasses / subject.totalClasses) * 100;
}

/**
 * Predict attendance after skipping N classes
 * @param {object} subject - Subject data
 * @param {number} classesToSkip - Number of future classes to skip
 * @param {number} totalUpcomingClasses - Total upcoming classes (default: 10)
 * @returns {{ current, predicted, classesToSkip, canSkip, minimumRequired }}
 */
export function predictAttendance(subject, classesToSkip = 0, totalUpcomingClasses = 10) {
  const currentPercentage = getAttendancePercentage(subject);
  const futureTotal = subject.totalClasses + totalUpcomingClasses;
  const futureAttended = subject.attendedClasses + (totalUpcomingClasses - classesToSkip);
  const predictedPercentage = (futureAttended / futureTotal) * 100;

  // Calculate max classes that can be skipped while maintaining minimum attendance
  const minRequired = Math.ceil(futureTotal * (thresholds.minAttendance / 100));
  const maxSkippable = Math.max(0, subject.attendedClasses + totalUpcomingClasses - minRequired);

  return {
    current: Math.round(currentPercentage * 100) / 100,
    predicted: Math.round(predictedPercentage * 100) / 100,
    classesToSkip,
    totalUpcoming: totalUpcomingClasses,
    canSkip: classesToSkip <= maxSkippable,
    maxSkippable,
    isBelowMinimum: predictedPercentage < thresholds.minAttendance,
    isBelowSafe: predictedPercentage < thresholds.safeAttendance,
    futureTotal,
    futureAttended,
  };
}

/**
 * Calculate how many classes can be safely skipped
 */
export function getMaxSkippableClasses(subject, totalUpcomingClasses = 10) {
  const futureTotal = subject.totalClasses + totalUpcomingClasses;
  const minRequired = Math.ceil(futureTotal * (thresholds.minAttendance / 100));
  return Math.max(0, subject.attendedClasses + totalUpcomingClasses - minRequired);
}

// ============================================
// 2. GRADE PREDICTIONS
// ============================================

/**
 * Get letter grade from percentage
 */
export function getGradeFromPercentage(percentage) {
  for (const [grade, range] of Object.entries(gradingScale)) {
    if (percentage >= range.min && percentage <= range.max) {
      return { grade, gradePoint: range.gradePoint, percentage };
    }
  }
  return { grade: 'F', gradePoint: 0, percentage };
}

/**
 * Calculate total marks for a subject (including predicted final)
 */
export function calculateTotalMarks(subject, predictedFinalMarks = null) {
  const internal = subject.internalMarks || 0;
  const midTerm = subject.midTermMarks || 0;
  const assignment = subject.assignmentMarks || 0;
  const final_ = predictedFinalMarks !== null ? predictedFinalMarks : (subject.finalMarks || 0);

  // Normalize to 100
  const maxTotal = subject.maxInternalMarks + subject.maxMidTermMarks +
                   subject.maxAssignmentMarks + subject.maxFinalMarks;
  const totalObtained = internal + midTerm + assignment + final_;
  
  return {
    internal,
    midTerm,
    assignment,
    final: final_,
    total: totalObtained,
    maxTotal,
    percentage: (totalObtained / maxTotal) * 100,
  };
}

/**
 * Predict grade based on expected final exam marks
 */
export function predictGrade(subject, expectedFinalMarks) {
  const marks = calculateTotalMarks(subject, expectedFinalMarks);
  const grade = getGradeFromPercentage(marks.percentage);

  return {
    ...marks,
    ...grade,
    subjectName: subject.name,
    shortName: subject.shortName,
  };
}

/**
 * Calculate required final exam marks to achieve a target grade
 */
export function calculateRequiredMarks(subject, targetGrade) {
  const gradeInfo = gradingScale[targetGrade];
  if (!gradeInfo) return null;

  const maxTotal = subject.maxInternalMarks + subject.maxMidTermMarks +
                   subject.maxAssignmentMarks + subject.maxFinalMarks;
  const currentMarks = subject.internalMarks + subject.midTermMarks + subject.assignmentMarks;
  
  const targetTotalMarks = Math.ceil((gradeInfo.min / 100) * maxTotal);
  const requiredFinal = targetTotalMarks - currentMarks;

  return {
    targetGrade,
    targetPercentage: gradeInfo.min,
    currentMarks,
    requiredFinalMarks: Math.max(0, requiredFinal),
    maxFinalMarks: subject.maxFinalMarks,
    isAchievable: requiredFinal <= subject.maxFinalMarks && requiredFinal >= 0,
    shortfall: requiredFinal > subject.maxFinalMarks ? requiredFinal - subject.maxFinalMarks : 0,
  };
}

// ============================================
// 3. CGPA PREDICTIONS
// ============================================

/**
 * Calculate current semester GPA from subjects
 */
export function calculateSGPA(subjects, finalMarksMap = {}) {
  let totalGradePoints = 0;
  let totalCredits = 0;

  subjects.forEach(subject => {
    const finalMarks = finalMarksMap[subject.id] !== undefined
      ? finalMarksMap[subject.id]
      : subject.finalMarks;
    
    const marks = calculateTotalMarks(subject, finalMarks);
    const grade = getGradeFromPercentage(marks.percentage);
    
    totalGradePoints += grade.gradePoint * subject.credits;
    totalCredits += subject.credits;
  });

  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
}

/**
 * Predict CGPA based on expected SGPA
 */
export function predictCGPA(currentCGPA, currentCredits, predictedSGPA, semesterCredits) {
  const totalGradePoints = (currentCGPA * currentCredits) + (predictedSGPA * semesterCredits);
  const totalCredits = currentCredits + semesterCredits;
  return Math.round((totalGradePoints / totalCredits) * 100) / 100;
}

/**
 * Full CGPA prediction with grade changes
 */
export function predictCGPAWithGradeChanges(subjects, finalMarksMap = {}) {
  const sgpa = calculateSGPA(subjects, finalMarksMap);
  const semesterCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const cgpa = predictCGPA(
    studentData.student.cgpa,
    studentData.student.earnedCredits,
    sgpa,
    semesterCredits
  );

  return {
    predictedSGPA: Math.round(sgpa * 100) / 100,
    predictedCGPA: cgpa,
    currentCGPA: studentData.student.cgpa,
    change: Math.round((cgpa - studentData.student.cgpa) * 100) / 100,
    semesterCredits,
  };
}

// ============================================
// 4. SCENARIO SIMULATION
// ============================================

/**
 * Simulate a complete academic scenario
 * @param {object} scenario - { attendance: { [subjectId]: classesToSkip }, marks: { [subjectId]: finalMarks }, lateSubmissions: [{ assignmentId, daysLate }] }
 */
export function simulateScenario(scenario = {}) {
  const subjects = studentData.subjects;
  const results = {
    attendance: {},
    grades: {},
    assignments: {},
    cgpa: null,
    risks: [],
    summary: '',
  };

  // Simulate attendance changes
  subjects.forEach(subject => {
    const classesToSkip = scenario.attendance?.[subject.id] || 0;
    const totalUpcoming = scenario.upcomingClasses || 10;
    results.attendance[subject.id] = predictAttendance(subject, classesToSkip, totalUpcoming);
  });

  // Simulate grade changes
  const finalMarksMap = {};
  subjects.forEach(subject => {
    const expectedFinal = scenario.marks?.[subject.id];
    if (expectedFinal !== undefined) {
      finalMarksMap[subject.id] = expectedFinal;
      results.grades[subject.id] = predictGrade(subject, expectedFinal);
    } else {
      // Predict based on current performance
      const avgPerformance = (
        (subject.internalMarks / subject.maxInternalMarks) +
        (subject.midTermMarks / subject.maxMidTermMarks) +
        (subject.assignmentMarks / subject.maxAssignmentMarks)
      ) / 3;
      const estimatedFinal = Math.round(avgPerformance * subject.maxFinalMarks);
      finalMarksMap[subject.id] = estimatedFinal;
      results.grades[subject.id] = predictGrade(subject, estimatedFinal);
    }
  });

  // Simulate late submissions
  if (scenario.lateSubmissions) {
    scenario.lateSubmissions.forEach(({ assignmentId, daysLate }) => {
      const assignment = studentData.assignments.find(a => a.id === assignmentId);
      if (assignment) {
        const penalty = Math.min(daysLate * thresholds.latePenaltyPerDay, 100);
        results.assignments[assignmentId] = {
          ...assignment,
          daysLate,
          penalty,
          adjustedMarks: assignment.maxMarks * (1 - penalty / 100),
        };
      }
    });
  }

  // Calculate CGPA impact
  results.cgpa = predictCGPAWithGradeChanges(subjects, finalMarksMap);

  // Identify risks
  results.risks = identifyRisks(results);

  // Generate summary
  results.summary = generateScenarioSummary(results);

  return results;
}

// ============================================
// 5. RISK IDENTIFICATION
// ============================================

/**
 * Identify subjects that need immediate attention
 */
export function identifyRiskSubjects() {
  return studentData.subjects.map(subject => {
    const attendance = getAttendancePercentage(subject);
    const marks = calculateTotalMarks(subject, null);
    const currentPerformance = (marks.total / (marks.maxTotal - subject.maxFinalMarks)) * 100;

    let riskLevel = 'low';
    const riskFactors = [];

    // Attendance risk
    if (attendance < thresholds.minAttendance) {
      riskLevel = 'critical';
      riskFactors.push(`Attendance (${attendance.toFixed(1)}%) below minimum ${thresholds.minAttendance}%`);
    } else if (attendance < thresholds.safeAttendance) {
      if (riskLevel !== 'critical') riskLevel = 'medium';
      riskFactors.push(`Attendance (${attendance.toFixed(1)}%) below safe threshold ${thresholds.safeAttendance}%`);
    }

    // Performance risk
    if (currentPerformance < 50) {
      riskLevel = 'critical';
      riskFactors.push(`Current performance (${currentPerformance.toFixed(1)}%) is below passing`);
    } else if (currentPerformance < 65) {
      if (riskLevel !== 'critical') riskLevel = 'medium';
      riskFactors.push(`Current performance (${currentPerformance.toFixed(1)}%) needs improvement`);
    }

    // Pending assignments risk
    const pendingAssignments = studentData.assignments.filter(
      a => a.subjectId === subject.id && a.status !== 'submitted'
    );
    if (pendingAssignments.length > 1) {
      if (riskLevel === 'low') riskLevel = 'medium';
      riskFactors.push(`${pendingAssignments.length} pending assignments`);
    }

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      shortName: subject.shortName,
      color: subject.color,
      attendance,
      currentPerformance,
      riskLevel,
      riskFactors,
      pendingAssignments: pendingAssignments.length,
    };
  }).sort((a, b) => {
    const riskOrder = { critical: 0, medium: 1, low: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });
}

/**
 * Identify risks from simulation results
 */
function identifyRisks(results) {
  const risks = [];

  // Check attendance risks
  Object.entries(results.attendance).forEach(([subjectId, data]) => {
    if (data.isBelowMinimum) {
      const subject = studentData.subjects.find(s => s.id === subjectId);
      risks.push({
        type: 'attendance',
        severity: 'critical',
        subjectId,
        subjectName: subject?.shortName || subjectId,
        message: `Attendance will drop to ${data.predicted.toFixed(1)}% (below ${thresholds.minAttendance}% minimum)`,
      });
    } else if (data.isBelowSafe) {
      const subject = studentData.subjects.find(s => s.id === subjectId);
      risks.push({
        type: 'attendance',
        severity: 'warning',
        subjectId,
        subjectName: subject?.shortName || subjectId,
        message: `Attendance will be ${data.predicted.toFixed(1)}% (below ${thresholds.safeAttendance}% safe level)`,
      });
    }
  });

  // Check grade risks
  Object.entries(results.grades).forEach(([subjectId, data]) => {
    if (data.percentage < thresholds.minPassMarks) {
      risks.push({
        type: 'grade',
        severity: 'critical',
        subjectId,
        subjectName: data.shortName,
        message: `Predicted grade is ${data.grade} (${data.percentage.toFixed(1)}%) — risk of failing`,
      });
    }
  });

  // Check CGPA risk
  if (results.cgpa && results.cgpa.predictedCGPA < thresholds.warningCGPA) {
    risks.push({
      type: 'cgpa',
      severity: 'critical',
      message: `CGPA may drop to ${results.cgpa.predictedCGPA} (below ${thresholds.warningCGPA} warning threshold)`,
    });
  }

  return risks;
}

// ============================================
// 6. RECOMMENDATIONS
// ============================================

/**
 * Generate personalized academic recommendations
 */
export function generateRecommendations() {
  const risks = identifyRiskSubjects();
  const recommendations = [];
  let priorityCounter = 1;

  // Attendance-based recommendations
  risks.forEach(risk => {
    if (risk.attendance < thresholds.minAttendance) {
      recommendations.push({
        id: `rec-${priorityCounter++}`,
        priority: 'critical',
        category: 'attendance',
        subject: risk.shortName,
        title: `Urgent: Attend all ${risk.shortName} classes`,
        description: `Your attendance in ${risk.subjectName} is ${risk.attendance.toFixed(1)}%, which is below the required ${thresholds.minAttendance}%. Missing more classes could lead to debarment.`,
        action: `Do not skip any more ${risk.shortName} classes. You need to attend every remaining class.`,
        impact: 'high',
      });
    } else if (risk.attendance < thresholds.safeAttendance) {
      recommendations.push({
        id: `rec-${priorityCounter++}`,
        priority: 'warning',
        category: 'attendance',
        subject: risk.shortName,
        title: `Improve ${risk.shortName} attendance`,
        description: `Your attendance in ${risk.subjectName} is ${risk.attendance.toFixed(1)}%. While above minimum, it's below the safe threshold of ${thresholds.safeAttendance}%.`,
        action: `Try to attend all upcoming ${risk.shortName} classes to build a safety buffer.`,
        impact: 'medium',
      });
    }
  });

  // Performance-based recommendations
  risks.forEach(risk => {
    if (risk.currentPerformance < 60) {
      const subject = studentData.subjects.find(s => s.id === risk.subjectId);
      const required = calculateRequiredMarks(subject, 'B');
      
      recommendations.push({
        id: `rec-${priorityCounter++}`,
        priority: risk.currentPerformance < 50 ? 'critical' : 'warning',
        category: 'performance',
        subject: risk.shortName,
        title: `Boost ${risk.shortName} performance`,
        description: `Current performance in ${risk.subjectName} is ${risk.currentPerformance.toFixed(1)}%. ${required?.isAchievable ? `You need ${required.requiredFinalMarks}/${subject.maxFinalMarks} in finals for a B grade.` : 'Focus on maximizing your final exam score.'}`,
        action: `Increase study hours for ${risk.shortName} by at least 3 hours/week. Focus on weak topics and solve past papers.`,
        impact: 'high',
      });
    }
  });

  // Assignment recommendations
  const pendingAssignments = studentData.assignments.filter(a => a.status !== 'submitted');
  const overdue = pendingAssignments.filter(a => new Date(a.dueDate) < new Date());
  const upcoming = pendingAssignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const now = new Date();
    const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  });

  if (overdue.length > 0) {
    recommendations.push({
      id: `rec-${priorityCounter++}`,
      priority: 'critical',
      category: 'assignments',
      title: `${overdue.length} overdue assignment(s)`,
      description: `You have ${overdue.length} assignment(s) past their due date. Late submissions incur a ${thresholds.latePenaltyPerDay}% penalty per day.`,
      action: 'Submit overdue assignments immediately to minimize penalty.',
      impact: 'high',
    });
  }

  if (upcoming.length > 0) {
    recommendations.push({
      id: `rec-${priorityCounter++}`,
      priority: 'warning',
      category: 'assignments',
      title: `${upcoming.length} assignment(s) due this week`,
      description: `You have ${upcoming.length} assignment(s) due within 7 days. Plan your time to complete them before the deadline.`,
      action: 'Allocate time today to start working on upcoming assignments.',
      impact: 'medium',
    });
  }

  // Study balance recommendation
  const studyHours = studentData.subjects.map(s => ({
    name: s.shortName,
    hours: s.studyHoursPerWeek,
    risk: risks.find(r => r.subjectId === s.id)?.riskLevel || 'low',
  }));

  const lowStudyHighRisk = studyHours.filter(s => s.risk !== 'low' && s.hours < 6);
  if (lowStudyHighRisk.length > 0) {
    recommendations.push({
      id: `rec-${priorityCounter++}`,
      priority: 'warning',
      category: 'study',
      title: 'Rebalance study hours',
      description: `${lowStudyHighRisk.map(s => s.name).join(', ')} need more study time. These subjects have higher risk but lower study hours.`,
      action: `Increase study hours for ${lowStudyHighRisk.map(s => s.name).join(', ')} and reduce time on already-strong subjects if needed.`,
      impact: 'medium',
    });
  }

  // General CGPA recommendation
  const cgpaPrediction = predictCGPAWithGradeChanges(studentData.subjects);
  if (cgpaPrediction.change < 0) {
    recommendations.push({
      id: `rec-${priorityCounter++}`,
      priority: 'warning',
      category: 'cgpa',
      title: 'CGPA at risk of declining',
      description: `Based on current performance, your CGPA may ${cgpaPrediction.change >= -0.1 ? 'slightly' : 'significantly'} decrease from ${cgpaPrediction.currentCGPA} to ~${cgpaPrediction.predictedCGPA}.`,
      action: 'Focus on performing well in final exams, especially in weaker subjects.',
      impact: cgpaPrediction.change < -0.3 ? 'high' : 'medium',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, warning: 1, info: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================
// 7. ACADEMIC HEALTH SCORE
// ============================================

/**
 * Calculate overall academic health score (0-100)
 */
export function calculateAcademicHealth() {
  const subjects = studentData.subjects;
  let score = 100;
  const breakdown = {};

  // Attendance component (30 points)
  const avgAttendance = subjects.reduce((sum, s) => sum + getAttendancePercentage(s), 0) / subjects.length;
  const attendanceScore = Math.min(30, (avgAttendance / 100) * 30);
  breakdown.attendance = { score: Math.round(attendanceScore), max: 30, value: avgAttendance.toFixed(1) + '%' };

  // Performance component (30 points)
  const avgPerformance = subjects.reduce((sum, s) => {
    const marks = calculateTotalMarks(s);
    const currentMax = s.maxInternalMarks + s.maxMidTermMarks + s.maxAssignmentMarks;
    return sum + ((marks.internal + marks.midTerm + marks.assignment) / currentMax) * 100;
  }, 0) / subjects.length;
  const performanceScore = Math.min(30, (avgPerformance / 100) * 30);
  breakdown.performance = { score: Math.round(performanceScore), max: 30, value: avgPerformance.toFixed(1) + '%' };

  // CGPA component (20 points)
  const cgpaScore = Math.min(20, (studentData.student.cgpa / 10) * 20);
  breakdown.cgpa = { score: Math.round(cgpaScore), max: 20, value: studentData.student.cgpa.toFixed(2) };

  // Assignments component (10 points)
  const totalAssignments = studentData.assignments.length;
  const completedAssignments = studentData.assignments.filter(a => a.status === 'submitted').length;
  const assignmentScore = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 10 : 10;
  breakdown.assignments = { score: Math.round(assignmentScore), max: 10, value: `${completedAssignments}/${totalAssignments}` };

  // Risk component (10 points) — subtract for risks
  const risks = identifyRiskSubjects();
  const criticalCount = risks.filter(r => r.riskLevel === 'critical').length;
  const mediumCount = risks.filter(r => r.riskLevel === 'medium').length;
  const riskDeduction = Math.min(10, criticalCount * 5 + mediumCount * 2);
  const riskScore = 10 - riskDeduction;
  breakdown.risk = { score: Math.round(riskScore), max: 10, value: `${criticalCount} critical, ${mediumCount} warning` };

  score = attendanceScore + performanceScore + cgpaScore + assignmentScore + riskScore;

  let status;
  if (score >= 85) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 55) status = 'average';
  else if (score >= 40) status = 'at-risk';
  else status = 'critical';

  return {
    score: Math.round(score),
    status,
    breakdown,
  };
}

// ============================================
// 8. HELPERS
// ============================================

function generateScenarioSummary(results) {
  const parts = [];

  if (results.cgpa) {
    const dir = results.cgpa.change >= 0 ? 'increase' : 'decrease';
    parts.push(`CGPA would ${dir} by ${Math.abs(results.cgpa.change).toFixed(2)} to ${results.cgpa.predictedCGPA}`);
  }

  const criticalRisks = results.risks.filter(r => r.severity === 'critical');
  if (criticalRisks.length > 0) {
    parts.push(`${criticalRisks.length} critical risk(s) identified`);
  }

  return parts.join('. ') + '.';
}

/**
 * Get upcoming deadlines (assignments + exams)
 */
export function getUpcomingDeadlines(daysAhead = 30) {
  const now = new Date();
  const cutoff = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  const deadlines = [];

  studentData.assignments
    .filter(a => a.status !== 'submitted')
    .forEach(a => {
      const dueDate = new Date(a.dueDate);
      if (dueDate <= cutoff) {
        const subject = studentData.subjects.find(s => s.id === a.subjectId);
        deadlines.push({
          type: 'assignment',
          title: a.title,
          subject: subject?.shortName || a.subjectId,
          subjectColor: subject?.color,
          date: a.dueDate,
          daysLeft: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)),
          isOverdue: dueDate < now,
          id: a.id,
        });
      }
    });

  studentData.exams.forEach(e => {
    const examDate = new Date(e.date);
    if (examDate <= cutoff && examDate >= now) {
      const subject = studentData.subjects.find(s => s.id === e.subjectId);
      deadlines.push({
        type: 'exam',
        title: `${e.type} Exam`,
        subject: subject?.shortName || e.subjectId,
        subjectColor: subject?.color,
        date: e.date,
        daysLeft: Math.ceil((examDate - now) / (1000 * 60 * 60 * 24)),
        isOverdue: false,
        id: `exam-${e.subjectId}`,
      });
    }
  });

  return deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
}
