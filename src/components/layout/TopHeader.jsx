import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Hexagon, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-color px-4 py-3 flex items-center justify-between lg:px-8">
      {/* Brand Identity */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-light">
          <Hexagon className="text-white fill-current" size={24} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-black text-main uppercase tracking-tighter">EAMCET</span>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase ml-0.5">2026 Pro</span>
        </div>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-main px-3 py-1.5 rounded-full border border-color cursor-pointer hover:bg-white transition shadow-sm">
           <Zap size={14} className="text-warning fill-warning" />
           <span className="text-[10px] font-black text-main uppercase tracking-widest">Global Ranking</span>
        </div>
        
        <button 
          onClick={() => navigate('/notifications')} 
          className="w-10 h-10 rounded-xl bg-bg-main border border-color flex items-center justify-center text-muted hover:text-primary hover:border-primary transition relative group"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white group-hover:scale-125 transition"></span>
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary-light cursor-pointer hover:border-primary transition shadow-sm"
        >
          <img 
            src={currentUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${currentUser?.email}&background=4338ca&color=fff`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
