import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/ui/ProgressRing';
import Input from '../../components/ui/Input';
import { Search, ChevronDown, CheckCircle2, Lock } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function PracticeList() {
  const [activeSubject, setActiveSubject] = useState('All');
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapters() {
      const { data } = await supabase.from('practice_chapters').select('*').order('created_at', { ascending: false });
      if (data) setChapters(data);
      setLoading(false);
    }
    fetchChapters();
  }, []);

  const filteredChapters = activeSubject === 'All' 
    ? chapters 
    : chapters.filter(c => c.subject === activeSubject);

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2">Subject Practice</h1>
      <p className="subtitle mb-6">Master every concept chapter by chapter.</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search chapters..." 
          icon={<Search size={18} />} 
          fullWidth={false}
          className="flex-1"
          style={{ marginBottom: 0 }}
        />
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none' }}>
           {['All', 'Maths', 'Physics', 'Chemistry'].map(sub => (
             <Button 
               key={sub}
               variant={activeSubject === sub ? 'primary' : 'outline'}
               onClick={() => setActiveSubject(sub)}
               style={{ whiteSpace: 'nowrap' }}
               size="sm"
             >
               {sub}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <div className="col-span-2 text-center p-8 text-muted font-semibold">Loading practice engine...</div> :
         filteredChapters.length === 0 ? <div className="col-span-2 text-center p-8 text-muted font-semibold">No active chapters right now. Ask Admin to upload some practice modules!</div> :
         filteredChapters.map(chap => (
          <Card key={chap.id} className={`flex gap-4 hover:shadow-md transition ${chap.is_premium ? 'opacity-80 bg-main' : ''} relative`}>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                 <Badge variant={chap.subject === 'Maths' ? 'primary' : chap.subject === 'Physics' ? 'warning' : 'success'}>
                   {chap.subject}
                 </Badge>
                 {chap.mastery >= 90 && <CheckCircle2 size={18} className="text-success" />}
              </div>
              <h3 className="font-bold text-lg mb-1">{chap.name}</h3>
              <p className="text-sm text-muted mb-4">{chap.questions_count} Questions • PYQs Included</p>
              
              <div className="flex gap-2 mt-auto">
                 <Button size="sm" variant="primary">Mix Practice</Button>
                 <Button size="sm" variant="outline" className="hidden lg:flex">PYQs only</Button>
              </div>
            </div>
            
            <div className={`flex flex-col items-center justify-center border-l pl-4 border-color ${chap.is_premium ? 'blur-sm' : ''}`}>
               <span className="text-xs font-semibold text-muted mb-2">Mastery</span>
               <ProgressRing percentage={chap.mastery} size={50} strokeWidth={4} />
            </div>

            {chap.is_premium && (
               <div className="absolute inset-0 flex items-center justify-center glass rounded-lg flex-col z-10">
                  <Lock className="text-primary mb-2" size={24} />
                  <span className="font-bold">Pro Feature</span>
               </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
