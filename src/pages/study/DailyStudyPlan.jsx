import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Calendar, CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';
import { weakChapters } from '../../data/dummyData';
import { supabase } from '../../config/supabase';

export default function DailyStudyPlan() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const { data } = await supabase.from('study_plan_tasks').select('*').order('created_at', { ascending: false });
      if (data) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="h2 font-bold flex items-center gap-2"><Calendar className="text-primary"/> Daily Study Plan</h1>
          <p className="text-muted">{dateStr} • {pendingCount} Tasks Remaining</p>
        </div>
        <Button variant="primary">Generate Custom Plan</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="flex items-center justify-between bg-primary-light" style={{ border: '1px solid var(--primary-light)' }}>
             <div>
               <h3 className="font-bold text-primary">Daily Goal: 3.5 Hours</h3>
               <p className="text-sm text-muted">You have studied 1.5 hours today.</p>
             </div>
             <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 border-white bg-primary text-white font-bold shadow-md">
               42%
             </div>
          </Card>

          <h3 className="h4 font-bold mt-4 mb-2">Subject-wise Tasks</h3>
          {loading ? <div className="p-8 text-center text-muted font-semibold">Loading daily masterplan from live database...</div> : 
           tasks.length === 0 ? <div className="p-8 text-center text-muted">No syllabus scheduled for today. Kick back, or ask admin to push schedule!</div> :
           ["Maths", "Physics", "Chemistry", "Botany", "Zoology"].map(subject => {
            const subjectTasks = tasks.filter(t => t.subject === subject);
            if(subjectTasks.length === 0) return null;
            return (
              <div key={subject} className="mb-4">
                <h4 className="font-semibold mb-3 text-muted">{subject}</h4>
                <div className="flex flex-col gap-3">
                  {subjectTasks.map(task => (
                    <Card key={task.id} padding="p-4" className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition">
                      <div className="flex items-start gap-3">
                         {task.status === 'completed' ? 
                           <CheckCircle2 color="var(--success)" size={24} className="mt-1 flex-shrink-0" /> : 
                           <Circle color="var(--border-color)" size={24} className="mt-1 flex-shrink-0" />
                         }
                         <div>
                           <div className="font-bold text-lg">{task.topic}</div>
                           <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                             <span className="flex items-center gap-1"><Clock size={14}/> {task.duration}</span>
                             <Badge variant={task.type === 'Mock Test' ? 'danger' : task.type === 'Practice' ? 'primary' : 'warning'}>
                               {task.type}
                             </Badge>
                           </div>
                         </div>
                      </div>
                      <Button variant={task.status === 'completed' ? 'outline' : 'primary'} size="sm">
                        {task.status === 'completed' ? 'Review' : 'Start Task'}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-warning"/> Focus Areas (Weak Chapters)</h3>
            <p className="text-sm text-muted mb-4">Our AI suggests allocating extra time to these low-accuracy chapters.</p>
            <div className="flex flex-col gap-3">
              {weakChapters.map(chap => (
                <div key={chap.name} className="p-3 bg-main rounded-md border border-color">
                   <div className="font-semibold">{chap.name}</div>
                   <div className="flex justify-between text-xs text-muted mt-2">
                     <span>{chap.subject}</span>
                     <span className="text-danger font-bold">{chap.accuracy} Accuracy</span>
                   </div>
                </div>
              ))}
            </div>
            <Button variant="outline" fullWidth className="mt-4">Practice Weak Topics</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
