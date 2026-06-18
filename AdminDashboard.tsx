import React, { useState, useEffect } from 'react';
import { Property, Inquiry, Contact, Deal } from '../types';
import { dbHelper } from '../dbHelper';
import { useLanguage } from './LanguageContext';
import { DashboardAnalytics } from './DashboardAnalytics';
import { 
  Plus, 
  Trash2, 
  Edit, 
  FileSpreadsheet, 
  UserCheck, 
  Coins, 
  Building2, 
  Briefcase, 
  MessageSquare, 
  Save, 
  X, 
  Check, 
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { t } = useLanguage();
  
  // Storage Lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries' | 'contacts' | 'deals' | 'analytics'>('properties');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Property Modals / Forms States
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Contact Forms States
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Deal Forms States
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Search/Filter local states for dashboard lists
  const [propSearch, setPropSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // --- PROPERTY FORM STATES ---
  const [ownerName, setOwnerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [village, setVillage] = useState('');
  const [taluka, setTaluka] = useState('');
  const [district, setDistrict] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Agricultural');
  const [roadTouch, setRoadTouch] = useState<Property['roadTouch']>('Yes (Approach Road)');
  const [waterAvailability, setWaterAvailability] = useState<Property['waterAvailability']>('Yes (Well/Borewell)');
  const [naNocStatus, setNaNocStatus] = useState<Property['naNocStatus']>('Agricultural (Non-NA)');
  const [rawPhotos, setRawPhotos] = useState('');
  const [description, setDescription] = useState('');

  // --- CONTACT FORM STATES ---
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactRole, setContactRole] = useState<Contact['role']>('Buyer');
  const [contactVillage, setContactVillage] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  // --- DEAL FORM STATES ---
  const [dealPropId, setDealPropId] = useState('');
  const [dealBuyerName, setDealBuyerName] = useState('');
  const [dealSellerName, setDealSellerName] = useState('');
  const [dealPrice, setDealPrice] = useState<number>(0);
  const [dealCommSellerPercent, setDealCommSellerPercent] = useState<number>(2); // default 2%
  const [dealCommBuyerPercent, setDealCommBuyerPercent] = useState<number>(1);  // default 1%
  const [dealStatus, setDealStatus] = useState<Deal['status']>('Pending');
  const [dealDate, setDealDate] = useState(new Date().toISOString().split('T')[0]);
  const [dealNotes, setDealNotes] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const p = await dbHelper.getProperties();
      const i = await dbHelper.getInquiries();
      const c = await dbHelper.getContacts();
      const d = await dbHelper.getDeals();
      setProperties(p);
      setInquiries(i);
      setContacts(c);
      setDeals(d);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Pre-populate Property Form when editing
  const handleEditPropertyOpen = (prop: Property) => {
    setEditingProperty(prop);
    setOwnerName(prop.ownerName);
    setMobileNumber(prop.mobileNumber);
    setVillage(prop.village);
    setTaluka(prop.taluka);
    setDistrict(prop.district);
    setSurveyNumber(prop.surveyNumber);
    setArea(prop.area);
    setPrice(prop.price);
    setPropertyType(prop.propertyType);
    setRoadTouch(prop.roadTouch);
    setWaterAvailability(prop.waterAvailability);
    setNaNocStatus(prop.naNocStatus);
    setRawPhotos(prop.photos.join(', '));
    setDescription(prop.description);
    setPropertyFormOpen(true);
  };

  const handleCreatePropertyOpen = () => {
    setEditingProperty(null);
    setOwnerName('');
    setMobileNumber('');
    setVillage('');
    setTaluka('');
    setDistrict('');
    setSurveyNumber('');
    setArea('');
    setPrice(0);
    setPropertyType('Agricultural');
    setRoadTouch('Yes (Approach Road)');
    setWaterAvailability('Yes (Well/Borewell)');
    setNaNocStatus('Agricultural (Non-NA)');
    setRawPhotos('');
    setDescription('');
    setPropertyFormOpen(true);
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto populate Unsplash placeholder photos matching property category if rawPhotos is empty
    let photosList = rawPhotos.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
      
    if (photosList.length === 0) {
      if (propertyType === 'Agricultural') {
        photosList = [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200", 
          "https://images.unsplash.com/photo-1444858291040-58ea7f27e275?auto=format&fit=crop&q=80&w=1200"
        ];
      } else if (propertyType === 'NA Land') {
        photosList = ["https://images.unsplash.com/photo-1500049242364-5f500807cdd7?auto=format&fit=crop&q=80&w=1200"];
      } else if (propertyType === 'Residential') {
        photosList = ["https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&q=80&w=1200"];
      } else {
        photosList = ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"];
      }
    }

    const payload: Omit<Property, 'id'> = {
      ownerName,
      mobileNumber,
      village,
      taluka,
      district,
      surveyNumber,
      area,
      price: Number(price),
      propertyType,
      roadTouch,
      waterAvailability,
      naNocStatus,
      photos: photosList,
      description,
      createdAt: editingProperty ? editingProperty.createdAt : Date.now(),
      status: editingProperty ? editingProperty.status : 'Active'
    };

    if (editingProperty) {
      await dbHelper.updateProperty({ ...payload, id: editingProperty.id });
    } else {
      await dbHelper.addProperty(payload);
    }

    setPropertyFormOpen(false);
    setEditingProperty(null);
    loadAllData();
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      await dbHelper.deleteProperty(id);
      loadAllData();
    }
  };

  // --- CONTACTS CRUD SCRIPTING ---
  const handleEditContactOpen = (con: Contact) => {
    setEditingContact(con);
    setContactName(con.name);
    setContactMobile(con.mobile);
    setContactRole(con.role);
    setContactVillage(con.village);
    setContactNotes(con.notes);
    setContactFormOpen(true);
  };

  const handleCreateContactOpen = () => {
    setEditingContact(null);
    setContactName('');
    setContactMobile('');
    setContactRole('Buyer');
    setContactVillage('');
    setContactNotes('');
    setContactFormOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Contact, 'id'> = {
      name: contactName,
      mobile: contactMobile,
      role: contactRole,
      village: contactVillage,
      notes: contactNotes,
      createdAt: editingContact ? editingContact.createdAt : Date.now()
    };

    if (editingContact) {
      await dbHelper.updateContact({ ...payload, id: editingContact.id });
    } else {
      await dbHelper.addContact(payload);
    }
    setContactFormOpen(false);
    setEditingContact(null);
    loadAllData();
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await dbHelper.deleteContact(id);
      loadAllData();
    }
  };

  // --- DEALS CRUD SCRIPTING (COMMISSION AUTOMATION) ---
  const handleEditDealOpen = (deal: Deal) => {
    setEditingDeal(deal);
    setDealPropId(deal.propertyId);
    setDealBuyerName(deal.buyerName);
    setDealSellerName(deal.sellerName);
    setDealPrice(deal.dealPrice);
    // Rough estimate back-calculation
    setDealCommSellerPercent(Number(((deal.commissionSeller / deal.dealPrice) * 100).toFixed(1)) || 2);
    setDealCommBuyerPercent(Number(((deal.commissionBuyer / deal.dealPrice) * 100).toFixed(1)) || 1);
    setDealStatus(deal.status);
    setDealDate(deal.dealDate);
    setDealNotes(deal.notes);
    setDealFormOpen(true);
  };

  const handleCreateDealOpen = () => {
    setEditingDeal(null);
    setDealPropId('');
    setDealBuyerName('');
    setDealSellerName('');
    setDealPrice(0);
    setDealCommSellerPercent(2);
    setDealCommBuyerPercent(1);
    setDealStatus('Pending');
    setDealDate(new Date().toISOString().split('T')[0]);
    setDealNotes('');
    setDealFormOpen(true);
  };

  // Watch property selection to auto-fill Seller name & price!
  const handlePropSelectionChange = (pId: string) => {
    setDealPropId(pId);
    const linkedProp = properties.find(p => p.id === pId);
    if (linkedProp) {
      setDealSellerName(linkedProp.ownerName);
      setDealPrice(linkedProp.price);
    }
  };

  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealPropId || !dealBuyerName || !dealSellerName || dealPrice <= 0) {
      alert("Please complete the required deal pricing fields.");
      return;
    }

    const commSeller = Math.round((dealPrice * dealCommSellerPercent) / 100);
    const commBuyer = Math.round((dealPrice * dealCommBuyerPercent) / 100);
    const totalCommission = commSeller + commBuyer;

    const linkedProp = properties.find(p => p.id === dealPropId);
    const propName = linkedProp ? `${linkedProp.propertyType} in ${linkedProp.village}` : "Broker Property";

    const payload: Omit<Deal, 'id'> = {
      propertyId: dealPropId,
      propertyName: propName,
      buyerName: dealBuyerName,
      sellerName: dealSellerName,
      dealPrice,
      commissionSeller: commSeller,
      commissionBuyer: commBuyer,
      totalCommission,
      dealDate,
      status: dealStatus,
      notes: dealNotes,
      createdAt: editingDeal ? editingDeal.createdAt : Date.now()
    };

    if (editingDeal) {
      await dbHelper.updateDeal({ ...payload, id: editingDeal.id });
    } else {
      await dbHelper.addDeal(payload);
      // Mark original property as Sold if deal is marked Completed!
      if (dealStatus === 'Completed' && linkedProp) {
        await dbHelper.updateProperty({ ...linkedProp, status: 'Sold' });
      }
    }

    setDealFormOpen(false);
    setEditingDeal(null);
    loadAllData();
  };

  const handleDeleteDeal = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this deal history entry?")) {
      await dbHelper.deleteDeal(id);
      loadAllData();
    }
  };

  // Toggle Inquiry Status on-the-fly
  const handleInquiryStatusChange = async (inq: Inquiry, newStatus: Inquiry['status']) => {
    const updated = { ...inq, status: newStatus };
    await dbHelper.updateInquiry(updated);
    loadAllData();
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this inquiry?")) {
      await dbHelper.deleteInquiry(id);
      loadAllData();
    }
  };

  // EXPORT TO SYSTEM EXCEL/CSV FILE GENERATION
  const exportToCSV = (target: 'properties' | 'inquiries' | 'contacts' | 'deals') => {
    let rows: string[][] = [];
    let filename = `le_vech_${target}_export.csv`;

    if (target === 'properties') {
      rows = [
        ['Property ID', 'Owner Name', 'Mobile', 'Village', 'Taluka', 'District', 'Survey', 'Area', 'Price (INR)', 'Type', 'Road Touch', 'Water', 'NA Status', 'Status'],
        ...properties.map(p => [
          p.id, p.ownerName, p.mobileNumber, p.village, p.taluka, p.district, p.surveyNumber, p.area, p.price.toString(), p.propertyType, p.roadTouch, p.waterAvailability, p.naNocStatus, p.status
        ])
      ];
    } else if (target === 'inquiries') {
      rows = [
        ['Inquiry ID', 'Property Link', 'Buyer Name', 'Mobile', 'Message', 'Created State', 'Status'],
        ...inquiries.map(i => [
          i.id, i.propertyTitle, i.buyerName, i.buyerMobile, i.message, new Date(i.createdAt).toLocaleString(), i.status
        ])
      ];
    } else if (target === 'contacts') {
      rows = [
        ['Contact ID', 'Name', 'Mobile', 'Role', 'Village', 'Internal Notes'],
        ...contacts.map(c => [
          c.id, c.name, c.mobile, c.role, c.village, c.notes
        ])
      ];
    } else if (target === 'deals') {
      rows = [
        ['Deal ID', 'Property', 'Buyer', 'Seller', 'Deal Final Price', 'Seller Commission', 'Buyer Commission', 'Total Commission Collected', 'Deal Date', 'Status'],
        ...deals.map(d => [
          d.id, d.propertyName, d.buyerName, d.sellerName, d.dealPrice.toString(), d.commissionSeller.toString(), d.commissionBuyer.toString(), d.totalCommission.toString(), d.dealDate, d.status
        ])
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search/Filter Properties
  const filteredProperties = properties.filter(p => {
    const term = propSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      p.village.toLowerCase().includes(term) ||
      p.surveyNumber.toLowerCase().includes(term) ||
      p.taluka.toLowerCase().includes(term) ||
      p.district.toLowerCase().includes(term) ||
      p.ownerName.toLowerCase().includes(term) ||
      p.propertyType.toLowerCase().includes(term)
    );
  });

  const filteredContacts = contacts.filter(c => {
    const term = contactSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      c.name.toLowerCase().includes(term) ||
      c.mobile.includes(term) ||
      c.village.toLowerCase().includes(term) ||
      c.role.toLowerCase().includes(term)
    );
  });

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lac`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100" id="broker-admin-portal">
      
      {/* Upper Navigation Board */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/15">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                {t.adminDashboard}
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Broker SECURE</span>
              </h1>
              <p className="text-[11px] text-zinc-400 mt-1 dark:text-zinc-500 font-medium">Real-time assets, inquiries & brokerage performance portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={loadAllData} 
              disabled={isRefreshing}
              className="bg-zinc-100 hover:bg-zinc-150 dark:bg-zinc-800 dark:hover:bg-zinc-750 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Refresh Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs bar */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('properties')}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'properties' 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md' 
                : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Building2 className="w-4 h-4" />
            {t.propertiesTab}
          </button>
          
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'inquiries'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {t.inquiriesTab}
            {inquiries.filter(i => i.status === 'New').length > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {inquiries.filter(i => i.status === 'New').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'contacts'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Users className="w-4 h-4" />
            {t.buyerSellerManage}
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'deals'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {t.dealsTab}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.analyticsTab}
          </button>
        </div>

        {/* ================= PROPERTIES TAB CONTENT ================= */}
        {activeTab === 'properties' && (
          <div className="space-y-6" id="tab-properties-segment">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search registered land owner, survey reference, village..."
                  value={propSearch}
                  onChange={e => setPropSearch(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => exportToCSV('properties')}
                  className="bg-white hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Excel Export
                </button>
                <button
                  onClick={handleCreatePropertyOpen}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t.addProperty}
                </button>
              </div>
            </div>

            {/* Properties Listings Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[900px] font-sans">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider font-extrabold bg-zinc-50/50 dark:bg-zinc-950/20">
                    <th className="p-4 pl-6">Property ID</th>
                    <th className="p-4">Owner (Mobile)</th>
                    <th className="p-4">Geographic Details</th>
                    <th className="p-4">Pricing & Area</th>
                    <th className="p-4">Road / Water / NA</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-mono text-zinc-400 dark:text-zinc-500 text-xs block">ID: {p.id}</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{p.propertyType}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{p.ownerName}</span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 block font-mono mt-0.5">{p.mobileNumber}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">{p.village}, {p.taluka}</span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 block mt-0.5">{p.district} (Surv: {p.surveyNumber})</span>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 block">{formatPrice(p.price)}</span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-400 block font-bold mt-0.5">{p.area}</span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="text-[11px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md block font-medium max-w-[170px] truncate">{p.roadTouch}</span>
                          <span className="text-[11px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md block font-medium max-w-[170px] truncate">{p.waterAvailability}</span>
                          <span className="text-[11px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md block font-medium max-w-[170px] truncate">{p.naNocStatus}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${
                            p.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' 
                              : p.status === 'Sold' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' 
                              : 'bg-zinc-150 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditPropertyOpen(p)}
                              className="p-2 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                              title="Edit listing details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="p-2 border border-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800 hover:bg-red-50 text-red-650 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                              title="Delete catalog entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-400 italic">No registered properties match search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= INQUIRIES TAB ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6" id="tab-inquiries-segment">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold tracking-tight">Assocated Property Inquiries</h2>
              <button
                onClick={() => exportToCSV('inquiries')}
                className="bg-white hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Export Inquiries CSV
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[900px] font-sans">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider font-extrabold bg-zinc-50/50 dark:bg-zinc-950/20">
                    <th className="p-4 pl-6">Inquiry REF</th>
                    <th className="p-4">Buyer contacts</th>
                    <th className="p-4">Target Property link</th>
                    <th className="p-4">Enquiry message</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Workflow Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-mono text-zinc-400 dark:text-zinc-400 font-bold text-xs">{inq.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{inq.buyerName}</span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 block font-mono mt-0.5">{inq.buyerMobile}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-zinc-50 dark:bg-zinc-800 py-1 px-2.5 rounded-lg border border-zinc-100 dark:border-zinc-750 font-bold text-xs text-zinc-800 dark:text-zinc-200 inline-block">
                            {inq.propertyTitle}
                          </span>
                        </td>
                        <td className="p-4 max-w-[300px]">
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">"{inq.message}"</p>
                        </td>
                        <td className="p-4 text-zinc-400 font-mono text-xs">
                          {new Date(inq.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatusChange(inq, e.target.value as Inquiry['status'])}
                            className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold px-2 py-1.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                          >
                            <option value="New">🟢 New (Unassigned)</option>
                            <option value="In Progress">🟡 In Progress</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="Closed">⚫ Closed/Sold</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 dark:text-red-400 rounded-lg cursor-pointer transition-colors"
                            title="Remove inquiry record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-400 italic">No buyer inquiry tickets registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= BUYERS & SELLERS TAB ================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6" id="tab-contacts-segment">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search buyer name, contact village..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => exportToCSV('contacts')}
                  className="bg-white hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Excel Export
                </button>
                <button
                  onClick={handleCreateContactOpen}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Register Client
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[800px] font-sans">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider font-extrabold bg-zinc-50/50 dark:bg-zinc-950/20">
                    <th className="p-4 pl-6">Client ID</th>
                    <th className="p-4">Contact Name</th>
                    <th className="p-4">Mobile No</th>
                    <th className="p-4">Role Classification</th>
                    <th className="p-4">Village Location</th>
                    <th className="p-4">Internal Notes</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((con) => (
                      <tr key={con.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                        <td className="p-4 pl-6 font-mono text-zinc-400 font-bold text-xs">{con.id}</td>
                        <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">{con.name}</td>
                        <td className="p-4 font-mono text-zinc-800 dark:text-zinc-200">{con.mobile}</td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                            con.role === 'Buyer' 
                              ? 'bg-blue-105 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' 
                              : con.role === 'Seller' 
                              ? 'bg-amber-105 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' 
                              : 'bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-350'
                          }`}>
                            {con.role}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-700 dark:text-zinc-350 font-medium">{con.village || "Gujarat Zone"}</td>
                        <td className="p-4 max-w-[250px] truncate text-xs text-zinc-500 dark:text-zinc-400">{con.notes || 'No active notes logged'}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditContactOpen(con)}
                              className="p-2 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(con.id)}
                              className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 text-red-600 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-400 italic">No buyer/seller registers match.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= DEALS AND COMMISSION TRACKING ================= */}
        {activeTab === 'deals' && (
          <div className="space-y-6" id="tab-deals-segment">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Financial Deal Logs & Commission Accounts</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Automatic double-side brokerage logging (Default 2% Seller, 1% Buyer)</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => exportToCSV('deals')}
                  className="bg-white hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Excel Export
                </button>
                <button
                  onClick={handleCreateDealOpen}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto text-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Log Transaction
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[950px] font-sans">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider font-extrabold bg-zinc-50/50 dark:bg-zinc-950/20">
                    <th className="p-4 pl-6">DEAL REF</th>
                    <th className="p-4">Property Transacted</th>
                    <th className="p-4">Seller name</th>
                    <th className="p-4">Buyer name</th>
                    <th className="p-4">Deal settlement price</th>
                    <th className="p-4">Seller Comm</th>
                    <th className="p-4">Buyer Comm</th>
                    <th className="p-4">Total Commission</th>
                    <th className="p-4">Deal date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm">
                  {deals.length > 0 ? (
                    deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-zinc-400 text-xs">{deal.id}</td>
                        <td className="p-4 font-semibold text-zinc-850 dark:text-zinc-200">{deal.propertyName}</td>
                        <td className="p-4 font-medium text-zinc-700 dark:text-zinc-400">{deal.sellerName}</td>
                        <td className="p-4 font-medium text-zinc-700 dark:text-zinc-400">{deal.buyerName}</td>
                        <td className="p-4 font-black text-zinc-900 dark:text-zinc-100">{formatPrice(deal.dealPrice)}</td>
                        <td className="p-4 text-emerald-600 font-semibold">{formatPrice(deal.commissionSeller)}</td>
                        <td className="p-4 text-emerald-600 font-semibold">{formatPrice(deal.commissionBuyer)}</td>
                        <td className="p-4 text-amber-600 dark:text-amber-400 font-black tracking-tight">{formatPrice(deal.totalCommission)}</td>
                        <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400 text-xs">{deal.dealDate}</td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            deal.status === 'Completed' 
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-300' 
                              : deal.status === 'Pending' 
                              ? 'bg-amber-50 text-amber-850 dark:bg-amber-955/55 dark:text-amber-300' 
                              : 'bg-red-50 text-red-800 dark:bg-red-955/55 dark:text-red-300'
                          }`}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditDealOpen(deal)}
                              className="p-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-55 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-55 dark:hover:bg-zinc-800 text-red-650 hover:text-red-750 dark:text-red-400 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="p-12 text-center text-zinc-400 italic">No commission deals reported. Click 'Log Transaction' to start tracking broker earnings!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ANALYTICS TAB ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6" id="tab-analytics-segment">
            <DashboardAnalytics 
              properties={properties} 
              inquiries={inquiries} 
              deals={deals} 
              contacts={contacts} 
            />
          </div>
        )}

      </main>

      {/* ======================================================= */}
      {/* 🏡 MODAL: ADD / EDIT PROPERTY */}
      {/* ======================================================= */}
      {propertyFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto font-sans" id="prop-form-modal">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                {editingProperty ? t.editProperty : t.addProperty}
              </h3>
              <button 
                onClick={() => setPropertyFormOpen(false)}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-888 dark:text-zinc-100 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handlePropertySubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.ownerName}*</label>
                  <input
                    type="text"
                    required
                    placeholder="Owner's full name"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.mobileNumber}*</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.village}*</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g., Sanand"
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.taluka}*</label>
                  <input
                    type="text"
                    required
                    value={taluka}
                    onChange={e => setTaluka(e.target.value)}
                    placeholder="e.g., Sanand"
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.district}*</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g., Ahmedabad"
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.surveyNumber}*</label>
                  <input
                    type="text"
                    required
                    value={surveyNumber}
                    onChange={e => setSurveyNumber(e.target.value)}
                    placeholder="e.g., 241/A"
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.area}*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 12 Bigha or 500 Sq.Yd"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.price} (₹)*</label>
                  <input
                    type="number"
                    required
                    value={price || ''}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="Price in Rs."
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.propertyType}</label>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value as Property['propertyType'])}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="Agricultural">{t.agricultural}</option>
                    <option value="NA Land">{t.naLand}</option>
                    <option value="Residential">{t.residential}</option>
                    <option value="Commercial">{t.commercial}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.naNocStatus}</label>
                  <select
                    value={naNocStatus}
                    onChange={e => setNaNocStatus(e.target.value as Property['naNocStatus'])}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="Agricultural (Non-NA)">Agricultural (Non-NA)</option>
                    <option value="NA Passed">NA Converted Passed</option>
                    <option value="NOC Cleared">NOC Cleared</option>
                    <option value="Pending Approval">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.roadTouch}</label>
                  <select
                    value={roadTouch}
                    onChange={e => setRoadTouch(e.target.value as Property['roadTouch'])}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="Yes (National Highway)">Yes (National Highway)</option>
                    <option value="Yes (State Highway)">Yes (State Highway)</option>
                    <option value="Yes (Approach Road)">Yes (Approach Road)</option>
                    <option value="No (Internal Road)">No (Internal Road)</option>
                    <option value="No">No Road Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.waterAvailability}</label>
                  <select
                    value={waterAvailability}
                    onChange={e => setWaterAvailability(e.target.value as Property['waterAvailability'])}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="Yes (Well/Borewell)">Yes (Well/Borewell)</option>
                    <option value="Yes (Canal/River)">Yes (Canal/River)</option>
                    <option value="Yes (Municipal)">Yes (Municipal Access)</option>
                    <option value="No">No secure water source</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.photos} (Comma separated URLs)</label>
                <input
                  type="text"
                  placeholder="URL 1, URL 2..."
                  value={rawPhotos}
                  onChange={e => setRawPhotos(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">Leave empty to auto-load gorgeous stock high-res land photos.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">{t.description}</label>
                <textarea
                  rows={3}
                  placeholder="Tell clients about crop soil fertility, proximity to industry GIDC, etc."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all font-sans cursor-pointer flex justify-center items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {editingProperty ? "Update Listing" : "Register Property Listing"}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 👤 MODAL: REGISTER / EDIT CONTACT */}
      {/* ======================================================= */}
      {contactFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8 font-sans" id="contact-form-modal">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                {editingContact ? "Edit Client" : "Register Client"}
              </h3>
              <button 
                onClick={() => setContactFormOpen(false)}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 dark:text-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Full Name*</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Mobile Number*</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={contactMobile}
                  onChange={e => setContactMobile(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Role Type</label>
                <select
                  value={contactRole}
                  onChange={e => setContactRole(e.target.value as Contact['role'])}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <option value="Buyer">Prospective Buyer (Investment)</option>
                  <option value="Seller">Asset Seller / Owner</option>
                  <option value="Both">Joint Venture / Both Role</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Village/City</label>
                <input
                  type="text"
                  placeholder="Gujarat area location"
                  value={contactVillage}
                  onChange={e => setContactVillage(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Wants road touch land, budget range..."
                  value={contactNotes}
                  onChange={e => setContactNotes(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer"
              >
                {editingContact ? "Update Client" : "Register Client Info"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 📁 MODAL: LOG TRANSACTION DEAL */}
      {/* ======================================================= */}
      {dealFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8 font-sans" id="deal-form-modal">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6 font-sans">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500 animate-spin" />
                Transaction Commission Entry
              </h3>
              <button 
                onClick={() => setDealFormOpen(false)}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 dark:text-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDealSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Select Property*</label>
                <select
                  required
                  value={dealPropId}
                  onChange={(e) => handlePropSelectionChange(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <option value="">-- Click to choose property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.village} ({p.propertyType}) - Survey: {p.surveyNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Seller Owner Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="Seller Name"
                    value={dealSellerName}
                    onChange={e => setDealSellerName(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Buyer Client Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="Buyer Name"
                    value={dealBuyerName}
                    onChange={e => setDealBuyerName(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Final Deal Settlement Price (₹)*</label>
                <input
                  type="number"
                  required
                  value={dealPrice || ''}
                  onChange={(e) => setDealPrice(Number(e.target.value))}
                  placeholder="Enter negotiated final price"
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100 font-bold text-emerald-600"
                />
              </div>

              <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">Commission Percentage rates</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Seller Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dealCommSellerPercent}
                      onChange={(e) => setDealCommSellerPercent(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-805 rounded-lg px-2.5 py-1.5"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1">Amt: {formatPrice(Math.round(dealPrice * dealCommSellerPercent / 100))}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Buyer Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dealCommBuyerPercent}
                      onChange={(e) => setDealCommBuyerPercent(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-805 rounded-lg px-2.5 py-1.5"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1">Amt: {formatPrice(Math.round(dealPrice * dealCommBuyerPercent / 100))}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Total Commissions:</span>
                  <span className="text-sm font-black text-amber-600">{formatPrice(Math.round((dealPrice * dealCommSellerPercent / 100) + (dealPrice * dealCommBuyerPercent / 100)))}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Deal Date</label>
                  <input
                    type="date"
                    required
                    value={dealDate}
                    onChange={e => setDealDate(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Deal Status</label>
                  <select
                    value={dealStatus}
                    onChange={e => setDealStatus(e.target.value as Deal['status'])}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="Pending">Pending Escrow</option>
                    <option value="Completed">Completed & Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-645 dark:text-zinc-400 mb-1">Transaction Notes</label>
                <textarea
                  rows={2}
                  placeholder="Payment receipt, token/earnest money, registry timeline details..."
                  value={dealNotes}
                  onChange={e => setDealNotes(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden dark:text-zinc-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer"
              >
                Log Transaction
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
