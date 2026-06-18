import React from 'react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { 
  Building2, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  LayoutDashboard,
  Gem
} from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onHomeClick: () => void;
  currentView: 'customer' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onAdminClick,
  isAdminLoggedIn,
  onHomeClick,
  currentView
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand area */}
          <div 
            onClick={onHomeClick}
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo-trigger"
          >
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/15 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block dark:text-white leading-none">
                {t.appName}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-semibold uppercase tracking-wider block">
                {language === 'EN' ? 'Bilingual Brokering Hub' : 'દ્વિભાષી રિયલ એસ્ટેટ હબ'}
              </span>
            </div>
          </div>

          {/* Context Control Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Switch Section */}
            <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 p-1">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 text-[11px] font-black tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'EN' 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' 
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('GU')}
                className={`px-3 py-1.5 text-[11px] font-black tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'GU'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-805'
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 shadow-xs cursor-pointer transition-all duration-200"
              title="Switch light/dark visuals"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-zinc-700" />
              ) : (
                <Sun className="w-4 h-4 text-zinc-200" />
              )}
            </button>

            {/* Admin Login Button */}
            {currentView === 'customer' ? (
              <button
                onClick={onAdminClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                {isAdminLoggedIn ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.adminDashboard}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>{t.adminLogin}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onHomeClick}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-850 dark:text-zinc-200 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Browse site</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};
