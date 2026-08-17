import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

// In-memory fallbacks in case Supabase or 3rd party credentials are not yet set
export const inMemoryOtpStore: Array<{
  id: string;
  identifier: string;
  otp: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}> = [];

export const inMemoryCustomers: Array<{
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  created_at: string;
  last_login: string;
}> = [];

export const inMemoryOrders: Array<{
  id: string;
  customer_id: string;
  shopify_order_id?: string | null;
  order_number: string;
  tracking_id: string;
  items: any;
  shipping_address: any;
  payment_method: string;
  subtotal: number;
  cod_fee: number;
  final_amount: number;
  status: string;
  razorpay_payment_id: string | null;
  created_at: string;
  estimated_delivery: string;
}> = [];

let supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseAdmin) return supabaseAdmin;

  const url = (process.env.SUPABASE_URL || process.env.supabase_url || process.env.VITE_SUPABASE_URL)?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.supabase_service_key ||
    process.env.supabase_anon_key ||
    process.env.VITE_SUPABASE_ANON_KEY
  )?.trim();

  if (url && key) {
    try {
      supabaseAdmin = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return supabaseAdmin;
    } catch (err) {
      console.error('[Supabase Init Error]:', err);
      return null;
    }
  }

  return null;
}

const DEFAULT_JWT_SECRET = 'indigo_and_co_secret_jwt_key_2026_luxury_brand';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET?.trim() || DEFAULT_JWT_SECRET;
}

export function generateJwtToken(payload: {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
}): string {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email || '',
      phone: payload.phone || '',
      name: payload.name || 'Indigo & Co. Customer'
    },
    secret,
    { expiresIn: '30d' }
  );
}

export function verifyJwtToken(token: string): any {
  if (!token) return null;
  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const secret = getJwtSecret();
    return jwt.verify(cleanToken, secret);
  } catch (err) {
    return null;
  }
}

let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  if (resendClient) return resendClient;
  const key = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.resend_api_key)?.trim();
  if (key) {
    try {
      resendClient = new Resend(key);
      return resendClient;
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Resend API Email Sender helper
 */
export async function sendResendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const resendApiKey = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.resend_api_key)?.trim();
  if (!resendApiKey) {
    console.warn('[Resend Email] RESEND_API_KEY is not set. Simulating email dispatch to:', to);
    return { success: true, data: { id: `sim_${Date.now()}` } };
  }

  try {
    const resend = getResend() || new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: 'Indigo & Co. <onboarding@resend.dev>',
      to: [to],
      subject,
      html
    });

    if (result.error) {
      console.error('[Resend Email] Failed to send email:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[Resend Email] Email sent successfully to', to, result.data);
    return { success: true, data: result.data };
  } catch (err: any) {
    console.error('[Resend Email] SDK error:', err);
    return { success: false, error: err?.message || 'Email delivery error' };
  }
}

/**
 * Fast2SMS API SMS Sender helper
 */
export async function sendFast2Sms({
  phone,
  otp
}: {
  phone: string;
  otp: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = (
    process.env.FAST2SMS_API_KEY ||
    process.env.FAST2SMS_KEY ||
    process.env.fast2sms_api_key ||
    process.env.FAST2SMS_AUTH
  )?.trim();
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  if (!apiKey) {
    console.warn('[Fast2SMS] FAST2SMS_API_KEY is not set. Simulating SMS OTP', otp, 'to +91' + cleanPhone);
    return { success: true, data: { simulated: true, otp } };
  }

  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: apiKey
      },
      body: JSON.stringify({
        variables_values: otp,
        route: 'otp',
        numbers: cleanPhone
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[Fast2SMS] Failed to send SMS:', errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    console.log('[Fast2SMS] SMS sent successfully to', cleanPhone, data);
    return { success: true, data };
  } catch (err: any) {
    console.error('[Fast2SMS] Fetch error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Branded Indigo & Co. Royal Purple OTP Email Template
 */
export function getOtpEmailHtml(otp: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your Indigo & Co. Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f2eded; color: #2c2c2c;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #e5e0db;">
      <!-- Header -->
      <tr>
        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #4b0082 0%, #2d004d 100%);">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase;">
            INDIGO & CO.
          </h1>
          <p style="color: #c9a84c; font-size: 11px; letter-spacing: 4px; margin: 6px 0 0 0; text-transform: uppercase; font-weight: 600;">
            Luxury Essentials • Pure Craftsmanship
          </p>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style="padding: 40px 35px; text-align: center;">
          <h2 style="color: #4b0082; font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">
            Login Verification Code
          </h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
            Use the 6-digit one-time password below to access your Indigo & Co. account and track your orders.
          </p>
          
          <!-- OTP Box -->
          <div style="background-color: #f8f6f3; border: 2px dashed #4b0082; border-radius: 12px; padding: 20px 30px; display: inline-block; margin: 0 auto 25px auto;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #4b0082;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #888888; font-size: 13px; line-height: 1.5; margin: 0 0 10px 0;">
            ⏱ This code is valid for <strong>10 minutes</strong>. Please do not share this OTP with anyone.
          </p>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="padding: 25px 30px; background-color: #fcfbfa; border-top: 1px solid #f0eae1; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0 0 8px 0;">
            If you did not request this verification code, please ignore this email.
          </p>
          <p style="color: #4b0082; font-size: 12px; font-weight: 700; margin: 0;">
            © ${new Date().getFullYear()} Indigo & Co. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Branded Order Confirmation Email Template
 */
export function getOrderConfirmationEmailHtml(order: {
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
  items: any[];
  subtotal: number;
  codFee: number;
  finalAmount: number;
  paymentMethod: string;
  estimatedDelivery: string;
  shippingAddress: any;
}): string {
  const itemsHtml = (order.items || [])
    .map((item: any) => {
      const prod = item.product || {};
      const sizeStr = item.selectedSize ? ` • Size: ${item.selectedSize}` : '';
      return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0eae1;">
          <strong style="color: #2c2c2c; font-size: 14px;">${prod.name || 'Indigo Product'}</strong>
          <div style="color: #777777; font-size: 12px;">Qty: ${item.quantity || 1}${sizeStr}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0eae1; text-align: right; font-weight: 700; color: #4b0082; font-size: 14px;">
          ₹${(prod.sellPrice || prod.price || 0) * (item.quantity || 1)}
        </td>
      </tr>
    `;
    })
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmation - Indigo & Co.</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f2eded; color: #2c2c2c;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #e5e0db;">
      <!-- Header -->
      <tr>
        <td style="padding: 35px 30px; text-align: center; background: linear-gradient(135deg, #4b0082 0%, #2d004d 100%);">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase;">
            INDIGO & CO.
          </h1>
          <p style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin: 5px 0 0 0; text-transform: uppercase; font-weight: 600;">
            Order Confirmed & Preparing for Dispatch
          </p>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style="padding: 35px 30px;">
          <h2 style="color: #4b0082; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">
            Thank you, ${order.customerName}!
          </h2>
          <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order <strong>${order.orderNumber}</strong> has been received and is being prepared with utmost care.
          </p>
          
          <!-- Key Meta Box -->
          <div style="background-color: #f8f6f3; border-radius: 12px; padding: 18px 20px; margin-bottom: 25px; border: 1px solid #ece5dd;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size: 12px; color: #777777; padding-bottom: 5px;">Order Number:</td>
                <td style="font-size: 13px; font-weight: 800; color: #4b0082; text-align: right; padding-bottom: 5px;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="font-size: 12px; color: #777777; padding-bottom: 5px;">Tracking ID:</td>
                <td style="font-size: 13px; font-weight: 800; color: #2c2c2c; text-align: right; padding-bottom: 5px;">${order.trackingNumber}</td>
              </tr>
              <tr>
                <td style="font-size: 12px; color: #777777; padding-bottom: 5px;">Payment Mode:</td>
                <td style="font-size: 13px; font-weight: 700; color: #2c2c2c; text-align: right; padding-bottom: 5px;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="font-size: 12px; color: #777777;">Estimated Delivery:</td>
                <td style="font-size: 13px; font-weight: 800; color: #047857; text-align: right;">${order.estimatedDelivery}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="color: #2c2c2c; font-size: 15px; font-weight: 700; margin: 0 0 10px 0; border-bottom: 2px solid #4b0082; padding-bottom: 6px;">
            Order Summary
          </h3>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <!-- Financial summary -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e0d8ce; padding-top: 10px;">
            <tr>
              <td style="font-size: 13px; color: #666666; padding: 4px 0;">Subtotal:</td>
              <td style="font-size: 13px; font-weight: 600; color: #2c2c2c; text-align: right; padding: 4px 0;">₹${order.subtotal}</td>
            </tr>
            ${
              order.codFee > 0
                ? `
            <tr>
              <td style="font-size: 13px; color: #666666; padding: 4px 0;">COD Handling Fee:</td>
              <td style="font-size: 13px; font-weight: 600; color: #92400e; text-align: right; padding: 4px 0;">+ ₹${order.codFee}</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td style="font-size: 13px; color: #666666; padding: 4px 0;">Shipping:</td>
              <td style="font-size: 13px; font-weight: 700; color: #047857; text-align: right; padding: 4px 0;">FREE</td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 800; color: #4b0082; padding: 10px 0 0 0;">Total:</td>
              <td style="font-size: 18px; font-weight: 900; color: #4b0082; text-align: right; padding: 10px 0 0 0;">₹${order.finalAmount}</td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="padding: 25px 30px; background-color: #fcfbfa; border-top: 1px solid #f0eae1; text-align: center;">
          <p style="color: #666666; font-size: 12px; margin: 0 0 8px 0;">
            Track your package live or view your past purchases anytime in your Indigo & Co. account.
          </p>
          <p style="color: #4b0082; font-size: 12px; font-weight: 700; margin: 0;">
            © ${new Date().getFullYear()} Indigo & Co. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
