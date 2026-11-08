/**
 * Supply Order Monitoring System
 * Complete type definitions matching the reference dashboard UI
 */

export type OrderStage = 
  | 'ORDERS'
  | 'IDENTIFICATION_OF_STOCKS'
  | 'PRICING'
  | 'PURCHASING'
  | 'READY_FOR_DELIVERY'
  | 'COMPLETED';

export type CardBadgeType = 
  | 'New Order'
  | 'Pending Intake'
  | 'Stock Identified'
  | 'Depot Matched'
  | 'In Stock'
  | 'Review Price'
  | 'Pending Price'
  | 'In Purchase'
  | 'Processing'
  | 'Ready'
  | 'Completed';

export type PurchaseMethod = 'ONLINE' | 'NOT_ONLINE';
export type DepotBranchType = 'GBTN' | 'LIGAO' | 'Guinobatan Branch' | 'Ligao Branch';

export interface OrderItem {
  id: string;
  sku?: string;
  name: string;
  genericName?: string;
  quantityRequested: number;
  unit: string;
  unitPrice: number; // in PHP (₱)
  totalPrice?: number;
  warehouseLocation?: string;
  depotBranch?: DepotBranchType | string;
  purchaseMethod?: PurchaseMethod; // 'ONLINE' = Bought Online, 'NOT_ONLINE' = In-Store / Walk-in
  stockStatus?: string;
  imageUrl?: string;
}

export interface SupplyOrder {
  id: string;
  orderNumber: string; // e.g., "SO-2025-0018"
  customerName: string; // e.g., "Maria Santos"
  customerRole?: string; // e.g., "Administrative Officer"
  customerEmail?: string;
  itemName: string; // primary item summary e.g. "Laptop Paper (Continuous Form)"
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
  depotUrl?: string; // e.g., "https://7starsdepot.netlify.app/"
  depotBranch?: DepotBranchType | string; // 'GBTN' | 'LIGAO'
  purchaseMethod?: PurchaseMethod | 'MIXED'; // 'ONLINE' | 'NOT_ONLINE' | 'MIXED'
  completedAt?: string; // e.g., "2025-11-09T14:30:00Z"
  deliveryNotes?: string; // e.g., "Delivered to Admin Bldg Room 204"
  items?: OrderItem[]; // List of all items included in this customer's order
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
