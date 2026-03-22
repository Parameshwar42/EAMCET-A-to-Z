import React from 'react';
import Card from '../../components/ui/Card';
import ProgressRing from '../../components/ui/ProgressRing';
import { BarChart3, TrendingUp, Activity, Award } from 'lucide-react';
import { subjectProgress, recentScores } from '../../data/dummyData';

export default function PerformanceAnalytics() {
  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-primary"/> Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <TrendingUp className="text-success" />, label: "Overall Accuracy", value: "82%" },
          { icon: <Activity className="text-warning" />, label: "Avg. Test Score", value: "98/160" },
          { icon: <Award className="text-primary" />, label: "Predicted Rank", value: "#2,450" },
          { icon: <BarChart3 className="text-muted" />, label: "Tests Taken", value: "24" },
        ].map((stat, i) => (
           <Card key={i} className="flex items-center gap-4">
              <div className="p-3 bg-main rounded-full">{stat.icon}</div>
              <div>
                 <div className="text-sm text-muted">{stat.label}</div>
                 <div className="text-xl font-bold">{stat.value}</div>
              </div>
           </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <Card className="lg:col-span-2">
            <h3 className="font-bold mb-4">Score Trend (Last 5 Tests)</h3>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-color pl-2 pb-2 mt-8 opacity-80">
               {/* Dummy CSS Chart */}
               {[40, 55, 62, 75, 82].map((val, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 group">
                    <span className="text-xs font-bold mb-2 opacity-0 group-hover:opacity-100 transition text-primary">{val}%</span>
                    <div className="w-full max-w-[40px] bg-primary rounded-t-sm transition-all hover:bg-primary-hover" style={{ height: `${val}%` }}></div>
                    <span className="text-xs text-muted mt-2 block w-max">Test {i+1}</span>
                 </div>
               ))}
            </div>
         </Card>

         <Card>
            <h3 className="font-bold mb-4">Subject Mastery</h3>
            <div className="flex flex-col gap-6 items-center justify-center">
               {subjectProgress.map(subj => (
                 <div key={subj.subject} className="flex items-center w-full justify-between gap-4">
                    <span className="font-semibold w-24">{subj.subject}</span>
                    <div className="flex-1 bg-border-color h-3 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${subj.progress}%`, backgroundColor: subj.color }}></div>
                    </div>
                    <span className="text-sm font-bold">{subj.progress}%</span>
                 </div>
               ))}
            </div>
         </Card>
      </div>
      
      <Card>
         <h3 className="font-bold mb-4">Recent Tests Breakdown</h3>
         <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-color text-sm text-muted">
                    <th className="pb-3">Test Name</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Accuracy</th>
                    <th className="pb-3">Percentile</th>
                  </tr>
               </thead>
               <tbody>
                  {recentScores.map(score => (
                    <tr key={score.id} className="border-b border-color border-opacity-50 hover:bg-main transition">
                      <td className="py-4 font-semibold">{score.name}</td>
                      <td className="py-4 font-bold text-primary">{score.score}</td>
                      <td className="py-4 font-semibold text-success">{score.accuracy}</td>
                      <td className="py-4 font-semibold">92.4</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}
