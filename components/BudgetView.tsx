import React, { useMemo } from 'react';
import { BudgetItem, VendorCategory, Vendor } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingBag, RotateCcw, CheckCircle2, DollarSign, Tag, Heart } from 'lucide-react';

interface BudgetViewProps {
  budget: BudgetItem[];
  setBudget: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  vendors: Vendor[];
  categories: string[];
}

const COLORS = ['#D4AF37', '#556B2F', '#A0522D', '#36454F', '#CD7F32', '#8B0000', '#2F4F4F', '#808000', '#9932CC', '#FF4500'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#4B5563"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-[9px] font-sans font-bold"
    >
      {percent > 0.02 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
    </text>
  );
};

const BudgetView: React.FC<BudgetViewProps> = ({ budget, setBudget, vendors, categories }) => {
  const allPossibleCategories = categories;

  const displayBudget = useMemo(() => {
    return allPossibleCategories.map(cat => {
      const existing = budget.find(b => b.category === cat);
      const categoryVendors = vendors.filter(v => v.category === cat);
      const selectedVendor = categoryVendors.find(v => v.id === existing?.vendorId);

      return {
        category: cat,
        spent: selectedVendor ? selectedVendor.priceEstimate : 0,
        vendorId: selectedVendor ? selectedVendor.id : undefined,
      };
    }).sort((a, b) => {
      if (a.spent !== b.spent) return b.spent - a.spent;
      return a.category.localeCompare(b.category);
    });
  }, [budget, vendors, allPossibleCategories]);

  const totalSpent = displayBudget.reduce((sum, item) => sum + item.spent, 0);

  const chartData = useMemo(() => {
    return displayBudget
      .filter(i => i.spent > 0)
      .map(b => ({
        name: b.category,
        value: b.spent
      }));
  }, [displayBudget]);

  const handleVendorSelect = (category: VendorCategory, vendorId: string) => {
    const selectedVendor = vendors.find(v => v.id === vendorId);
    setBudget(prevBudget => {
      const updated = [...prevBudget];
      const index = updated.findIndex(item => item.category === category);
      const newSpent = selectedVendor ? selectedVendor.priceEstimate : 0;

      if (index !== -1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { vendorId: _, ...rest } = updated[index];
        if (vendorId) {
          updated[index] = { ...rest, spent: newSpent, vendorId };
        } else {
          updated[index] = { ...rest, spent: 0 };
        }
      } else {
        // Create new item
        if (vendorId) {
          updated.push({ category, allocated: 0, spent: newSpent, status: 'on-track', vendorId });
        } else {
          updated.push({ category, allocated: 0, spent: 0, status: 'on-track' });
        }
      }
      return updated;
    });
  };

  const handleResetSelections = () => {
    if (window.confirm("Clear all confirmed vendor selections?")) {
      setBudget(prev => prev.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { vendorId, ...rest } = item;
        return { ...rest, spent: 0 };
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full lg:max-h-[calc(100vh-120px)] animate-fade-in pb-20 lg:pb-1">
      {/* Visuals & Summary - Top on Mobile, Left on Desktop */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {/* Chart Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col min-h-[300px] lg:flex-1 lg:min-h-0 overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-serif font-bold text-wedding-charcoal uppercase tracking-wider flex items-center gap-2">
              <Heart size={14} className="text-wedding-gold fill-wedding-gold/20" />
              Wedding Expense Breakdown
            </h3>
            <Tag size={10} className="text-wedding-gold" />
          </div>

          <div className="flex-1 min-h-0 relative h-[250px] lg:h-auto">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    label={renderCustomizedLabel}
                    outerRadius="65%"
                    innerRadius="45%"
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-90 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '11px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300 space-y-2 h-full">
                <DollarSign size={32} className="opacity-10" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-center px-4">Select Your Dream Vendors to see breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="bg-wedding-charcoal rounded-xl p-5 text-white shadow-lg flex items-center justify-between group flex-shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Total Confirmed Cost</p>
            <div className="text-3xl font-bold font-serif tracking-tight text-wedding-gold">${totalSpent.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl transition-transform group-hover:scale-110">
            <ShoppingBag size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Category List - Bottom on Mobile, Right on Desktop */}
      <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-stone-100 flex flex-col lg:h-full overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-50 flex justify-between items-center bg-stone-50/50 flex-shrink-0">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-wedding-charcoal">Planner Checklist</h3>
            <p className="text-[8px] text-gray-400 font-medium">LOCKED SELECTIONS UPDATE AUTOMATICALLY</p>
          </div>
          <button onClick={handleResetSelections} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full border border-stone-100">
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Two-column grid layout on larger screens, single column on mobile if needed but keeping 2 cols for compactness */}
        <div className="flex-1 lg:overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 content-start custom-scrollbar">
          {displayBudget.map((item, idx) => {
            const categoryVendors = vendors.filter(v => v.category === item.category);
            const isSelected = !!item.vendorId;

            return (
              <div
                key={item.category}
                className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg border transition-all ${isSelected
                  ? 'bg-wedding-sand/10 border-wedding-gold/30 shadow-sm'
                  : 'bg-stone-50/30 border-stone-100 hover:border-stone-200'
                  }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-[10px] font-bold truncate ${isSelected ? 'text-wedding-charcoal' : 'text-gray-500'}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-wedding-olive' : 'text-gray-300'}`}>
                      ${item.spent.toLocaleString()}
                    </span>
                    {isSelected && <CheckCircle2 size={10} className="text-wedding-olive" />}
                  </div>
                </div>
                <div className="relative">
                  <select
                    className={`w-full py-1.5 pl-2 pr-8 text-[11px] border rounded-md appearance-none cursor-pointer bg-white transition-all outline-none ${isSelected
                      ? 'border-wedding-gold/50 text-wedding-charcoal font-medium'
                      : 'border-stone-200 text-gray-400'
                      }`}
                    onChange={(e) => handleVendorSelect(item.category as VendorCategory, e.target.value)}
                    value={item.vendorId ?? ''}
                  >
                    <option value="">{categoryVendors.length > 0 ? 'Select Vendor...' : 'No options yet'}</option>
                    {categoryVendors.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} (${v.priceEstimate.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isSelected ? 'text-wedding-gold' : 'text-stone-300'}`}>
                    <DollarSign size={10} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-stone-50/50 border-t border-stone-100 flex-shrink-0 flex justify-between items-center">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Locked Progress</span>
          <span className="text-[9px] text-wedding-gold font-bold">
            {displayBudget.filter(i => i.vendorId).length} OF {displayBudget.length} VENDORS
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetView;