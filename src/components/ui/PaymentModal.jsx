import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { X, ShieldCheck, Copy, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function PaymentModal({ isOpen, onClose, amount = 99, currentUser, onSuccess }) {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // 1 = QR code, 2 = Pending Approval

  // Live polling for Admin Verification
  useEffect(() => {
    let interval;
    if (step === 2 && utrNumber) {
      interval = setInterval(async () => {
        try {
          const { data, error } = await supabase.from('transactions').select('status').eq('utr_number', utrNumber).order('created_at', { ascending: false }).limit(1);
          
          if (data && data.length > 0) {
            const currentStatus = data[0].status;
            if (currentStatus === 'verified') {
              clearInterval(interval);
              alert("🎉 SUCCESS! Payment Verified by Admin. All Premium PDFs are now UNLOCKED!");
              if (onSuccess) onSuccess();
              onClose();
            } else if (currentStatus === 'rejected') {
              clearInterval(interval);
              alert("❌ FRAUD ALERT: Payment Rejected! Your UTR number was invalid or money was not received.");
              setStep(1);
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [step, utrNumber]);

  // THE DIRECT UPI ID
  const upiId = "omegrowoffical@okaxis"; 
  const qrLink = `upi://pay?pa=${upiId}&pn=EAMCET_Premium&am=${amount}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrLink)}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (utrNumber.length < 10) return alert("Please enter a valid actual UTR / Transaction No.");

    setLoading(true);
    try {
      // Log transaction as Pending. WE DO NOT UNLOCK INSTANTLY.
      const { error: txnErr } = await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        user_email: currentUser.email,
        amount: amount,
        plan_name: 'Premium Pass',
        utr_number: utrNumber,
        status: 'pending'
      }]);

      if (txnErr) throw txnErr;

      // Show the pending success screen
      setStep(2);
      
    } catch (err) {
      console.error(err);
      alert("Error submitting UTR: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in relative overflow-hidden p-0 border-primary shadow-2xl" style={{ borderTopWidth: '4px' }}>

        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-danger z-10">
          <X />
        </button>

        {step === 1 ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-main">Unlock Premium</h2>
              <p className="text-sm text-muted mt-1">Get lifetime access to ALL PYQ Papers & Solutions for just ₹{amount}</p>
            </div>

            <div className="flex flex-col items-center bg-primary-light bg-opacity-30 p-6 rounded-2xl border border-primary border-opacity-20 mb-6">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                <img src={qrImageUrl} alt="UPI QR Code" className="w-48 h-48" />
              </div>
              <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Scan & Pay with any bank app</p>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm border font-mono">
                <span className="font-semibold text-main">{upiId}</span>
                <button onClick={handleCopy} className="text-primary hover:text-main transition">
                  {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-warning-light bg-opacity-30 p-3 rounded-lg border border-warning text-xs text-warning-dark flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <p>After payment, enter your 12-digit UTR/UPI Ref number below. Admin will verify and unlock your account.</p>
              </div>
              <Input
                placeholder="Enter 12-digit UPI Reference No."
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
              <Button type="submit" fullWidth disabled={loading || utrNumber.length < 10} className="text-white h-12 text-lg">
                {loading ? 'Submitting...' : 'Submit Payment for Review'}
              </Button>
              <p className="text-[10px] text-center text-muted flex items-center justify-center gap-1 mt-2">
                <ShieldCheck size={12} /> Secure Direct Transfer
              </p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center animate-pulse mb-6 shadow-xl shadow-warning-light">
              <Clock color="white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-warning-dark">Under Review</h2>
            <p className="text-muted mt-3 font-semibold">Your payment of ₹{amount} has been submitted to the Admin for verification.</p>
            <div className="bg-bg-main border border-color p-4 rounded-xl mt-6">
                <p className="text-xs text-muted mb-1">Your Submitted UTR:</p>
                <p className="text-lg font-mono font-bold text-main tracking-widest">{utrNumber}</p>
            </div>
            <p className="text-xs text-primary mt-6">You will be unlocked automatically once the admin confirms the receipt. You may close this window.</p>
            <Button onClick={onClose} variant="outline" className="mt-6 w-full">Back to App</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
