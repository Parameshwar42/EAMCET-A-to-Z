import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Splash from './pages/auth/Splash';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import ContactUs from './pages/legal/ContactUs';

// Protected App Pages
import HomeDashboard from './pages/dashboard/HomeDashboard';
import DailyStudyPlan from './pages/study/DailyStudyPlan';
import Profile from './pages/profile/Profile';
import Notifications from './pages/dashboard/Notifications';

// Learning Modules
import PracticeList from './pages/practice/PracticeList';
import MockTests from './pages/tests/MockTests';
import TestExecution from './pages/tests/TestExecution';
import TestResult from './pages/tests/TestResult';
import MistakeTracker from './pages/tracker/MistakeTracker';
import RevisionHub from './pages/revision/RevisionHub';
import VideoLessons from './pages/lessons/VideoLessons';
import DoubtSolving from './pages/doubts/DoubtSolving';
import StudyMaterials from './pages/study/StudyMaterials';

// Advanced Views
import PerformanceAnalytics from './pages/analytics/PerformanceAnalytics';
import Leaderboard from './pages/social/Leaderboard';
import ParentDashboard from './pages/roles/ParentDashboard';
import AdminDashboard from './pages/roles/AdminDashboard';
import ExamPlayer from './pages/tests/ExamPlayer';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Public Legal Pages for AdSense Compliance */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Main App flow wrapped in Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<HomeDashboard />} />
            <Route path="/study-plan" element={<DailyStudyPlan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/practice" element={<PracticeList />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/tests/execution/:id" element={<TestExecution />} />
            <Route path="/tests/result/:id" element={<TestResult />} />

            <Route path="/mistakes" element={<MistakeTracker />} />
            <Route path="/revision" element={<RevisionHub />} />
            <Route path="/video-lessons" element={<VideoLessons />} />
            <Route path="/doubts" element={<DoubtSolving />} />
            <Route path="/materials" element={<StudyMaterials />} />

            <Route path="/analytics" element={<PerformanceAnalytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/exam/:id" element={<ExamPlayer />} />

            {/* Defaults/Placeholders for missing routes (temporarily pointing to dashboard) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
