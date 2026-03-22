import React from 'react';
import Card from '../../components/ui/Card';
import { Trophy, Crown, Medal } from 'lucide-react';

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "Prashanth K.", score: 154, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prash" },
    { rank: 2, name: "Neha S.", score: 148, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
    { rank: 3, name: "Ravi Teja (You)", score: 124, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" },
    { rank: 4, name: "Arjun R.", score: 118, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
    { rank: 5, name: "Srinu V.", score: 112, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Srinu" }
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2 text-center"><Trophy className="inline text-warning mb-1 mr-2"/> Top Performers</h1>
      <p className="subtitle mb-8 text-center">Grand Mock Test 1 - State Level</p>

      {/* Podium for top 3 */}
      <div className="flex items-end justify-center gap-2 md:gap-6 mb-12 h-48 mt-12">
         {/* Rank 2 */}
         <div className="flex flex-col items-center gap-2 relative">
            <span className="absolute -top-6 text-sm font-bold text-muted">2nd</span>
            <img src={leaders[1].img} className="w-16 h-16 rounded-full border-4 border-slate-300 bg-white" alt="Rank 2" />
            <div className="w-20 md:w-28 h-24 bg-slate-200 rounded-t-lg flex items-center justify-center font-bold text-xl text-slate-600 shadow-inner">148</div>
         </div>
         {/* Rank 1 */}
         <div className="flex flex-col items-center gap-2 relative z-10">
            <Crown className="absolute -top-8 text-warning" size={32} />
            <img src={leaders[0].img} className="w-20 h-20 rounded-full border-4 border-warning bg-white shadow-lg" alt="Rank 1" />
            <div className="w-24 md:w-32 h-36 bg-gradient-to-t from-warning-light to-amber-200 rounded-t-lg flex flex-col items-center justify-center font-bold text-2xl text-amber-700 shadow-md">
               <span>1st</span>
               <span className="text-sm">154</span>
            </div>
         </div>
         {/* Rank 3 */}
         <div className="flex flex-col items-center gap-2 relative">
            <span className="absolute -top-6 text-sm font-bold text-orange-600">3rd</span>
            <img src={leaders[2].img} className="w-16 h-16 rounded-full border-4 border-orange-300 bg-white" alt="Rank 3" />
            <div className="w-20 md:w-28 h-20 bg-orange-100 rounded-t-lg flex items-center justify-center font-bold text-xl text-orange-700 shadow-inner">124</div>
         </div>
      </div>

      <Card padding="p-0" className="overflow-hidden">
        {leaders.map((student, i) => (
           <div key={student.rank} className={`flex items-center gap-4 p-4 border-b border-color hover:bg-main transition ${student.rank === 3 ? 'bg-primary-light border-l-4 border-l-primary' : ''}`}>
              <div className="font-bold w-6 text-center text-muted">{student.rank}</div>
              <img src={student.img} className="w-10 h-10 rounded-full bg-white border border-color" alt={student.name} />
              <div className="flex-1 font-semibold">{student.name} {student.rank === 3 && "(You)"}</div>
              <div className="font-bold text-primary">{student.score} <span className="text-xs text-muted font-normal block text-right">Marks</span></div>
           </div>
        ))}
      </Card>
    </div>
  );
}
