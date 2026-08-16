import express from 'express';
import { handleCreateOrder, orderHistory } from './create-order';

const app = express();

// Enable JSON and URL-encoded request body parsing with increased size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health / Status Check Endpoint
app.get('/api/health', (req, res) => {
  const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
  const cleanDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();

  const isShopifyConfigured = Boolean(cleanDomain && accessToken);
  res.json({
    status: 'ok',
    shopifyConnected: isShopifyConfigured,
    storeDomain: cleanDomain || 'Not Configured (Using Local Backend Mode)',
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID || 'rzp_test_TQMuUQaF5RTDps')
  });
});

// Get recent orders endpoint
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: orderHistory.length, orders: orderHistory });
});

// Create Order Endpoints (Serves both /api/create-order and /api/orders/create)
app.post('/api/create-order', handleCreateOrder);
app.post('/api/orders/create', handleCreateOrder);

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Internal Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err?.message || 'An unexpected error occurred' });
});

export default app;
