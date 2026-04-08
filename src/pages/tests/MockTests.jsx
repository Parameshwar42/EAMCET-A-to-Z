import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { Clock, PlayCircle, CheckCircle, FileText, Trophy, BarChart2, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

export default function MockTests() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [tests, setTests] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (activeTab === 'completed' && currentUser) fetchSubmissions();
  }, [activeTab]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('pdf_exams').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (data) {
        setTests(data);
        const counts = {};
        await Promise.all(data.map(async (exam) => {
          const { count } = await supabase.from('exam_questions').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id);
          counts[exam.id] = count || 0;
        }));
        setQuestionCounts(counts);
      }
    } catch (e) { console.error(e); }
    setTimeout(() => setLoading(false), 800);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('exam_submissions')
      .select('*, pdf_exams(title, duration_mins)')
      .eq('user_id', currentUser.id)
      .order('submitted_at', { ascending: false });
    if (data) setSubmissions(data);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-24 relative" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="h2 font-black text-main flex items-center gap-2">
           <Trophy className="text-warning" size={28} /> Advanced Assessments
        </h1>
        <p className="text-muted text-sm mt-1 font-medium">Test your preparation with live patterns & instant results.</p>
      </div>

      {/* Modern Tabs */}
      <div className="flex p-1 bg-bg-card rounded-2xl border border-color mb-8 shadow-sm max-w-sm">
        {[
          { key: 'active', label: 'EAMCET Exams', icon: PlayCircle },
          { key: 'completed', label: 'My Progress', icon: BarChart2 }
        ].map(t => (
          <button 
            key={t.key} 
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === t.key 
                ? 'bg-primary text-white shadow-md' 
                : 'text-muted hover:bg-main'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ACTIVE EXAMS ── */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-5">
          {loading ? (
             [1,2,3].map(i => (
               <Card key={i} className="flex flex-col md:flex-row items-center gap-4 p-5">
                  <Skeleton width="64px" height="64px" borderRadius="16px" />
                  <div className="flex-1 space-y-2 w-full">
                     <Skeleton width="100px" height="0.8rem" />
                     <Skeleton width="60%" height="1.2rem" />
                     <Skeleton width="40%" height="0.8rem" />
                  </div>
                  <Skeleton width="120px" height="44px" borderRadius="12px" />
               </Card>
             ))
          ) : tests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-color">
              <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileText size={32} className="text-muted opacity-30" />
              </div>
              <p className="font-bold text-main">No Test Available</p>
              <p className="text-xs text-muted mt-1">Check back soon for new assessments.</p>
            </div>
          ) : tests.map((test) => {
            const qCount = questionCounts[test.id] ?? 0;
            const hasQuestions = qCount > 0;
            return (
              <Card key={test.id} className="group flex flex-col md:flex-row md:items-center gap-5 p-5 hover:shadow-xl hover:border-primary transition-all bg-white border-color overflow-hidden relative">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary" className="!bg-primary !text-white !text-[8px] tracking-widest px-2 uppercase font-black">Live Assessment</Badge>
                    {hasQuestions && (
                       <div className="flex items-center gap-1 text-[9px] font-black text-success uppercase">
                         <div className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></div> Available Now
                       </div>
                    )}
                  </div>
                  
                  <h3 className="font-black text-main text-[17px] mb-2 group-hover:text-primary transition">{test.title}</h3>
                  
                  <div className="flex items-center gap-5 text-[11px] font-bold text-muted">
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {test.duration_mins} MINS</span>
                    <span className="flex items-center gap-1.5"><FileText size={14} className="text-primary" /> {test.questions_count || qCount} QUESTIONS</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="rounded-xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-light flex items-center justify-center gap-2"
                  onClick={() => navigate(`/exam/${test.id}`)}
                  disabled={!hasQuestions}>
                  {hasQuestions ? <><PlayCircle size={18} /> Start Exam</> : 'Syncing Data...'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── MY RESULTS ── */}
      {activeTab === 'completed' && (
        <div className="flex flex-col gap-5">
          {!currentUser ? (
            <div className="text-center p-12 text-muted">Please log in to see results.</div>
          ) : loading ? (
            [1,2].map(i => (
              <Card key={i} className="p-5 flex flex-col gap-3">
                 <Skeleton width="150px" height="0.8rem" />
                 <Skeleton width="100%" height="1.5rem" />
                 <Skeleton width="50%" height="0.8rem" />
              </Card>
            ))
          ) : submissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-color">
              <Trophy size={48} className="mx-auto text-muted opacity-20 mb-4" />
              <p className="font-bold text-main">No Scorecards Yet</p>
              <p className="text-xs text-muted mt-1">Your performance analytics will appear here.</p>
            </div>
          ) : submissions.map((sub) => {
            const pct = Math.round((sub.score / sub.total) * 100);
            const passed = pct >= 40;
            return (
              <Card key={sub.id} className="relative overflow-hidden group p-0 border-0 shadow-lg bg-white rounded-3xl">
                <div className={`h-1.5 w-full ${passed ? 'bg-success' : 'bg-danger'}`}></div>
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${passed ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    <Trophy size={28} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Performance Summary</div>
                    <h3 className="font-black text-main text-lg mb-2">{sub.pdf_exams?.title || 'Exam Assessment'}</h3>
                    <div className="flex flex-wrap gap-4 text-[11px] font-bold text-muted">
                      <span className="flex items-center gap-1.5"><BarChart2 size={14} /> Score: {sub.score}/{sub.total}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col items-center justify-center px-8 py-3 rounded-2xl ${passed ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    <div className="text-3xl font-black leading-none">{pct}%</div>
                    <div className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">{passed ? 'Qualified' : 'Requires Review'}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

