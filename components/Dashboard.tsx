import React from 'react';
import { AppState } from '../types';
import { Calendar, CheckCircle, Wallet, ShoppingCart, Database, Cloud, Wifi, AlertTriangle, Sparkles, Users } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const weddingDate = new Date('2026-10-10T00:00:00');
  const today = new Date();

  const daysLeft = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const bookedVendors = state.vendors.filter(v => v.status === 'booked').length;

  // Total vendors in the system regardless of status
  const totalVendors = state.vendors.length;

  // Calculate spent based on assigned vendorId in budget
  const totalSpent = state.budget
    .filter(item => item.vendorId)
    .reduce((acc, item) => acc + item.spent, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-wedding-charcoal min-h-80 h-auto py-10 flex items-center justify-center text-center p-6 border-4 border-white/10">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
          <div className="sparkle-card relative px-8 md:px-16 py-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15),0_0_20px_rgba(212,175,55,0.1)] border border-wedding-gold/20 backdrop-blur-md transition-transform hover:scale-[1.01]">
            <div className="absolute -top-3 -left-3 text-wedding-gold animate-pulse"><Sparkles size={24} /></div>
            <div className="absolute -bottom-3 -right-3 text-wedding-gold animate-pulse delay-700"><Sparkles size={24} /></div>

            <h1 className="wedding-text-gold text-5xl md:text-7xl font-serif font-bold tracking-tight mb-2 select-none">
              Tara & Caner
            </h1>
            <div className="w-16 h-[2px] bg-wedding-gold/30 mx-auto my-4 rounded-full"></div>
            <p className="text-wedding-gold text-xl md:text-2xl font-light tracking-[0.5em] font-sans">
              10.10.2026
            </p>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 bg-wedding-gold text-wedding-charcoal rounded-full px-8 py-2.5 shadow-lg font-bold text-sm tracking-widest uppercase hover:bg-yellow-600 transition-colors cursor-default">
            <Calendar size={16} />
            <span>{daysLeft} Days To Go</span>
          </div>
          <p className="text-[10px] mt-4 text-wedding-sand uppercase tracking-widest font-black drop-shadow-md">Bodrum Celebration Portfolio</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 bg-wedding-sand rounded-full text-wedding-olive">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Booked Vendors</p>
            <p className="text-2xl font-bold font-serif text-wedding-charcoal">{bookedVendors}</p>
            <p className="text-[9px] text-gray-500 font-medium">Confirmed Contracts</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 bg-wedding-blush rounded-full text-pink-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Vendor Pool</p>
            <p className="text-2xl font-bold font-serif text-wedding-charcoal">{totalVendors}</p>
            <p className="text-[9px] text-gray-500 font-medium">Total Options Shortlisted</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Total Investment</p>
            <p className="text-2xl font-bold font-serif text-green-600">
              ${totalSpent.toLocaleString()}
            </p>
            <p className="text-[9px] text-gray-500 font-medium">Sum of Confirmed Costs</p>
          </div>
        </div>
      </div>

      {/* Assistant Tip & Data Security Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-wedding-olive to-emerald-700 text-white p-6 rounded-2xl shadow-lg flex items-start space-x-4 border border-white/10">
          <div className="flex-shrink-0">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Tara & Caner's Planning Insight</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              We are now deep in the planning phase. With {daysLeft} days remaining, our focus is on finalizing the premium Bodrum guest experience. The cloud database is fully synchronized for all contributors.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-4">
            <Cloud size={18} className="text-wedding-gold" />
            <h3 className="font-bold text-wedding-charcoal text-sm uppercase tracking-widest">Live Cloud Status</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Engine:</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                <Wifi size={10} /> Firebase DB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Security:</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                ENCRYPTED
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold mb-1 uppercase">
                <AlertTriangle size={12} /> Sync Note
              </div>
              <p className="text-[10px] text-gray-500 leading-tight italic">
                All changes made by Tara or Caner are visible instantly across devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;