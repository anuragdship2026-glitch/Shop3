import { Product, Review, SizeChartRow } from '../types';

export const HERO_PRODUCTS_COUNT = 4;

export const PRODUCTS: Product[] = [
  {
    id: 'instablack-touchup-stick',
    name: 'InstaBlack 2-in-1 Root Touch-Up Stick',
    supplier: 'Dropship India',
    cost: 200,
    sellPrice: 599,
    mrp: 1299,
    category: 'Beauty & Hair',
    isHero: true,
    tag: 'Running Ad | Best Seller',
    rating: 4.8,
    reviewCount: 3840,
    happyCustomersText: '36,000+ Happy Customers',
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Instant Grey Hair Coverage & Root Touch-Up with Dual Comb Applicator. Sweatproof & Water-Resistant.',
    description: 'InstaBlack 2-in-1 Root Touch-Up Stick is your ultimate quick fix for instant grey hair coverage between salon visits. Formulated with natural botanical extracts and charcoal pigments, it glides smoothly on your hairline, roots, and sideburns without flaking or clumping.',
    features: [
      'Instant 10-Second Grey Coverage for Hairline & Roots',
      '2-in-1 Precision Applicator Comb + Crayon Stick',
      'Waterproof, Sweatproof & Smudge-Proof All-Day Formula',
      'Washes off easily with regular hair shampoo',
      'Compact lipstick-sized tube for quick handbag touch-ups'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: 'Instant Coverage', subtitle: '10-sec grey fix' },
      { iconName: 'Droplets', title: 'Sweatproof', subtitle: 'Lasts all day' },
      { iconName: 'ShieldCheck', title: 'Safe Formula', subtitle: 'No harsh chemicals' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Piece',
        price: 599,
        originalPrice: 1299,
        savingsText: 'You save 54%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (Recommended)',
        price: 999,
        originalPrice: 2598,
        savingsText: 'You save 62%',
        isPopular: true
      }
    ]
  },
  {
    id: 'japcounter-digital-jaap-mala',
    name: 'JapCounter™ Digital Jaap Mala with Tally Counter',
    supplier: 'Dropship India',
    cost: 250,
    sellPrice: 699,
    mrp: 1499,
    category: 'Spiritual & Devotion',
    isHero: true,
    tag: 'Trending Spiritual Gear',
    rating: 4.9,
    reviewCount: 4120,
    happyCustomersText: '45,000+ Devotees Trust Us',
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Handheld Smart Digital Tally Counter for Mantras, Jaap & Prayers with Soft Ring Finger Grip.',
    description: 'JapCounter™ Digital Jaap Mala combines traditional devotion with modern digital convenience. Features smooth scrolling roller wheel, clear LED tally counter display, auto-sleep battery saving mode, and ergonomic wood-texture body with traditional tassel.',
    features: [
      'One-Touch Smooth Scroll Counter with LCD Display',
      'Built-in Reset Button for 108 Chant Tracking',
      'Ergonomic Ring Grip suitable for all finger sizes',
      'Long-lasting replaced button battery included',
      'Ideal for Radhe Radhe, Mahamrityunjaya, Gayatri Mantra jaap'
    ],
    keyIcons: [
      { iconName: 'RotateCcw', title: 'One-Touch Reset', subtitle: 'Easy 108 tracking' },
      { iconName: 'Battery', title: 'Long Battery Life', subtitle: '6+ months standby' },
      { iconName: 'Heart', title: 'Ergonomic Grip', subtitle: 'Comfortable holding' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Piece',
        price: 699,
        originalPrice: 1499,
        savingsText: 'You save 53%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (For Family/Gifting)',
        price: 1199,
        originalPrice: 2998,
        savingsText: 'You save 60%',
        isPopular: true
      }
    ]
  },
  {
    id: 'high-waist-tummy-tucker-shapewear',
    name: '4-in-1 High Waist Tummy Tucker Shapewear',
    supplier: 'Dropship India',
    cost: 175,
    sellPrice: 599,
    mrp: 1599,
    category: "Women's Fashion",
    isHero: true,
    tag: 'Viral Bestseller',
    rating: 4.7,
    reviewCount: 5290,
    happyCustomersText: '50,000+ Women Sculpted',
    stockCount: 7,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Instant Tummy Flattening, Waist Sculpting & Thigh Slimming. Seamless & Anti-Roll Silicone Grip.',
    description: 'Get an instant hour-glass silhouette with our 4-in-1 High Waist Tummy Tucker Shapewear. Crafted from ultra-breathable, stretchable Italian microfiber fabric that tucks tummy bulge, lifts buttocks, and slims thighs without showing lines under sarees, dresses, or jeans.',
    features: [
      'Reduces Waistline up to 2 Inches Instantly',
      'Anti-Roll Silicone Strip prevents waistband slipping',
      'Targeted 360° Compression on Tummy & Midsection',
      'Lightweight, Moisture-Wicking Breathable Fabric',
      '100% Invisible under Sarees, Kurtis & Bodycon Dresses'
    ],
    keyIcons: [
      { iconName: 'Layers', title: '360° Sculpting', subtitle: 'Tummy & hip shape' },
      { iconName: 'Feather', title: 'Breathable Fabric', subtitle: 'All-day wearability' },
      { iconName: 'Shield', title: 'Anti-Roll Strip', subtitle: 'Stays in place' }
    ],
    hasSizeGuide: true,
    bundles: [
      {
        id: 'single',
        name: 'Single Piece',
        price: 599,
        originalPrice: 1599,
        savingsText: 'You save 62%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (Beige + Black Combo)',
        price: 999,
        originalPrice: 3198,
        savingsText: 'You save 69%',
        isPopular: true
      }
    ]
  },
  {
    id: 'miniblend-portable-juice-blender',
    name: 'MiniBlend™ Portable USB Electric Juice Blender Bottle',
    supplier: 'Dropship India',
    cost: 295,
    sellPrice: 799,
    mrp: 1699,
    category: 'Wellness & Fitness',
    isHero: true,
    tag: 'Hot Ad Product',
    rating: 4.8,
    reviewCount: 3100,
    happyCustomersText: '28,000+ Smoothie Lovers',
    stockCount: 11,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502741126161-b048400d085d?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Rechargeable 350ml Personal Smoothie Blender with 6 Stainless Steel 3D Blades & Travel Carry Handle.',
    description: 'Blend fresh protein shakes, fruit smoothies, baby food, and iced juices on the go with MiniBlend™. Powerful 1400mAh battery delivers up to 15 blends per single USB charge. Easy self-cleaning mode — just add water, drop of dish soap, and press blend!',
    features: [
      '6 Stainless Steel 3D Serrated Blending Blades',
      'USB Rechargeable (Charge via Powerbank, Laptop, Adapter)',
      'BPA-Free Food Grade PCTG Material with Silicone Strap',
      'Safety Induction Lock prevents blade spinning when open',
      'Ultra Compact 350ml Bottle fits gym bag & car cup holder'
    ],
    keyIcons: [
      { iconName: 'BatteryCharging', title: 'Rechargeable', subtitle: 'USB Fast Charging' },
      { iconName: 'Zap', title: '3D 6 Blades', subtitle: 'Instant 30s Blend' },
      { iconName: 'Luggage', title: 'Travel Friendly', subtitle: 'Lightweight 350ml' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Piece',
        price: 799,
        originalPrice: 1699,
        savingsText: 'You save 53%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (Pink + White)',
        price: 1499,
        originalPrice: 3398,
        savingsText: 'You save 56%',
        isPopular: true
      }
    ]
  },
  {
    id: 'warmease-heating-massage-belt',
    name: 'WarmEase™ Portable Heating & Vibration Massage Belt',
    supplier: 'Dropdash',
    cost: 650,
    sellPrice: 999,
    mrp: 1999,
    category: 'Wellness & Fitness',
    isHero: false,
    rating: 4.9,
    reviewCount: 1890,
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Wireless Fast Heating Pad with 3 Thermal Levels & 6 Vibration Modes for Period Cramp & Back Pain Relief.',
    description: 'Instant soothing comfort during monthly periods or lower back muscle soreness. WarmEase™ heats up in 3 seconds using Graphene technology and delivers gentle vibration massage.',
    features: [
      '3 Heating Temperatures (50°C, 55°C, 60°C)',
      '6 High-Frequency Soothing Vibration Modes',
      'Adjustable Elastic Waist Belt fits all body sizes',
      'USB Rechargeable Wireless Operation'
    ]
  },
  {
    id: 'indigoflow-smocked-midi-dress',
    name: 'IndigoFlow™ Floral Smocked Bodice Midi Dress',
    supplier: 'Dropship India',
    cost: 250,
    sellPrice: 699,
    mrp: 1499,
    category: "Women's Fashion",
    isHero: false,
    rating: 4.6,
    reviewCount: 940,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Flowy & Breathable Cotton Rayon Midi Dress with Stretchable Smocked Bust & Ruffle Sleeves.',
    description: 'A breezy, stylish midi dress designed for effortless grace. Features elasticated smocked bodice that flatters every body shape and soft breathable fabric ideal for Indian climate.',
    features: [
      'Ultra Soft Viscose Rayon Fabric',
      'Stretchable Smocked Chest fits Bust 32" to 42"',
      'Flattering Tiered Midi Length with Ruffle Cap Sleeves'
    ]
  },
  {
    id: 'postureright-back-support-belt',
    name: 'PostureRight™ Unisex Spine & Back Support Corrector Belt',
    supplier: 'Dropship India',
    cost: 180,
    sellPrice: 599,
    mrp: 1299,
    category: 'Wellness & Fitness',
    isHero: false,
    rating: 4.7,
    reviewCount: 1420,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Ergonomic Posture Corrector for Desk Workers & Drivers. Relieves Shoulder & Neck Strain.',
    description: 'Retrain your posture in 21 days! PostureRight™ pulls shoulders back gently to realign your spine, preventing slouching during long hours of computer work or driving.',
    features: [
      'Adjustable Neoprene Straps with Soft Armpit Padding',
      'Lightweight & Discreete under shirt or kurti',
      'Relieves Upper Back, Neck & Shoulder stiffness'
    ]
  },
  {
    id: 'silkfoot-exfoliating-foot-mask',
    name: 'SilkFoot™ AHA Exfoliating Foot Peel Mask Socks',
    supplier: 'Dropship India',
    cost: 180,
    sellPrice: 499,
    mrp: 999,
    category: 'Beauty & Hair',
    isHero: false,
    rating: 4.8,
    reviewCount: 2210,
    stockCount: 22,
    images: [
      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Peels Away Dead Cracked Skin & Calluses in 7 Days for Baby Soft Smooth Feet.',
    description: 'Enriched with botanical fruit acids, lavender oil, and aloe vera. Slip on the booties for 60 minutes, and watch dead skin naturally peel away over 5-7 days.',
    features: [
      'Painless Natural Exfoliation Booties',
      'Removes Stubborn Heel Cracks & Dead Cuticles',
      'Infused with Hydrating Aloe & Lavender'
    ]
  },
  {
    id: 'glowsheet-korean-collagen-mask',
    name: 'GlowSheet™ Korean Overnight Bio-Collagen Face Mask',
    supplier: 'Dropship India',
    cost: 150,
    sellPrice: 449,
    mrp: 899,
    category: 'Beauty & Hair',
    isHero: false,
    rating: 4.9,
    reviewCount: 2850,
    stockCount: 30,
    images: [
      'https://images.unsplash.com/photo-1512290900673-7002fe515286?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Hydrogel Deep Collagen Mask that Turns Transparent Overnight for Glass Skin Glow.',
    description: 'Infused with Oligo-Hyaluronic acid and low-molecular collagen that penetrates deep into skin layers, tightening pores and boosting elasticity overnight.',
    features: [
      'Turns Transparent as Skin Absorbs Active Serum',
      'Deep Pore Minimizing & Hydration Lock',
      'Suitable for All Skin Types including Sensitive'
    ]
  },
  {
    id: 'grindmaster-electric-coffee-grinder',
    name: 'GrindMaster™ Stainless Steel Electric Spice & Coffee Grinder',
    supplier: 'Dropdash',
    cost: 460,
    sellPrice: 999,
    mrp: 1999,
    category: 'Wellness & Fitness',
    isHero: false,
    rating: 4.7,
    reviewCount: 1120,
    stockCount: 16,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'High-Power One-Touch Grinder for Coffee Beans, Dry Spices, Nuts & Chutneys.',
    description: 'Pulse control electric grinder with 150W copper motor and durable 304 food-grade stainless steel blades. Grinds coffee beans and Indian spices like cardamom, black pepper, and cumin in 10 seconds.',
    features: [
      '150W Powerful Copper Motor with Sharp SS Blades',
      'Transparent Lid for Coarseness Monitoring',
      'Compact & Easy to Wipe Clean'
    ]
  }
];

export const SHAPEWEAR_SIZE_GUIDE: SizeChartRow[] = [
  { size: 'S', usSize: '2~4', waist: '23"~28"', hip: '32"~40"' },
  { size: 'M', usSize: '6~8', waist: '25"~30"', hip: '34"~42"' },
  { size: 'L', usSize: '10~12', waist: '27"~32"', hip: '36"~44"' },
  { size: 'XL', usSize: '14~16', waist: '29"~34"', hip: '38"~46"' },
  { size: 'XXL', usSize: '18~20', waist: '31"~36"', hip: '40"~48"' },
  { size: 'XXXL', usSize: '22~24', waist: '33"~38"', hip: '42"~50"' }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Priya Sharma',
    location: 'Delhi NCR',
    rating: 5,
    date: '2 days ago',
    comment: 'InstaBlack stick is a lifesaver before attending family weddings! Covered my grey roots at the temples in 30 seconds. COD was smooth and delivery reached in 3 days.',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
  },
  {
    id: 'rev-2',
    author: 'Sunita Verma',
    location: 'Lucknow, UP',
    rating: 5,
    date: '3 days ago',
    comment: 'Bought JapCounter for my mother. She uses it every morning for her 108 Gayatri Mantra jaap. Screen is clear and battery lasts very long. Highly recommended!',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },
  {
    id: 'rev-3',
    author: 'Ananya Deshmukh',
    location: 'Pune, MH',
    rating: 5,
    date: '1 week ago',
    comment: 'The tummy tucker shapewear gives incredible support under sarees! It does not roll down at all thanks to the silicone grip on top. Will order another color.',
    verified: true,
    productName: '4-in-1 High Waist Tummy Tucker Shapewear'
  },
  {
    id: 'rev-4',
    author: 'Meera Iyer',
    location: 'Bengaluru, KA',
    rating: 5,
    date: '4 days ago',
    comment: 'MiniBlend portable blender makes my morning protein shake super easy. I carry it directly to my gym. Blends banana and berries in 20 seconds!',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender'
  }
];

export const GST_DETAILS = {
  state: 'Delhi',
  ward: 'Ward 81',
  commissionerate: 'Delhi East',
  division: 'Gandhi Nagar',
  range: 'Range 146 (ZK0301)',
  businessType: 'Sole Proprietorship',
  natureOfBusiness: 'Retail Business + Office/Sale Office',
  reason: 'Selling through e-Commerce portal',
  email: 'anuragd.ship@gmail.com',
  supportHours: 'Mon-Sat 10am-6pm IST'
};

export const POLICIES_CONTENT = {
  shipping: {
    title: 'Shipping Policy',
    highlights: [
      'FREE Shipping Across India on all orders',
      'Processing Time: 24 to 48 hours',
      'Delivery Timeline: 3-7 business days (Metro Cities), 5-7 days (Tier 2/3), 7-10 days (Remote locations)',
      'Live Tracking ID dispatched via SMS & WhatsApp upon dispatch'
    ]
  },
  returns: {
    title: 'Return & Refund Policy',
    highlights: [
      '7 Days Easy Return Window from date of delivery',
      'Cash on Delivery (COD) refunds processed directly via Bank Transfer / UPI ID',
      'Items must be unused and in original packaging with tags intact',
      'Sizing issues for shapewear eligible for size exchange option'
    ]
  }
};
