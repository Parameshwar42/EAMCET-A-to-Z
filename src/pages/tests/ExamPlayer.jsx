import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, Trophy } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'];

export default function ExamPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [phase, setPhase] = useState('loading'); // loading, exam, result
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    loadExam();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const loadExam = async () => {
    const { data: examData } = await supabase.from('pdf_exams').select('*').eq('id', id).single();
    const { data: qData } = await supabase.from('exam_questions').select('*').eq('exam_id', id).order('question_number', { ascending: true });
    if (!examData || !qData || qData.length === 0) { navigate('/mock-tests'); return; }
    setExam(examData);
    setQuestions(qData);
    setTimeLeft(examData.duration_mins * 60);
    setPhase('exam');
  };

  useEffect(() => {
    if (phase !== 'exam' || timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, phase]);

  const handleAnswer = (questionNumber, option) => {
    setAnswers(prev => ({ ...prev, [questionNumber]: option }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm(`You have answered ${Object.keys(answers).length} of ${questions.length} questions. Submit now?`)) return;
    clearInterval(timerRef.current);

    let score = 0;
    questions.forEach(q => { if (answers[q.question_number] === q.correct_answer) score++; });

    if (currentUser) {
      await supabase.from('exam_submissions').insert([{
        exam_id: id,
        user_id: currentUser.id,
        answers,
        score,
        total: questions.length
      }]);
    }
    setResult({ score, total: questions.length });
    setPhase('result');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // ── LOADING ──
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse text-muted font-semibold">Loading exam...</div>
    </div>
  );

  // ── RESULT SCREEN ──
  if (phase === 'result' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const passed = pct >= 40;
    return (
      <div className="p-4 animate-fade-in pb-24" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card className="text-center mb-6" padding="p-8">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🏆' : '📚'}</div>
          <h2 className="h2 text-primary mb-1">{exam.title}</h2>
          <p className="subtitle mb-6">Exam Completed!</p>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: passed ? 'var(--success)' : 'var(--danger)' }}>{pct}%</div>
          <p className="text-muted mt-1 font-semibold">{result.score} / {result.total} Correct</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: '700' }}>✅ Correct: {result.score}</div>
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: '700' }}>❌ Wrong: {result.total - result.score}</div>
            <div style={{ background: 'var(--border-color)', color: 'var(--text-muted)', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: '700' }}>⬜ Skipped: {result.total - Object.keys(answers).length}</div>
          </div>
        </Card>

        <h3 className="h3 font-bold mb-4">Answer Review</h3>
        <div className="flex flex-col gap-4">
          {questions.map((q, idx) => {
            const studentAns = answers[q.question_number];
            const isCorrect = studentAns === q.correct_answer;
            const isSkipped = !studentAns;
            return (
              <Card key={q.id} style={{ borderLeft: `4px solid ${isCorrect ? 'var(--success)' : isSkipped ? 'var(--border-color)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  {isCorrect ? <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-0.5" /> : isSkipped ? <AlertCircle size={20} className="text-muted flex-shrink-0 mt-0.5" /> : <XCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />}
                  <div style={{ flex: 1 }}>
                    <p className="font-semibold text-sm mb-2"><span className="text-muted mr-2">Q{q.question_number}.</span>{q.question_text}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {OPTION_LABELS.map((label, i) => {
                        const optText = q[OPTION_KEYS[i]];
                        const isCorrectOpt = label === q.correct_answer;
                        const isStudentOpt = label === studentAns;
                        let bg = 'var(--bg-main)'; let border = 'var(--border-color)'; let color = 'var(--text-muted)';
                        if (isCorrectOpt) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
                        if (isStudentOpt && !isCorrectOpt) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
                        return (
                          <span key={label} style={{ background: bg, border: `1.5px solid ${border}`, color, borderRadius: '8px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '600' }}>
                            {label}: {optText}
                          </span>
                        );
                      })}
                    </div>
                    {!isCorrect && !isSkipped && (
                      <p className="text-xs text-success font-bold mt-2">✅ Correct: {q.correct_answer}) {q[OPTION_KEYS[OPTION_LABELS.indexOf(q.correct_answer)]]}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <Button onClick={() => navigate('/mock-tests')} variant="primary" fullWidth className="mt-8">Back to Tests</Button>
      </div>
    );
  }

  // ── EXAM SCREEN ──
  const q = questions[currentQ];
  const urgent = timeLeft !== null && timeLeft < 300;
  return (
    <div className="p-4 animate-fade-in pb-24" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem 1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <p className="text-xs text-muted font-semibold">{exam.title}</p>
          <p className="text-xs text-muted">{answeredCount}/{questions.length} answered</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: urgent ? 'var(--danger-light)' : 'var(--primary-light)', color: urgent ? 'var(--danger)' : 'var(--primary)', borderRadius: '999px', padding: '0.4rem 0.9rem', fontWeight: '700', fontSize: '1rem' }}>
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '999px', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--primary)', borderRadius: '999px', transition: 'width 0.3s' }} />
      </div>

      {/* Question Card */}
      <Card key={q.id} className="mb-4 animate-fade-in">
        <p className="text-xs text-muted font-bold mb-1">Question {currentQ + 1} of {questions.length}</p>
        <p className="font-bold text-base mb-5" style={{ lineHeight: '1.6' }}>{q.question_text}</p>
        <div className="flex flex-col gap-3">
          {OPTION_LABELS.map((label, i) => {
            const isSelected = answers[q.question_number] === label;
            return (
              <button key={label} onClick={() => handleAnswer(q.question_number, label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                  borderRadius: '12px', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                }}>
                <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.875rem', background: isSelected ? 'var(--primary)' : 'var(--border-color)', color: isSelected ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
                <span className="text-sm font-semibold">{q[OPTION_KEYS[i]]}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <Button variant="outline" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
          <ChevronLeft size={18} /> Prev
        </Button>
        <span className="text-xs text-muted font-bold">{currentQ + 1} / {questions.length}</span>
        {currentQ < questions.length - 1
          ? <Button variant="primary" onClick={() => setCurrentQ(q => q + 1)}>Next <ChevronRight size={18} /></Button>
          : <Button variant="danger" onClick={() => handleSubmit(false)}><Trophy size={18} className="mr-1" /> Submit</Button>
        }
      </div>

      {/* Question Grid */}
      <Card className="mt-4">
        <p className="text-xs font-bold text-muted mb-3">QUESTION NAVIGATOR</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {questions.map((question, idx) => {
            const isAnswered = !!answers[question.question_number];
            const isCurrent = idx === currentQ;
            return (
              <button key={idx} onClick={() => setCurrentQ(idx)}
                style={{ width: '2rem', height: '2rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.75rem', border: `2px solid ${isCurrent ? 'var(--primary)' : isAnswered ? 'var(--success)' : 'var(--border-color)'}`, background: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--success-light)' : 'var(--bg-main)', color: isCurrent ? 'white' : isAnswered ? 'var(--success)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.1s' }}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
