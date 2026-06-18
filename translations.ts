export interface TranslationKeys {
  appName: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  village: string;
  taluka: string;
  district: string;
  surveyNumber: string;
  area: string;
  price: string;
  propertyType: string;
  roadTouch: string;
  waterAvailability: string;
  naNocStatus: string;
  description: string;
  ownerName: string;
  mobileNumber: string;
  photos: string;
  details: string;
  callOwner: string;
  whatsappInquiry: string;
  submitInquiry: string;
  inquirySuccess: string;
  adminLogin: string;
  adminDashboard: string;
  dashboardTitle: string;
  addProperty: string;
  editProperty: string;
  deleteConfirm: string;
  exportExcel: string;
  inquiriesTab: string;
  contactsTab: string;
  dealsTab: string;
  analyticsTab: string;
  propertiesTab: string;
  buyerName: string;
  buyerMobile: string;
  email: string;
  message: string;
  propertyTitle: string;
  status: string;
  actions: string;
  totalProperties: string;
  totalInquiries: string;
  closedDeals: string;
  totalCommissions: string;
  agricultural: string;
  naLand: string;
  residential: string;
  commercial: string;
  login: string;
  logout: string;
  password: string;
  username: string;
  filterAll: string;
  roadTouchYesNH: string;
  roadTouchYesSH: string;
  roadTouchYesAR: string;
  roadTouchNoIR: string;
  roadTouchNo: string;
  waterYesWell: string;
  waterYesCanal: string;
  waterYesMun: string;
  waterNo: string;
  naPassed: string;
  nocCleared: string;
  pendingApproval: string;
  agriculturalNonNa: string;
  commissionTracking: string;
  buyerCommission: string;
  sellerCommission: string;
  dealPrice: string;
  buyerSellerManage: string;
  brokerName: string;
  commission: string;
}

export const translations: Record<'EN' | 'GU', TranslationKeys> = {
  EN: {
    appName: "Le Vech Property Hub",
    heroSubtitle: "Premium Real Estate brokering for Farms, Plots, Commercial, and NA Lands in Gujarat",
    searchPlaceholder: "Search by village, survey number, taluka...",
    village: "Village",
    taluka: "Taluka",
    district: "District",
    surveyNumber: "Survey Number",
    area: "Area",
    price: "Price",
    propertyType: "Property Type",
    roadTouch: "Road Touch Type",
    waterAvailability: "Water Source",
    naNocStatus: "NA/NOC Status",
    description: "Detailed Description",
    ownerName: "Owner Name",
    mobileNumber: "Mobile Number",
    photos: "Photo Gallery",
    details: "Property Details",
    callOwner: "Call Agent/Broker",
    whatsappInquiry: "WhatsApp Inquiry",
    submitInquiry: "Send Inquiry Form",
    inquirySuccess: "Inquiry submitted successfully! We will contact you soon.",
    adminLogin: "Admin Login",
    adminDashboard: "Broker Dashboard",
    dashboardTitle: "Analytics & Asset Management",
    addProperty: "Add New Property",
    editProperty: "Edit Property",
    deleteConfirm: "Are you sure you want to delete this property?",
    exportExcel: "Export as CSV (Excel)",
    inquiriesTab: "Inquiries",
    contactsTab: "Buyers & Sellers",
    dealsTab: "Deals Tracker",
    analyticsTab: "Analytics Dashboard",
    propertiesTab: "Properties List",
    buyerName: "Buyer Name",
    buyerMobile: "Buyer Mobile",
    email: "Email Address",
    message: "Inquiry Message",
    propertyTitle: "Property Link",
    status: "Status",
    actions: "Actions",
    totalProperties: "Total listings",
    totalInquiries: "Total inquiries",
    closedDeals: "Total deals closed",
    totalCommissions: "Commissions earned",
    agricultural: "Agricultural Land",
    naLand: "NA Converted Land",
    residential: "Residential Land/Plot",
    commercial: "Commercial Property",
    login: "Log In",
    logout: "Log Out",
    password: "Password",
    username: "Admin Username",
    filterAll: "All Properties",
    roadTouchYesNH: "Yes (National Highway)",
    roadTouchYesSH: "Yes (State Highway)",
    roadTouchYesAR: "Yes (Approach Road)",
    roadTouchNoIR: "No (Internal Road)",
    roadTouchNo: "No Road Encroach",
    waterYesWell: "Yes (Well/Borewell)",
    waterYesCanal: "Yes (Canal/River)",
    waterYesMun: "Yes (Municipal water)",
    waterNo: "No Water Source",
    naPassed: "NA Passed",
    nocCleared: "NOC Cleared",
    pendingApproval: "Pending Approval",
    agriculturalNonNa: "Agricultural (Non-NA)",
    commissionTracking: "Brokerage & Commission Tracking",
    buyerCommission: "Buyer Commission",
    sellerCommission: "Seller Commission",
    dealPrice: "Deal Final Price",
    buyerSellerManage: "Manage Buyers & Sellers",
    brokerName: "Broker Name",
    commission: "Commission"
  },
  GU: {
    appName: "લે વેચ પ્રોપર્ટી હબ",
    heroSubtitle: "ગુજરાતમાં ખેતીની જમીન, પ્લોટ, કોમર્શિયલ અને NA જમીન માટે પ્રીમિયમ રિયલ એસ્ટેટ બ્રોકરેજ",
    searchPlaceholder: "ગામ, સર્વે નંબર અથવા તાલુકા દ્વારા શોધો...",
    village: "ગામ",
    taluka: "તાલુકો",
    district: "જિલ્લો",
    surveyNumber: "સર્વે નંબર",
    area: "ક્ષેત્રફળ (એરિયા)",
    price: "કિંમત/રૂપિયા",
    propertyType: "મિલકતનો પ્રકાર",
    roadTouch: "રોડ ટચ પ્રકાર",
    waterAvailability: "પાણીની સુવિધા",
    naNocStatus: "NA/NOC સ્થિતિ",
    description: "વિગતવાર વર્ણન",
    ownerName: "માલિકનું નામ",
    mobileNumber: "મોબાઇલ નંબર",
    photos: "ફોટો ગેલેરી",
    details: "મિલકત ની વિગતો",
    callOwner: "એજન્ટ / બ્રોકર ને કોલ કરો",
    whatsappInquiry: "વોટ્સએપ પૂછપરછ",
    submitInquiry: "પૂછપરછ ફોર્મ મોકલો",
    inquirySuccess: "પૂછપરછ સફળતાપૂર્વક સબમિટ થઈ ગઈ છે! અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.",
    adminLogin: "એડમિન લોગિન",
    adminDashboard: "બ્રોકર ડેશબોર્ડ",
    dashboardTitle: "એનાલિટિક્સ અને સંપત્તિ વ્યવસ્થાપન",
    addProperty: "નવી પ્રોપર્ટી ઉમેરો",
    editProperty: "પ્રોપર્ટી સુધારો",
    deleteConfirm: "શું તમે ખરેખર આ પ્રોપર્ટી કાઢી નાખવા માંગો છો?",
    exportExcel: "CSV (Excel) માં નિકાસ કરો",
    inquiriesTab: "પૂછપરછો",
    contactsTab: "ગ્રાહકો અને માલિકો (સંપર્ક)",
    dealsTab: "ડીલ ટ્રેકર",
    analyticsTab: "એનાલિટિક્સ ડેશબોર્ડ",
    propertiesTab: "પ્રોપર્ટીની યાદી",
    buyerName: "ખરીદનારનું નામ",
    buyerMobile: "ખરીદનારનો મોબાઇલ",
    email: "ઇમેઇલ સરનામું",
    message: "પૂછપરછ સંદેશ",
    propertyTitle: "મિલકતની લિંક",
    status: "સ્થિતિ",
    actions: "ક્રિયાઓ",
    totalProperties: "કુલ લિસ્ટિંગ્સ",
    totalInquiries: "કુલ પૂછપરછો",
    closedDeals: "કુલ પૂર્ણ થયેલ ડીલ્સ",
    totalCommissions: "કુલ કમાયેલ કમિશન",
    agricultural: "ખેતીની જમીન",
    naLand: "NA બિનખેતી જમીન",
    residential: "રહેણાંક જમીન/પ્લોટ",
    commercial: "કોમર્શિયલ મિલકત",
    login: "લોગિન કરો",
    logout: "લોગઆઉટ કરો",
    password: "પાસવર્ડ",
    username: "એડમિન યુઝરનેમ",
    filterAll: "બધી પ્રોપર્ટીઝ",
    roadTouchYesNH: "હા (નેશનલ હાઇવે)",
    roadTouchYesSH: "હા (સ્ટેટ હાઇવે)",
    roadTouchYesAR: "હા (એપ્રોચ રોડ)",
    roadTouchNoIR: "ના (આંતરિક રસ્તો)",
    roadTouchNo: "કોઈ રસ્તો નથી અક્ષમ",
    waterYesWell: "હા (કૂવો / બોરવેલ)",
    waterYesCanal: "હા (કેનાલ / નદી)",
    waterYesMun: "હા (પંચાયત / નગરપાલિકા)",
    waterNo: "પાણીની સુવિધા નથી",
    naPassed: "NA મંજૂર થયેલ",
    nocCleared: "NOC મળેલ છે",
    pendingApproval: "મંજૂરી બાકી છે",
    agriculturalNonNa: "ખેતીવાડી (બિન-NA)",
    commissionTracking: "બ્રોકરેજ અને કમિશન ટ્રેકિંગ",
    buyerCommission: "ખરીદનાર કમિશન",
    sellerCommission: "વેચનાર કમિશન",
    dealPrice: "ડીલની અંતિમ કિંમત",
    buyerSellerManage: "ખરીદનાર અને વેચનાર સંચાલન",
    brokerName: "દલાલનું નામ",
    commission: "દલાલી/કમિશન"
  }
};
