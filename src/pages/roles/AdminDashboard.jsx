import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { ShieldAlert, Video, FileText, PenLine, Zap, Calendar, UploadCloud, Edit3, Trash2, Book, ClipboardList, Play, Clock, Library } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [module, setModule] = useState('materials'); // video, test, practice, revision, plan, pdf_exam
  const [mode, setMode] = useState('add'); // add, manage
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [csvText, setCsvText] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (mode === 'manage') fetchData();
  }, [module, mode]);

  const fetchData = async () => {
     let table = getTableName();
     const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
     if(data) setDataList(data);
  };

  const getTableName = () => {
    const tableMap = {
      'video': 'videos',
      'test': 'mock_tests',
      'practice': 'practice_chapters',
      'revision': 'revision_notes',
      'plan': 'study_plan_tasks',
      'pdf_exam': 'pdf_exams',
      'materials': 'study_materials'
    };
    return tableMap[module];
  };

  const handleClear = () => { 
     setFormData({}); setCsvText(''); setEditingId(null); setMsg({text:'', type:''}); setUploadFile(null);
     if(mode === 'manage') setMode('add');
  };

  const handleSave = async (e) => {
     e.preventDefault(); setLoading(true); setMsg({text:'', type:''});
     let table = getTableName();

     try {
        let finalData = { ...formData };
        
        // PDF EXAM SPECIAL LOGIC (MCQ + Combined Creation)
        if (module === 'pdf_exam' && mode === 'add' && !editingId) {
           if (!finalData.title) throw new Error("Please enter a Test Title!");
           if (!csvText.trim()) throw new Error("Please paste your MCQ questions CSV!");
           
           // 1. Create the Exam Record
           const { data: examData, error: examErr } = await supabase.from(table).insert([{
             title: finalData.title,
             duration_mins: parseInt(finalData.duration_mins || 180),
             is_active: true
           }]).select().single();
           if (examErr) throw examErr;

           // 2. Parse Questions (Right-to-Left parsing for math safety)
           const lines = csvText.trim().split('\n').filter(l => l.trim());
           const dataLines = lines[0].trim().toLowerCase().startsWith('q') || isNaN(lines[0].trim().split(',')[0]) ? lines.slice(1) : lines;
           
           const rows = [];
           dataLines.forEach((line, idx) => {
              const allParts = line.split(',').map(p => p.trim());
              if (allParts.length < 6) return;
              const answer = allParts.pop();
              const d = allParts.pop(); const c = allParts.pop(); const b = allParts.pop(); const a = allParts.pop();
              let qT = allParts.join(', ');
              let qN = idx + 1;
              const firstComma = qT.indexOf(',');
              if (firstComma !== -1 && !isNaN(qT.substring(0, firstComma).trim())) {
                 qN = parseInt(qT.substring(0, firstComma).trim());
                 qT = qT.substring(firstComma + 1).trim();
              }
              const cleanAns = answer ? answer.toUpperCase().replace(/[^ABCD]/g, '').trim() : '';
              if (cleanAns.length === 1) {
                 rows.push({ exam_id: examData.id, question_number: qN, question_text: qT, option_a: a, option_b: b, option_c: c, option_d: d, correct_answer: cleanAns });
              }
           });

           if (rows.length === 0) throw new Error("No valid questions found in CSV!");
           const { error: qErr } = await supabase.from('exam_questions').insert(rows);
           if (qErr) throw qErr;

           setMsg({ text: `🚀 Exam "${finalData.title}" created with ${rows.length} questions!`, type: 'success' });
           handleClear();
           setLoading(false);
           return;
        }

        // Standard Logic for other modules or editing
        if (module === 'materials') {
           // Remove fields that do not exist in the study_materials table
           ['url', 'content_url', 'name', 'topic', 'video_url', 'duration_mins', 'duration'].forEach(key => delete finalData[key]);

           if (mode === 'add' && !uploadFile && !editingId) {
             throw new Error("Please select a PDF file to upload.");
           }

           if (uploadFile) {
             setMsg({ text: 'Uploading PDF to server...', type: 'info' });
             const fileExt = uploadFile.name.split('.').pop();
             const fileName = `material_${Date.now()}.${fileExt}`;
             
             const { error: uploadError } = await supabase.storage
               .from('study_materials_pdfs')
               .upload(fileName, uploadFile, { cacheControl: '3600', upsert: false });

             if (uploadError) {
                 console.error("Supabase Storage Upload Error:", uploadError);
                 throw new Error("Upload failed: " + uploadError.message);
             }

             const { data: publicUrlData } = supabase.storage
               .from('study_materials_pdfs')
               .getPublicUrl(fileName);

             finalData.file_url = publicUrlData.publicUrl;
             finalData.size = (uploadFile.size / (1024 * 1024)).toFixed(1) + ' MB';
           }
        }

        if(editingId) {
          const { error } = await supabase.from(table).update(finalData).eq('id', editingId);
          if(error) throw error;
        } else {
          const { error } = await supabase.from(table).insert([finalData]);
          if(error) throw error;
        }
        setMsg({text: `Saved to ${module} successfully!`, type: 'success'}); 
        handleClear();
     } catch (err) {
       setMsg({text: err.message, type: 'error'});
     }
     setLoading(false);
  };

  const handleDelete = async (id) => {
     if(!window.confirm('Are you sure?')) return;
     await supabase.from(getTableName()).delete().eq('id', id);
     fetchData(); setMsg({text: 'Deleted successfully', type:'success'});
  };

  const handleEdit = (item) => {
     setEditingId(item.id);
     setMode('add');
     setFormData(item);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-24" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 bg-danger-light bg-opacity-30 p-4 rounded-lg border border-danger">
         <ShieldAlert className="text-danger flex-shrink-0" size={32} />
         <div>
            <h1 className="h3 font-bold text-danger">Unified Master Admin System</h1>
            <p className="text-xs text-danger font-semibold mt-1">Full control over all app modules. Live Sync enabled.</p>
         </div>
      </div>

      {/* Module Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 bg-bg-card p-2 rounded-xl border border-color shadow-sm">
         {[
           { id: 'materials', label: 'Materials', icon: Library, color: 'primary' },
           { id: 'test', label: 'Tests', icon: FileText, color: 'primary' },
           { id: 'practice', label: 'Practice', icon: PenLine, color: 'primary' },
           { id: 'revision', label: 'Revision', icon: Zap, color: 'primary' },
           { id: 'plan', label: 'Study Plan', icon: Calendar, color: 'primary' },
           { id: 'pdf_exam', label: 'Live MCQ Tests', icon: Book, color: 'danger' }
         ].map(m => (
           <Button key={m.id} onClick={() => {setModule(m.id); handleClear()}} variant={module === m.id ? (m.color === 'danger' ? 'danger' : 'primary') : 'ghost'} size="sm">
             <m.icon size={16} className="mr-2"/> {m.label}
           </Button>
         ))}
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex gap-4 mb-6 border-b border-color pl-2">
         <div onClick={() => setMode('add')} className={`pb-3 font-semibold cursor-pointer transition ${mode === 'add' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-primary'}`}>
            {editingId ? 'Editing Record' : module === 'pdf_exam' ? 'Create & Import MCQ Test' : `Add New ${module}`}
         </div>
         <div onClick={() => setMode('manage')} className={`pb-3 font-semibold cursor-pointer transition ${mode === 'manage' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-primary'}`}>
            Manage Live Database
         </div>
      </div>

      {msg.text && (
         <div className={`p-4 rounded-lg font-bold mb-6 text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-emerald-700 border border-emerald-300'}`}>
            {msg.text}
         </div>
      )}

      {/* ADD / CREATE MODE */}
      {mode === 'add' && (
         <form onSubmit={handleSave} className="flex flex-col gap-4">
            <datalist id="subject-options">
               <option value="AP EAMCET PYQs" />
               <option value="TS EAMCET PYQs" />
               <option value="Maths" />
               <option value="Physics" />
               <option value="Chemistry" />
            </datalist>
            {module === 'pdf_exam' && !editingId ? (
              <div className="md:col-span-2 space-y-4">
                 <div className="bg-primary-light p-4 rounded-xl border border-primary border-opacity-20 mb-2">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-1"><ClipboardList size={18}/> Step 1: Basic Info</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                       <Input label="Test Title" placeholder="e.g. Physics Grand Test 1" value={formData.title || ''} onChange={(e)=>setFormData({...formData, title: e.target.value})} />
                       <Input label="Duration (Mins)" placeholder="180" type="number" value={formData.duration_mins || ''} onChange={(e)=>setFormData({...formData, duration_mins: e.target.value})} />
                    </div>
                 </div>
                 <div className="bg-bg-main p-4 rounded-xl border border-color">
                    <h4 className="font-bold text-text-main flex items-center gap-2 mb-1"><UploadCloud size={18}/> Step 2: Paste MCQ Questions (CSV)</h4>
                    <p className="text-[10px] text-muted mb-3 font-semibold uppercase">Format: Question Text, Option A, Option B, Option C, Option D, Answer</p>
                    <textarea rows={10} value={csvText} onChange={e => setCsvText(e.target.value)} placeholder={`1, What is Newton's First Law?, Inertia, Gravity, Motion, Force, A\n2, Next Question...`} 
                    className="w-full bg-bg-card border border-color rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary" />
                 </div>
              </div>
            ) : module === 'materials' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" placeholder="Enter title" value={formData.title || ''} onChange={(e)=>setFormData({...formData, title: e.target.value})} required/>
                <Input label="Subject Tag" placeholder="e.g. AP EAMCET PYQs" value={formData.subject || ''} onChange={(e)=>setFormData({...formData, subject: e.target.value})} list="subject-options" required/>
                <Input label="Type (Notes/Formulas/PYQ)" placeholder="Notes" value={formData.type || ''} onChange={(e)=>setFormData({...formData, type: e.target.value})} required/>
                
                <div className="flex flex-col gap-2 relative">
                   <label className="text-sm font-bold text-main" style={{ color: 'var(--text-main)' }}>Upload PDF File</label>
                   <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="w-full bg-bg-card border border-color rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      style={{ 
                          backgroundColor: 'var(--bg-card)', 
                          border: '1px solid var(--border-color)', 
                          color: 'var(--text-main)',
                      }}
                   />
                   {uploadFile && <span className="text-xs text-success absolute -bottom-5 left-0 font-semibold">{uploadFile.name} ({(uploadFile.size/(1024*1024)).toFixed(2)} MB)</span>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" placeholder="Enter title" value={formData.title || formData.name || formData.topic || ''} onChange={(e)=>setFormData({...formData, title: e.target.value, name: e.target.value, topic: e.target.value})} />
                {module === 'video' && <Input label="Video URL" placeholder="YouTube Link" value={formData.video_url || formData.url || ''} onChange={(e)=>setFormData({...formData, url: e.target.value})} />}
                {(module === 'test' || module === 'pdf_exam') && <Input label="Duration (Mins)" type="number" value={formData.duration_mins || ''} onChange={(e)=>setFormData({...formData, duration_mins: e.target.value})} />}
                <Input label="Subject Tag" placeholder="e.g. AP EAMCET PYQs" value={formData.subject || ''} onChange={(e)=>setFormData({...formData, subject: e.target.value})} list="subject-options" />
                <Input label="External URL / File Link" placeholder="https://..." value={formData.file_url || formData.url || formData.content_url || ''} onChange={(e)=>setFormData({...formData, file_url: e.target.value, url: e.target.value, content_url: e.target.value})} />
              </div>
            )}
            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
               {loading ? 'Processing...' : module === 'pdf_exam' && !editingId ? 'Launch Live MCQ Test' : 'Save to Database'}
            </Button>
         </form>
      )}

      {/* MANAGE MODE */}
      {mode === 'manage' && (
         <Card className="shadow-md">
            <h3 className="font-bold mb-4 flex items-center justify-between">Total Records <Badge variant="primary">{dataList.length}</Badge></h3>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
               {dataList.length === 0 ? <p className="text-muted text-sm text-center py-12">No data found in this module.</p> : dataList.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-bg-main p-4 rounded-xl border border-color gap-3 hover:border-primary transition">
                     <div className="flex-1 overflow-hidden w-full">
                        <div className="font-bold text-sm truncate">{item.title || item.name || item.topic}</div>
                        <div className="text-[10px] text-muted flex gap-3 mt-1 font-semibold uppercase">
                           {item.subject && <span>{item.subject}</span>}
                           {(item.duration || item.duration_mins) && <span>{item.duration || `${item.duration_mins} mins`}</span>}
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        {module === 'pdf_exam' && <Button onClick={() => navigate(`/exam/${item.id}`)} variant="outline" size="sm" className="text-success border-success">Play</Button>}
                        <Button onClick={()=>handleEdit(item)} variant="outline" size="sm">Edit</Button>
                        <Button onClick={()=>handleDelete(item.id)} variant="danger" size="sm">Delete</Button>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      )}
    </div>
  );
}
