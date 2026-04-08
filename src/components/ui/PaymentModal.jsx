import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { X, QrCode, ShieldCheck, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function PaymentModal({ isOpen, onClose, amount = 99, onSuccess, currentUser }) {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // 1 = QR code, 2 = Success

  // REPLACE THIS WITH YOUR ACTUAL UPI ID
  const upiId = "omegrowoffical@okaxis"; 
  const qrLink = `upi://pay?pa=${upiId}&pn=EAMCET_Premium&am=${amount}&cu=INR`;
  // Using an open source QR generator API for simplicity
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
      // 1. Log transaction in DB
      const { error: txnErr } = await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        user_email: currentUser.email,
        amount: amount,
        plan_name: 'Premium Pass',
        utr_number: utrNumber,
        status: 'pending'
      }]);

      if (txnErr) throw txnErr;

      // 2. Grant Instant Optimistic Access to user
      const { error: progErr } = await supabase.from('user_progress').update({
        is_premium: true
      }).eq('user_id', currentUser.id);

      if (progErr) throw progErr;

      setStep(2);
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep(1);
        setUtrNumber('');
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Error processing: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in relative overflow-hidden p-0 border-primary" style={{ borderTopWidth: '4px' }}>

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
              <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Scan & Pay with any app</p>
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
                <p>After payment, enter your 12-digit UTR/UPI Ref number below to get instant access.</p>
              </div>
              <Input
                placeholder="Enter 12-digit UPI Reference No."
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
              <Button type="submit" fullWidth disabled={loading || utrNumber.length < 10} className="text-white h-12 text-lg">
                {loading ? 'Verifying...' : 'Unlock My Access Now'}
              </Button>
              <p className="text-[10px] text-center text-muted flex items-center justify-center gap-1 mt-2">
                <ShieldCheck size={12} /> Secure Payment Processing
              </p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center h-80">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center animate-bounce mb-4 shadow-lg shadow-success">
              <CheckCircle2 color="white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-main">Payment Success!</h2>
            <p className="text-muted mt-2">You are now a Premium Member.</p>
            <p className="text-sm font-semibold text-primary mt-4 animate-pulse">Redirecting to your materials...</p>
          </div>
        )}
      </Card>
    </div>
  );
}
