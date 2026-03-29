import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Clock, PlayCircle, CheckCircle, FileText, Trophy, BarChart2 } from 'lucide-react';
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
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('exam_submissions')
      .select('*, pdf_exams(title, duration_mins)')
      .eq('user_id', currentUser.id)
      .order('submitted_at', { ascending: false });
    if (data) setSubmissions(data);
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-24" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2">Live MCQ Assessments</h1>
      <p className="subtitle mb-6">Interactive MCQ exams with instant auto-grading and full answer review.</p>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-color mb-6">
        {[
          { key: 'active', label: '🟢 Available Exams' },
          { key: 'completed', label: '📊 My Results' }
        ].map(t => (
          <div key={t.key} onClick={() => setActiveTab(t.key)}
            className={`pb-3 font-semibold cursor-pointer transition ${activeTab === t.key ? 'text-primary' : 'text-muted hover:text-primary'}`}
            style={{ borderBottom: activeTab === t.key ? '2px solid var(--primary)' : '2px solid transparent' }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* ── ACTIVE EXAMS ── */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center p-8 text-primary font-bold animate-pulse">Loading exams...</div>
          ) : tests.length === 0 ? (
            <div className="text-center p-12 text-muted font-semibold border-2 border-dashed border-color rounded-xl">
              No active exams available right now.<br />
              <span className="text-sm font-normal mt-2 inline-block">Ask your admin to upload one!</span>
            </div>
          ) : tests.map((test) => {
            const qCount = questionCounts[test.id] ?? 0;
            const hasQuestions = qCount > 0;
            return (
              <Card key={test.id} className="flex flex-col md:flex-row md:items-center gap-4 hover:border-primary transition group shadow-sm">
                <div style={{ background: 'var(--primary-light)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', flexShrink: 0 }}>
                  <FileText size={28} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <Badge variant="primary" className="text-[10px] uppercase tracking-wider font-bold">Live MCQ</Badge>
                    {hasQuestions
                      ? <span style={{ background: 'var(--success-light)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.6rem', borderRadius: '999px' }}>✅ {qCount} Questions Ready</span>
                      : <span style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.6rem', borderRadius: '999px' }}>⚠️ Questions Loading Soon</span>
                    }
                  </div>
                  <h3 className="h3 font-bold mb-1 text-text-main group-hover:text-primary transition">{test.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted mt-1">
                    <span className="flex items-center gap-1"><Clock size={15} /> {test.duration_mins} Mins</span>
                    <span className="flex items-center gap-1"><CheckCircle size={15} /> {test.questions_count} Questions</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-3 w-full md:w-auto mt-3 md:mt-0">
                  <Button
                    variant="primary"
                    className="flex-1 md:w-44 font-bold shadow-lg"
                    onClick={() => navigate(`/exam/${test.id}`)}
                    disabled={!hasQuestions}>
                    <PlayCircle size={18} className="mr-2" />
                    {hasQuestions ? 'Start Exam' : 'Coming Soon'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── MY RESULTS ── */}
      {activeTab === 'completed' && (
        <div className="flex flex-col gap-4">
          {!currentUser ? (
            <div className="text-center p-12 text-muted font-semibold border-2 border-dashed border-color rounded-xl">Please log in to see your results.</div>
          ) : loading ? (
            <div className="text-center p-8 text-primary font-bold animate-pulse">Fetching your results...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center p-12 text-muted font-semibold border-2 border-dashed border-color rounded-xl">
              No completed exams yet.<br />
              <span className="text-sm font-normal mt-2 inline-block">Take an exam to see your results here!</span>
            </div>
          ) : submissions.map((sub) => {
            const pct = Math.round((sub.score / sub.total) * 100);
            const passed = pct >= 40;
            return (
              <Card key={sub.id} className="flex flex-col md:flex-row md:items-center gap-4">
                <div style={{ background: passed ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', flexShrink: 0 }}>
                  <Trophy size={28} style={{ color: passed ? 'var(--success)' : 'var(--danger)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-main mb-1">{sub.pdf_exams?.title || 'Exam'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted font-semibold mt-1">
                    <span className="flex items-center gap-1"><BarChart2 size={15} /> {sub.score} / {sub.total} correct</span>
                    <span className="flex items-center gap-1"><Clock size={15} /> {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem 1.5rem', background: passed ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: '12px', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: passed ? 'var(--success)' : 'var(--danger)' }}>{pct}%</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: passed ? 'var(--success)' : 'var(--danger)' }}>{passed ? '✅ PASSED' : '❌ FAILED'}</div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
