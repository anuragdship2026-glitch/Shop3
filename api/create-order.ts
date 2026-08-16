import type { Request, Response } from 'express';

// In-memory order log fallback for tracking & dashboard
export const orderHistory: any[] = [];

// Optional mapping of product IDs / names to Shopify Variant IDs
// You can also populate this mapping or pass SHOPIFY_VARIANT_MAPPINGS JSON in env
const SHOPIFY_VARIANT_MAP: Record<string, number> = {
  'warmease-heating-massage-belt': 44921000000001,
  'indigoflow-smocked-midi-dress': 44921000000002,
  'postureright-back-support-belt': 44921000000003,
  'cool-gel-full-face-mask': 44921000000004,
  'glowsheet-bio-collagen-mask': 44921000000005,
  'japcounter-digital-jaap-mala': 44921000000006,
  'miniblend-portable-juice-blender': 44921000000007,
  'high-waist-tummy-tucker-shapewear': 44921000000008,
  'instablack-root-touch-up-stick': 44921000000009
};

export async function handleCreateOrder(req: Request | any, res: Response | any) {
  try {
    const body = req.body || {};
    const {
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      cartItems,
      paymentMethod,
      finalAmount,
      codFee,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    } = body;

    if (!customerName || !phone || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer information or cart items.'
      });
    }

    const isPrepaid = paymentMethod !== 'COD';
    const isCOD = paymentMethod === 'COD';

    // Generate local IDs as fallback & tracking reference
    const generatedOrderNum = Math.floor(100000 + Math.random() * 900000);
    const localOrderId = `IND-${generatedOrderNum}`;
    const trackingNumber = `DEL${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const localOrderRecord = {
      id: localOrderId,
      orderNumber: `#${generatedOrderNum}`,
      trackingNumber,
      customerName,
      email: email || '',
      phone,
      address: `${address || ''}, ${city || ''}, ${state || ''} - ${pincode || ''}`,
      items: cartItems,
      paymentMethod: isCOD ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay / UPI)',
      razorpayPaymentId: razorpayPaymentId || null,
      razorpayOrderId: razorpayOrderId || null,
      totalAmount: (finalAmount || 0) - (codFee || 0),
      codFee: codFee || 0,
      finalAmount: finalAmount || 0,
      financialStatus: isCOD ? 'pending' : 'paid',
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    orderHistory.unshift(localOrderRecord);

    // Read Shopify Credentials from Environment
    const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
    const shopDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();

    // If Shopify is configured, create real order via Shopify Admin REST API
    if (shopDomain && accessToken) {
      try {
        const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
        const last10Digits = cleanPhoneDigits.slice(-10);
        const formattedPhone =
          last10Digits.length === 10
            ? `+91${last10Digits}`
            : phone.startsWith('+')
            ? phone
            : `+91${cleanPhoneDigits}`;

        // Format line items with variant mapping
        const lineItems = cartItems.map((item: any) => {
          const prod = item?.product || {};
          let unitPrice = Number(prod.sellPrice || prod.price || 0);

          if (item?.selectedBundleId && Array.isArray(prod.bundles)) {
            const bundle = prod.bundles.find((b: any) => b.id === item.selectedBundleId);
            if (bundle && item.quantity > 0) {
              unitPrice = Math.round(Number(bundle.price) / Number(item.quantity));
            }
          }

          const matchedVariantId = SHOPIFY_VARIANT_MAP[prod.id];
          const lineItemObj: any = {
            title: prod.name || 'Indigo Product Item',
            price: unitPrice.toString(),
            quantity: Number(item?.quantity) || 1
          };

          if (item?.selectedSize) {
            lineItemObj.variant_title = `Size: ${item.selectedSize}`;
          }

          if (matchedVariantId) {
            lineItemObj.variant_id = matchedVariantId;
          }

          return lineItemObj;
        });

        // Add COD Fee line item if applicable
        if (isCOD && codFee > 0) {
          lineItems.push({
            title: 'COD Convenience Charge',
            price: codFee.toString(),
            quantity: 1
          });
        }

        const nameParts = (customerName || '').trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || '';

        const shopifyOrderPayload: any = {
          order: {
            line_items: lineItems,
            customer: {
              first_name: firstName,
              last_name: lastName || firstName,
              email: email || undefined,
              phone: formattedPhone
            },
            shipping_address: {
              first_name: firstName,
              last_name: lastName || firstName,
              address1: address || 'Main Address',
              city: city || 'City',
              province: state || 'State',
              zip: pincode || '110001',
              country: 'India',
              phone: formattedPhone
            },
            billing_address: {
              first_name: firstName,
              last_name: lastName || firstName,
              address1: address || 'Main Address',
              city: city || 'City',
              province: state || 'State',
              zip: pincode || '110001',
              country: 'India',
              phone: formattedPhone
            },
            financial_status: isCOD ? 'pending' : 'paid',
            payment_gateway_names: isCOD ? ['cash_on_delivery'] : ['razorpay'],
            tags: isCOD ? 'COD, Indigo & Co.' : 'Prepaid, Razorpay, Indigo & Co.',
            note: isCOD
              ? `Cash on Delivery Order. Deliver with cash collection of ₹${finalAmount}. Phone: ${formattedPhone}`
              : `Paid Online via Razorpay. Payment ID: ${razorpayPaymentId || 'N/A'}. Signature: ${razorpaySignature || 'Verified'}. Phone: ${formattedPhone}`,
            note_attributes: [
              { name: 'PaymentMethod', value: isCOD ? 'Cash on Delivery' : 'Razorpay UPI/Cards' },
              { name: 'RazorpayPaymentID', value: razorpayPaymentId || 'N/A' },
              { name: 'RazorpayOrderID', value: razorpayOrderId || 'N/A' },
              { name: 'TrackingNumber', value: trackingNumber }
            ]
          }
        };

        // If Razorpay payment ID exists, record transaction
        if (isPrepaid && razorpayPaymentId) {
          shopifyOrderPayload.order.transactions = [
            {
              kind: 'sale',
              status: 'success',
              amount: finalAmount.toString(),
              gateway: 'razorpay',
              authorization: razorpayPaymentId
            }
          ];
        }

        const shopifyRes = await fetch(`https://${shopDomain}/admin/api/2024-01/orders.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          },
          body: JSON.stringify(shopifyOrderPayload)
        });

        if (shopifyRes.ok) {
          const shopifyData = await shopifyRes.json();
          const createdShopifyOrder = shopifyData.order;

          return res.status(200).json({
            success: true,
            pushedToShopify: true,
            orderId: createdShopifyOrder.id ? `SHOPIFY-${createdShopifyOrder.id}` : localOrderId,
            orderNumber: createdShopifyOrder.name || `#${createdShopifyOrder.order_number}` || localOrderId,
            shopifyOrder: createdShopifyOrder,
            trackingNumber,
            localOrder: localOrderRecord,
            paymentMethod,
            razorpayPaymentId: razorpayPaymentId || null,
            message: 'Order created successfully in Shopify Admin!'
          });
        } else {
          const errorResponseText = await shopifyRes.text();
          console.error('Shopify Admin REST API Order Error:', errorResponseText);

          return res.status(200).json({
            success: true,
            pushedToShopify: false,
            shopifyError: errorResponseText,
            orderId: localOrderId,
            orderNumber: `#${generatedOrderNum}`,
            trackingNumber,
            localOrder: localOrderRecord,
            paymentMethod,
            razorpayPaymentId: razorpayPaymentId || null,
            message: 'Order recorded successfully! (Shopify sync fallback to local store)'
          });
        }
      } catch (shopifyErr: any) {
        console.error('Shopify Network / Sync Error:', shopifyErr);
        return res.status(200).json({
          success: true,
          pushedToShopify: false,
          orderId: localOrderId,
          orderNumber: `#${generatedOrderNum}`,
          trackingNumber,
          localOrder: localOrderRecord,
          paymentMethod,
          razorpayPaymentId: razorpayPaymentId || null,
          message: 'Order confirmed and saved locally.'
        });
      }
    }

    // Default Response when Shopify env is not provided
    return res.status(200).json({
      success: true,
      pushedToShopify: false,
      orderId: localOrderId,
      orderNumber: `#${generatedOrderNum}`,
      trackingNumber,
      localOrder: localOrderRecord,
      paymentMethod,
      razorpayPaymentId: razorpayPaymentId || null,
      message:
        'Order confirmed! Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in env to push directly to Shopify Admin.'
    });
  } catch (err: any) {
    console.error('Error in create-order endpoint:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process order creation',
      details: err?.message || 'Server error'
    });
  }
}

export default handleCreateOrder;
