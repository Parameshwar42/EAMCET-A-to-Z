import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/ui/ProgressRing';
import { userProfile, todayPlan, subjectProgress, recentScores } from '../../data/dummyData';
import { Flame, Target, ChevronRight, CheckCircle2, Circle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomeDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.email === 'admin@eamcet2026.com';

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="h2 font-bold text-main">Hello, {currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "Aspirant"} 👋</h1>
          <p className="text-muted">You're preparing for <span className="font-semibold text-primary">{userProfile.targetExam}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <Card padding="p-2 px-4" className="flex items-center gap-2" style={{ borderRadius: 'var(--radius-pill)' }}>
            <Flame color="var(--warning)" size={20} />
            <span className="font-bold">{userProfile.streak} Day Streak</span>
          </Card>
          <img 
            src={userProfile.avatar} 
            alt="Avatar" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--primary-light)' }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Plan & Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Today's Plan */}
          <section>
            <div className="flex justify-between items-center mb-4">
               <h2 className="h3 font-bold flex items-center gap-2"><Target size={20} className="text-primary"/> Today's Action Plan</h2>
               <span className="text-primary font-semibold text-sm cursor-pointer">View All</span>
            </div>
            <Card className="flex flex-col gap-4">
              {todayPlan.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-main transition" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                  <div className="flex items-center gap-3">
                     {task.status === 'completed' ? 
                       <CheckCircle2 color="var(--success)" size={24} /> : 
                       <Circle color="var(--text-muted)" size={24} />
                     }
                     <div>
                       <div className="font-semibold">{task.topic}</div>
                       <div className="text-xs text-muted mt-1">{task.subject} • {task.duration}</div>
                     </div>
                  </div>
                  <Badge variant={task.type === 'Mock Test' ? 'danger' : task.type === 'Practice' ? 'primary' : 'warning'}>
                    {task.type}
                  </Badge>
                </div>
              ))}
              <Button fullWidth variant="outline" className="mt-2">Start Next Action</Button>
            </Card>
          </section>

          {/* Subject Progress */}
          <section>
            <h2 className="h3 font-bold mb-4">Subject Mastery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {subjectProgress.map(subj => (
                 <Card key={subj.subject} className="flex flex-col items-center justify-center text-center">
                    <h3 className="font-semibold mb-4">{subj.subject}</h3>
                    <ProgressRing percentage={subj.progress} color={subj.color} />
                    <p className="text-xs text-muted mt-4">Based on practice tests</p>
                 </Card>
               ))}
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Quick Actions */}
        <div className="flex flex-col gap-6">
           {/* Weekly Goal */}
           <Card className="bg-primary text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', border: 'none' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'white' }}>Weekly Target</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="h1 text-white">{userProfile.weeklyTargetCompletion}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                <div style={{ width: `${userProfile.weeklyTargetCompletion}%`, height: '100%', backgroundColor: '#fff', borderRadius: '4px' }}></div>
              </div>
              <p className="text-xs mt-3 opacity-80">You're slightly behind. Complete 2 more topics to hit your goal.</p>
           </Card>

           {/* Quick Actions */}
           <Card>
             <h3 className="font-semibold mb-4">Quick Tools</h3>
             <div className="grid grid-cols-2 gap-3">
               {isAdmin && (
                 <div onClick={() => navigate('/admin')} className="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-main col-span-2 mb-2 border border-danger-light" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                   <div className="font-bold flex items-center gap-2"><ShieldAlert size={18}/> Admin System Hub</div>
                   <div className="text-xs text-danger mt-1 text-center font-semibold">Logged in as admin</div>
                 </div>
               )}
               <div onClick={() => navigate('/materials')} className="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-main" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                 <div className="font-bold mb-1">Formula Book</div>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-main" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                 <div className="font-bold mb-1">My Mistakes</div>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-main" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
                 <div className="font-bold mb-1">Ask Doubt</div>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-main" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                 <div className="font-bold mb-1">Leaderboard</div>
               </div>
             </div>
           </Card>

           {/* Recent Scores */}
           <Card>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold">Recent Test Scores</h3>
               <ChevronRight size={18} className="text-muted" />
             </div>
             <div className="flex flex-col gap-3">
               {recentScores.map(score => (
                 <div key={score.id} className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                   <div>
                     <div className="font-semibold text-sm">{score.name}</div>
                     <div className="text-xs text-muted">Accuracy: {score.accuracy}</div>
                   </div>
                   <div className="font-bold text-primary">{score.score}</div>
                 </div>
               ))}
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
