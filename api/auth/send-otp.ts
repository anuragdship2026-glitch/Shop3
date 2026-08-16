import type { Request, Response } from 'express';
import {
  getSupabase,
  inMemoryOtpStore,
  sendResendEmail,
  sendFast2Sms,
  getOtpEmailHtml
} from '../lib/supabase.js';

export async function handleSendOtp(req: Request | any, res: Response | any) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  console.log('[API /api/auth/send-otp] Request Body:', body);
  try {
    const identifier = (body.identifier || body.email || body.phone || '').toString().trim();
    const method = (body.method || (identifier.includes('@') ? 'email' : 'phone')).toLowerCase();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address or 10-digit mobile number.'
      });
    }

    // Basic format validation
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (method === 'phone') {
      const digits = identifier.replace(/\D/g, '');
      if (digits.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid 10-digit mobile number.'
        });
      }
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry
    const createdAt = new Date().toISOString();

    const supabase = getSupabase();

    if (supabase) {
      // Invalidate any previous unused OTPs for this identifier
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('identifier', identifier)
        .eq('used', false);

      // Insert new OTP record
      const { error: insertError } = await supabase.from('otp_codes').insert([
        {
          identifier,
          otp,
          expires_at: expiresAt,
          used: false,
          created_at: createdAt
        }
      ]);

      if (insertError) {
        console.error('[Supabase OTP Insert Error]:', insertError);
      }
    } else {
      console.warn('[Supabase] Client not initialized. Using in-memory OTP store.');
      // Mark old as used
      inMemoryOtpStore.forEach((item) => {
        if (item.identifier === identifier) item.used = true;
      });
      inMemoryOtpStore.push({
        id: `otp_${Date.now()}`,
        identifier,
        otp,
        expires_at: expiresAt,
        used: false,
        created_at: createdAt
      });
    }

    // Dispatch via Resend (Email) or Fast2SMS (Phone)
    if (method === 'email' || identifier.includes('@')) {
      const emailHtml = getOtpEmailHtml(otp);
      const emailResult = await sendResendEmail({
        to: identifier,
        subject: `Your Indigo & Co. Verification Code: ${otp}`,
        html: emailHtml
      });

      console.log('[Send OTP Email Result]:', emailResult);
    } else {
      const smsResult = await sendFast2Sms({
        phone: identifier,
        otp
      });

      console.log('[Send OTP SMS Result]:', smsResult);
    }

    return res.status(200).json({
      success: true,
      message: method === 'email' ? `Verification code sent to ${identifier}` : `OTP sent to +91 ${identifier.slice(-10)}`,
      // For local testing convenience if SMS/Email is mocked:
      ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {})
    });
  } catch (err: any) {
    console.error('[API /api/auth/send-otp] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong while sending OTP. Please try again.',
      details: err?.message
    });
  }
}

export default handleSendOtp;
