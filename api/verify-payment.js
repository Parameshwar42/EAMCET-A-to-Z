import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) throw new Error("Razorpay Secret Missing");

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: 'Transaction is not legit!' });
    }

    // Since signature matches, it is safely verified
    res.status(200).json({ 
      verified: true,
      msg: 'success'
    });
  } catch (error) {
    console.error("Verification Error: ", error);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
}
