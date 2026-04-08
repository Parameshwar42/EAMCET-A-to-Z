import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { Settings, LogOut, Bell, Shield, Book, CreditCard, ChevronRight, User, Award, ExternalLink, Mail, Edit3 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: "Learning Journey",
      items: [
        { icon: <Book size={18} />, label: "Target Examination", value: "AP & TS EAMCET 2026", color: "text-primary" },
        { icon: <Award size={18} />, label: "Current Subscription", value: "Pro Access Active", color: "text-warning" },
      ]
    },
    {
      title: "System Settings",
      items: [
        { icon: <Bell size={18} />, label: "Push Notifications", value: "On" },
        { icon: <Shield size={18} />, label: "Privacy & Data" },
        { icon: <Settings size={18} />, label: "App Preferences" },
      ]
    },
    {
      title: "Account Actions",
      items: [
        { icon: <LogOut size={18} />, label: "Sign Out of Account", action: handleLogout, isDanger: true },
      ]
    }
  ];

  const profileName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "Aspirant";

  return (
    <div className="animate-fade-in relative pb-24 min-h-screen bg-bg-main" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Ambient Profile Header */}
      <div className="relative h-48 w-full bg-primary overflow-hidden lg:rounded-b-[40px] mb-20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-indigo-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center">
          <div className="relative">
             <div className="w-32 h-32 rounded-[36px] bg-white p-1.5 shadow-2xl overflow-hidden border-4 border-white">
                {loading ? <Skeleton width="100%" height="100%" borderRadius="28px" /> : (
                  <img 
                    src={currentUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${profileName}&background=4338ca&color=fff&size=200`} 
                    className="w-full h-full object-cover rounded-[28px]" 
                    alt="User" 
                  />
                )}
             </div>
             <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg border border-color flex items-center justify-center text-primary hover:scale-110 transition">
                <Edit3 size={18} />
             </button>
          </div>
          
          <div className="mt-4 text-center">
             <h2 className="text-2xl font-black text-main tracking-tight">
               {loading ? <Skeleton width="150px" height="1.5rem" /> : profileName}
             </h2>
             <div className="flex items-center gap-2 text-muted font-bold text-xs uppercase tracking-widest mt-1">
                <Mail size={12} /> {currentUser?.email}
             </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-6">
        {/* Pro Status Card */}
        <Card className="!rounded-[24px] border-0 bg-gradient-to-r from-warning-light to-white p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-warning shadow-sm">
                 <Zap size={24} className="fill-current" />
              </div>
              <div>
                 <h3 className="font-black text-main text-sm uppercase tracking-tight">Active Plan</h3>
                 <p className="text-xs font-bold text-muted">EAMCET 2026 PRO Membership</p>
              </div>
           </div>
           <Badge variant="warning" className="border-0 bg-white px-4 py-2 text-[10px] font-black tracking-widest uppercase shadow-sm">VALID</Badge>
        </Card>

        {/* Menu Groups */}
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
             <h4 className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">{group.title}</h4>
             <Card padding="p-0 overflow-hidden" className="!rounded-[24px] border-color shadow-sm bg-white">
                <div className="flex flex-col divide-y divide-color divide-opacity-50">
                   {group.items.map((item, i) => (
                     <div 
                        key={i} 
                        onClick={item.action || (() => {})}
                        className="flex justify-between items-center p-5 cursor-pointer hover:bg-bg-main transition group active:scale-[0.98]"
                      >
                       <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-bg-main group-hover:bg-white transition ${item.isDanger ? 'text-danger' : item.color || 'text-primary'}`}>
                           {item.icon}
                         </div>
                         <div className="flex flex-col">
                            <span className={`text-sm font-black tracking-tight ${item.isDanger ? 'text-danger' : 'text-main'}`}>{item.label}</span>
                            {item.value && <span className="text-[10px] font-bold text-muted mt-0.5">{item.value}</span>}
                         </div>
                       </div>
                       <ChevronRight size={16} className="text-muted group-hover:text-primary transition group-hover:translate-x-1" />
                     </div>
                   ))}
                </div>
             </Card>
          </div>
        ))}

        <div className="text-center py-6">
           <p className="text-[10px] font-bold text-muted opacity-50 uppercase tracking-widest">EAMCET A-to-Z • Version 2.0.4-beta</p>
        </div>
      </div>
    </div>
  );
}

const Zap = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

