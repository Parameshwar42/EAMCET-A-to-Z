import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import ProgressRing from '../../components/ui/ProgressRing';
import Skeleton from '../../components/ui/Skeleton';
import { BarChart3, TrendingUp, Activity, Award, Calendar, ChevronRight, Target, Brain } from 'lucide-react';
import { subjectProgress, recentScores } from '../../data/dummyData';

export default function PerformanceAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch for skeleton demo
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const stats = [
    { icon: <TrendingUp size={20} />, label: "Overall Accuracy", value: "82%", trend: "+2.4%", color: "success" },
    { icon: <Activity size={20} />, label: "Average Score", value: "98/160", trend: "+5 pts", color: "warning" },
    { icon: <Award size={20} />, label: "Predicted Rank", value: "#2,450", trend: "Top 2%", color: "primary" },
    { icon: <Calendar size={20} />, label: "Mock Tests", value: "24", trend: "Last 30 days", color: "muted" },
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in relative pb-24" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="h3 font-black text-main flex items-center gap-2">
           <BarChart3 className="text-primary" size={24} /> Learning Analytics
        </h1>
        <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">Real-time performance insights</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {[1,2,3,4].map(i => <Skeleton key={i} height="100px" borderRadius="24px" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
             <Card key={i} className="flex flex-col gap-2 p-5 border-0 shadow-sm relative overflow-hidden group hover:shadow-md transition-all bg-white">
                <div className={`p-2 rounded-xl w-fit ${stat.color === 'success' ? 'bg-success-light text-success' : stat.color === 'warning' ? 'bg-warning-light text-warning-dark' : stat.color === 'primary' ? 'bg-primary-light text-primary' : 'bg-bg-main text-muted'}`}>
                   {stat.icon}
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase text-muted tracking-tight mb-1">{stat.label}</div>
                   <div className="text-xl font-black text-main">{stat.value}</div>
                   <div className={`text-[10px] font-bold mt-1 ${stat.color === 'success' ? 'text-success' : 'text-primary opacity-80'}`}>
                      {stat.trend}
                   </div>
                </div>
             </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         {/* Score Trend Chart */}
         <Card className="lg:col-span-2 p-6 !rounded-[32px] border-0 shadow-lg bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <TrendingUp size={120} />
            </div>
            <div className="flex justify-between items-center mb-10 relative z-10">
               <div>
                  <h3 className="font-black text-main text-lg tracking-tight">Score Progression</h3>
                  <p className="text-xs text-muted font-bold">Last 5 Major Mock Assessments</p>
               </div>
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" style={{ opacity: 1 - i*0.25 }}></div>)}
               </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 relative z-10 px-2 mt-4">
               {loading ? <Skeleton width="100%" height="100%" /> : [40, 55, 62, 75, 82].map((val, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                    <div className="absolute -top-6 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                       {val}%
                    </div>
                    <div className="w-full max-w-[48px] rounded-2xl transition-all duration-500 shadow-lg relative overflow-hidden" 
                         style={{ 
                            height: `${val}%`,
                            background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-hover) 100%)',
                         }}>
                       <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-10"></div>
                    </div>
                    <span className="text-[10px] font-black text-muted mt-4 uppercase tracking-tighter">Test 0{i+1}</span>
                 </div>
               ))}
            </div>
         </Card>

         {/* Subject Detail */}
         <Card className="p-6 !rounded-[32px] border-0 shadow-lg bg-main">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                  <Brain size={24} />
               </div>
               <h3 className="font-black text-main tracking-tight">Focus Areas</h3>
            </div>
            
            <div className="flex flex-col gap-8 h-full justify-center">
               {loading ? [1,2,3].map(i => <Skeleton key={i} height="40px" />) : subjectProgress.map(subj => (
                 <div key={subj.subject} className="flex flex-col w-full gap-2">
                    <div className="flex justify-between items-center px-1">
                       <span className="text-xs font-black uppercase tracking-widest text-main">{subj.subject}</span>
                       <span className="text-xs font-black text-primary">{subj.progress}%</span>
                    </div>
                    <div className="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                       <div className="h-full rounded-full transition-all duration-1000 shadow-sm" 
                            style={{ width: `${subj.progress}%`, backgroundColor: subj.color }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </Card>
      </div>
      
      {/* Detailed Report Table */}
      <Card className="p-0 overflow-hidden border-0 shadow-xl !rounded-[32px] bg-white">
         <div className="p-6 border-b border-color flex justify-between items-center">
            <h3 className="font-black text-main text-lg flex items-center gap-2">
               <Target size={20} className="text-danger" /> Test Report Card
            </h3>
            <Button variant="ghost" size="sm" className="text-[10px] font-black border border-color rounded-xl h-8">VIEW FULL HISTORY</Button>
         </div>
         <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-bg-main text-[10px] font-black text-muted uppercase tracking-widest">
                    <th className="px-6 py-4">Assessment Name</th>
                    <th className="px-6 py-4 text-center">Final Score</th>
                    <th className="px-6 py-4 text-center">Accuracy</th>
                    <th className="px-6 py-4 text-right">Result</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-color">
                  {loading ? [1,2,3].map(i => (
                    <tr key={i}><td colSpan="4" className="p-4"><Skeleton height="30px" /></td></tr>
                  )) : recentScores.map(score => (
                    <tr key={score.id} className="hover:bg-primary-light hover:bg-opacity-20 transition-colors group">
                      <td className="px-6 py-5 font-black text-sm text-main group-hover:text-primary">{score.name}</td>
                      <td className="px-6 py-5 text-center font-black text-primary">{score.score}</td>
                      <td className="px-6 py-5 text-center font-bold text-success">{score.accuracy}</td>
                      <td className="px-6 py-5 text-right">
                         <Badge variant="success" className="bg-success-light text-success border-0 px-3 uppercase text-[9px] font-black tracking-widest">QUALIFIED</Badge>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}

