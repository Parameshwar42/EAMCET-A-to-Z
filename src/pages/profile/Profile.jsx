import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { userProfile } from '../../data/dummyData';
import { Settings, LogOut, Bell, Shield, Book, CreditCard, ChevronRight } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <Book size={20} />, label: "My Enrolled Courses", value: "EAMCET 2026 Pro" },
    { icon: <CreditCard size={20} />, label: "Subscription & Billing", value: "Active" },
    { icon: <Bell size={20} />, label: "Notification Preferences" },
    { icon: <Shield size={20} />, label: "Privacy & Security" },
    { icon: <Settings size={20} />, label: "App Settings" },
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-6">Profile & Settings</h1>
      
      <Card className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <img src={userProfile.avatar} className="w-16 h-16 rounded-full border border-color" alt="User" />
        <div className="flex-1 text-center md:text-left">
           <h2 className="h3 font-bold">{currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "EAMCET Aspirant"}</h2>
           <div className="text-sm font-semibold opacity-90">{currentUser?.email}</div>
           <div className="text-xs mt-1 bg-white bg-opacity-20 inline-block px-2 py-1 rounded">Target: TS EAMCET 2026</div>
           <div className="flex gap-3 justify-center md:justify-start mt-2">
            <Button variant="outline" size="sm">Edit Profile</Button>
            <BadgePremium />
          </div>
        </div>
      </Card>

      <Card padding="p-0">
         <div className="flex flex-col">
            {menuItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 cursor-pointer hover:bg-main transition" 
                   style={{ borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div className="flex items-center gap-4">
                  <div className="text-primary">{item.icon}</div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <div className="flex items-center gap-3 text-muted">
                  {item.value && <span className="text-sm font-medium">{item.value}</span>}
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
         </div>
      </Card>

      <div className="mt-8 flex justify-center">
         <Button 
           variant="ghost" 
           className="text-danger flex items-center gap-2" 
           onClick={() => navigate('/login')}
         >
           <LogOut size={20} /> Logout
         </Button>
      </div>
    </div>
  );
}

function BadgePremium() {
  return (
    <span style={{ 
      background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)', 
      color: '#8c6000', padding: '0.25rem 0.75rem', 
      borderRadius: 'var(--radius-pill)', fontSize: '0.875rem', fontWeight: 'bold' 
    }}>
      PRO Member
    </span>
  );
}
