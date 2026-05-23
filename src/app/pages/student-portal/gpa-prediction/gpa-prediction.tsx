"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Calculator,
  ArrowRight,
  Zap,
  Award,
  BookOpen,
  Brain,
  BarChart3,
  Plus,
  Trash2,
  X,
  GraduationCap,
  RefreshCw,
  Save,
  FileText
} from "lucide-react";
import { motion, Variants, Easing } from "framer-motion";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  assignmentScores: AssignmentScore[];
  predictedExamScore: number;
  examWeight: number;
}

interface AssignmentScore {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

interface GPACalculatorCourse {
  id: string;
  code: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface GradePoint {
  minScore: number;
  grade: string;
  gradePoint: number;
  description: string;
}

// Nigerian university grading scale (5-point system)
const GRADE_SCALE: GradePoint[] = [
  { minScore: 70, grade: "A", gradePoint: 5.0, description: "Excellent" },
  { minScore: 60, grade: "B", gradePoint: 4.0, description: "Very Good" },
  { minScore: 50, grade: "C", gradePoint: 3.0, description: "Good" },
  { minScore: 45, grade: "D", gradePoint: 2.0, description: "Pass" },
  { minScore: 40, grade: "E", gradePoint: 1.0, description: "Marginal Pass" },
  { minScore: 0, grade: "F", gradePoint: 0.0, description: "Fail" },
];

const GRADE_OPTIONS = [
  { grade: "A", gradePoint: 5.0, minScore: 70 },
  { grade: "B", gradePoint: 4.0, minScore: 60 },
  { grade: "C", gradePoint: 3.0, minScore: 50 },
  { grade: "D", gradePoint: 2.0, minScore: 45 },
  { grade: "E", gradePoint: 1.0, minScore: 40 },
  { grade: "F", gradePoint: 0.0, minScore: 0 },
];

const getGradeInfo = (score: number): GradePoint => {
  return GRADE_SCALE.find(g => score >= g.minScore) || GRADE_SCALE[GRADE_SCALE.length - 1];
};

const getGradePointFromLetter = (grade: string): number => {
  const found = GRADE_OPTIONS.find(g => g.grade === grade);
  return found ? found.gradePoint : 0;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculateCourseFinalScore = (course: Course): number => {
  let totalAssignmentWeight = 0;
  let totalWeightedScore = 0;
  
  course.assignmentScores.forEach(assignment => {
    const percentage = (assignment.score / assignment.maxScore) * 100;
    totalWeightedScore += percentage * assignment.weight;
    totalAssignmentWeight += assignment.weight;
  });
  
  const assignmentsScore = totalAssignmentWeight > 0 ? totalWeightedScore / totalAssignmentWeight : 0;
  const examContribution = (course.predictedExamScore / 100) * course.examWeight * 100;
  const assignmentsContribution = assignmentsScore * (1 - course.examWeight);
  
  return Math.min(100, Math.max(0, examContribution + assignmentsContribution));
};

const calculatePredictedGPA = (courses: Course[]): number => {
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    const finalScore = calculateCourseFinalScore(course);
    const gradeInfo = getGradeInfo(finalScore);
    totalGradePoints += gradeInfo.gradePoint * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
};

const calculateActualGPA = (courses: GPACalculatorCourse[]): number => {
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    totalGradePoints += course.gradePoint * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
};

const getClassification = (gpa: number): { text: string; color: string; minGpa: number; description: string } => {
  if (gpa >= 4.5) return { text: "First Class", color: "#22b864", minGpa: 4.5, description: "Excellent! Keep up the outstanding work!" };
  if (gpa >= 3.5) return { text: "Second Class Upper", color: "#4fd68a", minGpa: 3.5, description: "Great job! You're doing very well." };
  if (gpa >= 2.5) return { text: "Second Class Lower", color: "#c8a84b", minGpa: 2.5, description: "Good progress! Aim higher next semester." };
  if (gpa >= 1.5) return { text: "Third Class", color: "#e67e22", minGpa: 1.5, description: "Room for improvement. Focus on your studies." };
  return { text: "Pass", color: "#e74c3c", minGpa: 1.0, description: "You need to work harder to graduate with a good grade." };
};

// ============================================================================
// ADD COURSE MODAL
// ============================================================================

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Omit<Course, 'id' | 'assignmentScores'> & { assignmentScores?: AssignmentScore[] }) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [credits, setCredits] = useState(3);
  const [examWeight, setExamWeight] = useState(0.6);

  const handleAdd = () => {
    if (code && title) {
      onAdd({
        code: code.toUpperCase(),
        title,
        credits,
        examWeight,
        assignmentScores: [],
        predictedExamScore: 50,
      });
      setCode("");
      setTitle("");
      setCredits(3);
      setExamWeight(0.6);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#071a0d]">Add New Course</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#e6faf0] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Course Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., CSC 401"
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Advanced Software Engineering"
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Credit Hours</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Exam Weight (%)</label>
            <input
              type="range"
              min="30"
              max="80"
              value={examWeight * 100}
              onChange={(e) => setExamWeight(parseInt(e.target.value) / 100)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#6a9975] mt-1">
              <span>Assignments: {((1 - examWeight) * 100).toFixed(0)}%</span>
              <span>Exam: {(examWeight * 100).toFixed(0)}%</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!code || !title}
            className="w-full py-3 bg-[#0f6e3f] text-white rounded-xl font-semibold hover:bg-[#22b864] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ASSIGNMENT MODAL
// ============================================================================

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignments: AssignmentScore[]) => void;
  existingAssignments: AssignmentScore[];
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, existingAssignments }) => {
  const [assignments, setAssignments] = useState<AssignmentScore[]>(existingAssignments.length > 0 ? existingAssignments : [
    { id: "1", name: "Quiz 1", score: 0, maxScore: 20, weight: 10 },
    { id: "2", name: "Assignment 1", score: 0, maxScore: 100, weight: 20 },
    { id: "3", name: "Midterm", score: 0, maxScore: 100, weight: 30 },
    { id: "4", name: "Project", score: 0, maxScore: 100, weight: 40 },
  ]);

  const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);

  const updateAssignment = (id: string, field: keyof AssignmentScore, value: string | number) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: typeof value === 'string' ? value : Math.max(0, Math.min(100, Number(value) || 0)) } : a
    ));
  };

  const addAssignment = () => {
    const newId = Date.now().toString();
    setAssignments(prev => [...prev, { id: newId, name: "New Assignment", score: 0, maxScore: 100, weight: 0 }]);
  };

  const removeAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleSave = () => {
    if (Math.abs(totalWeight - 100) > 5) {
      alert(`Total weight is ${totalWeight}%. Please adjust to 100% for accurate calculation.`);
      return;
    }
    onSave(assignments);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#071a0d]">Assignment Scores</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#e6faf0] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="p-3 bg-[#f2fbf6] rounded-lg">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={assignment.name}
                  onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                  className="flex-1 p-2 border border-[#d8eedd] rounded-lg text-sm"
                />
                <button onClick={() => removeAssignment(assignment.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#6a9975]">Score</label>
                  <input
                    type="number"
                    value={assignment.score}
                    onChange={(e) => updateAssignment(assignment.id, 'score', e.target.value)}
                    className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#6a9975]">Max Score</label>
                  <input
                    type="number"
                    value={assignment.maxScore}
                    onChange={(e) => updateAssignment(assignment.id, 'maxScore', e.target.value)}
                    className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#6a9975]">Weight (%)</label>
                  <input
                    type="number"
                    value={assignment.weight}
                    onChange={(e) => updateAssignment(assignment.id, 'weight', e.target.value)}
                    className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addAssignment} className="w-full py-2 border border-dashed border-[#22b864] text-[#22b864] rounded-lg text-sm font-semibold hover:bg-[#e6faf0] transition-all mb-4">
          + Add Assignment
        </button>

        <div className={`p-3 rounded-lg mb-4 text-center text-sm ${Math.abs(totalWeight - 100) <= 5 ? 'bg-[#e6faf0] text-[#0f6e3f]' : 'bg-red-50 text-red-600'}`}>
          Total Weight: {totalWeight}% {Math.abs(totalWeight - 100) > 5 ? '(Should be 100%)' : '✓'}
        </div>

        <button onClick={handleSave} className="w-full py-3 bg-[#0f6e3f] text-white rounded-xl font-semibold hover:bg-[#22b864] transition-all">
          Save Assignments
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// GPA CALCULATOR COMPONENT
// ============================================================================

const GPACalculatorSection: React.FC = () => {
  const [courses, setCourses] = useState<GPACalculatorCourse[]>([]);
  const [semesterName, setSemesterName] = useState("Current Semester");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState("A");

  const currentGPA = useMemo(() => calculateActualGPA(courses), [courses]);
  const classification = getClassification(currentGPA);

  const addCourse = () => {
    if (newCode) {
      const gradePoint = getGradePointFromLetter(newGrade);
      setCourses(prev => [...prev, {
        id: Date.now().toString(),
        code: newCode.toUpperCase(),
        credits: newCredits,
        grade: newGrade,
        gradePoint,
      }]);
      setNewCode("");
      setNewCredits(3);
      setNewGrade("A");
      setShowAddForm(false);
    }
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateGrade = (id: string, grade: string) => {
    const gradePoint = getGradePointFromLetter(grade);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, grade, gradePoint } : c));
  };

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalGradePoints = courses.reduce((sum, c) => sum + (c.gradePoint * c.credits), 0);

  return (
    <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden">
      <div className="border-b border-[#d8eedd] p-5 md:px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">GPA Calculator</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              placeholder="Semester name"
              className="px-3 py-1.5 border border-[#d8eedd] rounded-lg text-sm focus:outline-none focus:border-[#22b864]"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0f6e3f] text-white rounded-lg text-sm font-semibold hover:bg-[#22b864] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {/* GPA Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#f2fbf6] rounded-xl p-4 text-center">
            <div className="text-xs text-[#6a9975] mb-1">Current GPA</div>
            <div className="text-3xl font-bold text-[#071a0d] font-serif">{currentGPA.toFixed(2)}</div>
            <div className="text-xs text-[#22b864] mt-1">/ 5.00</div>
          </div>
          <div className="bg-[#f2fbf6] rounded-xl p-4 text-center">
            <div className="text-xs text-[#6a9975] mb-1">Total Credits</div>
            <div className="text-3xl font-bold text-[#071a0d]">{totalCredits}</div>
          </div>
          <div className="bg-[#f2fbf6] rounded-xl p-4 text-center">
            <div className="text-xs text-[#6a9975] mb-1">Classification</div>
            <div className="text-lg font-bold" style={{ color: classification.color }}>{classification.text}</div>
          </div>
        </div>

        {/* Course List */}
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#e6faf0] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#22b864]" />
            </div>
            <p className="text-[#6a9975]">No courses added yet</p>
            <button onClick={() => setShowAddForm(true)} className="mt-3 px-4 py-2 bg-[#0f6e3f] text-white rounded-lg text-sm">
              Add Your First Course
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-[#f2fbf6] rounded-xl">
                <div>
                  <span className="text-sm font-mono font-bold text-[#22b864]">{course.code}</span>
                  <div className="text-xs text-[#6a9975]">{course.credits} credits</div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={course.grade}
                    onChange={(e) => updateGrade(course.id, e.target.value)}
                    className="px-3 py-1.5 border border-[#d8eedd] rounded-lg text-sm font-semibold bg-white"
                  >
                    {GRADE_OPTIONS.map(opt => (
                      <option key={opt.grade} value={opt.grade}>{opt.grade} ({opt.gradePoint.toFixed(1)})</option>
                    ))}
                  </select>
                  <button onClick={() => removeCourse(course.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Course Form Popup */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[#071a0d] mb-4">Add Course to GPA Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g., CSC 401"
                    className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Credit Hours</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                    className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
                  >
                    {GRADE_OPTIONS.map(opt => (
                      <option key={opt.grade} value={opt.grade}>{opt.grade} ({opt.gradePoint.toFixed(1)} points)</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 py-2 border border-[#d8eedd] rounded-lg">Cancel</button>
                  <button onClick={addCourse} className="flex-1 py-2 bg-[#0f6e3f] text-white rounded-lg font-semibold">Add Course</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN GPA PREDICTION ENGINE COMPONENT
// ============================================================================

const GPAPredictionEngine: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nacos_gpa_predictor_courses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [targetGPA, setTargetGPA] = useState<number>(4.5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedCourseForAssignments, setSelectedCourseForAssignments] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("2025/2026 Harmattan");
  const [activeTab, setActiveTab] = useState<"predictor" | "calculator">("predictor");

  const predictedGPA = useMemo(() => calculatePredictedGPA(courses), [courses]);
  const classification = getClassification(predictedGPA);
  
  useEffect(() => {
    localStorage.setItem("nacos_gpa_predictor_courses", JSON.stringify(courses));
  }, [courses]);

  const addCourse = (newCourse: Omit<Course, "id" | "assignmentScores"> & { assignmentScores?: AssignmentScore[] }) => {
    const course: Course = {
      ...newCourse,
      id: Date.now().toString(),
      assignmentScores: newCourse.assignmentScores || [],
      predictedExamScore: 50,
    };
    setCourses(prev => [...prev, course]);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateExamScore = (id: string, score: number) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, predictedExamScore: score } : c));
  };

  const updateAssignments = (id: string, assignments: AssignmentScore[]) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, assignmentScores: assignments } : c));
  };

  const openAssignmentModal = (course: Course) => {
    setSelectedCourseForAssignments(course);
    setIsAssignmentModalOpen(true);
  };

  const getAssignmentSummary = (course: Course): string => {
    if (course.assignmentScores.length === 0) return "No assignments added";
    let totalWeight = 0;
    let totalWeightedScore = 0;
    course.assignmentScores.forEach(a => {
      const percentage = (a.score / a.maxScore) * 100;
      totalWeightedScore += percentage * a.weight;
      totalWeight += a.weight;
    });
    const avgScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    return `${course.assignmentScores.length} assignments · ${Math.round(avgScore)}% avg`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as unknown as Easing[] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-[#22b864]" />
            <span className="text-xs font-mono font-bold text-[#22b864] uppercase tracking-wider">Academic Tools</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight">
            GPA Suite
          </h1>
          <p className="text-sm text-[#6a9975] mt-1">
            Predict your future GPA or calculate your current semester performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#e6faf0] border border-[#c0f4d5] rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <Zap className="w-4 h-4 text-[#22b864]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#6a9975] uppercase tracking-tight leading-none mb-1">Academic Standing</span>
              <span className="text-xs font-bold text-[#0f6e3f]">Good Standing</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="flex gap-2 border-b border-[#d8eedd]">
        <button
          onClick={() => setActiveTab("predictor")}
          className={`px-6 py-3 text-sm font-semibold transition-all relative ${
            activeTab === "predictor" 
              ? "text-[#22b864]" 
              : "text-[#6a9975] hover:text-[#071a0d]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            GPA Predictor
          </div>
          {activeTab === "predictor" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22b864] rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-6 py-3 text-sm font-semibold transition-all relative ${
            activeTab === "calculator" 
              ? "text-[#22b864]" 
              : "text-[#6a9975] hover:text-[#071a0d]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            GPA Calculator
          </div>
          {activeTab === "calculator" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22b864] rounded-full"></div>
          )}
        </button>
      </motion.div>

      {/* GPA Predictor Section */}
      {activeTab === "predictor" && (
        <>
          {/* GPA Display Card */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-6 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#e6faf0" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="#22b864" strokeWidth="12" fill="transparent"
                    strokeDasharray="553"
                    strokeDashoffset={553 - (553 * predictedGPA) / 5.0}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-[#071a0d] font-serif">
                    {predictedGPA.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#6a9975] mt-1">/ 5.00</span>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${classification.color}15`, border: `1px solid ${classification.color}30` }}>
                  <Award className="w-4 h-4" style={{ color: classification.color }} />
                  <span className="text-sm font-bold" style={{ color: classification.color }}>
                    {classification.text}
                  </span>
                </div>
                <p className="text-xs text-[#6a9975] mt-3">{classification.description}</p>
              </div>

              <div className="w-full mt-6 pt-4 border-t border-[#d8eedd]">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#6a9975]">Total Credits</span>
                  <span className="text-sm font-bold text-[#071a0d]">{courses.reduce((sum, c) => sum + c.credits, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#6a9975]">Courses Enrolled</span>
                  <span className="text-sm font-bold text-[#071a0d]">{courses.length}</span>
                </div>
              </div>
            </div>

            {/* Target Analysis */}
            <div className="lg:col-span-2 bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#22b864]" />
                  <h3 className="text-lg font-bold text-[#071a0d] font-serif">Target GPA Analysis</h3>
                </div>
                <select
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
                  className="bg-[#e6faf0] border border-[#c0f4d5] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0f6e3f] outline-none"
                >
                  {[5.0, 4.5, 4.0, 3.5, 3.0, 2.5].map(gpa => (
                    <option key={gpa} value={gpa}>{gpa.toFixed(1)} ({getClassification(gpa).text})</option>
                  ))}
                </select>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-8 text-[#6a9975]">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Add courses to see target analysis</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map(course => {
                    const finalScore = calculateCourseFinalScore(course);
                    const gradeInfo = getGradeInfo(finalScore);
                    const targetGrade = GRADE_SCALE.find(g => g.gradePoint <= targetGPA);
                    const needsImprovement = targetGrade && finalScore < targetGrade.minScore;
                    
                    return (
                      <div key={course.id} className="p-3 bg-[#f2fbf6] rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#22b864]">{course.code}</span>
                            <p className="text-sm font-medium text-[#071a0d]">{course.title}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{gradeInfo.grade} ({Math.round(finalScore)}%)</div>
                            <div className="text-xs text-[#6a9975]">{course.credits} credits</div>
                          </div>
                        </div>
                        {needsImprovement && (
                          <div className="mt-2 text-xs text-[#e67e22] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Need {targetGrade.minScore}%+ to reach target
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Course List */}
          <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden">
            <div className="border-b border-[#d8eedd] p-5 md:px-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#071a0d] font-serif">Your Courses</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0f6e3f] text-white rounded-xl font-semibold hover:bg-[#22b864] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#e6faf0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-[#22b864]" />
                  </div>
                  <p className="text-[#6a9975] mb-4">No courses added yet</p>
                  <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-[#0f6e3f] text-white rounded-xl">
                    Add Your First Course
                  </button>
                </div>
              ) : (
                courses.map(course => {
                  const finalScore = calculateCourseFinalScore(course);
                  const gradeInfo = getGradeInfo(finalScore);
                  
                  return (
                    <div key={course.id} className="p-4 bg-[#f2fbf6] rounded-xl">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#22b864]">{course.code}</span>
                            <span className="text-xs text-[#6a9975]">{course.credits} credits</span>
                          </div>
                          <h4 className="text-base font-bold text-[#071a0d]">{course.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#071a0d]">{Math.round(finalScore)}%</div>
                            <div className={`text-sm font-bold ${gradeInfo.grade === 'F' ? 'text-red-500' : 'text-[#22b864]'}`}>
                              {gradeInfo.grade}
                            </div>
                          </div>
                          <button onClick={() => removeCourse(course.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#6a9975]">Predicted Exam Score</span>
                          <span className="font-semibold text-[#071a0d]">{course.predictedExamScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={course.predictedExamScore}
                          onChange={(e) => updateExamScore(course.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-[#e6faf0] rounded-lg accent-[#22b864]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#6a9975]">
                          {getAssignmentSummary(course)}
                        </div>
                        <button
                          onClick={() => openAssignmentModal(course)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#0f6e3f] border border-[#22b864] rounded-lg hover:bg-[#22b864] hover:text-white transition-all"
                        >
                          Edit Assignments
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* GPA Calculator Section */}
      {activeTab === "calculator" && (
        <motion.div variants={itemVariants}>
          <GPACalculatorSection />
        </motion.div>
      )}

      {/* Motivational Footer */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#0a4a20] to-[#0f6e3f] rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#4fd68a]" />
          <span className="text-sm font-bold text-white">Your potential is limitless</span>
        </div>
        <p className="text-xs text-[#88e8b0]">
          Every assignment and exam point brings you closer to your academic goals. Keep pushing forward! 🎓
        </p>
      </motion.div>

      {/* Modals */}
      <AddCourseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addCourse} />
      {selectedCourseForAssignments && (
        <AssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => setIsAssignmentModalOpen(false)}
          onSave={(assignments) => updateAssignments(selectedCourseForAssignments.id, assignments)}
          existingAssignments={selectedCourseForAssignments.assignmentScores}
        />
      )}
    </motion.div>
  );
};

export default GPAPredictionEngine;