import type { Request, Response } from 'express';
import {
  getSupabase,
  inMemoryOtpStore,
  inMemoryCustomers,
  generateJwtToken
} from '../lib/supabase';

export async function handleVerifyOtp(req: Request | any, res: Response | any) {
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

  console.log('[API /api/auth/verify-otp] Request Body:', body);
  try {
    const identifier = (body.identifier || body.email || body.phone || '').toString().trim();
    const otp = (body.otp || '').toString().trim();

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both identifier and the 6-digit OTP code.'
      });
    }

    const supabase = getSupabase();
    const nowIso = new Date().toISOString();
    let otpValid = false;

    if (supabase) {
      // Find matching active OTP in Supabase
      const { data: matchedOtps, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('identifier', identifier)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', nowIso)
        .order('created_at', { ascending: false })
        .limit(1);

      if (otpError) {
        console.error('[Supabase OTP query error]:', otpError);
      }

      if (matchedOtps && matchedOtps.length > 0) {
        otpValid = true;
        const matchedOtp = matchedOtps[0];
        // Mark OTP as used
        await supabase
          .from('otp_codes')
          .update({ used: true })
          .eq('id', matchedOtp.id);
      }
    } else {
      // Check in-memory store
      const matched = inMemoryOtpStore.find(
        (o) =>
          o.identifier === identifier &&
          o.otp === otp &&
          !o.used &&
          new Date(o.expires_at).getTime() > Date.now()
      );

      if (matched) {
        otpValid = true;
        matched.used = true;
      }
    }

    if (!otpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please check the code or request a new one.'
      });
    }

    // Determine email/phone format
    const isEmail = identifier.includes('@');
    const email = isEmail ? identifier.toLowerCase() : null;
    const phone = !isEmail ? identifier.replace(/\D/g, '') : null;
    const displayName = isEmail ? identifier.split('@')[0] : `Customer ${identifier.slice(-4)}`;

    let customer: any = null;

    if (supabase) {
      // Search existing customer by email or phone
      let query = supabase.from('customers').select('*');
      if (email) {
        query = query.eq('email', email);
      } else if (phone) {
        query = query.eq('phone', phone);
      }

      const { data: existingCustomers, error: findError } = await query.limit(1);

      if (findError) {
        console.error('[Supabase find customer error]:', findError);
      }

      if (existingCustomers && existingCustomers.length > 0) {
        customer = existingCustomers[0];
        // Update last login
        await supabase
          .from('customers')
          .update({ last_login: nowIso })
          .eq('id', customer.id);
        customer.last_login = nowIso;
      } else {
        // Create new customer
        const newCustomerPayload = {
          email: email || undefined,
          phone: phone || undefined,
          name: displayName,
          created_at: nowIso,
          last_login: nowIso
        };

        const { data: createdCustomers, error: createError } = await supabase
          .from('customers')
          .insert([newCustomerPayload])
          .select('*');

        if (createError) {
          console.error('[Supabase create customer error]:', createError);
          // Fallback object with generated id
          customer = {
            id: `cust_${Date.now()}`,
            ...newCustomerPayload
          };
        } else if (createdCustomers && createdCustomers.length > 0) {
          customer = createdCustomers[0];
        }
      }
    } else {
      // In-memory fallback
      let found = inMemoryCustomers.find(
        (c) => (email && c.email === email) || (phone && c.phone === phone)
      );

      if (found) {
        found.last_login = nowIso;
        customer = found;
      } else {
        customer = {
          id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          email,
          phone,
          name: displayName,
          created_at: nowIso,
          last_login: nowIso
        };
        inMemoryCustomers.push(customer);
      }
    }

    // Generate JWT token valid for 30 days
    const token = generateJwtToken({
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: customer.name
    });

    console.log('[API /api/auth/verify-otp] Authentication Successful for:', customer.name, customer.id);

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome to Indigo & Co.',
      token,
      customer
    });
  } catch (err: any) {
    console.error('[API /api/auth/verify-otp] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong while verifying OTP. Please try again.',
      details: err?.message
    });
  }
}

export default handleVerifyOtp;
