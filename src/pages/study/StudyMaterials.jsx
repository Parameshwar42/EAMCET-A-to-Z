import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { BookOpen, Download, FileText, Search, Library, Filter } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function StudyMaterials() {
  const [activeTab, setActiveTab] = useState('All');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback for icons if needed
  const iconMap = {
    BookOpen: BookOpen,
    FileText: FileText,
    Library: Library
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMaterials(data);
    setLoading(false);
  };

  // Dynamically get unique tabs from the fetched data
  const dynamicTabs = [...new Set(materials.map(m => m.subject))];
  const tabs = ['All', ...dynamicTabs];

  const filteredMaterials = activeTab === 'All' 
    ? materials 
    : materials.filter(m => m.subject === activeTab);

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="h2 font-bold text-main flex items-center gap-2">
            <Library className="text-primary" /> Study Materials
          </h1>
          <p className="text-muted mt-1">Download PDF notes, cheat sheets, and important formulas.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
              style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2"><Filter size={18}/> Filter</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-12 text-muted">
           <FileText size={48} className="mx-auto text-border-color mb-4 opacity-50" />
           <p className="font-semibold text-main mb-1">No Study Materials yet.</p>
           <p className="text-sm">As an admin, you can add them from the Admin Dashboard.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-white' 
                    : 'bg-transparent text-muted hover:bg-main'
                }`}
                style={activeTab !== tab ? { border: '1px solid var(--border-color)' } : { border: '1px solid var(--primary)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(item => {
              const IconComponent = iconMap[item.icon] || FileText;
              const color = item.color || 'var(--primary)';
              
              return (
                <Card key={item.id} className="flex flex-col hover:-translate-y-1 transition-transform border border-transparent hover:border-primary" style={{ border: '1px solid var(--border-color)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${color}20`, color: color }}
                    >
                      <IconComponent size={24} />
                    </div>
                    <Badge variant={
                      item.subject.toLowerCase().includes('math') ? 'primary' :
                      item.subject.toLowerCase().includes('physic') ? 'warning' :
                      item.subject.toLowerCase().includes('chemist') ? 'success' : 'danger'
                    }>
                      {item.subject}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-main">{item.title}</h3>
                  
                  <div className="flex items-center gap-4 text-xs text-muted mb-6">
                    <span className="flex items-center gap-1"><FileText size={14}/> {item.type}</span>
                    {item.size && <span className="flex items-center gap-1"><Download size={14}/> {item.size}</span>}
                  </div>
                  
                  <Button 
                     fullWidth 
                     variant="outline" 
                     className="mt-auto group flex items-center justify-center gap-2"
                     onClick={() => window.open(item.file_url || item.url, '_blank')}
                  >
                    <Download size={18} className="group-hover:translate-y-1 transition-transform"/> Download / View PDF
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
