import { Product, Review, SizeChartRow } from '../types';

export const HERO_PRODUCTS_COUNT = 4;

export const PRODUCTS: Product[] = [
  {
    id: 'warmease-heating-massage-belt',
    name: 'WarmEase™ Portable Heating Massage Belt — Period Pain & Back Cramp Relief',
    supplier: 'Dropship India',
    cost: 500,
    sellPrice: 1099,
    mrp: 2199,
    category: 'Wellness & Body Care',
    isHero: true,
    tag: 'Running Ad | Best Seller',
    rating: 4.9,
    reviewCount: 3890,
    happyCustomersText: '32,000+ Women Relieved',
    stockCount: 12,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_08_59_PM.png?v=1782394850',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_07_12_PM.png?v=1782394850',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1740568248108-32.jpg?v=1782164533',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1740568248143-47.jpg?v=1782164533',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Hc74adce9b3784453b6698073c46309f2G.jpg?v=1782391815',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H0957efbdbad44a3bb0445c114c69de57q.jpg?v=1782391816',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H23af5a78d6214c448d48468cb0d385f8Y.jpg?v=1782391814'
    ],
    shortDesc: 'Wireless Fast Heating Pad with 3 Thermal Levels & Built-in Vibration Massage for Period Pain & Back Cramps.',
    description: "Your Period Doesn't Have to Be Painful. That heavy, cramping pain that hits every month — the kind that makes you want to curl up and not move. WarmEase was made for exactly that moment. A portable heating belt with built-in vibration massage that delivers targeted relief to your lower abdomen or back, exactly where it hurts. No more hot water bottles that go cold in 10 minutes. WarmEase is wireless, wearable, and works while you go about your day.",
    features: [
      '3 Temperature Settings — Choose gentle warmth or intense heat based on your body needs',
      'Vibrating Massage Mode — Combines thermal heat with massage for faster, deeper relief',
      '3-Second Fast Heating — Instant warmth with no waiting around when pain strikes',
      'Large Heating Area — Covers full lower abdomen and lower back',
      'Wireless & Wearable — Wear comfortably under loose clothing and move freely'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: '3-Sec Heating', subtitle: 'Instant relief' },
      { iconName: 'Zap', title: 'Vibration Massage', subtitle: '3 Speed modes' },
      { iconName: 'ShieldCheck', title: 'Wireless Wearable', subtitle: 'All-day comfort' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Wear & Secure', desc: 'Wrap the belt comfortably around your lower abdomen or back and fasten elastic velcro strap.' },
      { stepNumber: 2, title: 'Turn On & Heat', desc: 'Long press the power button for 2 seconds to activate instant 3-second thermal heating.' },
      { stepNumber: 3, title: 'Select Massage', desc: 'Press the massage button to cycle through 3 vibration levels for rapid cramp relief.' }
    ],
    specifications: [
      { label: 'Category', value: 'Wellness & Body Care' },
      { label: 'Material', value: 'Soft Lycra & Premium Velvet' },
      { label: 'Power Source', value: 'USB Type-C Rechargeable' },
      { label: 'Heat Modes', value: '3 Temperature Settings (45°C, 55°C, 65°C)' },
      { label: 'Massage Modes', value: '3 Speed Vibration Levels' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Piece',
        price: 1099,
        originalPrice: 2199,
        savingsText: 'You save 50%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (Special Offer)',
        price: 1899,
        originalPrice: 4398,
        savingsText: 'You save 57%',
        isPopular: true
      }
    ]
  },
  {
    id: 'indigoflow-smocked-midi-dress',
    name: 'IndigoFlow™ Smocked Midi Dress — Effortless Everyday Style for Women',
    supplier: 'Dropship India',
    cost: 250,
    sellPrice: 899,
    mrp: 1799,
    category: "Women's Fashion",
    isHero: true,
    tag: 'Trending Outfit',
    rating: 4.8,
    reviewCount: 2410,
    happyCustomersText: '20,000+ Happy Women',
    stockCount: 15,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_18_42_PM.png?v=1782395395',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_21_07_PM.png?v=1782395739',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_21_07_PM2.png?v=1782395740',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_21_07_PM3.png?v=1782395740',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_21_07_PM4.png?v=1782395740'
    ],
    shortDesc: 'Flattering Smocked Bodice Midi Dress with Adjustable Straps & Flowy Breathable Silhouette.',
    description: "The Dress You'll Reach For Every Time. Some pieces just make getting dressed easy. This smocked midi dress is one of them — a flattering, relaxed silhouette with a ruched bodice that cinches naturally at the right places, flowing into a full midi skirt that moves beautifully with you. Wear it to brunch, family outings, day dates, or casual evenings.",
    features: [
      'Smocked Bodice — Stretchy, self-adjusting fit that flatters all body types',
      'Midi Length — Modest, versatile, comfortable for all-day wear',
      'Adjustable Straps — Customize the fit precisely to your frame',
      'Flowy Skirt — Lightweight and breathable fabric ideal for summer',
      'Available XS to XXXL — Because every woman deserves a perfect fit'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: 'Smocked Bodice', subtitle: 'Self-adjusting fit' },
      { iconName: 'Feather', title: 'Flowy & Light', subtitle: 'Breathable fabric' },
      { iconName: 'Heart', title: 'XS to XXXL', subtitle: 'All body shapes' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Slip On Effortlessly', desc: 'Step into dress or slip over head with self-adjusting elastic smocked bodice.' },
      { stepNumber: 2, title: 'Adjust Shoulder Straps', desc: 'Tweak shoulder tie straps to achieve your ideal fit and neckline height.' },
      { stepNumber: 3, title: 'Style & Enjoy', desc: 'Pair with flat sandals for daytime outings or heels for evening occasions.' }
    ],
    specifications: [
      { label: 'Category', value: "Women's Fashion" },
      { label: 'Fabric', value: '100% Breathable Rayon Cotton Blend' },
      { label: 'Fit Type', value: 'Smocked Bodice / Flowy Midi A-Line' },
      { label: 'Sizes Available', value: 'XS, S, M, L, XL, XXL, XXXL' },
      { label: 'Wash Care', value: 'Gentle Machine Wash / Hand Wash' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Dress',
        price: 899,
        originalPrice: 1799,
        savingsText: 'You save 50%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (Combo colors)',
        price: 1599,
        originalPrice: 3598,
        savingsText: 'You save 55%',
        isPopular: true
      }
    ]
  },
  {
    id: 'postureright-back-support-belt',
    name: 'PostureRight™ Unisex Back Support Belt — Fix Your Posture, Relieve Back Pain',
    supplier: 'Dropship India',
    cost: 180,
    sellPrice: 699,
    mrp: 1499,
    category: 'Wellness & Body Care',
    isHero: true,
    tag: 'Doctor Recommended',
    rating: 4.8,
    reviewCount: 4520,
    happyCustomersText: '40,000+ Back Pain Relieved',
    stockCount: 18,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_48_59_PM.png?v=1782394090',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_00_32_PM.png?v=1782394258',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_52_24_PM.png?v=1782394090',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1768376932283-29.jpg?v=1782162969',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H59f05d7b7cf648cfbb8f93963d16c187B.jpg?v=1782391816'
    ],
    shortDesc: 'Ergonomic Adjustable Back Support Brace to Realign Spine & Correct Slouching.',
    description: "Your Back Has Been Trying to Tell You Something. That dull ache after a long day at your desk, rounded shoulders in photos, or stiffness after sitting through back-to-back meetings. PostureRight is a fully adjustable back brace that gently pulls your shoulders back into proper alignment, reminding your muscles what good posture actually feels like.",
    features: [
      'Gentle Corrective Support — Guides spine into proper alignment without pain',
      'Helps Relieve Rounded Back — Targets desk-job slouching & shoulder strain',
      'Fully Adjustable Straps — Universal fit for both men and women',
      'Strong Breathable Material — Wear comfortably under or over clothes',
      'Builds Muscle Memory — Daily 20-min use maintains posture naturally'
    ],
    keyIcons: [
      { iconName: 'Layers', title: 'Spine Support', subtitle: 'Gentle alignment' },
      { iconName: 'Shield', title: 'Adjustable Fit', subtitle: 'Men & Women' },
      { iconName: 'Feather', title: 'Breathable Material', subtitle: 'All-day wear' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Wear Like Backpack', desc: 'Slip arm loops over shoulders like wearing a backpack.' },
      { stepNumber: 2, title: 'Adjust Tension', desc: 'Pull dual waist straps forward until shoulders gently align backward.' },
      { stepNumber: 3, title: 'Build Posture Habit', desc: 'Wear 20-30 minutes daily at desk to build natural muscle memory.' }
    ],
    specifications: [
      { label: 'Category', value: 'Wellness & Body Care' },
      { label: 'Material', value: 'High-Density Breathable Neoprene Mesh' },
      { label: 'Closure', value: 'Heavy-Duty Adjustable Velcro' },
      { label: 'Target Alignment', value: 'Spine, Shoulders & Upper Back' },
      { label: 'Gender', value: 'Unisex (Men & Women)' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Brace',
        price: 699,
        originalPrice: 1499,
        savingsText: 'You save 53%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (For Couple / Office)',
        price: 1199,
        originalPrice: 2998,
        savingsText: 'You save 60%',
        isPopular: true
      }
    ]
  },
  {
    id: 'cool-gel-full-face-mask',
    name: 'Cool Gel Full Face Mask Summer Ice Cooling Sleeping Mask',
    supplier: 'Dropship India',
    cost: 390,
    sellPrice: 799,
    mrp: 1499,
    category: 'Beauty & Haircare',
    isHero: true,
    tag: 'Summer Cooling Must-Have',
    rating: 4.7,
    reviewCount: 1820,
    happyCustomersText: '15,000+ Refreshed Users',
    stockCount: 10,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216478-1.jpg?v=1782162864',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216728-6.jpg?v=1782162863',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216648-10.jpg?v=1782162864',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216698-14.jpg?v=1782162863',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216749-17.jpg?v=1782162863',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216808-20.jpg?v=1782162863',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1738141216836-22.jpg?v=1782162863'
    ],
    shortDesc: 'Reusable Ice Gel Full Face Mask for Puffy Eyes, Migraine Relief & Summer Skin Cooling.',
    description: 'Experience instant icy cooling relief for tired eyes, facial fatigue, and summer heat. The Cool Gel Full Face Mask contours comfortably to your face, soothing inflammation, reducing dark circles and puffiness, and promoting deep, restful sleep.',
    features: [
      'Dual Hot & Cold Therapy — Freeze for ice cooling or warm up for soothing tension relief',
      'Reduces Eye Puffiness & Dark Circles — Ideal after long screen hours or outdoor sun',
      'Adjustable Velcro Straps — Fits securely and comfortably around all head sizes',
      'Medical-Grade Flexible Gel Beads — Conforms perfectly to facial curves even when frozen'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: 'Hot & Cold Therapy', subtitle: 'Dual relief modes' },
      { iconName: 'Droplets', title: 'Anti-Puffiness', subtitle: 'Soothes tired eyes' },
      { iconName: 'ShieldCheck', title: 'Medical Gel', subtitle: 'Safe & reusable' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Chill or Heat', desc: 'Freeze for 20 minutes for ice cooling, or microwave 10 seconds for warm relaxation.' },
      { stepNumber: 2, title: 'Secure Mask', desc: 'Place contoured gel mask over eyes and face, securing velcro strap behind head.' },
      { stepNumber: 3, title: 'Soothe & Refresh', desc: 'Rest for 15-20 minutes to relieve puffy eyes, dark circles, and headaches.' }
    ],
    specifications: [
      { label: 'Category', value: 'Beauty & Haircare' },
      { label: 'Material', value: 'Medical-Grade Gel Beads & Ultra-Soft PVC' },
      { label: 'Therapy Type', value: 'Dual Hot & Cold Gel Compress' },
      { label: 'Reusability', value: '100% Reusable & Washable' },
      { label: 'Size', value: 'Free Size with Adjustable Strap' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Mask',
        price: 799,
        originalPrice: 1499,
        savingsText: 'You save 47%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (For You & Partner)',
        price: 1399,
        originalPrice: 2998,
        savingsText: 'You save 53%',
        isPopular: true
      }
    ]
  },
  {
    id: 'glowsheet-korean-collagen-mask',
    name: 'GlowSheet™ Korean Overnight Bio-Collagen Face Mask — Glass Skin',
    supplier: 'Dropship India',
    cost: 150,
    sellPrice: 499,
    mrp: 999,
    category: 'Beauty & Haircare',
    isHero: false,
    tag: 'Viral K-Beauty Mask',
    rating: 4.9,
    reviewCount: 3120,
    happyCustomersText: '35,000+ Glass Skin Transformations',
    stockCount: 25,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1740481846929-234.jpg?v=1782162785'
    ],
    shortDesc: 'Deep Collagen Overnight Hydrogel Mask for Pore Shrinking & Luminous Glass Skin Glow.',
    description: "Glass Skin Isn't a Filter. It's a Skincare Routine. GlowSheet's overnight bio-collagen face mask delivers a full dose of deep hydration and low-molecular collagen while you sleep. The hydrogel sheet turns transparent as your skin absorbs the serum, leaving you with visibly plumper, smoother, and glowing glass skin by morning.",
    features: [
      'Real Bio-Collagen Formula — Locks in deep hydration and supports elasticity overnight',
      'Hydrating & Pore Minimizing — Skin feels tighter, smoother, and luminous',
      'Hydrogel Technology — Turns transparent as active serum penetrates deep layers',
      'Formulated in Korea — The gold standard in overnight glass skin glow'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: 'Overnight Glow', subtitle: 'Turns transparent' },
      { iconName: 'Droplets', title: 'Deep Hydration', subtitle: 'Low-molecular collagen' },
      { iconName: 'ShieldCheck', title: 'Pore Minimizing', subtitle: 'Smooth glass finish' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Cleanse Face', desc: 'Wash face thoroughly with mild cleanser and pat dry before sleeping.' },
      { stepNumber: 2, title: 'Apply Mask Sheet', desc: 'Peel protective film and smooth hydrogel mask evenly over face.' },
      { stepNumber: 3, title: 'Overnight Glow', desc: 'Leave on overnight. Mask turns transparent as bio-collagen absorbs into skin.' }
    ],
    specifications: [
      { label: 'Category', value: 'Beauty & Haircare' },
      { label: 'Active Formula', value: 'Low-Molecular Bio-Collagen & Hyaluronic Acid' },
      { label: 'Formulation', value: '100% Non-Toxic Korean Hydrogel' },
      { label: 'Skin Suitability', value: 'Dermatologically Tested (All Skin Types)' },
      { label: 'Quantity', value: '34g Deep Collagen Sheet' },
      { label: 'Country of Origin', value: 'South Korea' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Sheet',
        price: 499,
        originalPrice: 999,
        savingsText: 'You save 50%'
      },
      {
        id: 'pack-of-3',
        name: 'Pack of 3 (1-Month Treatment)',
        price: 1199,
        originalPrice: 2997,
        savingsText: 'You save 60%',
        isPopular: true
      }
    ]
  },
  {
    id: 'japcounter-digital-jaap-mala',
    name: 'JapCounter™ — Digital Jaap Mala with Built-In Counter',
    supplier: 'Dropship India',
    cost: 250,
    sellPrice: 599,
    mrp: 1299,
    category: 'Spiritual & Devotional',
    isHero: false,
    tag: 'Top Devotional Pick',
    rating: 4.9,
    reviewCount: 4120,
    happyCustomersText: '45,000+ Devotees Trust Us',
    stockCount: 14,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_41_52_PM.png?v=1782393448',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_45_31_PM_b084f013-a282-4818-9f7e-f09d89032cda.png?v=1782393719',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_45_31_PM.png?v=1782393626',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_56_20_PM.png?v=1782394036',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/cmimgopt-c61d5ba8-31a9-4f1f-9099-311179a16ce2.webp?v=1782162649'
    ],
    shortDesc: 'Handcrafted Wooden Digital Prayer Mala with LCD Counter, Reset Button & Tassel.',
    description: 'Your Jaap, Counted Perfectly. Every Time. Never lose count of your jaap again. This beautifully handcrafted wooden mala comes with a built-in digital counter, so you can stay fully present in your mantra practice — without breaking focus to keep count.',
    features: [
      'Built-In Digital Counter — Accurate count every single time with easy reset button',
      'Handcrafted Wooden Design — Warm, natural finish that feels good in hand',
      'One-Hand Smooth Scroll — Count effortlessly with a single thumb press',
      'Compact & Portable — Carry to temple or keep on home altar',
      'Traditional Tassel Detailing — Classic devotional aesthetic'
    ],
    keyIcons: [
      { iconName: 'RotateCcw', title: 'One-Touch Reset', subtitle: '108 chant tracking' },
      { iconName: 'Battery', title: 'Long Battery Life', subtitle: '6+ months standby' },
      { iconName: 'Heart', title: 'Ergonomic Wood', subtitle: 'Comfortable holding' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Hold Comfortably', desc: 'Grasp wooden mala in right hand with thumb resting on the scroll roller.' },
      { stepNumber: 2, title: 'Scroll & Chant', desc: 'Scroll down with thumb after each mantra chant; LCD display increments count.' },
      { stepNumber: 3, title: 'Reset Round', desc: 'Press top reset button to zero out count when starting a new 108 jaap cycle.' }
    ],
    specifications: [
      { label: 'Category', value: 'Spiritual & Devotional' },
      { label: 'Material', value: 'Handcrafted Hardwood & Brass Accents' },
      { label: 'Counter Type', value: '5-Digit LCD Digital Screen (0-99,999)' },
      { label: 'Battery Life', value: 'Built-in Button Cell (6+ Months Standby)' },
      { label: 'Special Feature', value: 'One-Touch Instant Reset Switch' },
      { label: 'Country of Origin', value: 'India' }
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
        name: 'Pack of 2 (For Family/Gifting)',
        price: 999,
        originalPrice: 2598,
        savingsText: 'You save 61%',
        isPopular: true
      }
    ]
  },
  {
    id: 'miniblend-portable-juice-blender',
    name: 'MiniBlend™ Portable Juice Blender Bottle — Fresh Juice & Shakes Anywhere',
    supplier: 'Dropship India',
    cost: 295,
    sellPrice: 899,
    mrp: 1799,
    category: 'Wellness & Body Care',
    isHero: false,
    tag: 'Hot Ad Product',
    rating: 4.8,
    reviewCount: 3100,
    happyCustomersText: '28,000+ Smoothie Lovers',
    stockCount: 11,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175429.png?v=1786367100',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175444.png?v=1786367100',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175457.png?v=1786367100',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175511.png?v=1786367099',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175540.png?v=1786367098',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Screenshot_2026-08-10_175526.png?v=1786367099'
    ],
    shortDesc: 'Rechargeable Personal Smoothie Blender Bottle with 3D Blades & Travel Carry Handle.',
    description: 'Fresh-Blended, Anywhere You Go. Gym bag, office desk, travel kit — your blender now fits wherever you go. This portable mini blender lets you make fresh juice, protein shakes, or fruit smoothies in seconds without lugging around a bulky appliance.',
    features: [
      'Blends in 10 Seconds — Sharp blades crush fruit, ice, and protein powder effortlessly',
      'Blend & Drink in One Bottle — No transferring, no extra dishes to wash',
      'Compact & Portable — Fits in your gym bag, car cupholder, or office desk',
      'Easy to Clean — Self-cleaning mode with water and soap drop'
    ],
    keyIcons: [
      { iconName: 'BatteryCharging', title: 'USB Rechargeable', subtitle: 'Fast charging' },
      { iconName: 'Zap', title: '10s Blend Speed', subtitle: '3D stainless blades' },
      { iconName: 'Luggage', title: 'Travel Friendly', subtitle: 'Fits in gym bag' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Add Fruit & Liquid', desc: 'Chop fruits into small pieces, add water or milk, and close cap tightly.' },
      { stepNumber: 2, title: 'Double Click Power', desc: 'Turn bottle upside down and double-press power button to spin blades.' },
      { stepNumber: 3, title: 'Drink & Travel', desc: 'Blend for 10-20 seconds. Sip directly from bottle or attach carry cap.' }
    ],
    specifications: [
      { label: 'Category', value: 'Wellness & Body Care' },
      { label: 'Capacity', value: '400ml Personal Travel Bottle' },
      { label: 'Blades', value: '6 Stainless Steel 3D Serrated Blades' },
      { label: 'Battery', value: '1200mAh USB Rechargeable (10+ Blends/Charge)' },
      { label: 'Material', value: 'BPA-Free Food-Grade Tritan Plastic' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Bottle',
        price: 899,
        originalPrice: 1799,
        savingsText: 'You save 50%'
      },
      {
        id: 'pack-of-2',
        name: 'Pack of 2 (For Couple)',
        price: 1599,
        originalPrice: 3598,
        savingsText: 'You save 55%',
        isPopular: true
      }
    ]
  },
  {
    id: 'high-waist-tummy-tucker-shapewear',
    name: 'High Waist Tummy Tucker Shapewear — Seamless Body Shaper for Women',
    supplier: 'Dropship India',
    cost: 175,
    sellPrice: 599,
    mrp: 1599,
    category: "Women's Fashion",
    isHero: false,
    tag: 'Viral Bestseller',
    rating: 4.7,
    reviewCount: 5290,
    happyCustomersText: '50,000+ Women Sculpted',
    stockCount: 7,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_38_34_PM.png?v=1782396533',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H7e1827a8eabc476d9fe4bb71b55e5f9d6.jpg?v=1782391812',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/cmimgopt-e4e37ffe-2c9e-4896-8c15-2e51f621a006.webp?v=1782162450',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/cmimgopt-54e37d55-5e6b-4889-ae59-d1bdf209f18d.webp?v=1782162450',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/Hc84fbb0ff1134e42844c73b8b9002002d.jpg?v=1782391813',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/cmimgopt-47189b95-c688-41d8-b7ff-4c00624d98af.webp?v=1782162452',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/cmimgopt-71b59894-5358-40f6-b922-272d67811edd.webp?v=1782162449'
    ],
    shortDesc: 'Instant 4-in-1 Tummy Flattening, Waist Sculpting & Butt Lighter with Anti-Roll Silicone Strip.',
    description: 'Look Smooth. Feel Confident. In Seconds. No more worrying about how your outfit fits. This 4-in-1 shapewear is designed to instantly smooth your tummy, shape your waist, and lift your hips — so you can walk into any event feeling put-together under sarees, dresses, jeans, and fitted outfits.',
    features: [
      '4-in-1 Shaping — Tummy control, waist shaping, hip lift, and thigh smoothing in one piece',
      'Totally Invisible — Seamless edges mean zero visible panty lines under tight clothing',
      'All-Day Comfort — Soft, stretchable, breathable fabric that moves with you',
      'Anti-Roll Silicone Strip — Stays securely in place without rolling down'
    ],
    keyIcons: [
      { iconName: 'Layers', title: '360° Sculpting', subtitle: 'Tummy & waist shape' },
      { iconName: 'Feather', title: 'Breathable Fabric', subtitle: 'All-day wearability' },
      { iconName: 'Shield', title: 'Anti-Roll Strip', subtitle: 'Stays in place' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Step Into Legs', desc: 'Roll down waistband and step feet into leg openings.' },
      { stepNumber: 2, title: 'Pull Up High', desc: 'Smoothly pull shapewear up over thighs and hips up to underbust line.' },
      { stepNumber: 3, title: 'Smooth & Fit', desc: 'Ensure anti-roll silicone waistband sits flat against skin under sarees or dresses.' }
    ],
    specifications: [
      { label: 'Category', value: "Women's Fashion" },
      { label: 'Fabric', value: 'Seamless Nylon Microfiber & High-Stretch Spandex' },
      { label: 'Control Level', value: 'Firm 360° Tummy, Waist & Hip Sculpting' },
      { label: 'Feature', value: 'Anti-Roll Dual Silicone Waistband' },
      { label: 'Sizes Available', value: 'S, M, L, XL, XXL, XXXL' },
      { label: 'Country of Origin', value: 'India' }
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
    id: 'instablack-touchup-stick',
    name: 'InstaBlack 2-in-1 Root Touch-Up Stick — Waterproof Instant Hair Color',
    supplier: 'Dropship India',
    cost: 200,
    sellPrice: 599,
    mrp: 1299,
    category: 'Beauty & Haircare',
    isHero: false,
    tag: 'Running Ad | Best Seller',
    rating: 4.8,
    reviewCount: 3840,
    happyCustomersText: '36,000+ Happy Customers',
    stockCount: 9,
    images: [
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_25_18_PM.png?v=1782392165',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_04_14_44_PM3.png?v=1782391732',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_04_14_44_PM2.png?v=1782391732',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_04_14_44_PM_-_Copy.png?v=1782391732',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_04_14_44_PM4.png?v=1782391732',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H399f00aa260c470da8dd48b9158986544.jpg?v=1782396670',
      'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/H98648758ed844deeb7bbb4f126b1faceM.jpg?v=1782391812'
    ],
    shortDesc: 'Instant 2-Minute Grey Coverage Stick with Built-In Comb Applicator. Sweatproof & Waterproof.',
    description: 'Grey Roots? Gone in 2 Minutes. Cover greys in under 2 minutes — no mixing, no mess, no salon visit. Just twist, comb, and go. This 2-in-1 instant hair color stick comes with a built-in comb applicator so you can touch up your roots anywhere.',
    features: [
      'Instant Coverage — Greys disappear in under 2 minutes',
      'Built-In Comb Applicator — Precise application, no brushes or gloves needed',
      'Waterproof & Sweat-Proof — Stays put through humidity, workouts, and rain',
      'Long-Lasting — Touch-up lasts until your next hair wash',
      'Travel-Friendly — Compact stick fits easily in any handbag'
    ],
    keyIcons: [
      { iconName: 'Sparkles', title: 'Instant Coverage', subtitle: '2-min grey fix' },
      { iconName: 'Droplets', title: 'Sweatproof', subtitle: 'Lasts all day' },
      { iconName: 'ShieldCheck', title: 'Safe Formula', subtitle: 'No harsh chemicals' }
    ],
    howToUseSteps: [
      { stepNumber: 1, title: 'Uncap & Twist', desc: 'Remove cap and gently twist base to expose touch-up stick tip.' },
      { stepNumber: 2, title: 'Comb Over Greys', desc: 'Glide built-in comb applicator directly onto grey roots or thin hairline spots.' },
      { stepNumber: 3, title: 'Fast Dry in 10s', desc: 'Dries naturally in 10 seconds. Enjoy 100% sweatproof coverage until next wash.' }
    ],
    specifications: [
      { label: 'Category', value: 'Beauty & Haircare' },
      { label: 'Formulation', value: 'Natural Herbal Wax & Botanical Pigments' },
      { label: 'Waterproof', value: '100% Sweatproof & Rainproof' },
      { label: 'Shade', value: 'Natural Jet Black' },
      { label: 'Shelf Life', value: '24 Months' },
      { label: 'Country of Origin', value: 'India' }
    ],
    bundles: [
      {
        id: 'single',
        name: 'Single Stick',
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
  // WarmEase Heating Belt
  {
    id: 'rev-1a',
    productId: 'warmease-heating-massage-belt',
    author: 'Priya Sharma',
    location: 'Delhi NCR',
    rating: 5,
    date: '08/10/2026',
    title: 'Absolute lifesaver for period cramps!',
    comment: 'WarmEase heating belt is an absolute blessing during monthly period cramps. Heats up in 3 seconds and the vibration massage is super soothing. Very lightweight and comfortable.',
    verified: true,
    productName: 'WarmEase™ Portable Heating Massage Belt'
  },
  {
    id: 'rev-1b',
    productId: 'warmease-heating-massage-belt',
    author: 'Sneha Patel',
    location: 'Ahmedabad, GJ',
    rating: 5,
    date: '08/07/2026',
    title: 'So convenient to use anywhere',
    comment: 'I can wear this under my oversized hoodie while working at my desk. The heat levels are perfect and battery lasts easily for 3-4 sessions.',
    verified: true,
    productName: 'WarmEase™ Portable Heating Massage Belt'
  },
  {
    id: 'rev-1c',
    productId: 'warmease-heating-massage-belt',
    author: 'Pooja Nair',
    location: 'Kochi, KL',
    rating: 5,
    date: '08/05/2026',
    title: 'Relieves lower back stiffness instantly',
    comment: 'Not just for cramps, I use it after long workout sessions for lower back relaxation. Warmth is constant and very comfortable.',
    verified: true,
    productName: 'WarmEase™ Portable Heating Massage Belt'
  },
  {
    id: 'rev-1d',
    productId: 'warmease-heating-massage-belt',
    author: 'Anjali Saxena',
    location: 'Indore, MP',
    rating: 5,
    date: '08/02/2026',
    title: 'Fast charging and soft velvet padding',
    comment: 'The plush fabric against skin feels luxurious. Rechargeable Type-C port makes it easy to charge anywhere.',
    verified: true,
    productName: 'WarmEase™ Portable Heating Massage Belt'
  },
  {
    id: 'rev-1e',
    productId: 'warmease-heating-massage-belt',
    author: 'Divya Reddy',
    location: 'Hyderabad, TS',
    rating: 5,
    date: '07/29/2026',
    title: 'Best gift I bought for my sister',
    comment: 'Gifted this to my sister on her birthday. She was so thankful! Highly recommend for anyone looking for fast pain relief without medicine.',
    verified: true,
    productName: 'WarmEase™ Portable Heating Massage Belt'
  },

  // JapCounter Digital Jaap Mala
  {
    id: 'rev-2a',
    productId: 'japcounter-digital-jaap-mala',
    author: 'Sunita Verma',
    location: 'Lucknow, UP',
    rating: 5,
    date: '08/09/2026',
    title: 'Very thoughtful & easy for elderly parents',
    comment: 'Bought JapCounter for my mother. She uses it every morning for her 108 Gayatri Mantra jaap. Screen is clear and button click is smooth. Highly recommended!',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },
  {
    id: 'rev-2b',
    productId: 'japcounter-digital-jaap-mala',
    author: 'Ramesh Sundaram',
    location: 'Chennai, TN',
    rating: 5,
    date: '08/04/2026',
    title: 'Very peaceful jaap experience',
    comment: 'Nice wooden finish and smooth roller. Holds count accurately even if kept in pocket.',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },
  {
    id: 'rev-2c',
    productId: 'japcounter-digital-jaap-mala',
    author: 'Mahesh Shastri',
    location: 'Varanasi, UP',
    rating: 5,
    date: '08/01/2026',
    title: 'Smooth scrolling beads mechanism',
    comment: 'Feels like real wooden mala beads. LED screen auto turns off to save battery. Wonderful product for spiritual daily routine.',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },
  {
    id: 'rev-2d',
    productId: 'japcounter-digital-jaap-mala',
    author: 'Geeta Agarwal',
    location: 'Mathura, UP',
    rating: 5,
    date: '07/28/2026',
    title: 'Compact and light in weight',
    comment: 'My father carries it during evening temple walks. Reset button has safety delay so count is never lost by mistake.',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },
  {
    id: 'rev-2e',
    productId: 'japcounter-digital-jaap-mala',
    author: 'Kishore Bhaumik',
    location: 'Kolkata, WB',
    rating: 5,
    date: '07/25/2026',
    title: 'Quality build with clear digital numbers',
    comment: 'Numbers are big enough for elderly eyes to read easily without glasses. Very satisfied with prompt delivery.',
    verified: true,
    productName: 'JapCounter™ Digital Jaap Mala'
  },

  // IndigoFlow Smocked Midi Dress
  {
    id: 'rev-3a',
    productId: 'indigoflow-smocked-midi-dress',
    author: 'Ananya Deshmukh',
    location: 'Pune, MH',
    rating: 5,
    date: '08/11/2026',
    title: 'Fits like a dream & ultra breathable',
    comment: 'The IndigoFlow smocked midi dress fits so effortlessly! The fabric is soft, flowy and extremely comfortable for daily summer wear.',
    verified: true,
    productName: 'IndigoFlow™ Smocked Midi Dress'
  },
  {
    id: 'rev-3b',
    productId: 'indigoflow-smocked-midi-dress',
    author: 'Ritu Agarwal',
    location: 'Jaipur, RJ',
    rating: 4,
    date: '08/05/2026',
    title: 'Lovely color & soft material',
    comment: 'The smocking at bust gives a very nice shape. Received many compliments at family dinner.',
    verified: true,
    productName: 'IndigoFlow™ Smocked Midi Dress'
  },
  {
    id: 'rev-3c',
    productId: 'indigoflow-smocked-midi-dress',
    author: 'Simran Kaur',
    location: 'Chandigarh',
    rating: 5,
    date: '08/03/2026',
    title: 'No color fading after first wash',
    comment: 'Washed it on gentle cycle, stitching held up great and no bleeding of indigo dye. Perfect calf length.',
    verified: true,
    productName: 'IndigoFlow™ Smocked Midi Dress'
  },
  {
    id: 'rev-3d',
    productId: 'indigoflow-smocked-midi-dress',
    author: 'Tanvi Shah',
    location: 'Surat, GJ',
    rating: 5,
    date: '07/31/2026',
    title: 'Chic boho look for weekend outings',
    comment: 'Paired it with flat sandals and tote bag. Elastic smocking holds comfortably without digging into shoulders.',
    verified: true,
    productName: 'IndigoFlow™ Smocked Midi Dress'
  },
  {
    id: 'rev-3e',
    productId: 'indigoflow-smocked-midi-dress',
    author: 'Bhavna Joshi',
    location: 'Mumbai, MH',
    rating: 5,
    date: '07/27/2026',
    title: 'High quality cotton viscose fabric',
    comment: 'Fabric feels breezy under humid weather. Ordering one more color variant for my sister!',
    verified: true,
    productName: 'IndigoFlow™ Smocked Midi Dress'
  },

  // GlowSheet Bio-Collagen Mask
  {
    id: 'rev-4a',
    productId: 'glowsheet-korean-collagen-mask',
    author: 'Meera Iyer',
    location: 'Bengaluru, KA',
    rating: 5,
    date: '08/08/2026',
    title: 'Visible glass skin glow overnight!',
    comment: 'GlowSheet Bio-Collagen mask gave me visible glass skin glow the next morning. My pores looked smaller and skin felt deeply hydrated and plump.',
    verified: true,
    productName: 'GlowSheet™ Korean Bio-Collagen Face Mask'
  },
  {
    id: 'rev-4b',
    productId: 'glowsheet-korean-collagen-mask',
    author: 'Bhavna Joshi',
    location: 'Mumbai, MH',
    rating: 5,
    date: '08/03/2026',
    title: 'Deeply relaxing & non-sticky',
    comment: 'Slept with it overnight as instructed. Mask absorbed completely transparent by morning and left my face feeling baby soft.',
    verified: true,
    productName: 'GlowSheet™ Korean Bio-Collagen Face Mask'
  },
  {
    id: 'rev-4c',
    productId: 'glowsheet-korean-collagen-mask',
    author: 'Nisha Singhania',
    location: 'Delhi NCR',
    rating: 5,
    date: '07/30/2026',
    title: 'Better than facial treatments at salon',
    comment: 'Preps skin magically before makeup for weddings or events. No foundation creasing after using this night before.',
    verified: true,
    productName: 'GlowSheet™ Korean Bio-Collagen Face Mask'
  },
  {
    id: 'rev-4d',
    productId: 'glowsheet-korean-collagen-mask',
    author: 'Shreya Roy',
    location: 'Kolkata, WB',
    rating: 5,
    date: '07/27/2026',
    title: 'Hydration lasts for 3 full days',
    comment: 'My dry skin patches vanished completely. Essence isn’t sticky at all and fits face contours snugly.',
    verified: true,
    productName: 'GlowSheet™ Korean Bio-Collagen Face Mask'
  },
  {
    id: 'rev-4e',
    productId: 'glowsheet-korean-collagen-mask',
    author: 'Swati Menon',
    location: 'Thrissur, KL',
    rating: 5,
    date: '07/22/2026',
    title: 'True Korean glass skin formula',
    comment: 'Super cooling feeling on application. Really turns clear when all nutrients are absorbed into skin!',
    verified: true,
    productName: 'GlowSheet™ Korean Bio-Collagen Face Mask'
  },

  // PostureRight Back Belt
  {
    id: 'rev-5a',
    productId: 'postureright-back-support-belt',
    author: 'Rohan Kapoor',
    location: 'Mumbai, MH',
    rating: 5,
    date: '08/09/2026',
    title: 'Great relief for long computer desk hours',
    comment: 'PostureRight belt has reduced my upper back pain significantly during 9-hour work desk shifts. Easy to adjust and comfortable under shirts.',
    verified: true,
    productName: 'PostureRight™ Unisex Back Support Belt'
  },
  {
    id: 'rev-5b',
    productId: 'postureright-back-support-belt',
    author: 'Amitabh Sengupta',
    location: 'Noida, UP',
    rating: 5,
    date: '08/04/2026',
    title: 'Instant posture correction while sitting',
    comment: 'Keeps shoulders pulled back naturally without muscle strain. Breathable mesh fabric doesn’t cause sweat.',
    verified: true,
    productName: 'PostureRight™ Unisex Back Support Belt'
  },
  {
    id: 'rev-5c',
    productId: 'postureright-back-support-belt',
    author: 'Deepak Chawla',
    location: 'Gurugram, HR',
    rating: 5,
    date: '07/30/2026',
    title: 'Sturdy straps and strong velcro',
    comment: 'Velcro grip is super strong and does not loosen while walking or driving. Worth every rupee.',
    verified: true,
    productName: 'PostureRight™ Unisex Back Support Belt'
  },
  {
    id: 'rev-5d',
    productId: 'postureright-back-support-belt',
    author: 'Monika Rao',
    location: 'Bengaluru, KA',
    rating: 4,
    date: '07/26/2026',
    title: 'Helps maintain straight posture',
    comment: 'Takes 2-3 days to get used to, but after that my slouching habit completely disappeared.',
    verified: true,
    productName: 'PostureRight™ Unisex Back Support Belt'
  },
  {
    id: 'rev-5e',
    productId: 'postureright-back-support-belt',
    author: 'Vikas Malhotra',
    location: 'Chandigarh',
    rating: 5,
    date: '07/21/2026',
    title: 'Comfortable under blazer & jacket',
    comment: 'Very slim profile, nobody in office noticed I had a posture belt underneath.',
    verified: true,
    productName: 'PostureRight™ Unisex Back Support Belt'
  },

  // Cool Gel Face Mask
  {
    id: 'rev-6a',
    productId: 'cool-gel-full-face-mask',
    author: 'Kavita Joshi',
    location: 'Jaipur, RJ',
    rating: 5,
    date: '08/06/2026',
    title: 'Instant cooling for tired & puffy eyes',
    comment: 'Cool Gel Face Mask is amazing after coming home from hot summer sun! Soothes puffy eyes and headache instantly. Very refreshing after fridge cooling.',
    verified: true,
    productName: 'Cool Gel Full Face Mask'
  },
  {
    id: 'rev-6b',
    productId: 'cool-gel-full-face-mask',
    author: 'Neha Bhalla',
    location: 'Amritsar, PB',
    rating: 5,
    date: '08/01/2026',
    title: 'Relieves stress & sinus pressure',
    comment: 'I put this on for 15 minutes before sleep with soft music. Relieves eye strain from phone screen work.',
    verified: true,
    productName: 'Cool Gel Full Face Mask'
  },
  {
    id: 'rev-6c',
    productId: 'cool-gel-full-face-mask',
    author: 'Aarti Pillai',
    location: 'Coimbatore, TN',
    rating: 5,
    date: '07/28/2026',
    title: 'Flexible strap fits securely',
    comment: 'Gel stays soft even after 30 mins in freezer. Eye holes allow watching TV while relaxing.',
    verified: true,
    productName: 'Cool Gel Full Face Mask'
  },
  {
    id: 'rev-6d',
    productId: 'cool-gel-full-face-mask',
    author: 'Rahul Saxena',
    location: 'Bhopal, MP',
    rating: 5,
    date: '07/23/2026',
    title: 'Dual use hot and cold compress',
    comment: 'Heated it in warm water for sinus relief and chilled in fridge for hangover headache. Works magic both ways.',
    verified: true,
    productName: 'Cool Gel Full Face Mask'
  },
  {
    id: 'rev-6e',
    productId: 'cool-gel-full-face-mask',
    author: 'Sushma Gowda',
    location: 'Bengaluru, KA',
    rating: 5,
    date: '07/19/2026',
    title: 'Durable leak-proof gel pouch',
    comment: 'Material quality is thick PVC gel pouch. No odor or leaking. Must have summer essential.',
    verified: true,
    productName: 'Cool Gel Full Face Mask'
  },

  // MiniBlend Juice Blender
  {
    id: 'rev-7a',
    productId: 'miniblend-portable-juice-blender',
    author: 'Vikram Mehta',
    location: 'Chandigarh',
    rating: 5,
    date: '08/10/2026',
    title: 'Blends smoothies in 10 seconds flat',
    comment: 'MiniBlend portable blender is perfect for post-workout protein shakes at the gym. Blends banana, oats and milk in 10 seconds effortlessly!',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender Bottle'
  },
  {
    id: 'rev-7b',
    productId: 'miniblend-portable-juice-blender',
    author: 'Siddharth Jain',
    location: 'Jaipur, RJ',
    rating: 5,
    date: '08/05/2026',
    title: 'Crushes frozen berries & ice easily',
    comment: 'Stainless steel 6-blade mechanism is surprisingly powerful for a USB rechargeable blender. Easy self-cleaning by adding water and running motor.',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender Bottle'
  },
  {
    id: 'rev-7c',
    productId: 'miniblend-portable-juice-blender',
    author: 'Archana Naidu',
    location: 'Vizag, AP',
    rating: 5,
    date: '07/31/2026',
    title: 'Ideal for office desk fresh juices',
    comment: 'Make fresh apple pomegranate juice directly in bottle right at my desk. Single charge blends around 12 bottles.',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender Bottle'
  },
  {
    id: 'rev-7d',
    productId: 'miniblend-portable-juice-blender',
    author: 'Gaurav Tripathi',
    location: 'Kanpur, UP',
    rating: 5,
    date: '07/26/2026',
    title: 'Leakproof silicone ring lid',
    comment: 'Carry it in my laptop backpack every day, zero leaks or spills. Magnetic safety lock prevents motor from starting if lid is open.',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender Bottle'
  },
  {
    id: 'rev-7e',
    productId: 'miniblend-portable-juice-blender',
    author: 'Tarun Varma',
    location: 'Delhi NCR',
    rating: 5,
    date: '07/20/2026',
    title: 'Compact size fits car cup holder',
    comment: 'Awesome gadget for road trips and daily commute. Drinks stay cold in BPA-free container.',
    verified: true,
    productName: 'MiniBlend™ Portable Juice Blender Bottle'
  },

  // Tummy Tucker Shapewear
  {
    id: 'rev-8a',
    productId: 'high-waist-tummy-tucker-shapewear',
    author: 'Shalini Saxena',
    location: 'Kolkata, WB',
    rating: 5,
    date: '08/07/2026',
    title: 'Doesn’t roll down under saree or dresses',
    comment: 'Tummy Tucker Shapewear gave me instant smooth silhouette under my designer saree! The anti-roll silicone strip really stays in place without pinching.',
    verified: true,
    productName: 'High Waist Tummy Tucker Shapewear'
  },
  {
    id: 'rev-8b',
    productId: 'high-waist-tummy-tucker-shapewear',
    author: 'Preeti Deshpande',
    location: 'Nagpur, MH',
    rating: 5,
    date: '08/02/2026',
    title: 'Instant 2-inch tummy waist tuck',
    comment: 'Smooths out side bulges completely under tight bodycon dresses. High waist design reaches right under bust line.',
    verified: true,
    productName: 'High Waist Tummy Tucker Shapewear'
  },
  {
    id: 'rev-8c',
    productId: 'high-waist-tummy-tucker-shapewear',
    author: 'Farida Khan',
    location: 'Mumbai, MH',
    rating: 5,
    date: '07/29/2026',
    title: 'Super elastic yet breathable micro-fabric',
    comment: 'Wore it for 8 hours at wedding event without feeling suffocated or hot. Excellent stretch recovery.',
    verified: true,
    productName: 'High Waist Tummy Tucker Shapewear'
  },
  {
    id: 'rev-8d',
    productId: 'high-waist-tummy-tucker-shapewear',
    author: 'Rashi Agarwal',
    location: 'Ludhiana, PB',
    rating: 5,
    date: '07/24/2026',
    title: 'Seamless panty lines under trousers',
    comment: 'No visible panty line at all under fitted trousers or leggings. Gives great butt lift shape too.',
    verified: true,
    productName: 'High Waist Tummy Tucker Shapewear'
  },
  {
    id: 'rev-8e',
    productId: 'high-waist-tummy-tucker-shapewear',
    author: 'Meenakshi Sundaram',
    location: 'Madurai, TN',
    rating: 5,
    date: '07/18/2026',
    title: 'Fits true to size chart',
    comment: 'Followed the waist size guide accurately and got XL size. Fits snug and comfy without curling down.',
    verified: true,
    productName: 'High Waist Tummy Tucker Shapewear'
  },

  // InstaBlack Touch-Up Stick
  {
    id: 'rev-9a',
    productId: 'instablack-touchup-stick',
    author: 'Rajesh Gupta',
    location: 'Ahmedabad, GJ',
    rating: 5,
    date: '08/12/2026',
    title: '1-minute fix before emergency meetings',
    comment: 'InstaBlack touch-up stick covers my grey roots in 1 minute before office meetings. Sweatproof, dries fast, and looks completely natural!',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
  },
  {
    id: 'rev-9b',
    productId: 'instablack-touchup-stick',
    author: 'Alka Shrivastav',
    location: 'Gwalior, MP',
    rating: 5,
    date: '08/06/2026',
    title: 'No mess or scalp staining',
    comment: 'Dual-ended applicator sponge allows precise dab around hairline. Doesn’t flake off on pillow or clothing.',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
  },
  {
    id: 'rev-9c',
    productId: 'instablack-touchup-stick',
    author: 'Manoj Pillai',
    location: 'Thiruvananthapuram, KL',
    rating: 5,
    date: '07/31/2026',
    title: 'Blends seamlessly with black hair',
    comment: 'Saves frequent salon hair dye visits. Easily washes off with regular shampoo during bath.',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
  },
  {
    id: 'rev-9d',
    productId: 'instablack-touchup-stick',
    author: 'Sunita Chaudhry',
    location: 'Dehradun, UK',
    rating: 5,
    date: '07/25/2026',
    title: 'Pocket size lipstick style tube',
    comment: 'Keep it in purse always. Instant gray coverage for temple sideburns when stepping out.',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
  },
  {
    id: 'rev-9e',
    productId: 'instablack-touchup-stick',
    author: 'Harish Nambiar',
    location: 'Bengaluru, KA',
    rating: 5,
    date: '07/20/2026',
    title: 'Natural matte finish without stickiness',
    comment: 'Looks completely real, no shiny residue or artificial stickiness. Highly useful daily product.',
    verified: true,
    productName: 'InstaBlack 2-in-1 Root Touch-Up Stick'
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
