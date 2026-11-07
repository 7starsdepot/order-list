import React from 'react';
import { 
  ShoppingCart, 
  Home, 
  Package, 
  ClipboardList, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut,
  CheckCircle2,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A1628] text-white flex flex-col justify-between p-4 shrink-0 min-h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-6 border-b border-slate-800/80">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-sky-500/30">
              <ShoppingCart className="w-8 h-8 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0A1628]" />
            </div>
          </div>
          <h1 className="text-base font-bold text-white tracking-tight leading-snug">
            Supply Order
            <br />
            Monitoring System
          </h1>
          <p className="text-[11px] text-slate-400 font-medium mt-1 tracking-wider uppercase">
            Track • Monitor • Deliver
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1D6FEB] text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onSelectTab('logout')}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Bottom Illustration Container */}
      <div className="pt-6 pb-2 text-center">
        <div className="relative flex justify-center items-center mb-3">
          {/* Stylized clipboard & package stack */}
          <div className="w-28 h-24 relative flex items-center justify-center">
            {/* Delivery Box Left */}
            <div className="absolute -left-1 bottom-1 w-10 h-10 bg-[#E08A28] rounded-md shadow-md border-t-2 border-[#F9B156] transform -rotate-12 flex items-center justify-center">
              <div className="w-8 h-1 bg-[#B46714] rounded-full opacity-60" />
            </div>

            {/* Delivery Box Right */}
            <div className="absolute -right-1 bottom-0 w-11 h-11 bg-[#CF7A1D] rounded-md shadow-md border-t-2 border-[#F9B156] transform rotate-6 flex items-center justify-center">
              <div className="w-9 h-1 bg-[#B46714] rounded-full opacity-60" />
            </div>

            {/* Clipboard Center */}
            <div className="relative z-10 w-16 h-20 bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 flex flex-col justify-between">
              <div className="w-6 h-2 bg-slate-300 rounded-full mx-auto -mt-2.5 shadow-xs" />
              <div className="space-y-1 my-auto">
                <div className="w-full h-1 bg-sky-500 rounded-full" />
                <div className="w-3/4 h-1 bg-slate-200 rounded-full" />
                <div className="w-4/5 h-1 bg-slate-200 rounded-full" />
              </div>
              {/* Green checkmark circle */}
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Front Small Box */}
            <div className="absolute -bottom-2 z-20 w-12 h-9 bg-[#E79738] rounded-md shadow-lg border-t border-[#FCD39B] flex items-center justify-center">
              <div className="w-6 h-1 bg-amber-800/40 rounded-full" />
            </div>
          </div>
        </div>

        <p className="font-serif italic text-sm text-sky-200 tracking-wide font-medium mt-1">
          Smart Orders.
        </p>
        <p className="font-serif italic text-sm text-sky-200 tracking-wide font-medium">
          On-Time Delivery.
        </p>
      </div>
    </aside>
  );
};
