import type { Request, Response } from 'express';
import {
  getSupabase,
  generateJwtToken,
  sendResendEmail,
  getOrderConfirmationEmailHtml,
  inMemoryCustomers,
  inMemoryOrders
} from './lib/supabase.js';

// In-memory order log fallback for tracking & dashboard
export const orderHistory: any[] = inMemoryOrders;

export async function handleCreateOrder(req: Request | any, res: Response | any) {
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

  console.log('====== [API /api/create-order] CALLED ======');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Method:', req.method);
  console.log('Request Body:', JSON.stringify(body, null, 2));

  try {
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
          .select()
          .single();

        if (custErr) {
          console.error('[Supabase Customer Creation Error]:', custErr);
          customerRecord = {
            id: `cust_${Date.now()}`,
            ...newCust
          };
        } else if (createdCust) {
          customerRecord = createdCust;
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

    // 2. SHOPIFY ADMIN REST API ORDER CREATION
    const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'indigoandco.myshopify.com';

    console.log('Shopify token exists:', !!SHOPIFY_TOKEN);
    console.log('Shopify token prefix:', SHOPIFY_TOKEN?.substring(0, 10));

    let shopifyOrderId: string | null = null;
    let shopifyOrderNumber: string | null = null;
    let pushedToShopify = false;

    try {
      const shopifyResponse = await fetch(
        `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_TOKEN || ''
          },
          body: JSON.stringify({
            order: {
              line_items: cartItems.map((item: any) => ({
                title: item.product?.name || item.product?.title || 'Product',
                quantity: item.quantity || 1,
                price: String(item.product?.sellPrice || item.product?.price || 0)
              })),
              customer: {
                first_name: customerName?.split(' ')[0] || customerName,
                last_name: customerName?.split(' ').slice(1).join(' ') || '',
                email: email,
                phone: phone
              },
              shipping_address: {
                first_name: customerName?.split(' ')[0] || customerName,
                last_name: customerName?.split(' ').slice(1).join(' ') || '',
                address1: address,
                city: city,
                province: state,
                zip: pincode,
                country_code: 'IN',
                phone: phone
              },
              financial_status: paymentMethod === 'COD' ? 'pending' : 'paid',
              tags: 'website-order,indigoandco',
              note: `Payment: ${paymentMethod} | Source: indigoandco.in`,
              send_receipt: true
            }
          })
        }
      );

      const shopifyData = await shopifyResponse.json();
      console.log('Shopify response status:', shopifyResponse.status);
      console.log('Shopify response:', JSON.stringify(shopifyData));

      if (!shopifyResponse.ok) {
        console.error('Shopify error:', JSON.stringify(shopifyData));
      }

      const shopifyOrder = shopifyData.order;
      shopifyOrderId = shopifyOrder?.id?.toString() || null;
      shopifyOrderNumber = shopifyOrder?.order_number?.toString() || null;

      if (shopifyOrderId) {
        pushedToShopify = true;
      }

      console.log('Shopify order created:', shopifyOrderId, shopifyOrderNumber);
    } catch (shopErr) {
      console.error('[Shopify Admin API] Order create fetch failed:', shopErr);
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
    const finalOrderNumber = shopifyOrderNumber ? `#${shopifyOrderNumber}` : orderNumberStr;
    const finalOrderId = shopifyOrderId ? `SHOPIFY-${shopifyOrderId}` : localOrderId;

    // Check if customer ID is a valid UUID
    const isCustomerUuid = customerRecord?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerRecord.id);

    const supabaseOrderPayload = {
      customer_id: isCustomerUuid ? customerRecord.id : null,
      tracking_id: trackingNumber,
      items: cartItems,
      shipping_address: shippingAddressObj,
      payment_method: isCOD ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay / UPI)',
      final_amount: finalAmount || 0,
      cod_fee: codFee || 0,
      status: 'Confirmed',
      estimated_delivery: estimatedDeliveryStr
    };

    let createdSupabaseOrder: any = null;

    if (supabase) {
      const { data: order, error: orderInsertErr } = await supabase
        .from('orders')
        .insert(supabaseOrderPayload)
        .select()
        .single();

      if (orderInsertErr) {
        console.error('[Supabase Order Insert Error]:', orderInsertErr);
      } else {
        createdSupabaseOrder = order;
        console.log('[Supabase Order Insert] Saved order with auto-generated UUID:', order?.id);
      }
    }

    const finalOrderObject = {
      id: createdSupabaseOrder?.id || finalOrderId,
      customer_id: customerRecord?.id || customerId,
      shopify_order_id: shopifyOrderId,
      shopify_order_number: shopifyOrderNumber,
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

    // Always keep in local memory array as fallback
    inMemoryOrders.unshift(finalOrderObject);

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
      shopifyOrderNumber,
      trackingId: trackingNumber,
      trackingNumber,
      estimatedDelivery: estimatedDeliveryStr,
      pushedToShopify,
      token: sessionToken,
      customer: customerRecord,
      order: finalOrderObject,
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
