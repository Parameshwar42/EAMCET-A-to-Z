import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { PlayCircle, Clock, Search, BookOpen } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function VideoLessons() {
  const [activeSubject, setActiveSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function fetchVideos() {
        setLoading(true);
        const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (!error && data) setVideos(data);
        setLoading(false);
     }
     fetchVideos();
  }, []);

  const subjects = ['All', 'Maths', 'Physics', 'Chemistry', 'Botany', 'Zoology']; 
  const featuredVideo = videos.length > 0 ? videos[0] : null;

  const filteredVideos = videos.filter(video => {
    const matchesSubject = activeSubject === 'All' || video.subject === activeSubject;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleSubjectClick = (subject) => {
    setActiveSubject(subject);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in pb-20 lg:pb-0" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2">Shortcut Video Lessons</h1>
      <p className="subtitle mb-6">Learn the fastest ways to solve EAMCET problems.</p>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1" style={{ flexGrow: 1, marginBottom: '-1rem' }}>
          <Input 
             placeholder="Search videos..."
             icon={<Search size={18} />}
             value={searchTerm}
             onChange={handleSearchChange}
             fullWidth
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
          {subjects.map(subject => (
            <Button
              key={subject}
              variant={activeSubject === subject ? 'primary' : 'outline'}
              onClick={() => handleSubjectClick(subject)}
              size="sm"
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-muted font-semibold">Loading live videos from Database...</div>
      ) : featuredVideo && activeSubject === 'All' && !searchTerm ? (
         <Card 
            padding="" 
            className="mb-8 shadow-md" 
            style={{ overflow: 'hidden', padding: 0 }}
            clickable
            onClick={() => window.open(featuredVideo.url, '_blank')}
         >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '500px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <img 
                  src={featuredVideo.thumbnail} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
                  alt="Featured" 
               />
               <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }}></div>
               <PlayCircle size={64} style={{ color: 'white', position: 'relative', zIndex: 10, opacity: 0.9 }} />
               <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                  <Badge variant="primary" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Newest Addition</Badge>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{featuredVideo.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 'bold' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={14}/> {featuredVideo.subject}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {featuredVideo.duration}</span>
                  </div>
               </div>
            </div>
         </Card>
      ) : null}

      {!loading && filteredVideos.length === 0 && (
         <div className="text-center p-8 text-muted font-semibold">No videos found. Ask Admin to upload some!</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
           <Card 
              key={video.id} 
              padding="" 
              clickable 
              onClick={() => window.open(video.url, '_blank')}
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
           >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                 <img 
                    src={video.thumbnail} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt={video.title} 
                 />
                 <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {video.duration}
                 </div>
              </div>
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <div style={{ marginBottom: '0.5rem' }}>
                    <Badge variant="outline" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{video.subject}</Badge>
                 </div>
                 <h3 style={{ fontWeight: 'bold', flex: 1, fontSize: '1rem', lineHeight: '1.4' }}>{video.title}</h3>
                 
                 <Button variant="ghost" className="mt-4" fullWidth style={{ marginTop: '1rem', border: '1px solid var(--border-color)' }}>
                   <PlayCircle size={16} className="mr-2" style={{ marginRight: '0.5rem' }}/> Watch Lesson
                 </Button>
              </div>
           </Card>
        ))}
      </div>
    </div>
  );
}
