import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/ui/ProgressRing';
import { userProfile, recentScores } from '../../data/dummyData';
import { Flame, Target, ChevronRight, CheckCircle2, Circle, ShieldAlert, Plus, Edit2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomeDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.email === 'admin@eamcet2026.com';

  const [loading, setLoading] = useState(true);
  const [actionPlan, setActionPlan] = useState([]);
  
  // Progress & Mastery State
  const [weeklyTargetTotal, setWeeklyTargetTotal] = useState(10);
  const [weeklyTargetCompleted, setWeeklyTargetCompleted] = useState(0);
  const [mastery, setMastery] = useState({ Maths: 0, Physics: 0, Chemistry: 0 });
  const [activeStreak, setActiveStreak] = useState(1);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ subject: 'Maths', topic: '', type: 'Practice', duration_mins: 30 });
  const [showEditTarget, setShowEditTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(10);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch User Progress (Weekly Target Total)
      let { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', currentUser.id).single();
      
      if (!progressData) {
        // Create initial progress if not exists
        const todayStrInit = new Date().toISOString().split('T')[0];
        const { data: newProg } = await supabase.from('user_progress').insert([{ 
          user_id: currentUser.id, 
          weekly_target_total: 10,
          current_streak: 1,
          last_login_date: todayStrInit
        }]).select().single();
        progressData = newProg;
      }
      setWeeklyTargetTotal(progressData?.weekly_target_total || 10);
      setNewTarget(progressData?.weekly_target_total || 10);

      // 1.5 Calculate Daily Streak
      const todayStr = new Date().toISOString().split('T')[0];
      let currentStreak = progressData?.current_streak || 1;
      let lastLoginDateStr = progressData?.last_login_date;
      let updateStreakInDB = false;

      if (!lastLoginDateStr) {
        // First login ever since tracking added
        currentStreak = 1;
        updateStreakInDB = true;
      } else if (lastLoginDateStr !== todayStr) {
        const lastDate = new Date(lastLoginDateStr);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          currentStreak += 1; // Logged in yesterday (+1 streak)
        } else if (diffDays > 1) {
          currentStreak = 1; // Missed at least one day (Reset to 1)
        }
        updateStreakInDB = true;
      }

      setActiveStreak(currentStreak);

      if (updateStreakInDB) {
        await supabase.from('user_progress').update({ 
          current_streak: currentStreak, 
          last_login_date: todayStr 
        }).eq('user_id', currentUser.id);
      }

      // 2. Fetch User Actions (Tasks)
      const { data: actionsData } = await supabase.from('user_actions').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
      
      if (actionsData) {
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Filter action plan for today (using startsWith in case DB attaches timestamp)
        const todaysActions = actionsData.filter(a => a.action_date && a.action_date.startsWith(todayStr));
        setActionPlan(todaysActions);

        // Calculate Weekly Completed
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        const nowMs = new Date().getTime();
        const thisWeekCompleted = actionsData.filter(a => a.status === 'completed' && (nowMs - new Date(a.created_at).getTime()) < ONE_WEEK_MS).length;
        setWeeklyTargetCompleted(thisWeekCompleted);

        // Calculate Subject Mastery (e.g. 5% mastery per completed task)
        const mathsCompleted = actionsData.filter(a => a.subject === 'Maths' && a.status === 'completed').length;
        const physicsCompleted = actionsData.filter(a => a.subject === 'Physics' && a.status === 'completed').length;
        const chemCompleted = actionsData.filter(a => a.subject === 'Chemistry' && a.status === 'completed').length;

        setMastery({
          Maths: Math.min(100, mathsCompleted * 5),
          Physics: Math.min(100, physicsCompleted * 5),
          Chemistry: Math.min(100, chemCompleted * 5)
        });
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    // Optimistic Update
    setActionPlan(actionPlan.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    // DB Update
    await supabase.from('user_actions').update({ status: newStatus }).eq('id', taskId);
    fetchDashboardData();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.topic.trim()) return;

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('user_actions').insert([{
        user_id: currentUser.id,
        subject: newTask.subject,
        topic: newTask.topic,
        type: newTask.type,
        duration_mins: parseInt(newTask.duration_mins) || 30,
        status: 'pending',
        action_date: todayStr
      }]);

      if (error) {
         console.error("Supabase insert error:", error);
         alert("Failed to save task: " + error.message);
         return;
      }

      setShowAddModal(false);
      setNewTask({ subject: 'Maths', topic: '', type: 'Practice', duration_mins: 30 });
      fetchDashboardData();
    } catch (err) {
      console.error("Try-catch error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleUpdateTarget = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('user_progress').update({ weekly_target_total: parseInt(newTarget) }).eq('user_id', currentUser.id);
      if (error) {
         alert("Failed to update target: " + error.message);
         return;
      }
      setWeeklyTargetTotal(parseInt(newTarget));
      setShowEditTarget(false);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const targetPercentage = Math.min(100, Math.round((weeklyTargetCompleted / Math.max(1, weeklyTargetTotal)) * 100));

  return (
    <div className="p-4 md:p-6 animate-fade-in relative" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="h2 font-bold text-main">Hello, {currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "Aspirant"} 👋</h1>
          <p className="text-muted">You're preparing for <span className="font-semibold text-primary">{userProfile.targetExam}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <Card padding="p-2 px-4" className="flex items-center gap-2" style={{ borderRadius: 'var(--radius-pill)' }}>
            <Flame color="var(--warning)" size={20} />
            <span className="font-bold">{activeStreak} Day Streak</span>
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
               <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)} className="flex items-center gap-1">
                 <Plus size={16}/> Add Task
               </Button>
            </div>
            <Card className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-muted p-4">Loading action plan...</div>
              ) : actionPlan.length === 0 ? (
                <div className="text-center text-muted p-6 border-2 border-dashed border-color rounded-xl">
                    <p className="mb-3">You have no tasks planned for today.</p>
                    <Button onClick={() => setShowAddModal(true)}>Set Today's Target</Button>
                </div>
              ) : (
                actionPlan.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-main transition" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                    <div className="flex items-center gap-3">
                       <button onClick={() => toggleTaskStatus(task.id, task.status)} className="focus:outline-none">
                         {task.status === 'completed' ? 
                           <CheckCircle2 color="var(--success)" size={26} className="cursor-pointer" /> : 
                           <Circle color="var(--text-muted)" size={26} className="cursor-pointer" />
                         }
                       </button>
                       <div>
                         <div className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted' : ''}`}>{task.topic}</div>
                         <div className="text-xs text-muted mt-1">{task.subject} • {task.duration_mins} mins</div>
                       </div>
                    </div>
                    <Badge variant={task.type === 'Mock Test' ? 'danger' : task.type === 'Practice' ? 'primary' : 'warning'}>
                      {task.type}
                    </Badge>
                  </div>
                ))
              )}
            </Card>
          </section>

          {/* Subject Progress */}
          <section>
            <h2 className="h3 font-bold mb-4">Subject Mastery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold mb-4">Maths</h3>
                  <ProgressRing percentage={mastery.Maths} color="var(--primary)" />
                  <p className="text-xs text-muted mt-4">Based on completed tasks</p>
               </Card>
               <Card className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold mb-4">Physics</h3>
                  <ProgressRing percentage={mastery.Physics} color="var(--warning)" />
                  <p className="text-xs text-muted mt-4">Based on completed tasks</p>
               </Card>
               <Card className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold mb-4">Chemistry</h3>
                  <ProgressRing percentage={mastery.Chemistry} color="var(--success)" />
                  <p className="text-xs text-muted mt-4">Based on completed tasks</p>
               </Card>
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Quick Actions */}
        <div className="flex flex-col gap-6">
           {/* Weekly Goal */}
           <Card className="bg-primary text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', border: 'none' }}>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-semibold mb-2" style={{ color: 'white' }}>Weekly Target</h3>
                 <button onClick={() => setShowEditTarget(true)} className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition">
                    <Edit2 size={16} />
                 </button>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="h1 text-white">{targetPercentage}%</span>
                <span className="text-sm opacity-80 mb-2">{weeklyTargetCompleted} / {weeklyTargetTotal} Tasks</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                <div style={{ width: `${targetPercentage}%`, height: '100%', backgroundColor: '#success', background: 'var(--success-light)', borderRadius: '4px' }}></div>
              </div>
              <p className="text-xs mt-3 opacity-80">
                {weeklyTargetCompleted >= weeklyTargetTotal ? "Goal Achieved! Outstanding!" : `Keep going! Complete ${weeklyTargetTotal - weeklyTargetCompleted} more topics to hit your goal.`}
              </p>
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

      {/* --- ADD TASK MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-scale-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="h3 font-bold">Add Today's Action</h3>
                <button onClick={() => setShowAddModal(false)}><X className="text-muted hover:text-danger"/></button>
             </div>
             <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                <div>
                   <label className="text-sm font-bold text-main block mb-1">Subject</label>
                   <select 
                     value={newTask.subject} 
                     onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                     className="w-full bg-bg-card border border-color rounded-lg px-4 py-2"
                   >
                      <option>Maths</option><option>Physics</option><option>Chemistry</option>
                   </select>
                </div>
                <div>
                   <label className="text-sm font-bold text-main block mb-1">Topic Name</label>
                   <input required type="text" placeholder="e.g. Integration Mastery" value={newTask.topic} onChange={(e) => setNewTask({...newTask, topic: e.target.value})} className="w-full bg-bg-card border border-color rounded-lg px-4 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-sm font-bold text-main block mb-1">Type</label>
                       <select value={newTask.type} onChange={(e) => setNewTask({...newTask, type: e.target.value})} className="w-full bg-bg-card border border-color rounded-lg px-4 py-2">
                          <option>Practice</option><option>Revision</option><option>Mock Test</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-sm font-bold text-main block mb-1">Duration (Mins)</label>
                       <input required type="number" min="5" value={newTask.duration_mins} onChange={(e) => setNewTask({...newTask, duration_mins: e.target.value})} className="w-full bg-bg-card border border-color rounded-lg px-4 py-2" />
                    </div>
                </div>
                <Button type="submit" fullWidth className="mt-2 text-white">Save Action</Button>
             </form>
          </Card>
        </div>
      )}

      {/* --- EDIT TARGET MODAL --- */}
      {showEditTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm animate-scale-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="h3 font-bold">Edit Weekly Target</h3>
                <button onClick={() => setShowEditTarget(false)}><X className="text-muted hover:text-danger"/></button>
             </div>
             <form onSubmit={handleUpdateTarget} className="flex flex-col gap-4">
                <div>
                   <label className="text-sm font-bold text-main block mb-1">Target Tasks Per Week</label>
                   <input required type="number" min="1" max="100" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} className="w-full bg-bg-card border border-color rounded-lg px-4 py-2" />
                </div>
                <Button type="submit" fullWidth className="mt-2 text-white">Update Weekly Target</Button>
             </form>
          </Card>
        </div>
      )}

    </div>
  );
}
