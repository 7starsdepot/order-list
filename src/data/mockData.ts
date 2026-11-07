import { SupplyOrder, InventoryItem, SystemAlert } from '../types/order';

export const INITIAL_ORDERS: SupplyOrder[] = [
  // 1. STOCKS AVAILABLE
  {
    id: 'ord-0018',
    orderNumber: 'SO-2025-0018',
    itemName: 'Laptop Paper',
    quantityDisplay: 'Qty: 50 pcs',
    quantity: 50,
    unit: 'pcs',
    unitPrice: 12.50,
    totalPrice: 625.00,
    badgeText: 'In Stock',
    currentStage: 'STOCKS_AVAILABLE',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T09:15:00Z',
    updatedAt: '2025-11-10T10:24:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    description: 'High quality premium continuous computer laptop form paper for reports and invoicing.',
    department: 'Administrative Division'
  },
  {
    id: 'ord-0019',
    orderNumber: 'SO-2025-0019',
    itemName: 'Ink Cartridge',
    quantityDisplay: 'Qty: 20 pcs',
    quantity: 20,
    unit: 'pcs',
    unitPrice: 350.00,
    totalPrice: 7000.00,
    badgeText: 'In Stock',
    currentStage: 'STOCKS_AVAILABLE',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T08:30:00Z',
    updatedAt: '2025-11-10T09:40:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    description: 'Original Black high-yield replacement ink cartridge for office printers.',
    department: 'Printing & Records Section'
  },
  {
    id: 'ord-0020',
    orderNumber: 'SO-2025-0020',
    itemName: 'Bond Paper (A4)',
    quantityDisplay: 'Qty: 100 reams',
    quantity: 100,
    unit: 'reams',
    unitPrice: 245.00,
    totalPrice: 24500.00,
    badgeText: 'In Stock',
    currentStage: 'STOCKS_AVAILABLE',
    statusLabel: 'In Progress',
    createdAt: '2025-11-10T07:45:00Z',
    updatedAt: '2025-11-10T08:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    description: 'Substance 20 70gsm Ultra White A4 multi-purpose copy paper.',
    department: 'Curriculum & Testing'
  },

  // 2. PRICING
  {
    id: 'ord-0017',
    orderNumber: 'SO-2025-0017',
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
    department: 'Finance Division'
  },
  {
    id: 'ord-0021',
    orderNumber: 'SO-2025-0021',
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
    department: 'General Services'
  },

  // 3. PURCHASING
  {
    id: 'ord-0022',
    orderNumber: 'SO-2025-0022',
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
    description: 'Dry erase whiteboard markers, bullet tip, assorted colors (Box of 12).',
    department: 'Academic Faculty'
  },

  // 4. READY FOR DELIVERY
  {
    id: 'ord-0015',
    orderNumber: 'SO-2025-0015',
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
    department: 'Registrar Section'
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
