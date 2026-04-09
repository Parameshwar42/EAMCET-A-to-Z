import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { Settings, LogOut, Bell, Shield, Book, ChevronRight, Award, Mail, Edit3 } from 'lucide-react';

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
        { icon: <Bell size={18} />, label: "Push Notifications", value: "On", color: "text-success" },
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
    <div className="animate-fade-in relative min-h-screen bg-bg-main" style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* ── Blue Banner ─────────────────────────────── */}
      <div className="relative h-36 w-full overflow-hidden lg:rounded-b-[40px]"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 50%, #312e81 100%)' }}>
        {/* Decorative orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-4 left-1/2 w-20 h-20 rounded-full bg-white opacity-5"></div>
      </div>

      {/* ── Profile Identity Card ─────────────────── */}
      <div className="relative px-4 z-10" style={{ marginTop: '-56px' }}>
        <div className="bg-white rounded-[28px] shadow-2xl border border-color/30 px-5 pt-16 pb-5">
          {/* Avatar — sits half-inside, half-outside the card */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-56px' }}>
            <div className="relative">
              <div className="w-28 h-28 rounded-[28px] bg-white p-1.5 shadow-2xl border-4 border-white overflow-hidden">
                {loading ? (
                  <Skeleton width="100%" height="100%" borderRadius="18px" />
                ) : (
                  <img
                    src={currentUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=4338ca&color=fff&size=200`}
                    className="w-full h-full object-cover rounded-[18px]"
                    alt="Profile"
                  />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-xl shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                <Edit3 size={14} />
              </button>
            </div>
          </div>

          {/* Name & Email */}
          <div className="text-center">
            <h2 className="text-xl font-black text-main tracking-tight leading-tight mb-1">
              {loading ? <Skeleton width="160px" height="1.5rem" /> : profileName}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-muted text-xs font-medium">
              <Mail size={11} className="flex-shrink-0" />
              <span className="truncate max-w-[220px]">{currentUser?.email}</span>
            </div>

            {/* Pro Badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border"
              style={{ background: 'linear-gradient(90deg, #fef3c7, #fefce8)', borderColor: 'rgba(245,158,11,0.3)' }}>
              <ZapIcon size={13} className="text-warning" />
              <span className="text-[11px] font-black text-warning uppercase tracking-widest">Pro Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Menu Sections ────────────────────────── */}
      <div className="px-4 mt-5 pb-28 space-y-5">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="px-2 text-[10px] font-black text-muted uppercase tracking-[0.18em]">
              {group.title}
            </h4>
            <div className="bg-white rounded-[24px] border shadow-sm overflow-hidden"
              style={{ borderColor: 'var(--border-color)' }}>
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action || (() => {})}
                  className={`w-full flex justify-between items-center px-4 py-4 transition-colors group active:scale-[0.99] text-left
                    ${i > 0 ? 'border-t' : ''}`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${item.isDanger ? 'bg-red-50 text-danger' : 'bg-bg-main text-primary group-hover:bg-primary-light'}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <span className={`block text-sm font-bold leading-tight ${item.isDanger ? 'text-danger' : 'text-main'}`}>
                        {item.label}
                      </span>
                      {item.value && (
                        <span className={`text-[11px] font-semibold mt-0.5 block ${item.color || 'text-muted'}`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 transition-all group-hover:translate-x-0.5 ${item.isDanger ? 'text-danger/40' : 'text-muted/40 group-hover:text-primary'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Version Footer */}
        <div className="text-center pt-2 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
            EAMCET A-to-Z • Version 2.0.4-beta
          </p>
        </div>
      </div>
    </div>
  );
}

/* Inline Zap SVG (avoids Lucide fill issue) */
const ZapIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
