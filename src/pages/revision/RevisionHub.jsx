import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FileText, Download, Search, Zap } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function RevisionHub() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      const { data } = await supabase.from('revision_notes').select('*').order('created_at', { ascending: false });
      if (data) setNotes(data);
      setLoading(false);
    }
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="h2 font-bold flex items-center gap-2"><Zap className="text-primary"/> Fast Revision Hub</h1>
          <p className="subtitle">Last-minute formulas and summary cards.</p>
        </div>
      </div>

      <div className="mb-8 max-w-md">
        <Input 
          placeholder="Search topics, formulas..." 
          icon={<Search size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="col-span-3 text-center p-8 text-muted font-semibold">Loading revision fast cards...</div> :
         filteredNotes.length === 0 ? <div className="col-span-3 text-center p-8 text-muted">No revision notes found matching your search.</div> :
         filteredNotes.map(item => (
          <Card key={item.id} className="flex flex-col group cursor-pointer hover:shadow-md transition">
             <div className="flex justify-between items-start mb-4">
               <Badge variant={item.subject === 'Maths' ? 'primary' : item.subject === 'Physics' ? 'warning' : 'success'}>
                 {item.subject}
               </Badge>
               <div className="text-primary opacity-0 group-hover:opacity-100 transition"><Download size={18}/></div>
             </div>
             
             <div className="flex items-center gap-3 mb-2 text-primary">
                <FileText size={24} />
                <h3 className="font-bold text-lg">{item.title}</h3>
             </div>
             <p className="text-sm text-muted mb-6">{item.type} • 5 mins read</p>
             
             <Button variant="outline" fullWidth className="mt-auto" onClick={() => item.content_url && window.open(item.content_url, '_blank')}>View Document</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
