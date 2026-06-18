import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Property, Inquiry, Contact, Deal } from '../types';
import { useLanguage } from './LanguageContext';
import { 
  Building2, 
  PhoneCall, 
  Briefcase, 
  IndianRupee, 
  TrendingUp, 
  Landmark, 
  PieChartIcon 
} from 'lucide-react';

interface DashboardAnalyticsProps {
  properties: Property[];
  inquiries: Inquiry[];
  deals: Deal[];
  contacts: Contact[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  properties,
  inquiries,
  deals,
  contacts
}) => {
  const { t } = useLanguage();

  // 1. KPI Calculations
  const totalListings = properties.length;
  const activeListings = properties.filter(p => p.status === 'Active').length;
  const totalInqs = inquiries.length;
  const closedDealsCount = deals.filter(d => d.status === 'Completed').length;
  
  const totalBrokerage = deals
    .filter(d => d.status === 'Completed')
    .reduce((sum, d) => sum + d.totalCommission, 0);

  const totalVolume = deals
    .filter(d => d.status === 'Completed')
    .reduce((sum, d) => sum + d.dealPrice, 0);

  // 2. Data Preparation for Chart: Property Types Distribution
  const typeCounts = properties.reduce((acc, p) => {
    acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyTypeData = [
    { name: t.agricultural, value: typeCounts['Agricultural'] || 0, color: '#10B981' },
    { name: t.naLand, value: typeCounts['NA Land'] || 0, color: '#3B82F6' },
    { name: t.residential, value: typeCounts['Residential'] || 0, color: '#F59E0B' },
    { name: t.commercial, value: typeCounts['Commercial'] || 0, color: '#8B5CF6' }
  ].filter(item => item.value > 0);

  // 3. Data Preparation: District-wise Listings Count
  const districtCounts = properties.reduce((acc, p) => {
    acc[p.district] = (acc[p.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const districtData = Object.keys(districtCounts).map(district => ({
    name: district,
    listings: districtCounts[district],
  }));

  // 4. Data Preparation: Deals Performance Over Time
  const dealTimelineData = deals
    .filter(d => d.status === 'Completed')
    .sort((a, b) => new Date(a.dealDate).getTime() - new Date(b.dealDate).getTime())
    .map(d => ({
      date: d.dealDate,
      price: d.dealPrice / 100000, // in Lakhs
      commission: d.totalCommission / 1000, // in Thousands
      propertyName: d.propertyName
    }));

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
    <div className="space-y-8 animate-fade-in" id="dashboard-analytics-root">
      
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Active Properties */}
        <div id="kpi-properties" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex items-center space-x-5 transition-transform hover:-translate-y-1 duration-200">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.totalProperties}</p>
            <h3 className="text-3xl font-bold font-sans mt-1 dark:text-zinc-100">
              {activeListings} <span className="text-sm font-normal text-zinc-400">/ {totalListings}</span>
            </h3>
          </div>
        </div>

        {/* KPI: Inquiries */}
        <div id="kpi-inquiries" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex items-center space-x-5 transition-transform hover:-translate-y-1 duration-200">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <PhoneCall className="w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.totalInquiries}</p>
            <h3 className="text-3xl font-bold font-sans mt-1 dark:text-zinc-100">{totalInqs}</h3>
          </div>
        </div>

        {/* KPI: Deals Closed */}
        <div id="kpi-deals" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex items-center space-x-5 transition-transform hover:-translate-y-1 duration-200">
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.closedDeals}</p>
            <h3 className="text-3xl font-bold font-sans mt-1 dark:text-zinc-100">
              {closedDealsCount}
            </h3>
          </div>
        </div>

        {/* KPI: Revenue Commissions */}
        <div id="kpi-commissions" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex items-center space-x-5 transition-transform hover:-translate-y-1 duration-200">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.totalCommissions}</p>
            <h3 className="text-2xl font-extrabold font-sans mt-1.5 text-amber-600 dark:text-amber-400 leading-none">
              {formatPrice(totalBrokerage)}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Total Sales: {formatPrice(totalVolume)}</p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart A: Property Type Distribution Pie */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              Property Type Allocation
            </h4>
          </div>
          
          <div className="h-[280px] w-full flex flex-col md:flex-row items-center justify-around">
            {propertyTypeData.length > 0 ? (
              <>
                <div className="h-[240px] w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} listings`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legends */}
                <div className="space-y-3 mt-4 md:mt-0 font-sans">
                  {propertyTypeData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full text-zinc-500 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-zinc-400 text-sm font-sans italic py-12">No active properties listed.</div>
            )}
          </div>
        </div>

        {/* Chart B: Geographic Distribution Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-500" />
              Properties by District
            </h4>
          </div>
          
          <div className="h-[280px] w-full">
            {districtData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} formatter={(value) => [`${value} properties`, 'Listings']} />
                  <Bar dataKey="listings" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={36}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-400 text-sm font-sans italic py-12 text-center">No district records.</div>
            )}
          </div>
        </div>

      </div>

      {/* Timeline Analysis Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          Deal and Commission Timelines (Lakhs)
        </h4>

        <div className="h-[300px] w-full">
          {dealTimelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dealTimelineData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value, name) => [
                  name === 'price' ? `₹${value} Lac` : `₹${value} K`, 
                  name === 'price' ? 'Deal Price' : 'Commission Earned'
                ]} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#F59E0B" name="price" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="commission" stroke="#10B981" name="commission" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-zinc-400 text-sm font-sans italic py-12 text-center flex flex-col items-center justify-center h-full">
              <span className="mb-2">No completed deals logged yet in the tracking system.</span>
              <span className="text-xs text-zinc-500">Go to Deals Tracker to log transactions and commissions.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
