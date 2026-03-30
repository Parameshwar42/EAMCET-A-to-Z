import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="p-6 md:p-12 animate-fade-in mx-auto max-w-4xl" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Button variant="ghost" className="mb-6 font-bold" onClick={() => navigate(-1)}>&larr; Back</Button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-color">
        <h1 className="h1 mb-6 text-primary border-b pb-4">Privacy Policy</h1>
        <p className="mb-4"><strong>Effective Date:</strong> March 2026</p>
        
        <h2 className="h3 mt-6 mb-3 font-bold">1. Information We Collect</h2>
        <p className="mb-4">When you register on A to Z EAMCET, we collect your name, email address, and performance data on our platform (such as test scores and study tracking) to provide a personalized learning experience.</p>
        
        <h2 className="h3 mt-6 mb-3 font-bold">2. How We Use Your Information</h2>
        <p className="mb-4">We use your information to operate and maintain our services, personalize your dashboard, track your progress, and communicate with you about your account.</p>

        <h2 className="h3 mt-6 mb-3 font-bold">3. Third-Party Services & Google AdSense</h2>
        <p className="mb-4">
          This site may use third-party advertising companies, such as <strong>Google AdSense</strong>, to serve ads when you visit our Website. These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you. 
          Accordingly, Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. 
        </p>

        <h2 className="h3 mt-6 mb-3 font-bold">4. Data Security</h2>
        <p className="mb-4">We implement appropriate technical and organizational measures to secure your personal data against unauthorized access.</p>

        <p className="mt-8 opacity-70 italic">If you have any questions about this Privacy Policy, please contact us via our Contact section.</p>
      </div>
    </div>
  );
}
