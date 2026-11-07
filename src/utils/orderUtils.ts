import { OrderStage, SupplyOrder, CardBadgeType } from '../types/order';

export interface StageConfig {
  id: OrderStage;
  stepNumber: number;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  borderColor: string;
  numberBg: string;
}

export const STAGES_CONFIG: Record<OrderStage, StageConfig> = {
  STOCKS_AVAILABLE: {
    id: 'STOCKS_AVAILABLE',
    stepNumber: 1,
    label: 'STOCKS AVAILABLE',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-[#EBF3FF]',
    borderColor: 'border-[#3B82F6]',
    numberBg: 'bg-[#2563EB]'
  },
  PRICING: {
    id: 'PRICING',
    stepNumber: 2,
    label: 'PRICING',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    headerBg: 'bg-[#E8F8F0]',
    borderColor: 'border-[#10B981]',
    numberBg: 'bg-[#10B981]'
  },
  PURCHASING: {
    id: 'PURCHASING',
    stepNumber: 3,
    label: 'PURCHASING',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    headerBg: 'bg-[#FFF3E6]',
    borderColor: 'border-[#F97316]',
    numberBg: 'bg-[#F97316]'
  },
  READY_FOR_DELIVERY: {
    id: 'READY_FOR_DELIVERY',
    stepNumber: 4,
    label: 'READY FOR DELIVERY',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-[#F3E8FF]',
    borderColor: 'border-[#8B5CF6]',
    numberBg: 'bg-[#8B5CF6]'
  },
  COMPLETED: {
    id: 'COMPLETED',
    stepNumber: 5,
    label: 'COMPLETED',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-[#ECFDF5]',
    borderColor: 'border-[#059669]',
    numberBg: 'bg-[#059669]'
  }
};

export const ORDERED_STAGES: OrderStage[] = [
  'STOCKS_AVAILABLE',
  'PRICING',
  'PURCHASING',
  'READY_FOR_DELIVERY'
];

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return `₱${formatted}`;
}

export function getBadgeStyle(badge: CardBadgeType | string): {
  bg: string;
  text: string;
  border?: string;
} {
  switch (badge) {
    case 'In Stock':
      return {
        bg: 'bg-[#E8F8EE]',
        text: 'text-[#16A34A]',
        border: 'border-[#BBF7D0]'
      };
    case 'Review Price':
      return {
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#D97706]',
        border: 'border-[#FDE68A]'
      };
    case 'Pending Price':
      return {
        bg: 'bg-[#F1F5F9]',
        text: 'text-[#475569]',
        border: 'border-[#E2E8F0]'
      };
    case 'In Purchase':
      return {
        bg: 'bg-[#F5F3FF]',
        text: 'text-[#7C3AED]',
        border: 'border-[#DDD6FE]'
      };
    case 'Processing':
    case '🛒 Processing':
      return {
        bg: 'bg-[#EFF6FF]',
        text: 'text-[#2563EB]',
        border: 'border-[#BFDBFE]'
      };
    case 'Ready':
      return {
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#15803D]',
        border: 'border-[#86EFAC]'
      };
    case 'Completed':
      return {
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#15803D]',
        border: 'border-[#86EFAC]'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200'
      };
  }
}

const STORAGE_KEY = 'supplyflow_dashboard_orders_v3';

export function loadSavedOrders(fallback: SupplyOrder[]): SupplyOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return fallback;
  } catch (e) {
    console.error('Failed to load orders from storage:', e);
    return fallback;
  }
}

export function saveOrdersToStorage(orders: SupplyOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage:', e);
  }
}
