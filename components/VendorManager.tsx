import React, { useState } from 'react';
import { Vendor, VendorCategory } from '../types';
import { Star, MapPin, DollarSign, Plus, Check, X, Search, Heart, RotateCcw, FileText, Edit2, ExternalLink, Trash2 } from 'lucide-react';

interface VendorManagerProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const VendorManager: React.FC<VendorManagerProps> = ({ vendors, setVendors, categories, setCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'All'>('All');
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [newVendorOpen, setNewVendorOpen] = useState(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [search, setSearch] = useState('');
  const [hoveredStar, setHoveredStar] = useState<{ id: string, rating: number } | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const filteredVendors = vendors.filter(v =>
    (selectedCategory === 'All' || v.category === selectedCategory) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(c => c !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      } else {
        alert("You can compare up to 3 vendors at a time.");
      }
    }
  };

  const handleAddVendor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVendor: Vendor = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      category: formData.get('category') as VendorCategory,
      priceEstimate: Number(formData.get('price')),
      rating: 0,
      reviewCount: 0,
      location: formData.get('location') as string,
      available: true,
      notes: formData.get('notes') as string || '',
      portfolioUrl: formData.get('portfolioUrl') as string || '',
      status: 'pending'
    };
    setVendors([...vendors, newVendor]);
    setNewVendorOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
      setNewCategoryOpen(false);
      setNewCategoryName('');
    }
  };

  const deleteVendor = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter(v => v.id !== id));
      setCompareList(compareList.filter(c => c !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const newStatus = v.status === 'favorite' ? 'pending' : 'favorite';
        return { ...v, status: newStatus };
      }
      return v;
    }));
  };

  const handleRateVendor = (id: string, newRating: number) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        // Direct assignment of rating (1-5 integers) as requested by user
        // Removed average calculation
        return { ...v, rating: newRating, reviewCount: 1 };
      }
      return v;
    }));
  };

  const handleResetRatings = () => {
    if (window.confirm("Are you sure you want to reset all vendor ratings?")) {
      setVendors(prevVendors => prevVendors.map(v => ({ ...v, rating: 0, reviewCount: 0 })));
    }
  };

  const startEditingNotes = (vendor: Vendor) => {
    setEditingNotesId(vendor.id);
    setTempNotes(vendor.notes);
  };

  const saveNotes = (id: string) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, notes: tempNotes } : v));
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-wedding-charcoal">Vendor Portfolio</h2>
          <p className="text-gray-500">Manage and compare your Bodrum dream team.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleResetRatings}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw size={18} /> <span className="hidden sm:inline">Reset Ratings</span>
          </button>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${compareMode ? 'bg-wedding-charcoal text-white border-transparent' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {compareMode ? 'Exit Comparison' : 'Compare'}
          </button>
          <button
            onClick={() => setNewCategoryOpen(true)}
            className="px-4 py-2 bg-stone-100 text-wedding-charcoal rounded-lg hover:bg-stone-200 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus size={18} /> New Category
          </button>
          <button
            onClick={() => setNewVendorOpen(true)}
            className="px-4 py-2 bg-wedding-gold text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus size={18} /> Add Vendor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-stone-200 items-center">
        <div className="relative mr-2 w-full md:w-auto mb-2 md:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-wedding-gold text-sm w-full md:w-48 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${selectedCategory === cat ? 'bg-wedding-olive text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className={`group bg-white rounded-xl shadow-sm border transition-all hover:shadow-md flex flex-col ${compareList.includes(vendor.id) ? 'border-wedding-gold ring-2 ring-wedding-gold/20' : 'border-stone-100'}`}>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="p-1.5 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    title="Delete Vendor"
                  >
                    <Trash2 size={14} />
                  </button>
                  {compareMode && (
                    <button
                      onClick={() => toggleCompare(vendor.id)}
                      className={`p-1.5 rounded-lg transition-colors ${compareList.includes(vendor.id) ? 'bg-wedding-gold text-white' : 'bg-stone-100 hover:bg-stone-200 text-gray-600'}`}
                    >
                      <Search size={14} />
                    </button>
                  )}
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${vendor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {vendor.available ? 'Available' : 'Booked'}
                </div>
              </div>

              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{vendor.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{vendor.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider ${vendor.status === 'booked' ? 'bg-wedding-olive text-white' :
                    vendor.status === 'favorite' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {vendor.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-yellow-500 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-700 mr-1">{vendor.rating}</span>
                  <div className="flex cursor-pointer" onMouseLeave={() => setHoveredStar(null)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={(hoveredStar?.id === vendor.id && star <= hoveredStar.rating) || (hoveredStar?.id !== vendor.id && star <= Math.round(vendor.rating)) ? "currentColor" : "none"}
                        onMouseEnter={() => setHoveredStar({ id: vendor.id, rating: star })}
                        onClick={() => handleRateVendor(vendor.id, star)}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">({vendor.reviewCount})</span>
              </div>

              <div className="flex justify-between items-center text-sm py-2 border-t border-gray-100 mb-3">
                <div className="flex items-center text-gray-600 font-mono font-bold">
                  <DollarSign size={14} />
                  {vendor.priceEstimate.toLocaleString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate max-w-[120px]">{vendor.location}</span>
                </div>
              </div>

              <div className="relative bg-gray-50 rounded-lg p-3 group/notes flex-1 mb-4">
                {editingNotesId === vendor.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full text-xs p-2 border rounded bg-white text-gray-800 outline-none"
                      value={tempNotes}
                      rows={2}
                      onChange={(e) => setTempNotes(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditingNotesId(null)} className="p-1"><X size={14} /></button>
                      <button onClick={() => saveNotes(vendor.id)} className="p-1 text-green-600"><Check size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mb-1">
                        <FileText size={10} /> Notes
                      </span>
                      <button onClick={() => startEditingNotes(vendor)} className="opacity-0 group-hover/notes:opacity-100 p-1 text-gray-400 hover:text-wedding-gold transition-opacity">
                        <Edit2 size={10} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      {vendor.notes || "Add notes..."}
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newStatus = vendor.status === 'booked' ? 'pending' : 'booked';
                    const updated = vendors.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v);
                    setVendors(updated);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${vendor.status === 'booked' ? 'bg-wedding-olive text-white' : 'bg-wedding-charcoal text-white hover:bg-black'}`}
                >
                  {vendor.status === 'booked' ? 'Confirmed' : 'Select Vendor'}
                </button>
                <button onClick={() => toggleFavorite(vendor.id)} className={`p-2 border rounded-lg ${vendor.status === 'favorite' ? 'border-pink-200 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-600'}`}>
                  <Heart size={18} fill={vendor.status === 'favorite' ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vendor Modal */}
      {newVendorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-wedding-charcoal">New Vendor</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Add to Tara & Caner Portfolio</p>
              </div>
              <button onClick={() => setNewVendorOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-gray-400"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Vendor Name</label>
                <input
                  name="name"
                  required
                  className="w-full border border-stone-200 rounded-xl p-3 bg-white text-gray-800 focus:ring-2 focus:ring-wedding-gold focus:border-transparent outline-none shadow-sm transition-all"
                  placeholder="e.g. Aegean Dream Catering"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Service Category</label>
                <select
                  name="category"
                  className="w-full border border-stone-200 rounded-xl p-3 bg-white text-gray-800 focus:ring-2 focus:ring-wedding-gold focus:border-transparent outline-none shadow-sm appearance-none cursor-pointer transition-all"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Estimated Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    className="w-full border border-stone-200 rounded-xl p-3 bg-white text-gray-800 focus:ring-2 focus:ring-wedding-gold focus:border-transparent outline-none shadow-sm transition-all"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                  <input
                    name="location"
                    defaultValue="Bodrum"
                    className="w-full border border-stone-200 rounded-xl p-3 bg-white text-gray-800 focus:ring-2 focus:ring-wedding-gold focus:border-transparent outline-none shadow-sm transition-all"
                    placeholder="e.g. Yalıkavak"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-wedding-gold text-white py-4 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-wedding-gold/20 flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {newCategoryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm animate-scale-in shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold text-wedding-charcoal">New Category</h3>
              <button onClick={() => setNewCategoryOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
                <input
                  autoFocus
                  className="w-full border border-stone-200 rounded-xl p-3 bg-white text-gray-800 focus:ring-2 focus:ring-wedding-gold outline-none"
                  placeholder="e.g. Fireworks"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-wedding-charcoal text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManager;