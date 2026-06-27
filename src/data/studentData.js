// ============================================
// STUDENT DATA — Complete Mock Academic Profile
// ============================================

const studentData = {
  // ---- Student Info ----
  student: {
    id: 'STU2024001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@university.edu',
    semester: 5,
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    enrollmentYear: 2023,
    avatar: null, // Will use initials
    cgpa: 8.12,
    totalCredits: 96,
    earnedCredits: 88,
  },

  // ---- Subjects ----
  subjects: [
    {
      id: 'CS501',
      name: 'Data Structures & Web Computing',
      shortName: 'DSWC',
      credits: 4,
      instructor: 'Dr. Priya Mehta',
      color: '#FF6B35',
      totalClasses: 42,
      attendedClasses: 36,
      maxInternalMarks: 30,
      internalMarks: 24,
      maxMidTermMarks: 20,
      midTermMarks: 16,
      maxFinalMarks: 50,
      finalMarks: null, // Not yet taken
      maxAssignmentMarks: 20,
      assignmentMarks: 17,
      gradeHistory: ['A', 'A', 'B+', 'A'],
      studyHoursPerWeek: 8,
      difficulty: 'Medium',
      attendanceLog: generateAttendanceLog(42, 36),
    },
    {
      id: 'CS502',
      name: 'Operating Systems',
      shortName: 'OS',
      credits: 4,
      instructor: 'Prof. Rajesh Kumar',
      color: '#004E89',
      totalClasses: 40,
      attendedClasses: 30,
      maxInternalMarks: 30,
      internalMarks: 20,
      maxMidTermMarks: 20,
      midTermMarks: 13,
      maxFinalMarks: 50,
      finalMarks: null,
      maxAssignmentMarks: 20,
      assignmentMarks: 14,
      gradeHistory: ['B+', 'B', 'B+', 'A'],
      studyHoursPerWeek: 5,
      difficulty: 'Hard',
      attendanceLog: generateAttendanceLog(40, 30),
    },
    {
      id: 'CS503',
      name: 'Database Management Systems',
      shortName: 'DBMS',
      credits: 4,
      instructor: 'Dr. Anita Desai',
      color: '#2DC653',
      totalClasses: 38,
      attendedClasses: 35,
      maxInternalMarks: 30,
      internalMarks: 27,
      maxMidTermMarks: 20,
      midTermMarks: 18,
      maxFinalMarks: 50,
      finalMarks: null,
      maxAssignmentMarks: 20,
      assignmentMarks: 19,
      gradeHistory: ['A', 'A', 'A', 'A+'],
      studyHoursPerWeek: 6,
      difficulty: 'Medium',
      attendanceLog: generateAttendanceLog(38, 35),
    },
    {
      id: 'CS504',
      name: 'Computer Networks',
      shortName: 'CN',
      credits: 3,
      instructor: 'Prof. Vikram Singh',
      color: '#FCBF49',
      totalClasses: 36,
      attendedClasses: 28,
      maxInternalMarks: 30,
      internalMarks: 18,
      maxMidTermMarks: 20,
      midTermMarks: 12,
      maxFinalMarks: 50,
      finalMarks: null,
      maxAssignmentMarks: 20,
      assignmentMarks: 13,
      gradeHistory: ['B', 'B+', 'C+', 'B'],
      studyHoursPerWeek: 4,
      difficulty: 'Hard',
      attendanceLog: generateAttendanceLog(36, 28),
    },
    {
      id: 'CS505',
      name: 'Software Engineering',
      shortName: 'SE',
      credits: 3,
      instructor: 'Dr. Neha Gupta',
      color: '#E63946',
      totalClasses: 34,
      attendedClasses: 31,
      maxInternalMarks: 30,
      internalMarks: 25,
      maxMidTermMarks: 20,
      midTermMarks: 17,
      maxFinalMarks: 50,
      finalMarks: null,
      maxAssignmentMarks: 20,
      assignmentMarks: 18,
      gradeHistory: ['A', 'A+', 'A', 'A'],
      studyHoursPerWeek: 5,
      difficulty: 'Easy',
      attendanceLog: generateAttendanceLog(34, 31),
    },
    {
      id: 'MA501',
      name: 'Probability & Statistics',
      shortName: 'P&S',
      credits: 3,
      instructor: 'Prof. Suresh Nair',
      color: '#4CC9F0',
      totalClasses: 36,
      attendedClasses: 32,
      maxInternalMarks: 30,
      internalMarks: 22,
      maxMidTermMarks: 20,
      midTermMarks: 15,
      maxFinalMarks: 50,
      finalMarks: null,
      maxAssignmentMarks: 20,
      assignmentMarks: 16,
      gradeHistory: ['B+', 'A', 'B', 'B+'],
      studyHoursPerWeek: 6,
      difficulty: 'Medium',
      attendanceLog: generateAttendanceLog(36, 32),
    },
  ],

  // ---- Assignments ----
  assignments: [
    {
      id: 'ASG001',
      subjectId: 'CS501',
      title: 'Binary Tree Implementation',
      dueDate: '2026-07-05',
      status: 'submitted',
      maxMarks: 20,
      marksObtained: 17,
      submittedDate: '2026-07-04',
      latePenalty: 0,
    },
    {
      id: 'ASG002',
      subjectId: 'CS502',
      title: 'Process Scheduling Simulator',
      dueDate: '2026-07-08',
      status: 'pending',
      maxMarks: 20,
      marksObtained: null,
      submittedDate: null,
      latePenalty: 0,
    },
    {
      id: 'ASG003',
      subjectId: 'CS503',
      title: 'ER Diagram Design',
      dueDate: '2026-07-02',
      status: 'submitted',
      maxMarks: 20,
      marksObtained: 19,
      submittedDate: '2026-07-01',
      latePenalty: 0,
    },
    {
      id: 'ASG004',
      subjectId: 'CS504',
      title: 'Socket Programming Lab',
      dueDate: '2026-07-10',
      status: 'pending',
      maxMarks: 20,
      marksObtained: null,
      submittedDate: null,
      latePenalty: 0,
    },
    {
      id: 'ASG005',
      subjectId: 'CS505',
      title: 'SRS Document Draft',
      dueDate: '2026-06-30',
      status: 'submitted',
      maxMarks: 20,
      marksObtained: 18,
      submittedDate: '2026-06-29',
      latePenalty: 0,
    },
    {
      id: 'ASG006',
      subjectId: 'MA501',
      title: 'Probability Problem Set',
      dueDate: '2026-07-12',
      status: 'pending',
      maxMarks: 20,
      marksObtained: null,
      submittedDate: null,
      latePenalty: 0,
    },
    {
      id: 'ASG007',
      subjectId: 'CS501',
      title: 'Graph Algorithm Analysis',
      dueDate: '2026-07-15',
      status: 'pending',
      maxMarks: 20,
      marksObtained: null,
      submittedDate: null,
      latePenalty: 0,
    },
    {
      id: 'ASG008',
      subjectId: 'CS502',
      title: 'Memory Management Report',
      dueDate: '2026-07-18',
      status: 'not-started',
      maxMarks: 20,
      marksObtained: null,
      submittedDate: null,
      latePenalty: 0,
    },
  ],

  // ---- Exam Schedule ----
  exams: [
    { subjectId: 'CS501', type: 'Final', date: '2026-08-10', weight: 50 },
    { subjectId: 'CS502', type: 'Final', date: '2026-08-12', weight: 50 },
    { subjectId: 'CS503', type: 'Final', date: '2026-08-14', weight: 50 },
    { subjectId: 'CS504', type: 'Final', date: '2026-08-16', weight: 50 },
    { subjectId: 'CS505', type: 'Final', date: '2026-08-18', weight: 50 },
    { subjectId: 'MA501', type: 'Final', date: '2026-08-20', weight: 50 },
  ],

  // ---- CGPA History ----
  cgpaHistory: [
    { semester: 1, cgpa: 7.8, sgpa: 7.8 },
    { semester: 2, cgpa: 7.95, sgpa: 8.1 },
    { semester: 3, cgpa: 8.05, sgpa: 8.2 },
    { semester: 4, cgpa: 8.12, sgpa: 8.3 },
  ],

  // ---- Grading Scale ----
  gradingScale: {
    'A+': { min: 90, max: 100, gradePoint: 10 },
    'A':  { min: 80, max: 89, gradePoint: 9 },
    'B+': { min: 70, max: 79, gradePoint: 8 },
    'B':  { min: 60, max: 69, gradePoint: 7 },
    'C+': { min: 55, max: 59, gradePoint: 6 },
    'C':  { min: 50, max: 54, gradePoint: 5 },
    'D':  { min: 45, max: 49, gradePoint: 4 },
    'F':  { min: 0,  max: 44, gradePoint: 0 },
  },

  // ---- Thresholds ----
  thresholds: {
    minAttendance: 75,
    safeAttendance: 85,
    minPassMarks: 45,
    warningCGPA: 6.0,
    latePenaltyPerDay: 5, // 5% penalty per day late
    maxLateDays: 5,
  },

  // ---- Study Hours History (last 8 weeks) ----
  weeklyStudyHours: [
    { week: 'W1', CS501: 7, CS502: 4, CS503: 6, CS504: 3, CS505: 5, MA501: 5 },
    { week: 'W2', CS501: 8, CS502: 5, CS503: 6, CS504: 4, CS505: 5, MA501: 6 },
    { week: 'W3', CS501: 9, CS502: 4, CS503: 7, CS504: 3, CS505: 4, MA501: 6 },
    { week: 'W4', CS501: 7, CS502: 6, CS503: 5, CS504: 5, CS505: 6, MA501: 5 },
    { week: 'W5', CS501: 8, CS502: 5, CS503: 6, CS504: 4, CS505: 5, MA501: 7 },
    { week: 'W6', CS501: 10, CS502: 3, CS503: 7, CS504: 3, CS505: 5, MA501: 6 },
    { week: 'W7', CS501: 8, CS502: 6, CS503: 6, CS504: 4, CS505: 5, MA501: 6 },
    { week: 'W8', CS501: 9, CS502: 5, CS503: 6, CS504: 4, CS505: 5, MA501: 6 },
  ],
};

// ============================================
// Helper: Generate realistic attendance log
// ============================================
function generateAttendanceLog(total, attended) {
  const log = [];
  const startDate = new Date('2026-02-01');
  let present = 0;
  const absent = total - attended;
  let absentCount = 0;

  for (let i = 0; i < total; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + Math.floor(i * 1.5)); // ~3 classes/week

    // Skip weekends
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }

    // Distribute absences somewhat randomly but weighted toward recent classes
    const remainingClasses = total - i;
    const remainingAbsences = absent - absentCount;
    const absentProbability = remainingAbsences / remainingClasses;

    let status;
    if (absentCount >= absent) {
      status = 'present';
    } else if (remainingAbsences >= remainingClasses) {
      status = 'absent';
    } else {
      status = Math.random() < absentProbability ? 'absent' : 'present';
    }

    if (status === 'present') {
      present++;
    } else {
      absentCount++;
    }

    log.push({
      date: date.toISOString().split('T')[0],
      status,
      classNumber: i + 1,
    });
  }

  return log;
}

export default studentData;
