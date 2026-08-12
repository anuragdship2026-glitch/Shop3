import express from 'express';

const app = express();

// Enable JSON and URL-encoded request body parsing with increased size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// In-memory order log for orders placed through the app
const orderHistory: any[] = [];

// Health / Status Check Endpoint
app.get('/api/health', (req, res) => {
  const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
  const cleanDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();

  const isShopifyConfigured = Boolean(cleanDomain && accessToken);
  res.json({
    status: 'ok',
    shopifyConnected: isShopifyConfigured,
    storeDomain: cleanDomain || 'Not Configured (Using Local Backend Mode)'
  });
});

// Get recent orders endpoint
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: orderHistory.length, orders: orderHistory });
});

// Create & Push Order to Shopify API Endpoint
app.post('/api/orders/create', async (req, res) => {
  try {
    const orderData = req.body || {};
    const { customerName, phone, address, city, state, pincode, cartItems, paymentMethod, finalAmount, codFee } = orderData;

    if (!customerName || !phone || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Missing required customer or item details' });
    }

    // Record locally in backend history
    const localOrder = {
      id: 'IND-' + Math.floor(100000 + Math.random() * 900000),
      trackingNumber: 'DEL' + Math.floor(1000000000 + Math.random() * 9000000000),
      customerName,
      phone,
      address: `${address || ''}, ${city || ''}, ${state || ''} - ${pincode || ''}`,
      items: cartItems,
      paymentMethod: paymentMethod || 'COD',
      totalAmount: (finalAmount || 0) - (codFee || 0),
      codFee: codFee || 0,
      finalAmount: finalAmount || 0,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    orderHistory.push(localOrder);

    // Check if Shopify credentials are provided
    const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
    const shopDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();

    if (shopDomain && accessToken) {
      try {
        const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
        const last10Digits = cleanPhoneDigits.slice(-10);
        const formattedPhone = last10Digits.length === 10 ? `+91${last10Digits}` : (phone.startsWith('+') ? phone : `+91${cleanPhoneDigits}`);

        // Format line items for Shopify REST / GraphQL Admin API
        const lineItems: any[] = cartItems.map((item: any) => {
          const prod = item?.product || {};
          let unitPrice = Number(prod.sellPrice || prod.price || 0);
          if (item?.selectedBundleId && Array.isArray(prod.bundles)) {
            const bundle = prod.bundles.find((b: any) => b.id === item.selectedBundleId);
            if (bundle && item.quantity > 0) {
              unitPrice = Math.round(Number(bundle.price) / Number(item.quantity));
            }
          }
          return {
            title: prod.name || 'Product Item',
            price: unitPrice.toString(),
            quantity: Number(item?.quantity) || 1,
            variant_title: item?.selectedSize ? `Size: ${item.selectedSize}` : undefined
          };
        });

        // Add COD Fee as a line item if applicable
        if (paymentMethod === 'COD' && codFee > 0) {
          lineItems.push({
            title: 'COD Convenience Charge',
            price: codFee.toString(),
            quantity: 1
          });
        }

        const shopifyOrderPayload = {
          order: {
            line_items: lineItems,
            customer: {
              first_name: customerName.split(' ')[0] || customerName,
              last_name: customerName.split(' ').slice(1).join(' ') || 'Customer',
              phone: formattedPhone
            },
            shipping_address: {
              first_name: customerName,
              address1: address || 'Main Address',
              city: city || 'City',
              province: state || 'State',
              zip: pincode || '110001',
              country: 'India',
              phone: formattedPhone
            },
            financial_status: paymentMethod === 'COD' ? 'pending' : 'paid',
            payment_gateway_names: paymentMethod === 'COD' ? ['Cash on Delivery (COD)'] : ['Prepaid Online'],
            tags: 'React Applet, COD App',
            note: `Placed via Custom React Landing Page. Payment: ${paymentMethod}`
          }
        };

        const shopifyResponse = await fetch(`https://${shopDomain}/admin/api/2024-01/orders.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          },
          body: JSON.stringify(shopifyOrderPayload)
        });

        if (shopifyResponse.ok) {
          const shopifyData = await shopifyResponse.json();
          return res.json({
            success: true,
            pushedToShopify: true,
            shopifyOrder: shopifyData.order,
            localOrder
          });
        } else {
          const errText = await shopifyResponse.text();
          console.error('Shopify API Order Push Error:', errText);
          return res.json({
            success: true,
            pushedToShopify: false,
            shopifyError: errText,
            localOrder,
            message: 'Order saved locally! Please verify Shopify API token permissions.'
          });
        }
      } catch (shopifyErr: any) {
        console.error('Shopify Connection Error:', shopifyErr);
        return res.json({
          success: true,
          pushedToShopify: false,
          localOrder,
          message: 'Order saved locally.'
        });
      }
    }

    return res.json({
      success: true,
      pushedToShopify: false,
      localOrder,
      message: 'Order saved in app backend! Add SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in env variables to sync with Shopify Admin.'
    });

  } catch (err: any) {
    console.error('Order creation endpoint error:', err);
    res.status(500).json({ error: 'Failed to process order creation', details: err?.message || 'Unknown error' });
  }
});

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Internal Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err?.message || 'An unexpected error occurred' });
});

export default app;
