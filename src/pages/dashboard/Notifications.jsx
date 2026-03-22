import React from 'react';
import Card from '../../components/ui/Card';
import { Bell, Trophy, AlertTriangle, BookOpen, Clock } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'alert', title: "Daily Target Missed", desc: "You missed yesterday's target. Let's make it up today!", time: "2 hours ago", icon: <AlertTriangle className="text-danger" /> },
    { id: 2, type: 'success', title: "Streak Master!", desc: "You've hit a 15-day streak. Keep the momentum going.", time: "5 hours ago", icon: <Trophy className="text-warning" /> },
    { id: 3, type: 'info', title: "New Mock Test Added", desc: "Grand Mock Test 2 is now available for premium users.", time: "1 day ago", icon: <BookOpen className="text-primary" /> },
    { id: 4, type: 'warning', title: "Revision Reminder", desc: "It's been 5 days since you revised Thermodynamics.", time: "1 day ago", icon: <Clock className="text-warning" /> }
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
       <h1 className="h2 font-bold mb-6 flex items-center gap-2"><Bell className="text-primary"/> Notifications</h1>
       <div className="flex flex-col gap-3">
          {notifications.map(notif => (
             <Card key={notif.id} className="flex gap-4 items-start hover:bg-main hover:shadow-md transition cursor-pointer">
                <div className="p-2 bg-main rounded-full mt-1">
                   {notif.icon}
                </div>
                <div>
                   <h3 className="font-bold text-lg">{notif.title}</h3>
                   <p className="text-muted text-sm mt-1 mb-2">{notif.desc}</p>
                   <span className="text-xs font-semibold text-muted opacity-80">{notif.time}</span>
                </div>
             </Card>
          ))}
       </div>
    </div>
  );
}
