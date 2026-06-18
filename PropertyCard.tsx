import React from 'react';
import { Property } from '../types';
import { useLanguage } from './LanguageContext';
import { 
  MapPin, 
  Ruler, 
  IndianRupee, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const { t } = useLanguage();

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
    <div 
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl dark:hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
      id={`property-card-${property.id}`}
    >
      
      {/* Property Display Hero Photo */}
      <div className="relative h-[220px] bg-zinc-950 overflow-hidden shrink-0">
        {property.photos && property.photos.length > 0 ? (
          <img 
            referrerPolicy="no-referrer"
            src={property.photos[0]} 
            alt={`${property.propertyType} field in ${property.village}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 font-semibold">
            No Images Seeded
          </div>
        )}

        {/* Dynamic Category Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
            {property.propertyType === 'Agricultural' ? t.agricultural : 
             property.propertyType === 'NA Land' ? t.naLand :
             property.propertyType === 'Residential' ? t.residential : t.commercial}
          </span>
        </div>

        {/* Optional "New" or Status tag */}
        {property.status === 'Sold' ? (
          <div className="absolute top-4 right-4 z-10 bg-red-650 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
            SOLD OUT
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
            ID: {property.id}
          </div>
        )}

        {/* Accent Price Floating Badge */}
        <div className="absolute bottom-4 left-4 bg-zinc-950/90 backdrop-blur-md text-emerald-400 font-extrabold text-sm px-3.5 py-1.5 rounded-xl border border-zinc-800/80">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Primary Details Box */}
      <div className="p-5 flex-1 flex flex-col justify-between font-sans">
        <div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-bold">Survey No: {property.surveyNumber}</span>
          <h4 className="text-lg font-black text-zinc-950 dark:text-zinc-100 tracking-tight mt-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {property.village}, {property.taluka}
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {property.district}, Gujarat
          </p>

          {/* Quick Metrics (Area / Road Touch) */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block leading-none">Total Area</span>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-300 mt-0.5 block">{property.area}</span>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block leading-none">Security</span>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-300 mt-0.5 block truncate max-w-[90px]">{property.naNocStatus}</span>
              </div>
            </div>
          </div>

          {/* Additional Road and water tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-450 px-2 py-0.5 rounded-md font-medium">
              🛣️ {property.roadTouch}
            </span>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-450 px-2 py-0.5 rounded-md font-medium">
              💧 {property.waterAvailability}
            </span>
          </div>
        </div>

        {/* View properties detail trigger */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/85">
          <button
            onClick={onViewDetails}
            className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 py-3 rounded-xl text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs font-sans"
          >
            <Eye className="w-3.5 h-3.5" />
            {t.details}
            <ArrowRight className="w-3 h-3 text-emerald-500 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

    </div>
  );
};
