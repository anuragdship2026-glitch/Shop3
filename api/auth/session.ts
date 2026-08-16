import type { Request, Response } from 'express';
import {
  getSupabase,
  verifyJwtToken,
  inMemoryCustomers
} from '../lib/supabase.js';

export async function handleSession(req: Request | any, res: Response | any) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
    const bodyToken = body?.token || req.query?.token;
    const rawToken = authHeader ? (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader) : bodyToken;

    if (!rawToken) {
      return res.status(401).json({
        valid: false,
        message: 'No authorization token provided.'
      });
    }

    const decoded = verifyJwtToken(rawToken);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        valid: false,
        message: 'Session token has expired or is invalid.'
      });
    }

    const customerId = decoded.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerId || '');
    const cleanEmail = decoded.email ? decoded.email.toLowerCase().trim() : null;
    const cleanPhone = decoded.phone ? decoded.phone.replace(/\D/g, '') : null;

    const supabase = getSupabase();
    let customer = null;

    if (supabase) {
      let query = supabase.from('customers').select('*');
      if (isUuid) {
        query = query.eq('id', customerId);
      } else if (cleanEmail) {
        query = query.eq('email', cleanEmail);
      } else if (cleanPhone) {
        query = query.eq('phone', cleanPhone);
      }

      if (isUuid || cleanEmail || cleanPhone) {
        const { data, error } = await query.limit(1);

        if (error) {
          console.error('[Supabase Session Error]:', error);
        }

        if (data && data.length > 0) {
          customer = data[0];
        }
      }
    }

    if (!customer) {
      // In-memory or token fallback
      const inMemoryFound = inMemoryCustomers.find((c) => c.id === customerId);
      customer = inMemoryFound || {
        id: decoded.id,
        email: decoded.email || null,
        phone: decoded.phone || null,
        name: decoded.name || 'Indigo & Co. Customer',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
    }

    return res.status(200).json({
      valid: true,
      customer
    });
  } catch (err: any) {
    console.error('[API /api/auth/session] Error:', err);
    return res.status(500).json({
      valid: false,
      message: 'Failed to validate session',
      details: err?.message
    });
  }
}

export default handleSession;
