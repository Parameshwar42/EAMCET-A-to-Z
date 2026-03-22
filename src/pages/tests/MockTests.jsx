import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Clock, PlayCircle, CheckCircle, FileText } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function MockTests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      const { data, error } = await supabase.from('pdf_exams').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setTests(data);
      }
      setLoading(false);
    }
    fetchTests();
  }, []);

  const activeTests = tests.filter(t => t.is_active);

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-24" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2">Live PDF Assessments</h1>
      <p className="subtitle mb-6">Real exam simulations with PDF question papers and instant auto-grading.</p>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-color mb-6">
        {['active', 'completed'].map(t => (
          <div
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 font-semibold cursor-pointer ${activeTab === t ? 'text-primary' : 'text-muted'}`}
            style={{ borderBottom: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent' }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
          </div>
        ))}
      </div>

      {/* Active Tests List */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-4">
          {loading ? (
             <div className="text-center p-8 text-primary font-bold animate-pulse">Establishing secure connection to grading servers...</div>
          ) : activeTests.length === 0 ? (
             <div className="text-center p-12 text-muted font-semibold border-2 border-dashed border-color rounded-xl bg-bg-main bg-opacity-50">
                No active exams available right now.<br/>
                <span className="text-sm font-normal mt-2 inline-block">Head to the Admin Hub to upload one!</span>
             </div>
          ) : activeTests.map((test) => (
             <Card key={test.id} className="flex flex-col md:flex-row md:items-center gap-4 hover:border-primary transition group shadow-sm bg-bg-card">
                <div className="bg-primary-light bg-opacity-20 p-4 rounded-xl flex items-center justify-center text-primary w-16 h-16 shrink-0 group-hover:scale-110 transition duration-300">
                   <FileText size={32} />
                </div>
                <div className="flex-1">
                   <Badge variant="primary" className="mb-2 text-[10px] uppercase tracking-wider font-bold">Live Assessment</Badge>
                   <h3 className="h3 font-bold mb-1 text-text-main group-hover:text-primary transition">{test.title}</h3>
                   <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted mt-2">
                     <span className="flex items-center gap-1"><Clock size={16}/> {test.duration_mins} Mins</span>
                     <span className="flex items-center gap-1"><CheckCircle size={16}/> {test.questions_count} Questions</span>
                   </div>
                </div>
                <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                   <Button variant="primary" className="flex-1 md:w-40 font-bold tracking-wide shadow-primary/30 shadow-lg" onClick={() => navigate(`/tests/execution/${test.id}`)}>
                      <PlayCircle size={18} className="mr-2"/> Start Exam
                   </Button>
                </div>
             </Card>
          ))}
        </div>
      )}

      {/* Completed Tests Placeholder */}
      {activeTab === 'completed' && (
        <div className="flex flex-col gap-4">
           <div className="text-center p-12 text-muted font-semibold border-2 border-dashed border-color rounded-xl bg-bg-main bg-opacity-50">
              Exam history tracking will be available soon! Take active tests from the Active tab.
           </div>
        </div>
      )}
    </div>
  );
}
