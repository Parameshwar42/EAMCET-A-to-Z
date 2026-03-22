import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { ShieldAlert, Video, FileText, PenLine, Zap, Calendar, UploadCloud, Edit3, Trash2, Book } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function AdminDashboard() {
  const [module, setModule] = useState('video'); // video, test, practice, revision, plan, pdf_exam
  const [mode, setMode] = useState('add'); // add, manage
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({ pdfFile: null, solutionFile: null });

  useEffect(() => {
    if (mode === 'manage') fetchData();
  }, [module, mode]);

  const fetchData = async () => {
     let table = '';
     if(module==='video') table='videos';
     if(module==='test') table='mock_tests';
     if(module==='practice') table='practice_chapters';
     if(module==='revision') table='revision_notes';
     if(module==='plan') table='study_plan_tasks';
     if(module==='pdf_exam') table='pdf_exams';

     const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
     if(data) setDataList(data);
  };

  const handleInputChange = (field, value) => {
     setFormData(prev => ({...prev, [field]: value}));
  };

  const handleClear = () => { 
     setFormData({}); setFileData({ pdfFile: null, solutionFile: null }); setEditingId(null); setMsg({text:'', type:''}); 
     if(mode === 'manage') setMode('add');
  };

  const handleSave = async (e) => {
     e.preventDefault(); setLoading(true); setMsg({text:'', type:''});
     let table = '';
     let payload = {};
     let error = null;

     try {
       if(module==='video') { 
          table='videos'; 
          let thumb = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400';
          const videoIdMatch = (formData.url||'').match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          if(videoIdMatch && videoIdMatch[1]) thumb = `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
          payload = { title: formData.title, url: formData.url, subject: formData.subject||'Physics', duration: formData.duration||'10 mins', thumbnail: thumb }; 
       }
       if(module==='test') { 
          table='mock_tests'; 
          payload = { title: formData.title, duration: `${formData.duration} mins`, questions_count: parseInt(formData.questions, 10), is_active: formData.is_active !== "false" }; 
       }
       if(module==='practice') { 
          table='practice_chapters'; 
          payload = { name: formData.title, subject: formData.subject||'Physics', questions_count: parseInt(formData.questions||0, 10), mastery: parseInt(formData.mastery||0, 10), is_premium: formData.is_premium==="true" }; 
       }
       if(module==='revision') { 
          table='revision_notes'; 
          payload = { title: formData.title, subject: formData.subject||'Physics', type: formData.type||'Formula Sheet', content_url: formData.url || '' }; 
       }
       if(module==='plan') { 
          table='study_plan_tasks'; 
          payload = { topic: formData.title, subject: formData.subject||'Physics', duration: formData.duration||'1 hr', type: formData.type||'Learning', status: formData.status||'pending' }; 
       }
       if(module==='pdf_exam') {
          table='pdf_exams';
          let pdf_url = formData.pdf_url || '';
          let solution_url = formData.solution_url || '';

          // File processing logic
          if (fileData.pdfFile) {
            const fileName = `question_papers/${Date.now()}_${fileData.pdfFile.name.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('test-pdfs').upload(fileName, fileData.pdfFile);
            if(uploadError) throw uploadError;
            const { data: publicData } = supabase.storage.from('test-pdfs').getPublicUrl(fileName);
            pdf_url = publicData.publicUrl;
          }

          if (fileData.solutionFile) {
            const fileName = `solutions/${Date.now()}_${fileData.solutionFile.name.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('test-pdfs').upload(fileName, fileData.solutionFile);
            if(uploadError) throw uploadError;
            const { data: publicData } = supabase.storage.from('test-pdfs').getPublicUrl(fileName);
            solution_url = publicData.publicUrl;
          }

          if(!pdf_url && !editingId) {
             throw new Error("You must attach a Question Paper PDF!");
          }

          payload = {
             title: formData.title,
             duration_mins: parseInt(formData.duration || 180, 10),
             questions_count: parseInt(formData.questions || 160, 10),
             pdf_url: pdf_url,
             solution_url: solution_url,
             answer_key: formData.answer_key || '',
             is_active: formData.is_active !== 'false'
          };
       }

       if(editingId) {
          const res = await supabase.from(table).update(payload).eq('id', editingId);
          error = res.error;
       } else {
          const res = await supabase.from(table).insert([payload]);
          error = res.error;
       }
     } catch (err) {
       error = err;
     }

     setLoading(false);
     if(error) setMsg({text: error.message, type: 'error'});
     else { 
        setMsg({text: `Saved ${module} module successfully!`, type: 'success'}); 
        setEditingId(null); setFormData({}); setFileData({ pdfFile: null, solutionFile: null });
        if(mode==='manage') fetchData(); 
     }
  }

  const handleDelete = async (id) => {
     if(!window.confirm('Are you sure you want to completely delete this?')) return;
     const tables = { 'video': 'videos', 'test': 'mock_tests', 'practice': 'practice_chapters', 'revision': 'revision_notes', 'plan': 'study_plan_tasks', 'pdf_exam': 'pdf_exams' };
     await supabase.from(tables[module]).delete().eq('id', id);
     fetchData(); setMsg({text: 'Deleted successfully', type:'success'});
  }

  const handleEdit = (item) => {
     setEditingId(item.id);
     setFileData({ pdfFile: null, solutionFile: null });
     setMode('add');
     if(module==='video') setFormData({title: item.title, url: item.url, subject: item.subject, duration: item.duration});
     if(module==='test') setFormData({title: item.title, duration: parseInt(item.duration), questions: item.questions_count, is_active: item.is_active ? "true" : "false"});
     if(module==='practice') setFormData({title: item.name, subject: item.subject, questions: item.questions_count, mastery: item.mastery, is_premium: item.is_premium ? "true" : "false"});
     if(module==='revision') setFormData({title: item.title, subject: item.subject, type: item.type, url: item.content_url});
     if(module==='plan') setFormData({title: item.topic, subject: item.subject, duration: item.duration, type: item.type, status: item.status});
     if(module==='pdf_exam') setFormData({title: item.title, duration: item.duration_mins, questions: item.questions_count, pdf_url: item.pdf_url, solution_url: item.solution_url, answer_key: item.answer_key, is_active: item.is_active ? "true" : "false"});
  }

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-24" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 bg-danger-light bg-opacity-30 p-4 rounded-lg border border-danger">
         <ShieldAlert className="text-danger flex-shrink-0" size={32} />
         <div>
            <h1 className="h3 font-bold text-danger">Unified Master Admin System</h1>
            <p className="text-xs text-danger font-semibold mt-1">Full control over Videos, Tests, Practice, Revision, Study Plan, and Real-time PDF Exams. Live Sync enabled.</p>
         </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 bg-bg-card p-2 rounded-xl border border-color shadow-sm">
         <Button onClick={() => {setModule('video'); handleClear()}} variant={module === 'video' ? 'primary' : 'ghost'} size="sm"><Video size={16} className="mr-2"/> Videos</Button>
         <Button onClick={() => {setModule('test'); handleClear()}} variant={module === 'test' ? 'primary' : 'ghost'} size="sm"><FileText size={16} className="mr-2"/> Tests</Button>
         <Button onClick={() => {setModule('practice'); handleClear()}} variant={module === 'practice' ? 'primary' : 'ghost'} size="sm"><PenLine size={16} className="mr-2"/> Practice</Button>
         <Button onClick={() => {setModule('revision'); handleClear()}} variant={module === 'revision' ? 'primary' : 'ghost'} size="sm"><Zap size={16} className="mr-2"/> Revision</Button>
         <Button onClick={() => {setModule('plan'); handleClear()}} variant={module === 'plan' ? 'primary' : 'ghost'} size="sm"><Calendar size={16} className="mr-2"/> Study Plan</Button>
         <Button onClick={() => {setModule('pdf_exam'); handleClear()}} variant={module === 'pdf_exam' ? 'danger' : 'ghost'} size="sm"><Book size={16} className="mr-2"/> Live PDF Exams</Button>
      </div>

      {/* Secondary Mode Navigation */}
      <div className="flex gap-4 mb-6 border-b border-color pl-2">
         <div onClick={() => setMode('add')} className={`pb-3 font-semibold cursor-pointer transition ${mode === 'add' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-primary'}`}>
            {editingId ? 'Editing Live Record' : `Add New ${module}`}
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

      {/* ADD / EDIT MODE */}
      {mode === 'add' && (
         <Card className="max-w-xl shadow-md border-opacity-50">
            {editingId && (
               <div className="flex justify-between items-center mb-6 bg-warning-light p-3 rounded-lg border border-warning border-opacity-50">
                 <Badge variant="warning">Updating ID: {editingId.slice(0,8)}...</Badge>
                 <Button size="sm" variant="ghost" className="text-danger opacity-80 hover:opacity-100" onClick={handleClear}>Cancel Edit</Button>
               </div>
            )}
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
               {/* Universal Title Field */}
               <Input label={(module === 'plan' ? 'Topic / Task Title' : module === 'practice' ? 'Chapter Name' : module==='pdf_exam' ? 'Exam Title' : 'Title')} placeholder="e.g. Current Electricity" required value={formData.title || ''} onChange={e=>handleInputChange('title', e.target.value)} />
               
               {/* Subject Dropdown applies to everything except tests and pdf_exams */}
               {(module !== 'test' && module !== 'pdf_exam') && (
                  <div className="flex flex-col gap-2 relative">
                     <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Subject</label>
                     <select value={formData.subject || 'Physics'} onChange={e=>handleInputChange('subject', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition font-semibold appearance-none">
                        <option>Physics</option> <option>Chemistry</option> <option>Maths</option> <option>Botany</option> <option>Zoology</option>
                     </select>
                  </div>
               )}

               {/* Module specific fields */}
               {(module === 'video' || module === 'revision') && (
                  <Input label={module==='video' ? "YouTube URL" : "PDF / Content URL"} type="url" placeholder="https://..." value={formData.url || ''} onChange={e=>handleInputChange('url', e.target.value)} />
               )}

               {(module === 'video' || module === 'test' || module === 'plan' || module === 'pdf_exam') && (
                  <Input label={module==='test' || module==='pdf_exam' ? "Total Duration (Mins)" : "Duration / Est. Time"} type={module==='test' || module==='pdf_exam' ? 'number' : 'text'} placeholder={module==='test' || module==='pdf_exam' ? "180" : "e.g. 15 mins"} required={module==='test' || module==='pdf_exam'} value={formData.duration || ''} onChange={e=>handleInputChange('duration', e.target.value)} />
               )}

               {(module === 'test' || module === 'practice' || module === 'pdf_exam') && (
                  <Input label="Questions Count" type="number" placeholder="160" required={module==='test' || module==='pdf_exam'} value={formData.questions || ''} onChange={e=>handleInputChange('questions', e.target.value)} />
               )}

               {/* REAL-TIME PDF EXAM FIELDS */}
               {module === 'pdf_exam' && (
                  <div className="bg-primary-light bg-opacity-30 p-4 rounded-xl border border-primary border-opacity-30 flex flex-col gap-4 mt-2">
                     <h3 className="font-bold text-primary flex items-center gap-2 mb-1"><Book size={18}/> Question Paper Upload</h3>
                     <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Attach Question Paper (PDF)</label>
                        <input type="file" accept="application/pdf" onChange={e => setFileData({...fileData, pdfFile: e.target.files[0]})} className="w-full bg-bg-card border border-color rounded-lg p-2 text-sm" />
                        {editingId && formData.pdf_url && <span className="text-xs text-muted mt-1 px-1 break-all">Current: {formData.pdf_url}</span>}
                     </div>

                     <div className="flex flex-col gap-1 mt-2">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Attach Solutions Paper (PDF) - Optional</label>
                        <input type="file" accept="application/pdf" onChange={e => setFileData({...fileData, solutionFile: e.target.files[0]})} className="w-full bg-bg-card border border-color rounded-lg p-2 text-sm" />
                        {editingId && formData.solution_url && <span className="text-xs text-muted mt-1 px-1 break-all">Current: {formData.solution_url}</span>}
                     </div>

                     <div className="flex flex-col gap-1 mt-4">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Master Answer Key</label>
                        <p className="text-xs text-muted pl-1 mb-1">Enter comma-separated correct options (e.g. A,B,C,D,C,A...). Ensure it exactly matches Questions Count.</p>
                        <textarea 
                           className="w-full bg-bg-card border border-color rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition" 
                           rows={4} 
                           placeholder="A,B,C,D,..." 
                           required 
                           value={formData.answer_key || ''} 
                           onChange={e=>handleInputChange('answer_key', e.target.value)} 
                        />
                     </div>
                  </div>
               )}

               {module === 'revision' && (
                  <div className="flex flex-col gap-2 relative">
                     <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Type</label>
                     <select value={formData.type || 'Formula Sheet'} onChange={e=>handleInputChange('type', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary">
                        <option>Formula Sheet</option> <option>Short Notes</option> <option>Mind Map</option>
                     </select>
                  </div>
               )}

               {module === 'plan' && (
                  <>
                     <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Activity Type</label>
                        <select value={formData.type || 'Learning'} onChange={e=>handleInputChange('type', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary">
                           <option>Learning</option> <option>Practice</option> <option>Mock Test</option> <option>Revision</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Status</label>
                        <select value={formData.status || 'pending'} onChange={e=>handleInputChange('status', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary">
                           <option>pending</option> <option>completed</option>
                        </select>
                     </div>
                  </>
               )}

               {module === 'practice' && (
                  <>
                     <Input label="Initial Mastery (%)" type="number" placeholder="0" value={formData.mastery || ''} onChange={e=>handleInputChange('mastery', e.target.value)} />
                     <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Is Premium Area?</label>
                        <select value={formData.is_premium || 'false'} onChange={e=>handleInputChange('is_premium', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary">
                           <option value="false">Free (Public)</option> <option value="true">Premium (Locked)</option>
                        </select>
                     </div>
                  </>
               )}

               {(module === 'test' || module === 'pdf_exam') && (
                  <div className="flex flex-col gap-2 relative">
                     <label className="text-sm font-semibold text-text-main opacity-90 pl-1">Visibility Status</label>
                     <select value={formData.is_active || 'true'} onChange={e=>handleInputChange('is_active', e.target.value)} className="w-full bg-main border border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary">
                        <option value="true">Live (Students Can Start)</option> <option value="false">Hidden (Draft)</option>
                     </select>
                  </div>
               )}

               <Button type="submit" variant="primary" fullWidth className={`mt-4 ${module === 'test' || module === 'pdf_exam' ? 'bg-indigo-600' : ''}`} disabled={loading}>
                 {loading ? 'Transmitting binary to Supabase...' : (editingId ? `Update ${module} Record` : `Deploy to Live App`)} <UploadCloud size={18} className="ml-2"/>
               </Button>
            </form>
         </Card>
      )}

      {/* MANAGE MODE */}
      {mode === 'manage' && (
         <Card className="shadow-md">
            <h3 className="font-bold mb-4 flex items-center justify-between">Total Live Records <Badge variant="primary">{dataList.length}</Badge></h3>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
               {dataList.length === 0 ? <p className="text-muted text-sm text-center py-12 border-2 border-dashed border-color rounded-lg bg-bg-main bg-opacity-50">Database table is absolutely empty.</p> : dataList.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-bg-main p-4 rounded-xl border border-color gap-3 hover:border-primary hover:shadow-sm transition">
                     <div className="flex-1 overflow-hidden w-full">
                        <div className="font-bold text-sm truncate text-text-main">{item.title || item.name || item.topic}</div>
                        <div className="text-xs text-muted flex items-center flex-wrap gap-2 mt-2">
                           {item.subject && <Badge variant="outline" className="opacity-80">{item.subject}</Badge>}
                           {(item.duration || item.duration_mins) && <span><Clock size={12} className="inline mr-1 opacity-50"/>{item.duration || `${item.duration_mins} mins`}</span>}
                           {item.questions_count !== undefined && <span className="text-primary font-semibold bg-primary-light px-2 py-0.5 rounded-full">{item.questions_count} Qs</span>}
                           {item.type && <span className="border border-color text-text-main px-2 py-0.5 rounded-full bg-white">{item.type}</span>}
                           {item.answer_key && <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-mono font-bold blur-[2px] hover:blur-none transition">KEY LOADED</span>}
                        </div>
                     </div>
                     <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0 justify-end">
                        <Button onClick={()=>handleEdit(item)} variant="outline" size="sm" className="px-3 py-2 border-primary text-primary hover:bg-primary-light"><Edit3 size={14}/></Button>
                        <Button onClick={()=>handleDelete(item.id)} variant="danger" size="sm" className="px-3 py-2 opacity-90 hover:opacity-100"><Trash2 size={14}/></Button>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      )}
    </div>
  );
}
