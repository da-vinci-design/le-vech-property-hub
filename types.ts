export interface Property {
  id: string;
  ownerName: string;
  mobileNumber: string;
  village: string;
  taluka: string;
  district: string;
  surveyNumber: string;
  area: string;         // e.g. "5 Bigha" or "1200 Sq.Ft."
  price: number;        // in Rs.
  propertyType: 'Agricultural' | 'NA Land' | 'Residential' | 'Commercial';
  roadTouch: 'Yes (National Highway)' | 'Yes (State Highway)' | 'Yes (Approach Road)' | 'No (Internal Road)' | 'No';
  waterAvailability: 'Yes (Well/Borewell)' | 'Yes (Canal/River)' | 'Yes (Municipal)' | 'No';
  naNocStatus: 'NA Passed' | 'NOC Cleared' | 'Pending Approval' | 'Agricultural (Non-NA)';
  photos: string[];     // Array of URLs
  description: string;
  createdAt: number;
  status: 'Active' | 'Sold' | 'Archived';
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string; // e.g. "Residential in Limbadi"
  buyerName: string;
  buyerMobile: string;
  buyerEmail?: string;
  message: string;
  createdAt: number;
  status: 'New' | 'In Progress' | 'Contacted' | 'Closed';
}

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  role: 'Buyer' | 'Seller' | 'Both';
  village: string;
  notes: string;
  createdAt: number;
}

export interface Deal {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerName: string;
  sellerName: string;
  dealPrice: number;
  commissionSeller: number; // calculated currency amount or input
  commissionBuyer: number;  // calculated currency amount or input
  totalCommission: number;
  dealDate: string;        // YYYY-MM-DD
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: number;
}
