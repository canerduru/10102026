import React, { useState } from 'react';
import { Guest } from '../types';
import { Search, Download, Plus, Trash2, User, Users } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}

const GuestList: React.FC<GuestListProps> = ({ guests, setGuests }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter(guest =>
    guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const brideGuests = filteredGuests.filter(g => g.side === 'bride');
  const groomGuests = filteredGuests.filter(g => g.side === 'groom');

  const addGuest = (side: 'bride' | 'groom') => {
    const newGuest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: '',
      lastName: '',
      side
    };
    setGuests([...guests, newGuest]);
  };

  const updateGuest = (id: string, field: 'firstName' | 'lastName', value: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['Side', 'First Name', 'Last Name'];
    const rows = guests.map(g => [
      g.side === 'bride' ? "Bride's Side" : "Groom's Side",
      g.firstName,
      g.lastName
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_guest_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const GuestColumn = ({ title, side, guestsList }: { title: string, side: 'bride' | 'groom', guestsList: Guest[] }) => (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col h-full">
      <div className={`p-4 border-b border-stone-100 flex items-center justify-between ${side === 'bride' ? 'bg-wedding-blush/20' : 'bg-blue-50/50'}`}>
        <h3 className="font-serif font-bold text-lg text-wedding-charcoal flex items-center gap-2">
          {side === 'bride' ? <User className="text-pink-400" size={20} /> : <User className="text-blue-400" size={20} />}
          {title}
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{guestsList.length} Guests</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {guestsList.length === 0 && (
          <div className="text-center py-8 text-gray-400 italic text-sm">
            No guests added yet.
          </div>
        )}
        {guestsList.map(guest => (
          <div key={guest.id} className="flex gap-2 items-center animate-fade-in group">
            <input
              type="text"
              placeholder="First Name"
              value={guest.firstName}
              onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)}
              className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-wedding-gold outline-none transition-shadow"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={guest.lastName}
              onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)}
              className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-wedding-gold outline-none transition-shadow"
            />
            <button
              onClick={() => removeGuest(guest.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Remove Guest"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-stone-100 bg-stone-50/50">
        <button
          onClick={() => addGuest(side)}
          className="w-full py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-wedding-gold hover:text-wedding-gold hover:bg-white transition-all"
        >
          <Plus size={16} /> Add Guest
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-wedding-charcoal mb-1">Guest List</h2>
          <p className="text-gray-500 text-sm">Manage your invitees for both sides.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search Guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-full text-sm focus:ring-2 focus:ring-wedding-gold outline-none shadow-sm"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-wedding-charcoal text-white rounded-full text-sm font-bold shadow-md hover:bg-black transition-colors whitespace-nowrap"
          >
            <Download size={16} /> <span className="hidden sm:inline">Download List</span>
          </button>
        </div>
      </div>

      {/* Lists Container */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 pb-6">
        <GuestColumn title="Bride's Side" side="bride" guestsList={brideGuests} />
        <GuestColumn title="Groom's Side" side="groom" guestsList={groomGuests} />
      </div>
    </div>
  );
};

export default GuestList;
