import React, { useState, useEffect, useRef } from 'react';
import { ViewState, AppState } from './types';
import { INITIAL_BUDGET, INITIAL_VENDORS, INITIAL_NOTES, INITIAL_CATEGORIES, INITIAL_GUESTS } from './constants';
import Dashboard from './components/Dashboard';
import VendorManager from './components/VendorManager';
import BudgetView from './components/BudgetView';
import InspirationBoard from './components/InspirationBoard';
import GuestList from './components/GuestList';
import AIChat from './components/AIChat';
import LoginScreen from './components/LoginScreen';
import { LayoutDashboard, Users, PieChart, Lightbulb, Menu, X, LogOut, Database, Download, Upload, RefreshCw, Wifi, AlertCircle, Settings, Heart, Maximize, Minimize, UserPlus } from 'lucide-react';
import { ref, onValue, set, off, Database as FirebaseDatabaseType } from 'firebase/database';
import { db } from './services/firebase';

const DB_PATH = 'wedding_data_v1';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  const dbRef = useRef<FirebaseDatabaseType | null>(null);
  const remoteChangeInProgress = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    try {
      dbRef.current = db;

      const dataRef = ref(db, DB_PATH);
      const connectedRef = ref(db, '.info/connected');

      // Monitor Connection
      onValue(connectedRef, (snap) => {
        setConnectionStatus(snap.val() === true ? 'connected' : 'disconnected');
      });

      // Initial Data Fetch & Monitor
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data && !remoteChangeInProgress.current) {
          remoteChangeInProgress.current = true;
          if (data.vendors) setVendors(data.vendors);
          if (data.budget) setBudget(data.budget);
          if (data.notes) setNotes(data.notes);
          if (data.guests) setGuests(data.guests);
          if (data.categories) setCategories(data.categories);
          setTimeout(() => { remoteChangeInProgress.current = false; }, 500);
        }
      });
    } catch (error) {
      console.error("Firebase Error:", error);
    }
  }, []);

  useEffect(() => {
    if (!dbRef.current || remoteChangeInProgress.current || connectionStatus !== 'connected') return;

    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const safeData = JSON.parse(JSON.stringify({ vendors, budget, notes, guests, categories }));
        await set(ref(dbRef.current!, DB_PATH), safeData);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [vendors, budget, notes, guests, categories, connectionStatus]);

  const state: AppState = { vendors, budget, notes, guests, categories };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans text-wedding-charcoal">
      {/* Sync Notification */}
      <div className={`fixed top-12 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${showSavedToast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        <div className="bg-wedding-charcoal text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-white/10 uppercase tracking-widest">
          <Wifi size={14} className="text-blue-400" /> Synchronized
        </div>
      </div>

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-full shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-wedding-gold mb-8">
            <div className="w-10 h-10 rounded-full bg-wedding-gold/10 border-2 border-wedding-gold flex items-center justify-center font-serif font-bold text-lg">T&C</div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-gray-800 leading-none">Tara & Caner</span>
              <span className="text-[9px] uppercase tracking-widest text-wedding-gold font-bold mt-1">Wedding 2026</span>
            </div>
          </div>
          <nav className="space-y-2">
            {[
              { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
              { id: ViewState.VENDORS, label: 'Vendors', icon: Users },
              { id: ViewState.BUDGET, label: 'Budget & Costs', icon: PieChart },
              { id: ViewState.INSPIRATION, label: 'Inspiration', icon: Lightbulb },
              { id: ViewState.GUEST_LIST, label: 'Guest List', icon: UserPlus },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${view === item.id ? 'bg-wedding-olive text-white shadow-lg scale-[1.02]' : 'text-gray-600 hover:bg-stone-100'}`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-stone-100 space-y-4">
          <div className="space-y-3 px-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {connectionStatus === 'connected' ? 'Cloud Online' : 'Cloud Offline'}
              </div>
              {isSyncing && <RefreshCw size={12} className="text-wedding-gold animate-spin" />}
            </div>
            <div className="flex gap-2">
              <button onClick={toggleFullscreen} className="flex-1 p-2 rounded-lg bg-stone-50 border border-stone-200 text-gray-500 hover:bg-wedding-sand/20 hover:text-wedding-gold transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase">
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                <span>{isFullscreen ? "Shrink" : "Full"}</span>
              </button>
              <button onClick={() => window.location.reload()} className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-gray-500 hover:bg-wedding-sand/20 hover:text-wedding-olive transition-all">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <button onClick={() => setDataModalOpen(true)} className="flex items-center space-x-2 w-full p-2 rounded-md bg-wedding-charcoal text-white text-xs hover:bg-black transition-colors shadow-sm">
            <Database size={14} /> <span>Cloud Settings</span>
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-2 text-red-500 text-sm hover:text-red-700 pl-2 transition-colors">
            <LogOut size={16} /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden bg-white border-b border-stone-200 p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-wedding-gold fill-wedding-gold" />
            <span className="font-serif font-bold text-lg text-wedding-charcoal">Tara & Caner</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2"><Menu /></button>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 bg-white z-[60] p-4 pt-20 flex flex-col gap-2 animate-fade-in">
            <button onClick={() => { setView(ViewState.DASHBOARD); setMobileMenuOpen(false); }} className="p-4 bg-stone-100 rounded-xl flex items-center gap-3 font-bold"><LayoutDashboard /> Dashboard</button>
            <button onClick={() => { setView(ViewState.VENDORS); setMobileMenuOpen(false); }} className="p-4 bg-stone-100 rounded-xl flex items-center gap-3 font-bold"><Users /> Vendors</button>
            <button onClick={() => { setView(ViewState.BUDGET); setMobileMenuOpen(false); }} className="p-4 bg-stone-100 rounded-xl flex items-center gap-3 font-bold"><PieChart /> Budget</button>
            <button onClick={() => { setView(ViewState.INSPIRATION); setMobileMenuOpen(false); }} className="p-4 bg-stone-100 rounded-xl flex items-center gap-3 font-bold"><Lightbulb /> Inspiration</button>
            <button onClick={() => { setView(ViewState.GUEST_LIST); setMobileMenuOpen(false); }} className="p-4 bg-stone-100 rounded-xl flex items-center gap-3 font-bold"><UserPlus /> Guest List</button>
            <button onClick={() => setIsAuthenticated(false)} className="p-4 text-red-500 mt-auto font-bold border-t"><LogOut /> Sign Out</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full custom-scrollbar pt-12 md:pt-8">
          {view === ViewState.DASHBOARD && <Dashboard state={state} />}
          {view === ViewState.VENDORS && <VendorManager vendors={vendors} setVendors={setVendors} categories={categories} setCategories={setCategories} />}
          {view === ViewState.BUDGET && <BudgetView budget={budget} setBudget={setBudget} vendors={vendors} categories={categories} />}
          {view === ViewState.INSPIRATION && <InspirationBoard notes={notes} setNotes={setNotes} />}
          {view === ViewState.GUEST_LIST && <GuestList guests={guests} setGuests={setGuests} />}
        </div>
        <AIChat />
      </main>

      {dataModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in border border-wedding-gold/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold flex items-center gap-2 text-wedding-charcoal"><Settings className="text-wedding-gold" /> System Settings</h3>
              <button onClick={() => setDataModalOpen(false)} className="p-1 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-green-50 border-green-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-wedding-charcoal">Firebase Sync</h4>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">Status: {connectionStatus}</p>
                </div>
                <button onClick={() => window.location.reload()} className="p-3 bg-white border rounded-lg text-green-600 hover:bg-green-100 transition-all"><RefreshCw size={18} /></button>
              </div>
              <div className="bg-stone-100 p-4 rounded-xl space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data Control</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => {
                    const data = JSON.stringify({ vendors, budget, notes, guests }, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'wedding_backup.json'; a.click();
                  }} className="p-3 bg-white border rounded-lg text-[10px] font-bold uppercase"><Download size={14} /> Download</button>
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white border rounded-lg text-[10px] font-bold uppercase"><Upload size={14} /> Upload</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      try {
                        const parsed = JSON.parse(ev.target?.result as string);
                        if (dbRef.current) await set(ref(dbRef.current, DB_PATH), parsed);
                      } catch { alert("Error!"); }
                    };
                    reader.readAsText(file);
                  }} />
                </div>
              </div>
              <button onClick={toggleFullscreen} className="w-full py-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 font-bold text-xs uppercase tracking-widest hover:border-wedding-gold hover:text-wedding-gold transition-all">Toggle Fullscreen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;