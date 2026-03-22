import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import Button from '../../components/ui/Button';
import { Clock, CheckCircle } from 'lucide-react';

export default function TestExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    async function fetchExam() {
      const { data, error } = await supabase.from('pdf_exams').select('*').eq('id', id).single();
      if (data) {
        setExam(data);
        setTimeLeft(data.duration_mins * 60);
      }
      setLoading(false);
    }
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (!exam || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, timeLeft]);

  const handleSubmit = () => {
    if (!exam) return;
    const answerKeyArray = (exam.answer_key || '').split(',').map(k => k.trim().toUpperCase());
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    for (let i = 1; i <= exam.questions_count; i++) {
        const userAns = answers[i];
        const correctAns = answerKeyArray[i - 1];
        if (!userAns) unanswered++;
        else if (userAns === correctAns) correct++;
        else incorrect++;
    }

    const score = correct; // EAMCET standard: +1 for correct, 0 for incorrect

    navigate(`/tests/result/${id}`, { 
       state: { exam, answers, stats: { score, correct, incorrect, unanswered } } 
    });
  };

  const handleBubbleClick = (qNum, option) => {
    setAnswers(prev => ({ ...prev, [qNum]: prev[qNum] === option ? null : option }));
  };

  if (loading) return <div className="p-8 text-center animate-pulse font-bold text-primary">Initializing Secure Exam Environment...</div>;
  if (!exam) return <div className="p-8 text-center text-danger font-bold text-xl">Exam configuration not found!</div>;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${Math.max(0, h).toString().padStart(2,'0')}:${Math.max(0, m).toString().padStart(2,'0')}:${Math.max(0, s).toString().padStart(2,'0')}`;
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-bg-main overflow-hidden w-full fixed inset-0 z-50">
      {/* Header Bar */}
      <div className="bg-bg-card border-b border-color p-3 md:p-4 flex justify-between items-center shadow-lg shadow-black/5 flex-shrink-0">
         <div>
            <h1 className="font-bold text-lg md:text-xl text-primary flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>{exam.title}</h1>
            <p className="text-xs text-muted font-semibold mt-1">Live PDF Assessment • {exam.duration_mins} Mins • {exam.questions_count} Qs</p>
         </div>
         <div className="flex items-center gap-4 md:gap-8">
            <div className={`flex items-center gap-2 font-mono text-2xl md:text-4xl font-extrabold bg-bg-main px-4 py-2 rounded-xl shadow-inner border border-color ${timeLeft < 300 ? 'text-danger animate-pulse bg-danger-light bg-opacity-20 border-danger' : 'text-text-main'}`}>
               <Clock className={timeLeft < 300 ? 'text-danger' : 'text-primary'} size={28}/>
               {formatTime(timeLeft)}
            </div>
            <Button variant="primary" className="hidden md:flex font-bold uppercase tracking-wide" onClick={() => { if(window.confirm('Submit Final Answers?')) handleSubmit() }}>Submit Exam</Button>
            <Button variant="primary" className="md:hidden font-bold" size="sm" onClick={() => { if(window.confirm('Submit Final Answers?')) handleSubmit() }}>Submit</Button>
         </div>
      </div>

      {/* Split Screen Container */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
         {/* Left Side: PDF Viewer */}
         <div className="flex-1 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-color md:w-2/3 bg-slate-900 overflow-hidden relative shadow-inner">
            <iframe 
               src={`${exam.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`} 
               className="w-full h-full border-none absolute inset-0"
               style={{ backgroundColor: '#0f172a' }}
               title="Question Paper"
            ></iframe>
         </div>

         {/* Right Side: OMR Sheet */}
         <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col bg-bg-card flex-shrink-0 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)] z-10">
            <div className="p-4 border-b border-color bg-gradient-to-r from-primary-light/30 to-transparent flex-shrink-0">
               <h2 className="font-bold text-lg flex items-center gap-2 text-primary"><CheckCircle size={20}/> Digital OMR Sheet</h2>
               <p className="text-xs text-muted font-semibold mt-1">Click bubbles to record answers. Click again to clear.</p>
               <div className="flex gap-4 mt-3 text-xs font-bold text-muted bg-bg-main p-2 rounded-lg border border-color text-center justify-around">
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-primary border-2 border-primary shadow-sm shadow-primary/20"></span> Attempted</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-white border-2 border-slate-300"></span> Unanswered</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ scrollbarWidth: 'thin' }}>
               <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 pb-32 md:pb-12">
                  {Array.from({ length: exam.questions_count }).map((_, i) => {
                     const qNum = i + 1;
                     return (
                        <div key={qNum} className={`flex items-center p-3 rounded-xl border transition-all duration-200 ${answers[qNum] ? 'bg-primary-light bg-opacity-10 border-primary shadow-sm' : 'bg-bg-main border-color hover:border-slate-400'}`}>
                           <span className="font-extrabold w-8 text-text-muted text-right pr-2 text-sm">{qNum}.</span>
                           <div className="flex items-center gap-2 flex-1 justify-around">
                              {['A', 'B', 'C', 'D'].map(opt => (
                                 <div 
                                    key={opt}
                                    onClick={() => handleBubbleClick(qNum, opt)}
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 select-none hover:scale-105 active:scale-95 ${answers[qNum] === opt ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : 'bg-bg-card border-slate-300 text-slate-500 hover:border-primary hover:text-primary'}`}
                                 >
                                    {opt}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
