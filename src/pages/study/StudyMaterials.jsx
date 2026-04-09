import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { BookOpen, Download, FileText, Search, Library, Filter, Lock } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/ui/PaymentModal';

export default function StudyMaterials() {
  const [activeTab, setActiveTab] = useState('All');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchMaterials();
    if (currentUser) {
      checkPremiumStatus();
    }
  }, [currentUser]);

  const checkPremiumStatus = async () => {
    try {
      const { data } = await supabase.from('user_progress').select('is_premium').eq('user_id', currentUser.id).single();
      if(data?.is_premium) setIsPremiumUser(true);
    } catch (e) { console.log(e); }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMaterials(data);
    setTimeout(() => setLoading(false), 800); // Small delay for smooth transition
  };

  const dynamicTabs = [...new Set(materials.map(m => m.subject))];
  const tabs = ['All', ...dynamicTabs];

  const filteredMaterials = materials.filter(m => {
    const matchesTab = activeTab === 'All' || m.subject === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 animate-fade-in relative pb-24" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Sticky Header Section */}
      <div className="sticky top-[-1px] z-30 bg-bg-main bg-opacity-80 backdrop-blur-md pt-2 pb-4 mb-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="h3 font-black text-main flex items-center gap-2">
                <Library className="text-primary" size={24} strokeWidth={3} /> PDF Library
              </h1>
              <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1">EAMCET 2026 Resources</p>
            </div>
            {isPremiumUser && (
              <Badge variant="success" className="bg-success-light text-success border-success border-opacity-20 animate-pulse">
                PRO ACTIVE
              </Badge>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search PYQs & Notes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:ring-opacity-20 bg-white border border-color shadow-sm"
              />
            </div>
            <Button variant="outline" className="h-[46px] w-[46px] p-0 flex items-center justify-center rounded-xl bg-white">
              <Filter size={18}/>
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-lg shadow-primary-light' 
                    : 'bg-white text-muted hover:text-primary border border-color shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="flex flex-col gap-3 p-4">
               <div className="flex items-center gap-3">
                 <Skeleton width="44px" height="44px" borderRadius="14px" />
                 <div className="flex-1">
                   <Skeleton width="60%" height="0.7rem" />
                   <Skeleton width="85%" height="1rem" style={{marginTop:'6px'}} />
                 </div>
               </div>
               <div className="flex gap-2">
                 <Skeleton width="60px" height="26px" borderRadius="99px" />
                 <Skeleton width="80px" height="26px" borderRadius="99px" />
               </div>
               <Skeleton width="100%" height="40px" borderRadius="12px" />
            </Card>
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-color">
           <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 border border-color">
             <FileText size={40} className="text-muted opacity-30" />
           </div>
           <p className="font-black text-main text-lg">No Results Found</p>
           <p className="text-sm text-muted px-8 mt-1">Try adjusting your filters or search term to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredMaterials.map(item => {
            const isLocked = item.is_premium && !isPremiumUser;
            return (
              <Card key={item.id} className="group relative flex flex-col bg-white border-color hover:border-primary hover:shadow-lg transition-all overflow-hidden" style={{padding:'1rem'}}>

                {/* Top row: icon + info */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isLocked ? 'var(--warning-light)' : 'var(--primary-light)',
                      color: isLocked ? 'var(--warning-dark)' : 'var(--primary)'
                    }}
                  >
                    <BookOpen size={20} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Badge variant={
                      item.subject.toLowerCase().includes('math') ? 'primary' :
                      item.subject.toLowerCase().includes('physic') ? 'warning' :
                      item.subject.toLowerCase().includes('chemist') ? 'success' : 'danger'
                    } className="mb-1.5 !text-[9px] uppercase tracking-tighter">
                      {item.subject}
                    </Badge>
                    <h3 className="font-bold text-main text-[13px] leading-snug line-clamp-2">{item.title}</h3>
                  </div>

                  {item.is_premium && (
                    <Lock size={13} className={`flex-shrink-0 mt-0.5 ${isLocked ? 'text-warning' : 'text-success'}`} />
                  )}
                </div>

                {/* Metadata pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-muted bg-bg-main px-2.5 py-1.5 rounded-full">
                      <FileText size={10} /> {item.type || 'PDF'}
                   </div>
                   {item.size && (
                     <div className="flex items-center gap-1 text-[10px] font-bold text-muted bg-bg-main px-2.5 py-1.5 rounded-full">
                        <Download size={10} /> {item.size}
                     </div>
                   )}
                </div>

                {/* Action button */}
                <Button
                   fullWidth
                   variant={isLocked ? "warning" : "primary"}
                   className={`mt-auto h-10 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 ${isLocked ? 'shadow-sm' : 'shadow-sm shadow-primary-light'}`}
                   onClick={() => isLocked ? setShowPaymentModal(true) : window.open(item.file_url || item.url, '_blank')}
                >
                  {isLocked ? (
                    <><Lock size={14} /> Unlock Material</>
                  ) : (
                    <><Download size={14} /> Download File</>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {showPaymentModal && currentUser && (
         <PaymentModal 
           isOpen={showPaymentModal}
           onClose={() => setShowPaymentModal(false)}
           amount={99}
           currentUser={currentUser}
           onSuccess={() => setIsPremiumUser(true)}
         />
      )}
    </div>
  );
}

