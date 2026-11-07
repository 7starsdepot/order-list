/**
 * Supply Order Monitoring System
 * Complete type definitions matching the reference dashboard UI
 */

export type OrderStage = 
  | 'STOCKS_AVAILABLE'
  | 'PRICING'
  | 'PURCHASING'
  | 'READY_FOR_DELIVERY'
  | 'COMPLETED';

export type CardBadgeType = 
  | 'In Stock'
  | 'Review Price'
  | 'Pending Price'
  | 'In Purchase'
  | 'Processing'
  | 'Ready'
  | 'Completed';

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  genericName?: string;
  quantityRequested: number;
  unit: string;
  unitPrice: number; // in PHP (₱)
  warehouseLocation?: string;
  imageUrl?: string;
}

export interface SupplyOrder {
  id: string;
  orderNumber: string; // e.g., "SO-2025-0018"
  itemName: string; // e.g., "Laptop Paper"
  quantityDisplay: string; // e.g., "Qty: 50 pcs"
  quantity: number;
  unit: string; // e.g., "pcs", "reams", "boxes"
  unitPrice: number; // e.g., 12.50
  totalPrice: number; // e.g., 625.00
  badgeText: CardBadgeType;
  currentStage: OrderStage;
  statusLabel?: string; // e.g., "In Progress", "Ready", "Completed"
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  description?: string;
  department?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantityDisplay: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  iconType: 'paper' | 'ink' | 'stapler' | 'markers' | 'folders';
  stockCount: number;
  unit: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  timeAgo: string;
  timestamp: string;
}
