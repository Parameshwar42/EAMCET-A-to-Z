import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { Trophy, Crown, Medal, TrendingUp, Users, Target, ChevronRight } from 'lucide-react';

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const leaders = [
    { rank: 1, name: "Prashanth K.", score: 154, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prash" },
    { rank: 2, name: "Neha S.", score: 148, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
    { rank: 3, name: "Ravi Teja (You)", score: 124, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" },
    { rank: 4, name: "Arjun R.", score: 118, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
    { rank: 5, name: "Srinu V.", score: 112, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Srinu" }
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in relative pb-24" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header Area */}
      <div className="text-center mb-10 mt-4">
        <h1 className="h2 font-black text-main flex items-center justify-center gap-2">
           <Trophy className="text-warning" size={32} /> State Rankings
        </h1>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-color shadow-sm mt-3">
          <Target size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Grand Mock Assessment 01</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mb-12 h-48 items-end gap-4">
           <Skeleton width="80px" height="120px" borderRadius="16px" />
           <Skeleton width="100px" height="160px" borderRadius="16px" />
           <Skeleton width="80px" height="100px" borderRadius="16px" />
        </div>
      ) : (
        /* Dynamic Podium */
        <div className="flex items-end justify-center gap-1 md:gap-4 mb-16 h-56 mt-12 px-2">
           {/* Rank 2 */}
           <div className="flex flex-col items-center gap-3 relative flex-1 max-w-[120px]">
              <div className="relative group">
                 <img src={leaders[1].img} className="w-16 h-16 rounded-[24px] border-4 border-slate-200 bg-white shadow-lg group-hover:scale-110 transition" alt="Rank 2" />
                 <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">2</div>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-white rounded-2xl flex flex-col items-center justify-center shadow-lg border-x border-t border-slate-100">
                 <span className="text-lg font-black text-slate-600">{leaders[1].score}</span>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Marks</span>
              </div>
              <span className="text-[10px] font-black text-main mt-1 truncate w-full text-center px-1">{leaders[1].name}</span>
           </div>

           {/* Rank 1 */}
           <div className="flex flex-col items-center gap-3 relative z-10 flex-1 max-w-[140px]">
              <Crown className="absolute -top-10 text-warning animate-bounce" size={40} />
              <div className="relative group">
                 <img src={leaders[0].img} className="w-20 h-20 rounded-[32px] border-4 border-warning bg-white shadow-2xl group-hover:scale-110 transition" alt="Rank 1" />
                 <div className="absolute -bottom-2 -right-2 bg-warning text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-lg">1</div>
              </div>
              <div className="w-full h-36 bg-gradient-to-t from-warning-light via-amber-100 to-white rounded-2xl flex flex-col items-center justify-center shadow-2xl border-x border-t border-amber-50">
                 <span className="text-2xl font-black text-amber-700">{leaders[0].score}</span>
                 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Marks</span>
              </div>
              <span className="text-xs font-black text-main mt-1 truncate w-full text-center px-1">{leaders[0].name}</span>
           </div>

           {/* Rank 3 */}
           <div className="flex flex-col items-center gap-3 relative flex-1 max-w-[120px]">
              <div className="relative group">
                 <img src={leaders[2].img} className="w-16 h-16 rounded-[24px] border-4 border-amber-100 bg-white shadow-lg group-hover:scale-110 transition" alt="Rank 3" />
                 <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">3</div>
              </div>
              <div className="w-full h-20 bg-gradient-to-t from-amber-50 to-white rounded-2xl flex flex-col items-center justify-center shadow-lg border-x border-t border-amber-50">
                 <span className="text-lg font-black text-amber-800">{leaders[2].score}</span>
                 <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Marks</span>
              </div>
              <span className="text-[10px] font-black text-main mt-1 truncate w-full text-center px-1">{leaders[2].name}</span>
           </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
         <div className="bg-primary-light bg-opacity-30 p-4 rounded-3xl flex items-center gap-3 border border-primary border-opacity-10">
            <Users className="text-primary" size={20} />
            <div>
               <div className="text-[9px] font-black text-primary uppercase tracking-tight">Total Aspirants</div>
               <div className="text-lg font-black text-primary-hover leading-none mt-0.5">14,250</div>
            </div>
         </div>
         <div className="bg-success-light bg-opacity-30 p-4 rounded-3xl flex items-center gap-3 border border-success border-opacity-10">
            <TrendingUp className="text-success" size={20} />
            <div>
               <div className="text-[9px] font-black text-success uppercase tracking-tight">My Percentile</div>
               <div className="text-lg font-black text-success-hover leading-none mt-0.5">92.4</div>
            </div>
         </div>
      </div>

      <Card padding="p-0" className="overflow-hidden border-0 shadow-lg !rounded-[32px] bg-white">
        <div className="p-5 border-b border-color bg-bg-main bg-opacity-40 flex justify-between items-center">
           <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Rank Breakdown</h4>
           <Medal size={16} className="text-muted" />
        </div>
        <div className="flex flex-col divide-y divide-color divide-opacity-30">
          {loading ? [1,2,3,4,5].map(i => (
            <div key={i} className="p-4 flex gap-4 items-center">
               <Skeleton width="40px" height="40px" borderRadius="12px" />
               <Skeleton width="100px" height="15px" />
            </div>
          )) : leaders.map((student, i) => (
             <div 
                key={student.rank} 
                className={`flex items-center gap-4 p-5 transition group ${student.rank === 3 ? 'bg-primary-light bg-opacity-20 relative' : 'hover:bg-bg-main'}`}
              >
                {student.rank === 3 && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                <div className="font-black text-xs text-muted w-6 text-center">{student.rank}</div>
                <img src={student.img} className="w-12 h-12 rounded-2xl bg-white border border-color shadow-sm group-hover:scale-105 transition" alt={student.name} />
                <div className="flex-1 min-w-0">
                   <div className="font-black text-main text-sm truncate uppercase tracking-tight">{student.name} {student.rank === 3 && <span className="text-primary">(You)</span>}</div>
                   <div className="text-[9px] font-black text-muted uppercase tracking-widest">TS-EAMCET BATCH '26</div>
                </div>
                <div className="text-right">
                   <div className="font-black text-primary text-lg leading-none">{student.score}</div>
                   <div className="text-[8px] font-black text-muted uppercase tracking-tighter">Marks</div>
                </div>
             </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 text-center px-8">
         <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">
           Ranking is based on your highest score in the latest Live Assessment. <br/> Improve your rank by attempting more practice tests.
         </p>
      </div>
    </div>
  );
}

