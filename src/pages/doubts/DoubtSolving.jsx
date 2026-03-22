import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Camera, Send, MessageCircle } from 'lucide-react';

export default function DoubtSolving() {
  const [doubtText, setDoubtText] = useState('');

  return (
    <div className="p-4 md:p-6 animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 font-bold mb-2 text-center md:text-left">Ask Ramarao Sir</h1>
      <p className="subtitle mb-8 text-center md:text-left">Get instant clarity on any EAMCET concept.</p>

      <Card className="mb-8" padding="p-6">
         <div className="bg-primary-bg p-4 rounded-lg border-dashed border-2 border-primary-light mb-4 flex flex-col items-center justify-center min-h-[150px] cursor-pointer hover:bg-main transition">
            <Camera size={48} className="text-primary mb-2 opacity-80" />
            <p className="font-semibold text-primary">Upload Photo of Question</p>
            <p className="text-xs text-muted mt-1">PNG, JPG up to 5MB</p>
         </div>

         <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-border-color"></div>
            <span className="text-xs font-bold text-muted uppercase">OR</span>
            <div className="flex-1 h-px bg-border-color"></div>
         </div>

         <div className="flex flex-col gap-3">
             <label className="text-sm font-semibold">Type your doubt</label>
             <textarea 
               className="w-full p-4 rounded-md border border-color focus:border-primary focus:outline-none"
               rows="4" 
               placeholder="E.g., I don't understand how to apply Lenz's law in this specific circuit..."
               value={doubtText}
               onChange={(e) => setDoubtText(e.target.value)}
               style={{ backgroundColor: 'var(--bg-main)' }}
             ></textarea>
         </div>

         <div className="mt-6 flex justify-end">
            <Button variant="primary" size="lg" className="flex items-center gap-2">
               Submit Doubt <Send size={18} />
            </Button>
         </div>
      </Card>

      <h3 className="font-bold text-lg mb-4">Recent Doubts Answered</h3>
      <div className="flex flex-col gap-4">
         <Card className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold font-mono">Q</div>
               <div>
                  <div className="font-semibold mb-1">Difference between Sp3 and Sp2 hybridization reactivity?</div>
                  <div className="text-xs text-muted">Chemistry • 2 hours ago</div>
               </div>
            </div>
            <div className="flex flex-col gap-4 ml-14">
               <div className="flex items-start gap-4 p-4 bg-success-light rounded-lg border border-success">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex shrink-0 items-center justify-center font-bold"><MessageCircle size={16}/></div>
                  <div>
                    <div className="font-semibold mb-1 text-success">Ramarao Sir</div>
                    <div className="text-sm">Sp3 has more s-character (25%) than Sp2 (33.3%). No wait, Sp2 has 33.3% and Sp3 has 25%. Higher s-character means electrons are held closer to nucleus, making the compound more electronegative...</div>
                  </div>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
