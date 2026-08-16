import type { Request, Response } from 'express';
import {
  getSupabase,
  verifyJwtToken,
  inMemoryOrders
} from '../lib/supabase';

export async function handleMyOrders(req: Request | any, res: Response | any) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[API /api/orders/my-orders] Request Method:', req.method);
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
        success: false,
        message: 'Authentication required. Please log in to view your orders.'
      });
    }

    const decoded = verifyJwtToken(rawToken);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }

    const customerId = decoded.id;
    const customerEmail = decoded.email?.toLowerCase();
    const customerPhone = decoded.phone ? decoded.phone.replace(/\D/g, '').slice(-10) : null;

    console.log('[API /api/orders/my-orders] Fetching orders for:', { customerId, customerEmail, customerPhone });

    const supabase = getSupabase();
    let orders: any[] = [];

    if (supabase) {
      // Query Supabase orders table
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase Fetch Orders Error]:', error);
      }

      if (data && data.length > 0) {
        orders = data;
      } else {
        // Also check if any orders were saved with matching email or phone in metadata
        const { data: allOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (allOrders) {
          orders = allOrders.filter((ord: any) => {
            const addr = ord.shipping_address || {};
            const emailMatch = customerEmail && (addr.email?.toLowerCase() === customerEmail || ord.customer_email?.toLowerCase() === customerEmail);
            const phoneMatch = customerPhone && (addr.phone?.includes(customerPhone) || ord.customer_phone?.includes(customerPhone));
            return ord.customer_id === customerId || emailMatch || phoneMatch;
          });
        }
      }
    }

    if (!orders || orders.length === 0) {
      // In-memory fallback
      orders = inMemoryOrders.filter((ord) => {
        const addr = ord.shipping_address || {};
        const emailMatch = customerEmail && addr.email?.toLowerCase() === customerEmail;
        const phoneMatch = customerPhone && addr.phone?.includes(customerPhone);
        return ord.customer_id === customerId || emailMatch || phoneMatch;
      });
    }

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (err: any) {
    console.error('[API /api/orders/my-orders] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong while fetching your orders. Please try again.',
      details: err?.message
    });
  }
}

export default handleMyOrders;
