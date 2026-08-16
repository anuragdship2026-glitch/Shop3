import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    try {
      razorpayInstance = new Razorpay({
        key_id: keyId.trim(),
        key_secret: keySecret.trim()
      });
      return razorpayInstance;
    } catch (err) {
      console.error('[Razorpay Init Error]:', err);
      return null;
    }
  }

  return null;
}

export default getRazorpay;
