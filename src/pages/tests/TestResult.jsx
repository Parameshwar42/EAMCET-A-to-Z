import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CheckCircle2, XCircle, AlertCircle, FileText, Download, Trophy, Target, ArrowLeft } from 'lucide-react';

export default function TestResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.exam) {
    return (
      <div className="p-8 text-center max-w-md mx-auto mt-20">
         <Card>
            <AlertCircle size={48} className="mx-auto text-warning mb-4"/>
            <h2 className="font-bold text-xl mb-2">No Results Found</h2>
            <p className="text-muted text-sm mb-6">Looks like you haven't taken this test yet or the session expired.</p>
            <Button variant="primary" onClick={() => navigate('/mock-tests')}>Go to Mock Tests</Button>
         </Card>
      </div>
    );
  }

  const { exam, answers, stats } = state;
  const accuracy = stats.score > 0 ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) : 0;
  const percentage = Math.round((stats.score / exam.questions_count) * 100);

  return (
    <div className="p-4 md:p-6 pb-24 animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition" onClick={() => navigate('/mock-tests')}>
        <ArrowLeft size={18} className="mr-2"/> Back to Tests
      </Button>

      <div className="text-center mb-8">
         <Badge variant="primary" className="mb-3 uppercase tracking-wider text-xs">Assessment Complete</Badge>
         <h1 className="h2 font-extrabold text-primary mb-2">{exam.title}</h1>
         <p className="subtitle">Real-time Auto-Grading Scorecard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
         {/* Main Score */}
         <Card className="col-span-1 md:col-span-3 bg-gradient-to-br from-primary to-indigo-700 text-white border-none shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
            <Trophy size={120} className="absolute -right-4 -bottom-4 text-white opacity-10 rotate-[-15deg]"/>
            <Target size={120} className="absolute -left-4 -top-4 text-white opacity-10 rotate-[15deg]"/>
            <h3 className="text-primary-100 font-bold tracking-widest uppercase mb-2 relative z-10">Final Score</h3>
            <div className="text-7xl md:text-8xl font-black relative z-10 drop-shadow-lg">{stats.score} <span className="text-3xl font-medium text-primary-200">/ {exam.questions_count}</span></div>
            <div className={`mt-4 px-4 py-1.5 rounded-full font-bold text-sm bg-white bg-opacity-20 backdrop-blur-sm relative z-10 ${percentage >= 80 ? 'text-emerald-300' : percentage >= 50 ? 'text-warning-light' : 'text-red-300'}`}>
               {percentage}% - {percentage >= 80 ? 'Excellent Performance! 🏆' : percentage >= 50 ? 'Good effort, keep practicing! 📈' : 'Needs more focus. You can do it! 💪'}
            </div>
         </Card>

         {/* Stats row */}
         <Card className="flex flex-col items-center justify-center p-6 border-emerald-500 border-opacity-30 bg-emerald-50 bg-opacity-10">
            <CheckCircle2 size={32} className="text-emerald-500 mb-3"/>
            <div className="text-3xl font-black text-emerald-600 mb-1">{stats.correct}</div>
            <div className="text-sm font-bold text-muted uppercase tracking-wider text-center">Correct Answers</div>
         </Card>
         <Card className="flex flex-col items-center justify-center p-6 border-red-500 border-opacity-30 bg-red-50 bg-opacity-10">
            <XCircle size={32} className="text-red-500 mb-3"/>
            <div className="text-3xl font-black text-red-600 mb-1">{stats.incorrect}</div>
            <div className="text-sm font-bold text-muted uppercase tracking-wider text-center">Incorrect Answers</div>
         </Card>
         <Card className="flex flex-col items-center justify-center p-6 border-slate-500 border-opacity-30 bg-slate-50 bg-opacity-10">
            <AlertCircle size={32} className="text-slate-500 mb-3"/>
            <div className="text-3xl font-black text-slate-600 mb-1">{stats.unanswered}</div>
            <div className="text-sm font-bold text-muted uppercase tracking-wider text-center">Unanswered</div>
         </Card>
      </div>

      {exam.solution_url ? (
         <Card className="text-center p-8 md:p-12 border-primary border-opacity-50 shadow-md bg-gradient-to-b from-bg-card to-primary-light to-opacity-10">
            <FileText size={48} className="mx-auto text-primary mb-4 opacity-80"/>
            <h3 className="font-bold text-xl mb-3">Detailed Solutions Paper</h3>
            <p className="text-muted text-sm max-w-md mx-auto mb-6">Review the official detailed step-by-step solutions to identify where you went wrong and learn the fastest problem-solving techniques.</p>
            <Button variant="primary" className="mx-auto font-bold px-8 shadow-primary/30 shadow-lg" onClick={() => window.open(exam.solution_url, '_blank')}>
               <Download size={20} className="mr-2"/> Download Solutions PDF
            </Button>
         </Card>
      ) : (
         <Card className="text-center p-8 bg-slate-50 border-dashed border-2">
            <h3 className="font-bold mb-2">No Solutions Attached</h3>
            <p className="text-muted text-sm">The admin has not uploaded a detailed solutions PDF for this exam yet.</p>
         </Card>
      )}

    </div>
  );
}
