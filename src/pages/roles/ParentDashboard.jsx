import React from 'react';
import Card from '../../components/ui/Card';
import ProgressRing from '../../components/ui/ProgressRing';
import { userProfile } from '../../data/dummyData';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';

export default function ParentDashboard() {
  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex items-center gap-3 mb-8">
         <Users className="text-primary" size={28} />
         <h1 className="h2 font-bold">Parent View Dashboard</h1>
      </div>

      <Card className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-primary-light border-primary-light">
         <img src={userProfile.avatar} className="w-20 h-20 rounded-full border-2 border-primary" alt="Student" />
         <div>
            <h2 className="h3 font-bold text-primary">Tracking {userProfile.name}'s Progress</h2>
            <p className="text-sm text-text-main mt-1">Preparing for {userProfile.targetExam}. Maintain an encouraging environment!</p>
         </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold text-muted mb-4 uppercase text-xs tracking-wider">Weekly Attendance</h3>
            <ProgressRing percentage={90} size={100} strokeWidth={8} color="var(--success)">
               <span className="text-2xl font-bold">90%</span>
            </ProgressRing>
            <p className="text-xs text-muted mt-4">Missed 1 study session this week</p>
         </Card>
         
         <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="flex items-center gap-4 hover:shadow-md transition">
               <div className="p-3 bg-main rounded-full"><FileText className="text-primary"/></div>
               <div className="flex-1">
                  <div className="font-bold mb-1">Recent Mock Test</div>
                  <div className="text-sm mb-1">Grand Mock Test 1</div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                     <span className="text-primary">Score: 124/160</span>
                     <span className="text-success">Accuracy: 82%</span>
                  </div>
               </div>
            </Card>

            <Card className="flex items-center gap-4 hover:shadow-md transition">
               <div className="p-3 bg-warning-light rounded-full text-warning"><AlertIcon /></div>
               <div className="flex-1">
                  <div className="font-bold mb-1">Focus Required</div>
                  <div className="text-sm text-muted">Struggling with Physics (35% mastery). We recommend enrolling in the revision batch.</div>
               </div>
            </Card>
         </div>
      </div>
      
      <Card>
         <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> Parent Action Items</h3>
         <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
            <li>Ensure Ravi completes his mock test scheduled for this Sunday at 10 AM.</li>
            <li>Review the "My Mistakes" notebook with him to see where he usually fails.</li>
            <li>Reward him for achieving a 15-day continuous learning streak!</li>
         </ul>
      </Card>
    </div>
  );
}

function AlertIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
