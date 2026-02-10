
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Continent, Category, Language, NewsArticle, UserLocation, AppView, TimeRange, UserProfile } from './types';
import { TRANSLATIONS } from './constants';
import { fetchNews, searchNews } from './geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import NewsCard from './components/NewsCard';
import MarketPulse from './components/MarketPulse';
import ArticleDetail from './components/ArticleDetail';
import TVSection from './components/TVSection';
import StrategySection from './components/StrategySection';
import CommunityView from './components/CommunityView';
import AIChatView from './components/AIChatView';
import EnterpriseHub from './components/EnterpriseHub';
import RiskCenter from './components/RiskCenter';
import VerificationPortal from './components/VerificationPortal';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [continent, setContinent] = useState<Continent>(Continent.GLOBAL);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<Category>(Category.BUSINESS);
  const [subCategory, setSubCategory] = useState<string | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.WEEK);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>({ detected: false });
  const [view, setView] = useState<AppView>(AppView.FEED);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const t = useMemo(() => TRANSLATIONS[language], [language]);

  // Check for Admin URL Hash on Mount
  useEffect(() => {
    if (window.location.hash === '#admin') {
        setView(AppView.ADMIN);
    }
  }, []);

  const handleReadMore = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const handleContinentChange = (c: Continent) => {
    setContinent(c);
    setSelectedCountry(undefined); 
    if (c === Continent.GLOBAL) {
      setCategory(Category.GLOBAL);
      setSubCategory(undefined);
    }
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSubCategory(undefined);
  };

  const loadData = useCallback(async (isRefresh = false, isLoadMore = false) => {
    if (view !== AppView.FEED) return;
    
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    
    if (!isLoadMore) setNews([]);

    try {
      const currentOffset = isLoadMore ? news.length : 0;
      let articles: NewsArticle[] = [];
      
      if (searchQuery) {
        articles = await searchNews(searchQuery, language, currentOffset);
      } else {
        articles = await fetchNews(continent, category, language, timeRange, userLocation, currentOffset, subCategory, selectedCountry);
      }
      setNews(prev => isLoadMore ? [...prev, ...articles] : articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [continent, selectedCountry, category, subCategory, language, searchQuery, view, timeRange, news.length]);

  useEffect(() => {
    if (view === AppView.FEED) {
      setNews([]);
      loadData();
    }
  }, [continent, selectedCountry, category, subCategory, language, searchQuery, userLocation, view, timeRange]);

  // If Admin View, render Admin Panel completely separate
  if (view === AppView.ADMIN) {
      return <AdminPanel />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentView={view} 
        onNavigate={setView}
        language={language}
        onLanguageChange={setLanguage}
      />

      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        onHomeClick={() => { setSearchQuery(''); setView(AppView.FEED); setSelectedArticle(null); }}
        onSearch={(q) => { setSearchQuery(q); setView(AppView.FEED); setSelectedArticle(null); }}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scroll relative">
        {(view === AppView.FEED || view === AppView.MARKET_PULSE) && !selectedArticle && (
           /* COMPACT STICKY HEADER AREA */
           <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md pt-2 pb-1 border-b border-white/5 shadow-lg">
              <FilterBar 
                language={language} selectedContinent={continent} selectedCountry={selectedCountry} selectedCategory={category} selectedSubCategory={subCategory} selectedTimeRange={timeRange} userLocation={userLocation}
                onContinentChange={handleContinentChange} onCountryChange={setSelectedCountry} onCategoryChange={handleCategoryChange} onSubCategoryChange={setSubCategory} onTimeRangeChange={setTimeRange}
                onLocationSearch={(loc) => setUserLocation({ country: loc, detected: true })} onDetectLocation={() => {}}
              />
           </div>
        )}

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 min-h-[calc(100vh-100px)]">
          {view === AppView.COMMUNITY ? (
            <CommunityView language={language} />
          ) : view === AppView.AI_CHAT ? (
            <AIChatView language={language} />
          ) : view === AppView.TV ? (
            <TVSection language={language} userLocation={userLocation} />
          ) : view === AppView.INNOVATION ? (
            <StrategySection language={language} continent={continent} />
          ) : view === AppView.ENTERPRISE ? (
            <EnterpriseHub language={language} />
          ) : view === AppView.RISK_CENTER ? (
            <RiskCenter language={language} />
          ) : view === AppView.VERIFICATION ? (
            <VerificationPortal language={language} />
          ) : view === AppView.MARKET_PULSE ? (
            <MarketPulse continent={continent} category={category} language={language} />
          ) : selectedArticle ? (
            <ArticleDetail article={selectedArticle} language={language} onBack={() => setSelectedArticle(null)} />
          ) : (
            <div className="space-y-6 animate-fade-in pb-20">
              {loading && news.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="glass-panel rounded-3xl h-[350px] animate-pulse">
                      <div className="h-40 bg-white/5 rounded-t-3xl"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        <div className="h-16 bg-white/5 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : news.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((article) => (
                      <NewsCard key={article.id} article={article} language={language} onReadMore={handleReadMore} />
                    ))}
                  </div>
                  
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => loadData(false, true)}
                      disabled={loadingMore}
                      className="group relative px-8 py-3 bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 font-bold uppercase tracking-widest rounded-full transition-all border border-brand-500/30 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        {loadingMore && <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-brand-300" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        Load Extended Feed
                      </span>
                    </button>
                  </div>
                </>
              ) : !loading && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 text-lg font-light font-display">{t.noResults}</p>
                  <button onClick={() => loadData(true)} className="mt-4 text-brand-400 hover:text-brand-300 uppercase tracking-widest text-xs font-bold">Refresh Uplink</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
