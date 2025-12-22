import React, { useState } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, Moon, Sun, Globe } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigate: (view: 'home' | 'tool') => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

const NAV_TEXT = {
  en: { top: 'Top', tools: 'Tools', about: 'About', contact: 'Contact' },
  ar: { top: 'الرئيسية', tools: 'الأدوات', about: 'عن الموقع', contact: 'اتصل بنا' }
};

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, onNavigate, lang, setLang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = NAV_TEXT[lang];

  return (
    <>
      <header id="header" className="fixed top-0 left-0 w-full h-20 bg-white/90 dark:bg-black/90 z-50 flex items-center justify-between px-6 md:px-10 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm transition-colors duration-300">
        <div className="left cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#FF4D00] flex items-center justify-center font-serif text-lg text-black dark:text-white transition-transform duration-300 group-hover:rotate-12">
              <span className="font-bold">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Raqim AI</span>
          </div>
        </div>
        
        <div className="right flex items-center gap-6">
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-semibold tracking-wide">
              <li>
                <button onClick={() => onNavigate('home')} className="group flex flex-col items-center">
                  <span className="group-hover:text-[#FF4D00] transition-colors">{t.top}</span>
                </button>
              </li>
              <li>
                <a href="#tools" className="group flex flex-col items-center">
                  <span className="group-hover:text-[#FF4D00] transition-colors">{t.tools}</span>
                </a>
              </li>
              <li>
                <a href="#about" className="group flex flex-col items-center">
                  <span className="group-hover:text-[#FF4D00] transition-colors">{t.about}</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="group flex flex-col items-center">
                  <span className="group-hover:text-[#FF4D00] transition-colors">{t.contact}</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors flex items-center gap-1"
            >
              <Globe size={14} />
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white dark:bg-black z-[60] transition-transform duration-500 ${isMenuOpen ? (lang === 'ar' ? '-translate-x-0' : 'translate-x-0') : (lang === 'ar' ? 'translate-x-full' : 'translate-x-full')}`}>
        <div className="p-6 flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} className="p-2">
            <X size={32} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-bold font-serif">
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}>{t.top}</button>
          <a href="#tools" onClick={() => setIsMenuOpen(false)}>{t.tools}</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>{t.about}</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>{t.contact}</a>
        </div>
      </div>
    </>
  );
};

export const Footer: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  return (
    <footer id="footer" className="bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-6 md:px-10 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="left space-y-12 md:w-1/2">
          <div className="block project-request">
            <h3 className="text-3xl font-serif mb-4">{isAr ? 'طلب عمل' : 'Work Request'}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {isAr 
                ? 'لا تتردد في الاتصال بنا لطلبات التصميم أو الاستشارات أو المحاضرات.' 
                : 'Please feel free to contact us for design requests, consulting, or lectures.'}
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 border-b-2 border-[#FF4D00] pb-1 font-bold hover:text-[#FF4D00] transition-colors">
              {isAr ? 'نموذج الاتصال' : 'Contact Form'}
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="block about-corp">
              <h3 className="text-lg font-bold mb-4">{isAr ? 'شركة Raqim AI' : 'Raqim AI Inc.'}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 leading-loose">
                {isAr ? 'شارع الذكاء الاصطناعي 123، حي التكنولوجيا' : '123 AI Street, Tech District'}<br />
                {isAr ? 'مدينة نيجاتا، نيجاتا 950-0000' : 'Niigata City, Niigata 950-0000'}<br />
                {isAr ? 'هاتف: 0000-000-025' : 'Phone: 025-000-0000'}
              </div>
            </div>
            <div className="block social">
              <h3 className="text-lg font-bold mb-4">{isAr ? 'تواصل اجتماعي' : 'Social'}</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#FF4D00] transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-[#FF4D00] transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-[#FF4D00] transition-colors"><Twitter size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="right md:w-1/2 flex flex-col justify-between items-end">
          <div className="text-4xl font-serif font-bold flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-[#FF4D00] inline-block"></div>
            Raqim AI
          </div>
          <div className="mt-10 flex flex-col items-end gap-2">
            <nav className="flex gap-6 text-sm font-semibold">
              <a href="#" className="hover:underline decoration-[#FF4D00]">{isAr ? 'الرئيسية' : 'Home'}</a>
              <a href="#" className="hover:underline decoration-[#FF4D00]">{isAr ? 'الأعمال' : 'Works'}</a>
              <a href="#" className="hover:underline decoration-[#FF4D00]">{isAr ? 'الخدمات' : 'Services'}</a>
              <a href="#" className="hover:underline decoration-[#FF4D00]">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            </nav>
            <div className="text-xs text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Raqim AI Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};