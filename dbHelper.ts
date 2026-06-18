import { db, isFirebaseEnabled } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { Property, Inquiry, Contact, Deal } from './types';

// Mock/Seed Data
const MOCK_PROPERTIES: Property[] = [
  {
    id: "PROP-001",
    ownerName: "Rajeshbhai Patel",
    mobileNumber: "9876543210",
    village: "Sanand",
    taluka: "Sanand",
    district: "Ahmedabad",
    surveyNumber: "241/A",
    area: "12 Bigha",
    price: 18500000,
    propertyType: 'Agricultural',
    roadTouch: 'Yes (National Highway)',
    waterAvailability: 'Yes (Well/Borewell)',
    naNocStatus: 'Agricultural (Non-NA)',
    photos: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Prime fertile agricultural flat land near Sanand Industrial GIDC zone. Excellent for organic farming or long-term industrial investment. Premium highway touch entry with 2 borewells.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    status: 'Active'
  },
  {
    id: "PROP-002",
    ownerName: "Arjanbhai Ahir",
    mobileNumber: "9900112233",
    village: "Mandvi",
    taluka: "Mandvi",
    district: "Kutch",
    surveyNumber: "822",
    area: "25 Bigha",
    price: 42000000,
    propertyType: 'Agricultural',
    roadTouch: 'Yes (Approach Road)',
    waterAvailability: 'Yes (Well/Borewell)',
    naNocStatus: 'Agricultural (Non-NA)',
    photos: [
      "https://images.unsplash.com/photo-1464207903534-402cf8841e5e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1444858291040-58ea7f27e275?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Yielding Kesar Mango Orchard in Kutch. Contains over 450 fully mature mango trees with advanced automated drip-irrigation network. Sweet ground water accessible via high power tube wells.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    status: 'Active'
  },
  {
    id: "PROP-003",
    ownerName: "Mansukhbhai Savaliya",
    mobileNumber: "9426214578",
    village: "Gondal",
    taluka: "Gondal",
    district: "Rajkot",
    surveyNumber: "109/B",
    area: "1200 Sq.Ft.",
    price: 6800000,
    propertyType: 'Commercial',
    roadTouch: 'Yes (State Highway)',
    waterAvailability: 'Yes (Municipal)',
    naNocStatus: 'NOC Cleared',
    photos: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Ready-to-occupy retail showroom or banking office space built directly touching Rajkot-Gondal State Highway. Superb visual frontage, separate fire exits, double shutters, 24/7 common water supply.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    status: 'Active'
  },
  {
    id: "PROP-004",
    ownerName: "Harshadbhai Shah",
    mobileNumber: "9566231144",
    village: "Limbdi",
    taluka: "Limbdi",
    district: "Surendranagar",
    surveyNumber: "512",
    area: "4500 Sq.Ft.",
    price: 3500000,
    propertyType: 'Residential',
    roadTouch: 'Yes (Approach Road)',
    waterAvailability: 'Yes (Municipal)',
    naNocStatus: 'NA Passed',
    photos: [
      "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1500049242364-5f500807cdd7?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Premium NA-passed residential plot layout. Located in a secured, gated society with paved cement roads, solar street lights, municipal water connections, close to schools.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    status: 'Active'
  },
  {
    id: "PROP-005",
    ownerName: "Kirtibhai Patel",
    mobileNumber: "9712123456",
    village: "Bardoli",
    taluka: "Bardoli",
    district: "Surat",
    surveyNumber: "78",
    area: "3 Bigha",
    price: 29000000,
    propertyType: 'NA Land',
    roadTouch: 'Yes (National Highway)',
    waterAvailability: 'Yes (Well/Borewell)',
    naNocStatus: 'NA Passed',
    photos: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Commercial / Industrial converted NA Passed plot directly touching Surat-Bardoli National Highway. Excellent dimensions for layout, heavy vehicle access, immediate clear-title NOC for factory/warehouse development.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    status: 'Active'
  }
];

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "INQ-001",
    propertyId: "PROP-001",
    propertyTitle: "Agricultural Land in Sanand",
    buyerName: "Dineshbhai Thakar",
    buyerMobile: "9825412233",
    buyerEmail: "dinesh@example.com",
    message: "I am interested in buying this agricultural property for standard tomato farming. Please arrange owner talk schedule.",
    createdAt: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    status: 'New'
  },
  {
    id: "INQ-002",
    propertyId: "PROP-003",
    propertyTitle: "Commercial in Gondal",
    buyerName: "Sureshbhai Vora",
    buyerMobile: "9601452299",
    buyerEmail: "vora.suresh@gmail.com",
    message: "We need this space to open a new cooperative bank branch office. Is the monthly lease terms also acceptable or is it purely for sale?",
    createdAt: Date.now() - 1000 * 60 * 60 * 30, // 30 hours ago
    status: 'Contacted'
  }
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: "CON-001",
    name: "Dineshbhai Thakar",
    mobile: "9825412233",
    role: "Buyer",
    village: "Ahmedabad",
    notes: "Active investor looking for cheap agricultural bighas around Sanand but requires highway touch path.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  },
  {
    id: "CON-002",
    name: "Rajeshbhai Patel",
    mobile: "9876543210",
    role: "Seller",
    village: "Sanand",
    notes: "Owns survey number 241/A. Wants strict cash deal, minor room for negotiations, absolute clear titles.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  }
];

const MOCK_DEALS: Deal[] = [
  {
    id: "DEAL-001",
    propertyId: "PROP-004",
    propertyName: "Residential Plot in Limbdi",
    buyerName: "Sanjaybhai Trivedi",
    sellerName: "Harshadbhai Shah",
    dealPrice: 3400000,
    commissionSeller: 68000, // 2%
    commissionBuyer: 34000,  // 1%
    totalCommission: 102000,
    dealDate: "2026-06-10",
    status: "Completed",
    notes: "Successfully closed. Document registration fee paid in full, standard commission settled through cheque.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  }
];

// LocalStorage Persistence Helpers
const loadLocal = <T>(key: string, backup: T[]): T[] => {
  const local = localStorage.getItem(`le_vech_${key}`);
  if (!local) {
    localStorage.setItem(`le_vech_${key}`, JSON.stringify(backup));
    return backup;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return backup;
  }
};

const saveLocal = <T>(key: string, data: T[]) => {
  localStorage.setItem(`le_vech_${key}`, JSON.stringify(data));
};

// Generic DB Core controller with Firebase sync
export const dbHelper = {
  // --- PROPERTIES ---
  async getProperties(): Promise<Property[]> {
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Property[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data() as Property, id: docSnap.id });
        });
        if (list.length > 0) {
          saveLocal('properties', list);
          return list;
        }
      } catch (e) {
        console.warn("Firestore properties fetching failed, using cache:", e);
      }
    }
    return loadLocal<Property>('properties', MOCK_PROPERTIES);
  },

  async addProperty(prop: Omit<Property, 'id'>): Promise<Property> {
    const id = "PROP-" + Math.floor(100000 + Math.random() * 900000);
    const newProp: Property = { ...prop, id };
    
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "properties", id), newProp);
      } catch (e) {
        console.warn("Firestore property insert failed, local mode used:", e);
      }
    }
    const current = loadLocal<Property>('properties', MOCK_PROPERTIES);
    current.unshift(newProp);
    saveLocal('properties', current);
    return newProp;
  },

  async updateProperty(prop: Property): Promise<Property> {
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "properties", prop.id), prop);
      } catch (e) {
        console.warn("Firestore property update failed, local mode used:", e);
      }
    }
    const current = loadLocal<Property>('properties', MOCK_PROPERTIES);
    const index = current.findIndex(p => p.id === prop.id);
    if (index !== -1) {
      current[index] = prop;
      saveLocal('properties', current);
    }
    return prop;
  },

  async deleteProperty(id: string): Promise<boolean> {
    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, "properties", id));
      } catch (e) {
        console.warn("Firestore property delete failed, local mode used:", e);
      }
    }
    const current = loadLocal<Property>('properties', MOCK_PROPERTIES);
    const filtered = current.filter(p => p.id !== id);
    saveLocal('properties', filtered);
    return true;
  },

  // --- INQUIRIES ---
  async getInquiries(): Promise<Inquiry[]> {
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Inquiry[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data() as Inquiry, id: docSnap.id });
        });
        if (list.length > 0) {
          saveLocal('inquiries', list);
          return list;
        }
      } catch (e) {
        console.warn("Firestore inquiries fetching failed, using cache:", e);
      }
    }
    return loadLocal<Inquiry>('inquiries', MOCK_INQUIRIES);
  },

  async addInquiry(inq: Omit<Inquiry, 'id'>): Promise<Inquiry> {
    const id = "INQ-" + Math.floor(100000 + Math.random() * 900000);
    const newInq: Inquiry = { ...inq, id };

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "inquiries", id), newInq);
      } catch (e) {
        console.warn("Firestore inquiry insert failed, local mode used:", e);
      }
    }
    const current = loadLocal<Inquiry>('inquiries', MOCK_INQUIRIES);
    current.unshift(newInq);
    saveLocal('inquiries', current);
    return newInq;
  },

  async updateInquiry(inq: Inquiry): Promise<Inquiry> {
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "inquiries", inq.id), inq);
      } catch (e) {
        console.warn("Firestore inquiry update failed, local mode used:", e);
      }
    }
    const current = loadLocal<Inquiry>('inquiries', MOCK_INQUIRIES);
    const index = current.findIndex(i => i.id === inq.id);
    if (index !== -1) {
      current[index] = inq;
      saveLocal('inquiries', current);
    }
    return inq;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
      } catch (e) {
        console.warn("Firestore inquiry delete failed, local mode used:", e);
      }
    }
    const current = loadLocal<Inquiry>('inquiries', MOCK_INQUIRIES);
    const filtered = current.filter(i => i.id !== id);
    saveLocal('inquiries', filtered);
    return true;
  },

  // --- CONTACTS ---
  async getContacts(): Promise<Contact[]> {
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Contact[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data() as Contact, id: docSnap.id });
        });
        if (list.length > 0) {
          saveLocal('contacts', list);
          return list;
        }
      } catch (e) {
        console.warn("Firestore contacts fetching failed, using cache:", e);
      }
    }
    return loadLocal<Contact>('contacts', MOCK_CONTACTS);
  },

  async addContact(con: Omit<Contact, 'id'>): Promise<Contact> {
    const id = "CON-" + Math.floor(100000 + Math.random() * 900000);
    const newCon: Contact = { ...con, id };

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "contacts", id), newCon);
      } catch (e) {
        console.warn("Firestore contact insert failed, local mode used:", e);
      }
    }
    const current = loadLocal<Contact>('contacts', MOCK_CONTACTS);
    current.unshift(newCon);
    saveLocal('contacts', current);
    return newCon;
  },

  async updateContact(con: Contact): Promise<Contact> {
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "contacts", con.id), con);
      } catch (e) {
        console.warn("Firestore contact update failed, local mode used:", e);
      }
    }
    const current = loadLocal<Contact>('contacts', MOCK_CONTACTS);
    const index = current.findIndex(c => c.id === con.id);
    if (index !== -1) {
      current[index] = con;
      saveLocal('contacts', current);
    }
    return con;
  },

  async deleteContact(id: string): Promise<boolean> {
    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, "contacts", id));
      } catch (e) {
        console.warn("Firestore contact delete failed, local mode used:", e);
      }
    }
    const current = loadLocal<Contact>('contacts', MOCK_CONTACTS);
    const filtered = current.filter(c => c.id !== id);
    saveLocal('contacts', filtered);
    return true;
  },

  // --- DEALS ---
  async getDeals(): Promise<Deal[]> {
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Deal[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data() as Deal, id: docSnap.id });
        });
        if (list.length > 0) {
          saveLocal('deals', list);
          return list;
        }
      } catch (e) {
        console.warn("Firestore deals fetching failed, using cache:", e);
      }
    }
    return loadLocal<Deal>('deals', MOCK_DEALS);
  },

  async addDeal(deal: Omit<Deal, 'id'>): Promise<Deal> {
    const id = "DEAL-" + Math.floor(100000 + Math.random() * 900000);
    const newDeal: Deal = { ...deal, id };

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "deals", id), newDeal);
      } catch (e) {
        console.warn("Firestore deal insert failed, local mode used:", e);
      }
    }
    const current = loadLocal<Deal>('deals', MOCK_DEALS);
    current.unshift(newDeal);
    saveLocal('deals', current);
    return newDeal;
  },

  async updateDeal(deal: Deal): Promise<Deal> {
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, "deals", deal.id), deal);
      } catch (e) {
        console.warn("Firestore deal update failed, local mode used:", e);
      }
    }
    const current = loadLocal<Deal>('deals', MOCK_DEALS);
    const index = current.findIndex(d => d.id === deal.id);
    if (index !== -1) {
      current[index] = deal;
      saveLocal('deals', current);
    }
    return deal;
  },

  async deleteDeal(id: string): Promise<boolean> {
    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, "deals", id));
      } catch (e) {
        console.warn("Firestore deal delete failed, local mode used:", e);
      }
    }
    const current = loadLocal<Deal>('deals', MOCK_DEALS);
    const filtered = current.filter(d => d.id !== id);
    saveLocal('deals', filtered);
    return true;
  }
};
