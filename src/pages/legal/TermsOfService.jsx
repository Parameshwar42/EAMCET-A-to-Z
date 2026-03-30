import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="p-6 md:p-12 animate-fade-in mx-auto max-w-4xl" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Button variant="ghost" className="mb-6 font-bold" onClick={() => navigate(-1)}>&larr; Back</Button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-color">
        <h1 className="h1 mb-6 text-primary border-b pb-4">Terms and Conditions</h1>
        <p className="mb-4"><strong>Effective Date:</strong> March 2026</p>
        
        <h2 className="h3 mt-6 mb-3 font-bold">1. Agreement to Terms</h2>
        <p className="mb-4">By engaging with A to Z EAMCET ("Company", "we", "us", "our"), you agree to be bound by these Terms. If you do not agree with all of these terms and conditions, then you are expressly prohibited from using the platform.</p>
        
        <h2 className="h3 mt-6 mb-3 font-bold">2. User Registration</h2>
        <p className="mb-4">To access specific study modules (mock tests, performance analytics), you must complete the registration process. You are completely accountable for safeguarding your password and account.</p>

        <h2 className="h3 mt-6 mb-3 font-bold">3. Acceptable Use Policy</h2>
        <p className="mb-4">You may not access or use the site for any different purposes other than that for which we make the platform available. Attempting to scrape test questions, manipulate the leaderboard, or distribute paid materials is strictly forbidden.</p>

        <h2 className="h3 mt-6 mb-3 font-bold">4. Educational Disclaimer</h2>
        <p className="mb-4">A to Z EAMCET provides test preparation content for educational purposes only. We do not guarantee admission into any specific engineering or medical institution.</p>
        
        <h2 className="h3 mt-6 mb-3 font-bold">5. Advertising</h2>
        <p className="mb-4">Our Website allows advertisers (like Google AdSense) to display their advertisements. If you click on an ad, you will leave our site and go to the advertiser's website. We are not responsible for the contents or accuracy of ad campaigns.</p>

        <p className="mt-8 opacity-70 italic">If you have questions, please reach out via our Contact section.</p>
      </div>
    </div>
  );
}
