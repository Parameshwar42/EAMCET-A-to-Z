import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { X, ShieldCheck, CheckCircle2, Lock, FileText, Smartphone } from 'lucide-react';
import { supabase } from '../../config/supabase';

// Helper to dynamically load the Razorpay SDK script
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentModal({ isOpen, onClose, amount = 99, onSuccess, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = pre-checkout details, 2 = Success

  // REPLACE THIS WITH YOUR RAZORPAY PUBLIC KEY! (It starts with 'rzp_test_' or 'rzp_live_')
  // We recommend injecting this via Vite env vars in production e.g. import.meta.env.VITE_RAZORPAY_KEY
  const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE'; 

  if (!isOpen) return null;

  const displayRazorpay = async () => {
    setLoading(true);
    
    // 1. Load Script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // 2. Safely ping our Vercel API backend to generate an Order ID secretly
    let order_id = null;
    try {
      const resp = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount })
      });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.error || "Failed order creation");
      order_id = data.id;
    } catch (e) {
      console.error(e);
      alert("System Error: Could not generate order securely. Ensure Vercel Keys are set.");
      setLoading(false);
      return;
    }

    // 3. Setup Razorpay Options
    const options = {
      key: RAZORPAY_KEY, // Public Key
      amount: amount * 100, // Amount is in currency subunits. 
      currency: "INR",
      name: "EAMCET A-Z",
      description: "Lifetime Premium Access",
      image: "https://i.imgur.com/KxP1t1B.png", // Demo logo
      order_id: order_id, // Safely created order_id
      handler: async function (response) {
        // Payment success callback!
        try {
          // 4. Send signature to our Vercel backend to verify
          const verifyResp = await fetch('/api/verify-payment', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
             })
          });

          const verifyData = await verifyResp.json();
          if(!verifyData.verified) throw new Error("Cryptographic verification failed!");

          // 5. Instantly Grant Access via Supabase securely 
          await supabase.from('user_progress').update({ is_premium: true }).eq('user_id', currentUser.id);
          
          await supabase.from('transactions').insert([{
            user_id: currentUser.id,
            user_email: currentUser.email,
            amount: amount,
            plan_name: 'Premium Pass',
            utr_number: response.razorpay_payment_id, // save standard payment id for UI
            status: 'verified' // Auto verified by Razorpay
          }]);

          setStep(2);
          setTimeout(() => {
            onSuccess();
            onClose();
            setStep(1);
          }, 3000);

        } catch(e) {
           console.error("Critical Post-Payment Error:", e);
           alert("Payment completed but app failed to unlock. Contact support.");
        }
      },
      prefill: {
        name: currentUser?.user_metadata?.full_name || "Student",
        email: currentUser?.email || "student@example.com",
        contact: "" // Ask student to fill phone
      },
      theme: { color: "#4f46e5" } // Vercel blue/indigo
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    
    // Catch when window closes
    paymentObject.on('payment.failed', function (response){
         alert("Payment Failed! Reason: " + response.error.description);
    });

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in relative overflow-hidden p-0 border-primary shadow-2xl" style={{ borderTopWidth: '4px' }}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-danger z-10">
          <X />
        </button>

        {step === 1 ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary border-opacity-30">
                 <Lock size={32} className="text-primary"/>
              </div>
              <h2 className="text-2xl font-black text-main">Unlock Premium Pass</h2>
              <p className="text-sm text-muted mt-2">Get lifetime access to ALL PYQ Papers & Solutions</p>
            </div>

            <div className="bg-bg-main p-4 rounded-xl border border-color mb-8 shadow-inner">
               <div className="flex justify-between items-center mb-2 pb-2 border-b border-color border-opacity-50">
                  <span className="text-sm font-semibold flex items-center gap-1"><FileText size={14}/> 10+ PDF Downloads</span>
                  <CheckCircle2 size={16} className="text-success" />
               </div>
               <div className="flex justify-between items-center mb-2 pb-2 border-b border-color border-opacity-50">
                  <span className="text-sm font-semibold flex items-center gap-1"><Smartphone size={14}/> Verified Answers</span>
                  <CheckCircle2 size={16} className="text-success" />
               </div>
               <div className="flex justify-between items-center pt-2 mt-4">
                  <span className="font-bold text-main">Total Upfront</span>
                  <span className="font-black text-2xl text-primary flex items-baseline">₹{amount} <span className="text-xs text-muted ml-1 line-through font-normal">₹999</span></span>
               </div>
            </div>

            <Button onClick={displayRazorpay} fullWidth disabled={loading} className="text-white h-14 text-lg bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary-light">
              {loading ? 'Initializing Secure Payment...' : `Pay ₹${amount} Now`}
            </Button>
            
            <p className="text-[10px] text-center text-muted flex items-center justify-center gap-1 mt-4 font-semibold uppercase tracking-wider">
               <ShieldCheck size={14} className="text-success"/> Secured officially by Razorpay
            </p>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center h-80">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center animate-bounce mb-4 shadow-xl shadow-success">
               <CheckCircle2 color="white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-main">Payment Success!</h2>
            <p className="text-muted mt-2">You are now officially a Premium Member.</p>
            <p className="text-sm font-semibold text-primary mt-4 animate-pulse">Redirecting to your materials...</p>
          </div>
        )}
      </Card>
    </div>
  );
}
