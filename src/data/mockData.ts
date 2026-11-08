import { SupplyOrder, InventoryItem, SystemAlert } from '../types/order';

export const INITIAL_ORDERS: SupplyOrder[] = [
  // 1. ORDERS
  {
    id: 'ord-0023',
    orderNumber: 'SO-2025-0023',
    customerName: 'Teacher Karen Morales',
    customerRole: 'SNED Coordinator',
    itemName: 'Sensory Liquid Tiles',
    quantityDisplay: 'Qty: 6 sets',
    quantity: 6,
    unit: 'sets',
    unitPrice: 1250.00,
    totalPrice: 7500.00,
    badgeText: 'New Order',
    currentStage: 'ORDERS',
    statusLabel: 'New Intake',
    createdAt: '2025-11-10T10:10:00Z',
    updatedAt: '2025-11-10T10:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    description: 'Interactive gel liquid floor tiles for sensory room therapy and motor skills development.',
    department: 'SNED Resource Center',
    depotUrl: 'https://7starsdepot.netlify.app/',
    items: [
      {
        id: 'it-23-1',
        sku: 'SNED-LT-01',
        name: 'Sensory Liquid Gel Floor Tiles (Hexagon)',
        quantityRequested: 4,
        unit: 'sets',
        unitPrice: 1250.00,
        totalPrice: 5000.00,
        depotBranch: 'Guinobatan Branch',
        stockStatus: 'Available in Depot'
      },
      {
        id: 'it-23-2',
        sku: 'SNED-LT-02',
        name: 'Liquid Flow Square Interactive Mats',
        quantityRequested: 2,
        unit: 'sets',
        unitPrice: 1250.00,
        totalPrice: 2500.00,
        depotBranch: 'Guinobatan Branch',
        stockStatus: 'Available in Depot'
      }
    ]
  },
  {
    id: 'ord-0024',
    orderNumber: 'SO-2025-0024',
    customerName: 'Dr. Ramon Bautista',
    customerRole: 'Special Ed Supervisor',
    itemName: 'PECS Communication Binder',
    quantityDisplay: 'Qty: 12 pcs',
    quantity: 12,
    unit: 'pcs',
    unitPrice: 480.00,
    totalPrice: 5760.00,
    badgeText: 'Pending Intake',
    currentStage: 'ORDERS',
    statusLabel: 'Pending Intake',
    createdAt: '2025-11-10T09:50:00Z',
    updatedAt: '2025-11-10T10:05:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    description: 'Durable picture exchange communication system binders with hook-and-loop strips.',
    department: 'Special Education Unit',
    depotUrl: 'https://7starsdepot.netlify.app/',
    items: [
      {
        id: 'it-24-1',
        sku: 'SNED-PECS-A4',
        name: 'PECS Communication Heavy Binder A4',
        quantityRequested: 8,
        unit: 'pcs',
        unitPrice: 480.00,
        totalPrice: 3840.00,
        depotBranch: 'Ligao Branch',
        stockStatus: 'Available in Depot'
      },
      {
        id: 'it-24-2',
        sku: 'SNED-PECS-HL',
        name: 'Self-Adhesive Hook & Loop Strips Roll',
        quantityRequested: 4,
        unit: 'pcs',
        unitPrice: 480.00,
        totalPrice: 1920.00,
        depotBranch: 'Ligao Branch',
        stockStatus: 'Available in Depot'
      }
    ]
  },

  // 2. IDENTIFICATION OF STOCKS (Divided into GBTN & LIGAO, connected to 7 Stars Depot)
  {
    id: 'ord-0018',
    orderNumber: 'SO-2025-0018',
    customerName: 'Maria Santos',
    customerRole: 'Administrative Officer',
    itemName: 'Laptop Paper',
    quantityDisplay: 'Qty: 50 pcs',
    quantity: 50,
    unit: 'pcs',
    unitPrice: 12.50,
    totalPrice: 625.00,
    badgeText: 'Stock Identified',
    currentStage: 'IDENTIFICATION_OF_STOCKS',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T09:15:00Z',
    updatedAt: '2025-11-10T10:24:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    description: 'High quality premium continuous computer laptop form paper for reports and invoicing.',
    department: 'Administrative Division',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'GBTN',
    purchaseMethod: 'ONLINE',
    items: [
      {
        id: 'it-18-1',
        sku: 'DEPOT-LP-01',
        name: 'Continuous Computer Laptop Form 1-Ply',
        quantityRequested: 30,
        unit: 'pcs',
        unitPrice: 12.50,
        totalPrice: 375.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'ONLINE',
        stockStatus: 'In Stock (Guinobatan)'
      },
      {
        id: 'it-18-2',
        sku: 'DEPOT-LP-02',
        name: 'Continuous Computer Laptop Form 2-Ply Carbonless',
        quantityRequested: 20,
        unit: 'pcs',
        unitPrice: 12.50,
        totalPrice: 250.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'ONLINE',
        stockStatus: 'In Stock (Guinobatan)'
      }
    ]
  },
  {
    id: 'ord-0019',
    orderNumber: 'SO-2025-0019',
    customerName: 'Roberto De Guzman',
    customerRole: 'Printing Supervisor',
    itemName: 'Ink Cartridge',
    quantityDisplay: 'Qty: 20 pcs',
    quantity: 20,
    unit: 'pcs',
    unitPrice: 350.00,
    totalPrice: 7000.00,
    badgeText: 'Depot Matched',
    currentStage: 'IDENTIFICATION_OF_STOCKS',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T08:30:00Z',
    updatedAt: '2025-11-10T09:40:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    description: 'Original Black high-yield replacement ink cartridge for office printers.',
    department: 'Printing & Records Section',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'LIGAO',
    purchaseMethod: 'ONLINE',
    items: [
      {
        id: 'it-19-1',
        sku: 'DEPOT-INK-BLK',
        name: 'High-Yield Black Ink Cartridge',
        quantityRequested: 12,
        unit: 'pcs',
        unitPrice: 350.00,
        totalPrice: 4200.00,
        depotBranch: 'LIGAO',
        purchaseMethod: 'ONLINE',
        stockStatus: 'Depot Matched (Ligao)'
      },
      {
        id: 'it-19-2',
        sku: 'DEPOT-INK-CLR',
        name: 'Color Tri-Pack Replacement Ink Cartridge',
        quantityRequested: 8,
        unit: 'pcs',
        unitPrice: 350.00,
        totalPrice: 2800.00,
        depotBranch: 'LIGAO',
        purchaseMethod: 'ONLINE',
        stockStatus: 'Depot Matched (Ligao)'
      }
    ]
  },
  {
    id: 'ord-0020',
    orderNumber: 'SO-2025-0020',
    customerName: 'Elena Cruz',
    customerRole: 'Testing & Curriculum Head',
    itemName: 'Bond Paper (A4)',
    quantityDisplay: 'Qty: 100 reams',
    quantity: 100,
    unit: 'reams',
    unitPrice: 245.00,
    totalPrice: 24500.00,
    badgeText: 'Stock Identified',
    currentStage: 'IDENTIFICATION_OF_STOCKS',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T07:45:00Z',
    updatedAt: '2025-11-10T08:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    description: 'Substance 20 70gsm Ultra White A4 multi-purpose copy paper.',
    department: 'Curriculum & Testing',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'GBTN',
    purchaseMethod: 'NOT_ONLINE',
    items: [
      {
        id: 'it-20-1',
        sku: 'DEPOT-BP-A4',
        name: 'Ultra White A4 Copy Paper 70gsm',
        quantityRequested: 70,
        unit: 'reams',
        unitPrice: 245.00,
        totalPrice: 17150.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'NOT_ONLINE',
        stockStatus: 'In Stock (Guinobatan)'
      },
      {
        id: 'it-20-2',
        sku: 'DEPOT-BP-LTR',
        name: 'Ultra White Letter Copy Paper 70gsm',
        quantityRequested: 30,
        unit: 'reams',
        unitPrice: 245.00,
        totalPrice: 7350.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'NOT_ONLINE',
        stockStatus: 'In Stock (Guinobatan)'
      }
    ]
  },

  // 3. PRICING
  {
    id: 'ord-0017',
    orderNumber: 'SO-2025-0017',
    customerName: 'Cynthia Alvarez',
    customerRole: 'Finance Analyst',
    itemName: 'Printer Ink',
    quantityDisplay: 'Qty: 30 pcs',
    quantity: 30,
    unit: 'pcs',
    unitPrice: 280.00,
    totalPrice: 8400.00,
    badgeText: 'Review Price',
    currentStage: 'PRICING',
    statusLabel: 'Price Review',
    createdAt: '2025-11-09T14:20:00Z',
    updatedAt: '2025-11-10T09:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    description: 'Refill dye ink bottles (Cyan, Magenta, Yellow, Black) multi-pack.',
    department: 'Finance Division',
    depotBranch: 'GBTN',
    purchaseMethod: 'ONLINE',
    items: [
      {
        id: 'it-17-1',
        sku: 'INK-REF-BLK',
        name: 'Refill Black Dye Ink Bottle 100ml',
        quantityRequested: 15,
        unit: 'pcs',
        unitPrice: 280.00,
        totalPrice: 4200.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'ONLINE'
      },
      {
        id: 'it-17-2',
        sku: 'INK-REF-COL',
        name: 'Refill Color Dye Ink Bottles 100ml',
        quantityRequested: 15,
        unit: 'pcs',
        unitPrice: 280.00,
        totalPrice: 4200.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'ONLINE'
      }
    ]
  },
  {
    id: 'ord-0021',
    orderNumber: 'SO-2025-0021',
    customerName: 'Mark Anthony Reyes',
    customerRole: 'General Services Custodian',
    itemName: 'Stapler',
    quantityDisplay: 'Qty: 25 pcs',
    quantity: 25,
    unit: 'pcs',
    unitPrice: 165.00,
    totalPrice: 4125.00,
    badgeText: 'Pending Price',
    currentStage: 'PRICING',
    statusLabel: 'Awaiting Quote',
    createdAt: '2025-11-09T16:00:00Z',
    updatedAt: '2025-11-10T08:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy duty desktop stapler with 50-sheet stapling capacity.',
    department: 'General Services',
    depotBranch: 'LIGAO',
    purchaseMethod: 'NOT_ONLINE',
    items: [
      {
        id: 'it-21-1',
        sku: 'OFF-STP-50',
        name: 'Heavy Duty Metal Desktop Stapler 50-Sheet',
        quantityRequested: 25,
        unit: 'pcs',
        unitPrice: 165.00,
        totalPrice: 4125.00,
        depotBranch: 'LIGAO',
        purchaseMethod: 'NOT_ONLINE'
      }
    ]
  },

  // 4. PURCHASING (Showing items bought online and not online)
  {
    id: 'ord-0022',
    orderNumber: 'SO-2025-0022',
    customerName: 'Prof. Jonathan Dizon',
    customerRole: 'Academic Faculty Lead',
    itemName: 'Markers (Box)',
    quantityDisplay: 'Qty: 10 boxes',
    quantity: 10,
    unit: 'boxes',
    unitPrice: 320.00,
    totalPrice: 3200.00,
    badgeText: 'In Purchase',
    currentStage: 'PURCHASING',
    statusLabel: 'In Purchase',
    createdAt: '2025-11-08T11:00:00Z',
    updatedAt: '2025-11-10T07:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    description: 'Dry erase whiteboard markers and permanent markers for classrooms.',
    department: 'Academic Faculty',
    depotBranch: 'GBTN',
    purchaseMethod: 'MIXED',
    items: [
      {
        id: 'it-22-1',
        sku: 'MRK-WB-12',
        name: 'Dry Erase Whiteboard Markers (Box of 12)',
        quantityRequested: 6,
        unit: 'boxes',
        unitPrice: 320.00,
        totalPrice: 1920.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'ONLINE',
        stockStatus: 'Depot Portal (Online)'
      },
      {
        id: 'it-22-2',
        sku: 'MRK-PM-12',
        name: 'Permanent Chisel Tip Markers (Box of 12)',
        quantityRequested: 4,
        unit: 'boxes',
        unitPrice: 320.00,
        totalPrice: 1280.00,
        depotBranch: 'GBTN',
        purchaseMethod: 'NOT_ONLINE',
        stockStatus: 'Direct Branch Pick-up (In-Store)'
      }
    ]
  },
  {
    id: 'ord-0026',
    orderNumber: 'SO-2025-0026',
    customerName: 'Engr. Patrick Villanueva',
    customerRole: 'Facilities Officer',
    itemName: 'Heavy Duty Tape Dispenser',
    quantityDisplay: 'Qty: 8 pcs',
    quantity: 8,
    unit: 'pcs',
    unitPrice: 290.00,
    totalPrice: 2320.00,
    badgeText: 'Processing',
    currentStage: 'PURCHASING',
    statusLabel: 'Online Procurement',
    createdAt: '2025-11-08T09:30:00Z',
    updatedAt: '2025-11-10T08:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    description: 'Weighted non-skid base tape dispensers for shipping and packaging.',
    department: 'Facilities Section',
    depotBranch: 'LIGAO',
    purchaseMethod: 'ONLINE',
    items: [
      {
        id: 'it-26-1',
        sku: 'PKG-DISP-01',
        name: 'Weighted Base Desktop Tape Dispenser',
        quantityRequested: 8,
        unit: 'pcs',
        unitPrice: 290.00,
        totalPrice: 2320.00,
        depotBranch: 'LIGAO',
        purchaseMethod: 'ONLINE',
        stockStatus: 'Depot E-Commerce Order (Online)'
      }
    ]
  },

  // 5. READY FOR DELIVERY
  {
    id: 'ord-0015',
    orderNumber: 'SO-2025-0015',
    customerName: 'Atty. Grace Villafuerte',
    customerRole: 'Registrar Section Head',
    itemName: 'Folders (Long)',
    quantityDisplay: 'Qty: 200 pcs',
    quantity: 200,
    unit: 'pcs',
    unitPrice: 15.00,
    totalPrice: 3000.00,
    badgeText: 'Ready',
    currentStage: 'READY_FOR_DELIVERY',
    statusLabel: 'Ready for Delivery',
    createdAt: '2025-11-07T10:00:00Z',
    updatedAt: '2025-11-10T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    description: 'Long pressboard expandable folders with fastener slots for records.',
    department: 'Registrar Section',
    depotBranch: 'Ligao Branch',
    items: [
      {
        id: 'it-15-1',
        sku: 'OFF-FLD-LONG',
        name: 'Long Pressboard Expandable Folders',
        quantityRequested: 150,
        unit: 'pcs',
        unitPrice: 15.00,
        totalPrice: 2250.00,
        depotBranch: 'Ligao Branch'
      },
      {
        id: 'it-15-2',
        sku: 'OFF-FST-50',
        name: 'Metal Document Fasteners 2-Piece',
        quantityRequested: 50,
        unit: 'pcs',
        unitPrice: 15.00,
        totalPrice: 750.00,
        depotBranch: 'Ligao Branch'
      }
    ]
  },

  // 6. COMPLETED (Historical Fulfilled Orders)
  {
    id: 'ord-0014',
    orderNumber: 'SO-2025-0014',
    customerName: 'Atty. Grace Villafuerte',
    customerRole: 'Registrar Section Head',
    itemName: 'A4 Multi-Purpose Bond Paper',
    quantityDisplay: 'Qty: 150 reams',
    quantity: 150,
    unit: 'reams',
    unitPrice: 240.00,
    totalPrice: 36000.00,
    badgeText: 'Completed',
    currentStage: 'COMPLETED',
    statusLabel: 'Delivered',
    createdAt: '2025-11-05T08:00:00Z',
    updatedAt: '2025-11-09T16:30:00Z',
    completedAt: '2025-11-09T16:30:00Z',
    deliveryNotes: 'Delivered and verified by Registrar Receiving Officer.',
    description: 'Substance 20 70gsm Ultra White A4 copy paper.',
    department: 'Registrar Section',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'Guinobatan Branch',
    items: [
      {
        id: 'it-14-1',
        sku: 'DEPOT-BP-A4',
        name: 'A4 Multi-Purpose Bond Paper 70gsm (500 sheets/ream)',
        quantityRequested: 150,
        unit: 'reams',
        unitPrice: 240.00,
        totalPrice: 36000.00,
        depotBranch: 'Guinobatan Branch'
      }
    ]
  },
  {
    id: 'ord-0012',
    orderNumber: 'SO-2025-0012',
    customerName: 'Mark Anthony Reyes',
    customerRole: 'General Services Custodian',
    itemName: 'Heavy Duty Desktop Stapler',
    quantityDisplay: 'Qty: 15 pcs',
    quantity: 15,
    unit: 'pcs',
    unitPrice: 185.00,
    totalPrice: 2775.00,
    badgeText: 'Completed',
    currentStage: 'COMPLETED',
    statusLabel: 'Delivered',
    createdAt: '2025-11-04T11:20:00Z',
    updatedAt: '2025-11-08T14:15:00Z',
    completedAt: '2025-11-08T14:15:00Z',
    deliveryNotes: 'Signed by Property Custodian.',
    description: 'Heavy duty steel staplers with staple wire boxes.',
    department: 'General Services',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'Ligao Branch',
    items: [
      {
        id: 'it-12-1',
        sku: 'OFF-STP-HD',
        name: 'Heavy Duty Desktop Stapler with Rubber Base',
        quantityRequested: 15,
        unit: 'pcs',
        unitPrice: 185.00,
        totalPrice: 2775.00,
        depotBranch: 'Ligao Branch'
      }
    ]
  },
  {
    id: 'ord-0010',
    orderNumber: 'SO-2025-0010',
    customerName: 'Teacher Karen Morales',
    customerRole: 'SNED Coordinator',
    itemName: 'Sensory Tactile Stepping Stones',
    quantityDisplay: 'Qty: 8 sets',
    quantity: 8,
    unit: 'sets',
    unitPrice: 1450.00,
    totalPrice: 11600.00,
    badgeText: 'Completed',
    currentStage: 'COMPLETED',
    statusLabel: 'Delivered',
    createdAt: '2025-11-03T09:10:00Z',
    updatedAt: '2025-11-07T11:45:00Z',
    completedAt: '2025-11-07T11:45:00Z',
    deliveryNotes: 'Delivered directly to Sensory Therapy Room 102.',
    description: 'Anti-slip textured balance river stones for sensory integration.',
    department: 'SNED Resource Center',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'Guinobatan Branch',
    items: [
      {
        id: 'it-10-1',
        sku: 'SNED-ST-08',
        name: 'Textured Sensory River Balance Stepping Stones',
        quantityRequested: 8,
        unit: 'sets',
        unitPrice: 1450.00,
        totalPrice: 11600.00,
        depotBranch: 'Guinobatan Branch'
      }
    ]
  },
  {
    id: 'ord-0008',
    orderNumber: 'SO-2025-0008',
    customerName: 'Roberto De Guzman',
    customerRole: 'Printing Supervisor',
    itemName: 'High-Yield Cyan & Magenta Ink',
    quantityDisplay: 'Qty: 24 bottles',
    quantity: 24,
    unit: 'pcs',
    unitPrice: 290.00,
    totalPrice: 6960.00,
    badgeText: 'Completed',
    currentStage: 'COMPLETED',
    statusLabel: 'Delivered',
    createdAt: '2025-11-02T13:40:00Z',
    updatedAt: '2025-11-06T10:20:00Z',
    completedAt: '2025-11-06T10:20:00Z',
    deliveryNotes: 'Delivered to Production Printing room.',
    description: 'Genuine refilling inks with verified batch authenticity.',
    department: 'Printing & Records Section',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'Guinobatan Branch',
    items: [
      {
        id: 'it-8-1',
        sku: 'INK-CYAN-100',
        name: 'High-Yield Cyan Ink Bottle 100ml',
        quantityRequested: 12,
        unit: 'pcs',
        unitPrice: 290.00,
        totalPrice: 3480.00,
        depotBranch: 'Guinobatan Branch'
      },
      {
        id: 'it-8-2',
        sku: 'INK-MAG-100',
        name: 'High-Yield Magenta Ink Bottle 100ml',
        quantityRequested: 12,
        unit: 'pcs',
        unitPrice: 290.00,
        totalPrice: 3480.00,
        depotBranch: 'Guinobatan Branch'
      }
    ]
  },
  {
    id: 'ord-0005',
    orderNumber: 'SO-2025-0005',
    customerName: 'Prof. Jonathan Dizon',
    customerRole: 'Academic Faculty Lead',
    itemName: 'Whiteboard Marker Multi-Color Pack',
    quantityDisplay: 'Qty: 40 boxes',
    quantity: 40,
    unit: 'boxes',
    unitPrice: 280.00,
    totalPrice: 11200.00,
    badgeText: 'Completed',
    currentStage: 'COMPLETED',
    statusLabel: 'Delivered',
    createdAt: '2025-10-28T10:00:00Z',
    updatedAt: '2025-11-04T15:00:00Z',
    completedAt: '2025-11-04T15:00:00Z',
    deliveryNotes: 'Received by Academic Dean office.',
    description: 'Non-toxic low-odor dry erase markers.',
    department: 'Academic Faculty',
    depotUrl: 'https://7starsdepot.netlify.app/',
    depotBranch: 'Ligao Branch',
    items: [
      {
        id: 'it-5-1',
        sku: 'MRK-WB-40',
        name: 'Whiteboard Marker Multi-Color Pack (Box of 12)',
        quantityRequested: 40,
        unit: 'boxes',
        unitPrice: 280.00,
        totalPrice: 11200.00,
        depotBranch: 'Ligao Branch'
      }
    ]
  }
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Bond Paper (A4)',
    quantityDisplay: '120 reams',
    status: 'In Stock',
    iconType: 'paper',
    stockCount: 120,
    unit: 'reams'
  },
  {
    id: 'inv-2',
    name: 'Printer Ink (Black)',
    quantityDisplay: '45 pcs',
    status: 'In Stock',
    iconType: 'ink',
    stockCount: 45,
    unit: 'pcs'
  },
  {
    id: 'inv-3',
    name: 'Stapler',
    quantityDisplay: '30 pcs',
    status: 'In Stock',
    iconType: 'stapler',
    stockCount: 30,
    unit: 'pcs'
  },
  {
    id: 'inv-4',
    name: 'Markers',
    quantityDisplay: '50 boxes',
    status: 'Low Stock',
    iconType: 'markers',
    stockCount: 50,
    unit: 'boxes'
  },
  {
    id: 'inv-5',
    name: 'Folders (Long)',
    quantityDisplay: '10 pcs',
    status: 'In Stock',
    iconType: 'folders',
    stockCount: 10,
    unit: 'pcs'
  }
];

export const SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    type: 'warning',
    title: 'Markers (Box) stock is low (5 boxes left)',
    timeAgo: '2h ago',
    timestamp: '2025-11-10T08:24:00Z'
  },
  {
    id: 'alt-2',
    type: 'info',
    title: 'SO-2025-0021 is awaiting price confirmation',
    timeAgo: '3h ago',
    timestamp: '2025-11-10T07:24:00Z'
  },
  {
    id: 'alt-3',
    type: 'success',
    title: 'SO-2025-0015 delivered Successfully',
    timeAgo: '1d ago',
    timestamp: '2025-11-09T10:24:00Z'
  }
];
