import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ContactUs() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-12 animate-fade-in mx-auto max-w-4xl" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Button variant="ghost" className="mb-6 font-bold" onClick={() => navigate(-1)}>&larr; Back</Button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-color">
        <h1 className="h1 mb-6 text-primary border-b pb-4">Contact Us</h1>
        
        <p className="mb-6 text-lg">We would love to hear from you. Whether you have an inquiry, feedback about our EAMCET preparation resources, or need support with your account, our team is ready to assist!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 rounded-lg bg-bg-card border border-color">
                <h2 className="h3 font-bold mb-3 text-secondary">Student Support</h2>
                <p className="mb-2">For help with your study plan, mock tests, or account issues:</p>
                <a href="mailto:support@eamcet2026.com" className="font-bold text-primary hover:underline">support@eamcet2026.com</a>
            </div>

            <div className="p-6 rounded-lg bg-bg-card border border-color">
                <h2 className="h3 font-bold mb-3 text-warning">Business & Advertising</h2>
                <p className="mb-2">For business inquiries, partnerships, or AdSense related communication:</p>
                <a href="mailto:business@eamcet2026.com" className="font-bold text-primary hover:underline">business@eamcet2026.com</a>
            </div>
        </div>

        <div className="mt-10 p-6 rounded-lg bg-primary-light border border-primary text-center">
            <h2 className="h3 font-bold mb-2 text-primary">Office Location</h2>
            <p className="opacity-90">A to Z EAMCET Prep Headquarters</p>
            <p className="opacity-90">Hyderabad, Telangana, India</p>
        </div>
      </div>
    </div>
  );
}
