import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { Navbar } from './components/Navbar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { dbHelper } from './dbHelper';
import { Property } from './types';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Star, 
  Layers, 
  Droplet, 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  Handshake, 
  Lock,
  Eye,
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';

function AppContent() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  // Screen View state: 'customer' | 'admin' | 'login'
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'login'>('customer');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('le_vech_admin_session') === 'true';
  });

  // Master lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  // Search & Filters state
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('All');
  const [filterWater, setFilterWater] = useState<string>('All');
  const [filterRoadTouch, setFilterRoadTouch] = useState<string>('All');

  // Login variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [currentView]);

  const fetchProperties = async () => {
    try {
      const list = await dbHelper.getProperties();
      setProperties(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminAccessTrigger = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin pass configured simple & secure
    if (username.trim() === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('le_vech_admin_session', 'true');
      setCurrentView('admin');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid Username or Security Password. Try admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('le_vech_admin_session');
    setCurrentView('customer');
  };

  // Perform client filtering
  const filteredList = properties.filter((p) => {
    // 1. Search text mapping (Survey, Village, description, etc)
    const query = searchText.toLowerCase().trim();
    if (query) {
      const matchSearch = 
        p.village.toLowerCase().includes(query) ||
        p.surveyNumber.toLowerCase().includes(query) ||
        p.taluka.toLowerCase().includes(query) ||
        p.district.toLowerCase().includes(query) ||
        p.ownerName.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      if (!matchSearch) return false;
    }

    // 2. Type filter
    if (filterType !== 'All' && p.propertyType !== filterType) {
      return false;
    }

    // 3. Price Range Filter
    if (filterPriceRange !== 'All') {
      if (filterPriceRange === 'under-50l' && p.price >= 5000000) return false;
      if (filterPriceRange === '50l-1c' && (p.price < 5000000 || p.price > 10000000)) return false;
      if (filterPriceRange === '1c-3c' && (p.price < 10000000 || p.price > 30000000)) return false;
      if (filterPriceRange === 'above-3c' && p.price <= 30000000) return false;
    }

    // 4. Water Availability Filter
    if (filterWater !== 'All') {
      if (filterWater === 'yes' && p.waterAvailability === 'No') return false;
      if (filterWater === 'no' && p.waterAvailability !== 'No') return false;
    }

    // 5. Road Touch
    if (filterRoadTouch !== 'All') {
      if (filterRoadTouch === 'highway' && !p.roadTouch.includes('Highway')) return false;
      if (filterRoadTouch === 'approach' && !p.roadTouch.includes('Approach')) return false;
    }

    return p.status === 'Active'; // customer can only browse active ones!
  });

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Crore`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakh`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col font-sans" id="app-root-container">
      
      {/* Dynamic Header Core */}
      <Navbar 
        onAdminClick={handleAdminAccessTrigger} 
        isAdminLoggedIn={isAdminLoggedIn} 
        onHomeClick={() => setCurrentView('customer')}
        currentView={currentView === 'admin' ? 'admin' : 'customer'}
      />

      {/* CUSTOMER PORTAL */}
      {currentView === 'customer' && (
        <div className="flex-1 flex flex-col" id="view-customer-portal">
          
          {/* Elegant Hero Banner Carousel Section */}
          <section className="relative overflow-hidden bg-zinc-900 dark:bg-zinc-950 text-white min-h-[460px] flex items-center p-8 sm:p-12 border-b border-zinc-800">
            {/* Visual background accents */}
            <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[45%] h-full bg-cover bg-center opacity-30 z-0 hidden lg:block" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200')" }}></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                
                {/* Visual Label */}
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest leading-none">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium Broker Services
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none max-w-2xl">
                  {language === 'EN' ? (
                    <>
                      Secure Land <span className="text-emerald-500">Deals</span> Made Simple
                    </>
                  ) : (
                    <>
                      જમીન સોદા હવે બનશે <span className="text-emerald-500">સરળ</span>
                    </>
                  )}
                </h1>
                
                <p className="text-sm sm:text-lg text-zinc-400 dark:text-zinc-350 max-w-xl leading-relaxed">
                  {t.heroSubtitle}
                </p>

                {/* Micro metrics highlight */}
                <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg border-t border-zinc-800">
                  <div>
                    <h5 className="text-xl sm:text-2xl font-extrabold text-emerald-400">100%</h5>
                    <p className="text-[10px] sm:text-xs text-zinc-500 uppercase font-black tracking-wider mt-1">Verified survey</p>
                  </div>
                  <div>
                    <h5 className="text-xl sm:text-2xl font-extrabold text-emerald-400">0%</h5>
                    <p className="text-[10px] sm:text-xs text-zinc-500 uppercase font-black tracking-wider mt-1">Hidden Charges</p>
                  </div>
                  <div>
                    <h5 className="text-xl sm:text-2xl font-extrabold text-emerald-400">Bilingual</h5>
                    <p className="text-[10px] sm:text-xs text-zinc-500 uppercase font-black tracking-wider mt-1">Guj/Eng support</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Core Interactive Search & Filter Panels */}
          <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-6 sticky top-20 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Text field */}
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl pl-11 pr-4 py-3 focus:outline-hidden dark:text-zinc-100 placeholder-zinc-400 font-sans"
                  />
                  {searchText && (
                    <button 
                      onClick={() => setSearchText('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-650"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Compact Filters Grid block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0 font-sans">
                  
                  {/* Property type selection dropdown */}
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full text-xs font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-hidden cursor-pointer"
                    >
                      <option value="All">🏷️ All Types</option>
                      <option value="Agricultural">{t.agricultural}</option>
                      <option value="NA Land">{t.naLand}</option>
                      <option value="Residential">{t.residential}</option>
                      <option value="Commercial">{t.commercial}</option>
                    </select>
                  </div>

                  {/* Budget price range select */}
                  <div>
                    <select
                      value={filterPriceRange}
                      onChange={(e) => setFilterPriceRange(e.target.value)}
                      className="w-full text-xs font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-hidden cursor-pointer"
                    >
                      <option value="All">💰 Any Budget</option>
                      <option value="under-50l">Under ₹50 Lakh</option>
                      <option value="50l-1c">₹50 Lakh - ₹1 Crore</option>
                      <option value="1c-3c">₹1 Crore - ₹3 Crore</option>
                      <option value="above-3c">Above ₹3 Crore</option>
                    </select>
                  </div>

                  {/* Water Availability select */}
                  <div>
                    <select
                      value={filterWater}
                      onChange={(e) => setFilterWater(e.target.value)}
                      className="w-full text-xs font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-hidden cursor-pointer"
                    >
                      <option value="All">💧 Water: Any</option>
                      <option value="yes">With Secure Water</option>
                      <option value="no">Dry Land</option>
                    </select>
                  </div>

                  {/* Road touch access filter */}
                  <div>
                    <select
                      value={filterRoadTouch}
                      onChange={(e) => setFilterRoadTouch(e.target.value)}
                      className="w-full text-xs font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-hidden cursor-pointer"
                    >
                      <option value="All">🛣️ Road: Any</option>
                      <option value="highway">Highway Touch</option>
                      <option value="approach">Approach Touch</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Filtering summary stats */}
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <p>Showing <span className="font-bold text-zinc-800 dark:text-zinc-300">{filteredList.length}</span> verified lands with public status</p>
                {(searchText || filterType !== 'All' || filterPriceRange !== 'All' || filterWater !== 'All' || filterRoadTouch !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchText('');
                      setFilterType('All');
                      setFilterPriceRange('All');
                      setFilterWater('All');
                      setFilterRoadTouch('All');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

            </div>
          </section>

          {/* Active listings grid section */}
          <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredList.map((p) => (
                  <PropertyCard 
                    key={p.id} 
                    property={p} 
                    onViewDetails={() => setActiveProperty(p)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-850 max-w-xl mx-auto p-8 shadow-xs">
                <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 font-bold">
                  ⚠️
                </div>
                <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-200">No matching fields found</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Adjust your price range, select another village, or check back with different filters.</p>
              </div>
            )}
          </section>

          {/* Customer highlight value-proposition ribbon */}
          <section className="bg-zinc-100 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-850 py-12 text-zinc-620 dark:text-zinc-350">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center font-sans">
              <div className="space-y-2 flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-605 p-3 rounded-2xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Direct Whatsapp Communication</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Instantly discuss negotiations, survey photos, and site visits directly with the broker.</p>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-605 p-3 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Verified NA Converted titles</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Rest secure. Every listing requires double boundary check, clean legal title verification.</p>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-605 p-3 rounded-2xl">
                  <Handshake className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Bilingual Support (Gujarati/English)</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Translate documentation or discuss negotiations in your preferred native tongue.</p>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ADMIN REGISTER / DASHBOARD VIEW */}
      {currentView === 'admin' && isAdminLoggedIn && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {/* ======================================================= */}
      {/* 🔐 SCREEN/LOGIN: SECURE BROKER AUTHENTICATOR */}
      {/* ======================================================= */}
      {currentView === 'login' && (
        <div className="flex-1 flex items-center justify-center py-16 px-4 animate-fade-in" id="admin-login-screen">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-xl text-center relative overflow-hidden font-sans">
            
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600"></div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center text-emerald-650 mx-auto mb-5 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">{t.adminLogin}</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">Access commission registry logs, inquiries, and secure properties lists</p>

            {loginError && (
              <div className="mt-4 bg-red-50 dark:bg-red-950/40 border border-red-150 dark:border-red-900 text-red-750 dark:text-red-300 p-3.5 rounded-xl text-xs text-left">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">{t.username}</label>
                <input
                  type="text"
                  required
                  placeholder="Enter login username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">{t.password}</label>
                <input
                  type="password"
                  required
                  placeholder="Enter pin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              {/* Prompt test tip */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-850 text-[11px] text-zinc-500 leading-normal flex items-start gap-2">
                <span className="shrink-0 bg-emerald-500 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black font-mono">i</span>
                <span className="font-medium text-left">Test standard username: <span className="font-mono font-bold text-emerald-600">admin</span> and password: <span className="font-mono font-bold text-emerald-600">admin123</span></span>
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md cursor-pointer text-center"
              >
                {t.login}
              </button>
            </form>

            <button
              onClick={() => setCurrentView('customer')}
              className="mt-5 text-xs font-bold text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-250 cursor-pointer"
            >
              Cancel and Return
            </button>

          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-850 py-6 text-zinc-400/90 dark:text-zinc-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Le Vech Property Hub. Designed for secure land brokering and real estate management in Surendranagar, Kutch, Surat, and Ahmedabad.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-zinc-650">Rules & Regulations</span>
            <span className="cursor-pointer hover:text-zinc-650">Broker Lic: RERA/GUJ/99799</span>
          </div>
        </div>
      </footer>

      {/* ======================================================= */}
      {/* 🔍 MODAL OVERLAY: BACKDROP FOR CAROUSEL SPECIFIC POPUP */}
      {/* ======================================================= */}
      {activeProperty && (
        <PropertyDetailsModal 
          property={activeProperty} 
          onClose={() => setActiveProperty(null)} 
          onInquirySubmitted={() => {
            fetchProperties();
          }} 
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
