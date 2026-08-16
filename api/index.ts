import express from 'express';
import { handleCreateOrder, orderHistory } from './create-order';
import { handleSendOtp } from './auth/send-otp';
import { handleVerifyOtp } from './auth/verify-otp';
import { handleSession } from './auth/session';
import { handleLogout } from './auth/logout';
import { handleMyOrders } from './orders/my-orders';

const app = express();

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Enable JSON and URL-encoded request body parsing with increased size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health / Status Check Endpoint
app.get('/api/health', (req, res) => {
  const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || 'indigoandco.myshopify.com').trim();
  const cleanDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();
  const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const fast2smsKey = (process.env.FAST2SMS_API_KEY || '').trim();

  res.json({
    status: 'ok',
    storeDomain: cleanDomain,
    shopifyConnected: Boolean(accessToken),
    supabaseConnected: Boolean(supabaseUrl),
    resendConfigured: Boolean(resendKey),
    fast2smsConfigured: Boolean(fast2smsKey),
    razorpayConfigured: Boolean(process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID)
  });
});

// Authentication Endpoints
app.post('/api/auth/send-otp', handleSendOtp);
app.post('/api/auth/verify-otp', handleVerifyOtp);
app.get('/api/auth/session', handleSession);
app.post('/api/auth/session', handleSession);
app.post('/api/auth/logout', handleLogout);
app.get('/api/auth/logout', handleLogout);

// Orders Endpoints
app.get('/api/orders/my-orders', handleMyOrders);
app.post('/api/orders/my-orders', handleMyOrders);
app.get('/api/my-orders', handleMyOrders);
app.post('/api/my-orders', handleMyOrders);
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: orderHistory.length, orders: orderHistory });
});
app.post('/api/create-order', handleCreateOrder);
app.post('/api/orders/create', handleCreateOrder);

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Internal Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err?.message || 'An unexpected error occurred' });
});

export default app;
