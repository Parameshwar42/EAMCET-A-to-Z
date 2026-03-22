export const userProfile = {
  id: "U123",
  name: "Ravi Teja",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
  streak: 15,
  targetExam: "TS EAMCET 2026",
  weeklyTargetCompletion: 75,
};

export const subjectProgress = [
  { subject: "Maths", progress: 65, color: "var(--primary)" },
  { subject: "Physics", progress: 42, color: "var(--warning)" },
  { subject: "Chemistry", progress: 80, color: "var(--success)" },
];

export const todayPlan = [
  { id: 1, subject: "Maths", topic: "Definite Integrals", type: "Practice", status: "pending", duration: "45 mins" },
  { id: 2, subject: "Physics", topic: "Thermodynamics", type: "Revision", status: "completed", duration: "30 mins" },
  { id: 3, subject: "Chemistry", topic: "Chemical Bonding", type: "Mock Test", status: "pending", duration: "60 mins" },
];

export const upcomingTests = [
  { id: 101, name: "Grand Mock Test 1", date: "Sunday, 10 AM", syllabus: "Full Syllabus" },
  { id: 102, name: "Physics Part Test", date: "Wednesday, 6 PM", syllabus: "Mechanics" },
];

export const recentScores = [
  { id: 201, name: "Maths Chapter Test", score: "45/60", accuracy: "80%" },
  { id: 202, name: "Chemistry Mini Mock", score: "55/60", accuracy: "92%" },
];

export const weakChapters = [
  { name: "Rotational Motion", subject: "Physics", accuracy: "35%" },
  { name: "Complex Numbers", subject: "Maths", accuracy: "42%" },
];

export const dummyPracticeChapters = [
  { id: "M1", subject: "Maths", name: "Quadratic Equations", questionsCount: 150, mastery: 80 },
  { id: "M2", subject: "Maths", name: "Vectors", questionsCount: 120, mastery: 60 },
  { id: "P1", subject: "Physics", name: "Kinematics", questionsCount: 200, mastery: 90 },
  { id: "C1", subject: "Chemistry", name: "Organic Basics", questionsCount: 180, mastery: 40 },
];

export const mistakeCategories = [
  { type: "Silly Mistake", count: 42, color: "var(--warning)" },
  { type: "Concept Gap", count: 28, color: "var(--danger)" },
  { type: "Formula Error", count: 15, color: "var(--primary)" },
  { type: "Time Pressure", count: 19, color: "var(--secondary)" },
];

export const revisionNotes = [
  { id: "R1", title: "Integration Shortcuts", subject: "Maths", type: "Flashcards" },
  { id: "R2", title: "Named Reactions", subject: "Chemistry", type: "Summary Cards" },
  { id: "R3", title: "Mechanics Formulas", subject: "Physics", type: "Formula Sheet" },
];

export const videoLessons = [
  { id: "V1", title: "Vector Algebra Hacks", duration: "12:45", views: "12K", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop" },
  { id: "V2", title: "Stoichiometry in 10 Mins", duration: "09:30", views: "8.5K", thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop" },
];
