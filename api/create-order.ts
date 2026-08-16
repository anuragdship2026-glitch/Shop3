import type { Request, Response } from 'express';
import {
  getSupabase,
  generateJwtToken,
  sendResendEmail,
  getOrderConfirmationEmailHtml,
  inMemoryCustomers,
  inMemoryOrders
} from './lib/supabase';

// In-memory order log fallback for tracking & dashboard
export const orderHistory: any[] = inMemoryOrders;

export async function handleCreateOrder(req: Request | any, res: Response | any) {
  console.log('====== [API /api/create-order] CALLED ======');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Method:', req.method);
  console.log('Request Body:', JSON.stringify(req.body, null, 2));

  try {
    const body = req.body || {};
    const cust = body.customer || {};

    // Extract customer details supporting both flat and nested structures
    const customerName = (body.customerName || body.name || cust.name || '').trim();
    const phone = (body.phone || cust.phone || '').trim();
    const email = (body.email || cust.email || '').trim();
    const address = (body.address || cust.address || '').trim();
    const city = (body.city || cust.city || '').trim();
    const state = (body.state || cust.state || '').trim();
    const pincode = (body.pincode || cust.pincode || '').trim();
    const cartItems = body.cartItems || [];
    const paymentMethod = body.paymentMethod || 'Prepaid UPI/Razorpay';
    const razorpayPaymentId = body.razorpayPaymentId || body.razorpay_payment_id || '';
    const razorpayOrderId = body.razorpayOrderId || body.razorpay_order_id || '';
    const finalAmount = Number(body.finalAmount || body.amount || 0);
    const codFee = Number(body.codFee || 0);

    if (!customerName || !phone || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.warn('[API /api/create-order] Missing mandatory fields:', { customerName, phone, itemsCount: cartItems.length });
      return res.status(400).json({
        success: false,
        error: 'Missing required customer information or cart items.'
      });
    }

    const isCOD = paymentMethod === 'COD' || paymentMethod === 'cash_on_delivery' || paymentMethod.includes('COD');
    const isPrepaid = !isCOD;

    // Generate Unique IDs
    const generatedOrderNum = Math.floor(100000 + Math.random() * 900000);
    const localOrderId = `IND-${generatedOrderNum}`;
    const orderNumberStr = `#${generatedOrderNum}`;
    const trackingNumber = `DEL${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const nowIso = new Date().toISOString();

    // Delivery calculation (3-5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDeliveryStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const cleanPhoneDigits = phone.replace(/\D/g, '');
    const cleanEmail = email ? email.toLowerCase() : null;

    // 1. SUPABASE CUSTOMER FIND OR CREATE
    const supabase = getSupabase();
    let customerRecord: any = null;

    if (supabase) {
      // Look up existing customer
      let query = supabase.from('customers').select('*');
      if (cleanEmail) {
        query = query.eq('email', cleanEmail);
      } else if (cleanPhoneDigits) {
        query = query.eq('phone', cleanPhoneDigits);
      }

      const { data: matchedCust } = await query.limit(1);

      if (matchedCust && matchedCust.length > 0) {
        customerRecord = matchedCust[0];
        // Update name or last_login if needed
        await supabase
          .from('customers')
          .update({
            last_login: nowIso,
            name: customerName || customerRecord.name,
            phone: cleanPhoneDigits || customerRecord.phone,
            email: cleanEmail || customerRecord.email
          })
          .eq('id', customerRecord.id);
      } else {
        // Create new customer in Supabase
        const newCust = {
          name: customerName,
          email: cleanEmail || undefined,
          phone: cleanPhoneDigits || undefined,
          created_at: nowIso,
          last_login: nowIso
        };

        const { data: createdCust, error: custErr } = await supabase
          .from('customers')
          .insert([newCust])
          .select('*');

        if (custErr) {
          console.error('[Supabase Customer Creation Error]:', custErr);
          customerRecord = {
            id: `cust_${Date.now()}`,
            ...newCust
          };
        } else if (createdCust && createdCust.length > 0) {
          customerRecord = createdCust[0];
        }
      }
    } else {
      // In-memory customer management
      let found = inMemoryCustomers.find(
        (c) => (cleanEmail && c.email === cleanEmail) || (cleanPhoneDigits && c.phone === cleanPhoneDigits)
      );

      if (found) {
        found.last_login = nowIso;
        found.name = customerName;
        customerRecord = found;
      } else {
        customerRecord = {
          id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          email: cleanEmail,
          phone: cleanPhoneDigits,
          name: customerName,
          created_at: nowIso,
          last_login: nowIso
        };
        inMemoryCustomers.push(customerRecord);
      }
    }

    const customerId = customerRecord?.id || `cust_${Date.now()}`;

    // Generate JWT auth session token for auto-login
    const sessionToken = generateJwtToken({
      id: customerId,
      email: cleanEmail,
      phone: cleanPhoneDigits,
      name: customerName
    });

    // 2. SHOPIFY ORDER CREATION
    const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || 'indigoandco.myshopify.com').trim();
    const shopDomain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    const accessToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();

    const last10Digits = cleanPhoneDigits.slice(-10);
    const formattedPhone =
      last10Digits.length === 10
        ? `+91${last10Digits}`
        : phone.startsWith('+')
        ? phone
        : `+91${cleanPhoneDigits}`;

    const nameParts = customerName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Line items for Shopify
    const lineItems: any[] = cartItems.map((item: any) => {
      const prod = item?.product || {};
      let unitPrice = Number(prod.sellPrice || prod.price || 0);

      if (item?.selectedBundleId && Array.isArray(prod.bundles)) {
        const bundle = prod.bundles.find((b: any) => b.id === item.selectedBundleId);
        if (bundle && item.quantity > 0) {
          unitPrice = Math.round(Number(bundle.price) / Number(item.quantity));
        }
      }

      const lineItemObj: any = {
        title: prod.name || 'Indigo & Co. Product',
        price: (unitPrice > 0 ? unitPrice : 899).toString(),
        quantity: Number(item?.quantity) || 1
      };

      if (item?.selectedSize) {
        lineItemObj.variant_title = `Size: ${item.selectedSize}`;
      }

      return lineItemObj;
    });

    if (isCOD && codFee > 0) {
      lineItems.push({
        title: 'COD Convenience Charge',
        price: codFee.toString(),
        quantity: 1
      });
    }

    const shopifyOrderPayload: any = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail || undefined,
          phone: formattedPhone
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address || 'Main Delivery Address',
          city: city || 'City',
          province: state || 'State',
          zip: pincode || '110001',
          country: 'India',
          phone: formattedPhone
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address || 'Main Delivery Address',
          city: city || 'City',
          province: state || 'State',
          zip: pincode || '110001',
          country: 'India',
          phone: formattedPhone
        },
        financial_status: isPrepaid ? 'paid' : 'pending',
        payment_gateway_names: isPrepaid ? ['razorpay'] : ['cash_on_delivery'],
        tags: 'website-order',
        note: isPrepaid
          ? `Prepaid Order via Razorpay. Payment ID: ${razorpayPaymentId || 'N/A'}. Phone: ${formattedPhone}`
          : `Cash on Delivery Order. Collect ₹${finalAmount} on delivery. Phone: ${formattedPhone}`,
        note_attributes: [
          { name: 'PaymentMethod', value: isPrepaid ? 'Razorpay' : 'Cash on Delivery' },
          { name: 'RazorpayPaymentID', value: razorpayPaymentId || 'N/A' },
          { name: 'TrackingNumber', value: trackingNumber }
        ]
      }
    };

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

    let shopifyOrderId: string | null = null;
    let shopifyOrderNumber: string | null = null;
    let pushedToShopify = false;

    if (accessToken) {
      const shopifyUrl = `https://${shopDomain}/admin/api/2024-01/orders.json`;
      console.log(`[Shopify API] Sending POST to ${shopifyUrl}...`);

      try {
        const shopifyRes = await fetch(shopifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          },
          body: JSON.stringify(shopifyOrderPayload)
        });

        console.log(`[Shopify API] Status: ${shopifyRes.status} ${shopifyRes.statusText}`);

        if (shopifyRes.ok) {
          const shopifyData = await shopifyRes.json();
          const createdShopifyOrder = shopifyData?.order || {};
          shopifyOrderId = createdShopifyOrder.id ? createdShopifyOrder.id.toString() : null;
          shopifyOrderNumber = createdShopifyOrder.name || (createdShopifyOrder.order_number ? `#${createdShopifyOrder.order_number}` : null);
          pushedToShopify = true;
          console.log('[Shopify API] Order created in Shopify:', { shopifyOrderId, shopifyOrderNumber });
        } else {
          const errText = await shopifyRes.text();
          console.error('[Shopify API] Error creating order:', errText);
        }
      } catch (shopErr) {
        console.error('[Shopify API] Fetch failed:', shopErr);
      }
    } else {
      console.warn('[Shopify API] SHOPIFY_ADMIN_ACCESS_TOKEN not configured.');
    }

    const shippingAddressObj = {
      name: customerName,
      phone,
      email: cleanEmail || '',
      address,
      city,
      state,
      pincode,
      country: 'India'
    };

    const subtotal = (finalAmount || 0) - (codFee || 0);

    // 3. SAVE TO SUPABASE ORDERS TABLE
    const finalOrderNumber = shopifyOrderNumber || orderNumberStr;
    const finalOrderId = shopifyOrderId ? `SHOPIFY-${shopifyOrderId}` : localOrderId;

    const dbOrderPayload = {
      id: finalOrderId,
      customer_id: customerId,
      shopify_order_id: shopifyOrderId,
      order_number: finalOrderNumber,
      tracking_id: trackingNumber,
      items: cartItems,
      shipping_address: shippingAddressObj,
      payment_method: isCOD ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay / UPI)',
      subtotal,
      cod_fee: codFee || 0,
      final_amount: finalAmount || 0,
      status: 'Confirmed',
      razorpay_payment_id: razorpayPaymentId || null,
      created_at: nowIso,
      estimated_delivery: estimatedDeliveryStr
    };

    if (supabase) {
      const { error: orderInsertErr } = await supabase.from('orders').insert([dbOrderPayload]);
      if (orderInsertErr) {
        console.error('[Supabase Order Insert Error]:', orderInsertErr);
      } else {
        console.log('[Supabase Order Insert] Saved order to Supabase orders table:', finalOrderId);
      }
    }

    // Always keep in local memory array as fallback
    inMemoryOrders.unshift(dbOrderPayload);

    // 4. SEND ORDER CONFIRMATION EMAIL VIA RESEND
    if (cleanEmail) {
      const confirmationEmailHtml = getOrderConfirmationEmailHtml({
        orderNumber: finalOrderNumber,
        trackingNumber,
        customerName,
        items: cartItems,
        subtotal,
        codFee,
        finalAmount,
        paymentMethod: isCOD ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay / UPI)',
        estimatedDelivery: estimatedDeliveryStr,
        shippingAddress: shippingAddressObj
      });

      sendResendEmail({
        to: cleanEmail,
        subject: `Order Confirmed: ${finalOrderNumber} - Indigo & Co.`,
        html: confirmationEmailHtml
      }).catch((emailErr) => {
        console.error('[Resend Email Catch Error]:', emailErr);
      });
    }

    console.log('[API /api/create-order] Order processing complete!', {
      orderId: finalOrderId,
      orderNumber: finalOrderNumber,
      trackingNumber,
      customerId,
      pushedToShopify
    });

    return res.status(200).json({
      success: true,
      orderId: finalOrderId,
      orderNumber: finalOrderNumber,
      shopifyOrderId,
      trackingId: trackingNumber,
      trackingNumber,
      estimatedDelivery: estimatedDeliveryStr,
      pushedToShopify,
      token: sessionToken,
      customer: customerRecord,
      order: dbOrderPayload,
      message: 'Order created successfully!'
    });
  } catch (err: any) {
    console.error('[API /api/create-order] Fatal Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process order creation',
      details: err?.message || 'Server error'
    });
  }
}

export default handleCreateOrder;
