import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import SocialContentVisual from './components/SocialContentVisual';
import PromptEngineeringVisual from './components/PromptEngineeringVisual';
import VisualIntelligenceVisual from './components/VisualIntelligenceVisual';
import { TOOLS, TOOLS_AR } from './constants';
import { ToolType, ToolMetadata } from './types';
import { generateAI, fetchUrlContent } from './services/aiClient';
import { 
  Upload, 
  Loader2, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles,
  Type,
  Palette,
  Settings2,
  Link as LinkIcon,
  Twitter,
  MoveRight,
  Download,
  History,
  Trash2,
  FileText,
  Lightbulb
} from 'lucide-react';

const FONT_OPTIONS = {
  sans: [
    { name: 'Inter', label: 'Inter' },
    { name: 'Cairo', label: 'Cairo' },
    { name: 'Roboto', label: 'Roboto' },
    { name: 'Open Sans', label: 'Open Sans' },
    { name: 'Montserrat', label: 'Montserrat' },
    { name: 'Lato', label: 'Lato' },
  ],
  serif: [
    { name: 'Playfair Display', label: 'Playfair Display' },
    { name: 'Amiri', label: 'Amiri' },
    { name: 'Merriweather', label: 'Merriweather' },
    { name: 'Cormorant', label: 'Cormorant' },
    { name: 'Aleo', label: 'Aleo' },
    { name: 'Cardo', label: 'Cardo' },
  ]
};

const TRANSLATIONS = {
  en: {
    heroTitle: <>Design <br/><span className="italic">Your</span> Intelligence.</>,
    heroDesc: "Raqim AI acts as your creative partner for prompt engineering, branding analysis, and consulting. Leverage the power of design in your AI workflow.",
    viewWorks: 'View Works',
    customize: 'Customize Interface',
    back: 'Back to Works',
    inputReq: 'Input Request',
    output: 'Output',
    generate: 'Generate',
    dragDrop: 'Drag & Drop Image',
    copied: 'Copied',
    copy: 'Copy',
    config: 'Configuration',
    resultWait: 'The generated result will appear here...',
    download: 'Download',
    downloadTxt: 'Download as TXT',
    downloadMd: 'Download as MD',
    history: 'History',
    clearHistory: 'Clear History',
    noHistory: 'No history yet',
    tryExample: 'Try Example',
    charCount: 'characters',
    wordCount: 'words',
    categories: [
      {
        id: '01',
        title: 'Prompt Engineering',
        desc: 'Convert simple ideas into highly detailed, professional engineering prompts. We organize output to solve complex AI interaction challenges.',
      },
      {
        id: '02',
        title: 'Social & Content',
        desc: 'Grow your audience with AI. Convert blogs to viral threads, rewrite content, and generate high-converting product descriptions.',
      },
      {
        id: '03',
        title: 'Visual Intelligence',
        desc: 'Extract content from images, merge visual concepts, and create prompts for video and image generation.',
      }
    ]
  },
  ar: {
    heroTitle: <>صمم <br/><span className="italic">ذكاءك</span> الاصطناعي.</>,
    heroDesc: "تعمل Raqim AI كشريك إبداعي لهندسة الأوامر وتحليل العلامات التجارية والاستشارات. استفد من قوة التصميم في سير عمل الذكاء الاصطناعي الخاص بك.",
    viewWorks: 'عرض الأعمال',
    customize: 'تخصيص الواجهة',
    back: 'العودة للأعمال',
    inputReq: 'طلب الإدخال',
    output: 'النتيجة',
    generate: 'توليد',
    dragDrop: 'اسحب وأفلت الصورة',
    copied: 'تم النسخ',
    copy: 'نسخ',
    config: 'الإعدادات',
    resultWait: 'ستظهر النتيجة المولدة هنا...',
    download: 'تحميل',
    downloadTxt: 'تحميل كملف TXT',
    downloadMd: 'تحميل كملف MD',
    history: 'السجل',
    clearHistory: 'مسح السجل',
    noHistory: 'لا يوجد سجل بعد',
    tryExample: 'جرب مثال',
    charCount: 'حرف',
    wordCount: 'كلمة',
    categories: [
      {
        id: '01',
        title: 'هندسة الأوامر',
        desc: 'حول الأفكار البسيطة إلى أوامر هندسية احترافية مفصلة. ننظم المخرجات لحل تحديات التفاعل المعقدة مع الذكاء الاصطناعي.',
      },
      {
        id: '02',
        title: 'التواصل والمحتوى',
        desc: 'نمِ جمهورك باستخدام الذكاء الاصطناعي. حول المدونات إلى ثريدات، أعد صياغة المحتوى، وأنشئ أوصاف منتجات جذابة.',
      },
      {
        id: '03',
        title: 'الذكاء البصري',
        desc: 'استخرج المحتوى من الصور، ودمج المفاهيم البصرية، وأنشئ أوامر لتوليد الفيديو والصور.',
      }
    ]
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'tool'>('home');
  const [selectedToolId, setSelectedToolId] = useState<ToolType | null>(null);
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<Array<{tool: string, input: string, output: string, timestamp: number}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Customization State
  const [iconColor, setIconColor] = useState('#FF4D00');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  
  // Smooth Scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Advanced Tool State
  const [advancedParams, setAdvancedParams] = useState({
    tone: 'Professional',
    audience: 'General',
    complexity: 'Medium'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTools = lang === 'en' ? TOOLS : TOOLS_AR;
  const activeTool = currentTools.find(t => t.id === selectedToolId) || currentTools[0];
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (lang === 'ar') {
      setFontFamily('Cairo');
    } else {
      setFontFamily('Inter');
    }
  }, [lang]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('raqim-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history');
      }
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Export functions
  const downloadAsFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsTxt = () => {
    if (result) {
      downloadAsFile(result, `raqim-${activeTool.id}-${Date.now()}.txt`, 'text/plain');
    }
  };

  const downloadAsMd = () => {
    if (result) {
      const markdown = `# ${activeTool.title}\n\n## Input\n${inputText}\n\n## Output\n${result}`;
      downloadAsFile(markdown, `raqim-${activeTool.id}-${Date.now()}.md`, 'text/markdown');
    }
  };

  // History functions
  const saveToHistory = (tool: string, input: string, output: string) => {
    const newEntry = { tool, input, output, timestamp: Date.now() };
    const newHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('raqim-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('raqim-history');
  };

  const loadFromHistory = (entry: any) => {
    setInputText(entry.input);
    setResult(entry.output);
    setShowHistory(false);
  };

  // Character and word count
  const getCharCount = () => inputText.length;
  const getWordCount = () => inputText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Load example
  const loadExample = () => {
    if (activeTool.example) {
      setInputText(activeTool.example);
    }
  };

  const handleToolSelect = (id: ToolType) => {
    setSelectedToolId(id);
    setView('tool');
    setResult(null);
    setInputText('');
    setFiles([]);
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      const maxFiles = selectedToolId === ToolType.TWO_IMAGES_TO_PROMPT ? 2 : 1;
      const readers = Array.from(fileList).slice(0, maxFiles).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results: string[]) => {
        setFiles(results);
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const isUrl = (string: string) => {
    try { 
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;  
    }
  };

  const handleSubmit = async () => {
    if (!inputText && files.length === 0) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      let finalPrompt = "";
      let systemPrompt = "";
      
      if (selectedToolId === ToolType.BLOG_TO_THREAD) {
        let contentToProcess = inputText;
        if (isUrl(inputText.trim())) {
          try {
             contentToProcess = await fetchUrlContent(inputText.trim());
          } catch (e) {
             console.warn("Could not fetch URL, treating as text.", e);
          }
        }
        finalPrompt = `${activeTool.promptTemplate}\n\n[CONTENT_START]\n${contentToProcess}\n[CONTENT_END]`;
      } else {
        systemPrompt = activeTool.promptTemplate;
        if (selectedToolId === ToolType.ADVANCED_PROMPT) {
          systemPrompt += `\n\nConfig:\n- Tone: ${advancedParams.tone}\n- Audience: ${advancedParams.audience}\n- Complexity: ${advancedParams.complexity}`;
        }
        finalPrompt = inputText;
      }

      // Call Worker API instead of direct Gemini
      const res = await generateAI({
        tool: selectedToolId as string,
        prompt: finalPrompt,
        system: systemPrompt || undefined,
        temperature: 0.7,
        maxOutputTokens: 2048,
        locale: lang,
        images: files.length > 0 ? files : undefined
      });
      
      setResult(res.text);
      // Save to history
      saveToHistory(activeTool.title, inputText, res.text);
    } catch (error: any) {
      console.error(error);
      setResult(error.message || "Error processing request. Please check your input or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const categoryImages = [
    // الفئة الأولى: هندسة الأوامر - تصميم gradient بنفسجي (ضع رابط صورتك هنا)
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
    // الفئة الثانية: التواصل والمحتوى - صورة جديدة من imgbb
    'https://i.ibb.co/pBvsD7mp/Gemini-Generated-Image-3m77u03m77u03m77.png',
    // الفئة الثالثة: الذكاء البصري
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'
  ];

  const categoryTools = [
    [ToolType.PROMPT_GEN, ToolType.ADVANCED_PROMPT],
    [ToolType.BLOG_TO_THREAD, ToolType.REWRITE, ToolType.PRODUCT_DESC, ToolType.TEXT_DETECTOR, ToolType.PROMPT_CHECK],
    [ToolType.IMAGE_TO_PROMPT, ToolType.IMAGE_TO_TEXT, ToolType.TWO_IMAGES_TO_PROMPT, ToolType.IMAGE_PROMPT, ToolType.VIDEO_PROMPT]
  ];

  const renderThreadResult = (text: string) => {
    const tweets = text.split('|||').map(t => t.trim()).filter(t => t.length > 0);
    if (tweets.length <= 1) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
           <Twitter size={16} className="text-[#1DA1F2]" />
           <span>{tweets.length} Tweets Generated</span>
        </div>
        {tweets.map((tweet, idx) => (
          <div key={idx} className="relative p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-[#FF4D00] transition-colors group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(tweet);
                }}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#FF4D00] hover:text-white transition-colors"
                title="Copy Tweet"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                {idx !== tweets.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800"></div>}
              </div>
              <div className="flex-1 pt-1 whitespace-pre-wrap text-base leading-relaxed">
                {tweet}
              </div>
            </div>
            <div className={`mt-4 text-xs font-mono text-right ${tweet.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
              {tweet.length}/280
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Split tools for marquee rows
  const row1 = currentTools.slice(0, Math.ceil(currentTools.length / 2));
  const row2 = currentTools.slice(Math.ceil(currentTools.length / 2));

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col transition-colors duration-500 bg-white dark:bg-black text-black dark:text-white"
      style={{ fontFamily: `"${fontFamily}", sans-serif` }}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onNavigate={setView} lang={lang} setLang={setLang} />

      <main className="flex-grow pt-20">
        {view === 'home' ? (
          <div className="animate-in fade-in duration-700">
            
            {/* NEW: Marquee Section replacing the old grid */}
            <section className="relative w-full overflow-hidden py-10 opacity-100">
               {/* Marquee Animations */}
               <style>{`
                 @keyframes scroll {
                   0% { transform: translateX(0); }
                   100% { transform: translateX(calc(-50% - 1rem)); }
                 }
                 @keyframes scroll-reverse {
                   0% { transform: translateX(calc(-50% - 1rem)); }
                   100% { transform: translateX(0); }
                 }
                 .animate-scroll {
                   animation: scroll 40s linear infinite;
                 }
                 .animate-scroll-reverse {
                   animation: scroll-reverse 40s linear infinite;
                 }
                 .pause-hover:hover {
                   animation-play-state: paused;
                 }
                 /* For RTL, we swap animations logic visually if needed, but marquee usually flows constantly */
               `}</style>
               
               <div className="flex flex-col gap-4">
                  {/* Row 1 */}
                  <div className="flex w-max gap-4 animate-scroll pause-hover">
                     {[...row1, ...row1, ...row1, ...row1].map((tool, i) => (
                        <button 
                          key={`r1-${i}`}
                          onClick={() => handleToolSelect(tool.id)}
                          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full shadow-sm hover:border-[#FF4D00] hover:shadow-md transition-all group whitespace-nowrap"
                        >
                           <div className="text-gray-400 group-hover:text-[#FF4D00] transition-colors">
                              {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 18 })}
                           </div>
                           <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{tool.title}</span>
                        </button>
                     ))}
                  </div>
                  
                  {/* Row 2 */}
                  <div className="flex w-max gap-4 animate-scroll-reverse pause-hover">
                     {[...row2, ...row2, ...row2, ...row2].map((tool, i) => (
                        <button 
                          key={`r2-${i}`}
                          onClick={() => handleToolSelect(tool.id)}
                          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full shadow-sm hover:border-[#FF4D00] hover:shadow-md transition-all group whitespace-nowrap"
                        >
                           <div className="text-gray-400 group-hover:text-[#FF4D00] transition-colors">
                              {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 18 })}
                           </div>
                           <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{tool.title}</span>
                        </button>
                     ))}
                  </div>
               </div>
               
               {/* Fade Edges */}
               <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none z-10"></div>
               <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none z-10"></div>
            </section>

            {/* Hero / Concept Area */}
            <section className="relative py-24 px-6 md:px-10 overflow-hidden min-h-[60vh] flex items-center">
               <div className="max-w-7xl mx-auto relative z-10 w-full">
                 <h1 className="text-6xl md:text-9xl font-serif font-medium tracking-tight leading-none mb-8 relative z-20 mix-blend-difference text-black dark:text-white">
                   {t.heroTitle}
                 </h1>
                 <p className="max-w-xl text-lg md:text-xl font-light leading-relaxed text-gray-600 dark:text-gray-400">
                   {t.heroDesc}
                 </p>
               </div>
               
               {/* THE DISTINCT ORANGE SQUARE FRAME */}
               <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border-[30px] md:border-[60px] border-[#FF4D00] rotate-[15deg] opacity-90 z-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen ${lang === 'ar' ? 'left-[-10%] md:left-[5%]' : 'right-[-10%] md:right-[5%]'}`}
               ></div>

               {/* Decorative background element mimicking the reference mask */}
               <div className={`absolute top-0 w-1/2 h-full opacity-5 pointer-events-none ${lang === 'ar' ? 'left-0 scale-x-[-1]' : 'right-0'}`}>
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-black dark:text-white">
                    <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.5,-41.3C83.9,-27,88.5,-12.1,86.4,2C84.3,16.1,75.5,29.4,65.8,40.8C56.1,52.2,45.5,61.7,33.2,68.6C20.9,75.5,7,79.8,-5.6,89.5C-18.2,99.2,-29.5,114.3,-39.2,112.5C-48.9,110.7,-57,92,-63.9,77.5C-70.8,63,-76.5,52.7,-79.8,41.4C-83.1,30.1,-84,17.8,-82.3,6.2C-80.6,-5.4,-76.3,-16.3,-69.7,-25.6C-63.1,-34.9,-54.2,-42.6,-44.3,-51.2C-34.4,-59.8,-23.5,-69.3,-11.6,-71.9C0.3,-74.5,12.2,-70.2,32.5,-83.3Z" transform="translate(100 100)" />
                  </svg>
               </div>
            </section>

            {/* What We Do (Categories) */}
            <section className="py-20 px-6 md:px-10 bg-gray-50 dark:bg-gray-900" id="tools">
              <div className="max-w-7xl mx-auto space-y-24">
                {t.categories.map((cat, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-12 group cursor-pointer" onClick={() => handleToolSelect(categoryTools[idx][0])}>
                    <div className={`md:w-1/2 overflow-hidden relative ${idx === 0 || idx === 1 || idx === 2 ? 'bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg' : ''}`}>
                      {idx === 0 ? (
                        <div className="rounded-lg shadow-lg">
                          <PromptEngineeringVisual />
                        </div>
                      ) : idx === 1 ? (
                        <div className="rounded-lg shadow-lg">
                          <SocialContentVisual />
                        </div>
                      ) : (
                        <div className="rounded-lg shadow-lg">
                          <VisualIntelligenceVisual />
                        </div>
                      )}
                       {/* Hover effect square */}
                       <div className="absolute inset-0 border-[10px] border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-95 group-hover:scale-100"></div>
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-between py-4">
                      <div>
                        <div className="text-4xl font-serif font-bold text-gray-200 dark:text-gray-700 mb-6">{cat.id}</div>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8 group-hover:translate-x-2 transition-transform duration-500">
                          {cat.title}
                        </h2>
                        <ul className="space-y-3 mb-8">
                          {categoryTools[idx].map(tId => {
                            const tool = currentTools.find(x => x.id === tId);
                            return tool ? (
                              <li key={tId} className="flex items-center gap-3 text-sm font-bold tracking-wide border-b border-gray-200 dark:border-gray-800 pb-2">
                                <ArrowRight size={14} className={`text-[#FF4D00] ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                {tool.title}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                      <div className="mt-auto">
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-light">
                          {cat.desc}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection('tools');
                          }}
                          className="px-8 py-3 border border-black dark:border-white rounded-full text-sm font-bold hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:text-white transition-all duration-300"
                        >
                          {t.viewWorks}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Customizer Section */}
            <section className="py-20 px-6 md:px-10 border-t border-gray-100 dark:border-gray-800">
               <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                 <h3 className="text-2xl font-serif font-bold">{t.customize}</h3>
                 <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                      <Type size={18} />
                      <select 
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="bg-transparent font-semibold outline-none text-sm w-32 cursor-pointer"
                      >
                        <optgroup label="Sans Serif">
                          {FONT_OPTIONS.sans.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
                        </optgroup>
                        <optgroup label="Serif">
                          {FONT_OPTIONS.serif.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
                        </optgroup>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                      <Palette size={18} />
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-300">
                        <input 
                          type="color" 
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 border-none cursor-pointer"
                        />
                      </div>
                    </div>
                 </div>
               </div>
            </section>

          </div>
        ) : (
          /* Tool View */
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 min-h-[80vh] flex flex-col">
            <div className="flex-grow max-w-6xl mx-auto px-6 md:px-10 w-full py-10">
               
               <div className="mb-8 flex items-center justify-between">
                 <button 
                   onClick={() => setView('home')} 
                   className="flex items-center gap-2 text-gray-500 hover:text-[#FF4D00] transition-colors text-sm font-bold uppercase tracking-wider"
                 >
                   <ArrowRight className={`${lang === 'ar' ? '' : 'rotate-180'}`} size={16} />
                   {t.back}
                 </button>
                 <div className="flex items-center gap-4">
                   <button
                     onClick={() => setShowHistory(!showHistory)}
                     className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF4D00] transition-colors"
                   >
                     <History size={16} />
                     {t.history}
                   </button>
                   <div className="text-xs font-mono text-gray-400">
                     {activeTool.title}
                   </div>
                 </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-16">
                 {/* Left Column: Input */}
                 <div className="lg:w-1/2 space-y-8">
                   <div className="border-b border-black dark:border-white pb-6 relative">
                      {/* Decorative Line */}
                      <div className={`absolute top-0 w-20 h-1 bg-[#FF4D00] ${lang === 'ar' ? 'right-0' : 'left-0'}`}></div>
                      
                      <div className="flex items-center gap-4 mb-4 pt-6">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-[#FF4D00]">
                          {React.cloneElement(activeTool.icon as React.ReactElement<any>, { size: 28 })}
                        </div>
                        <h1 className="text-4xl font-serif font-bold">{activeTool.title}</h1>
                      </div>
                      <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                        {activeTool.description}
                      </p>
                   </div>

                   {/* Advanced Settings */}
                   {selectedToolId === ToolType.ADVANCED_PROMPT && (
                     <div className={`p-6 bg-gray-50 dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-800 ${lang === 'ar' ? 'border-r-4 border-r-[#FF4D00]' : 'border-l-4 border-l-[#FF4D00]'}`}>
                        <div className="flex items-center gap-2 mb-4 font-bold">
                          <Settings2 size={18} />
                          <span>{t.config}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           {Object.entries(advancedParams).map(([key, val]) => (
                             <div key={key}>
                               <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{key}</label>
                               <select 
                                 className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 text-sm rounded-sm"
                                 value={val}
                                 onChange={(e) => setAdvancedParams({...advancedParams, [key]: e.target.value})}
                               >
                                 <option>Low</option>
                                 <option>Medium</option>
                                 <option>High</option>
                                 <option>General</option>
                                 <option>Professional</option>
                               </select>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <label className="block font-bold text-sm uppercase tracking-wide">{t.inputReq}</label>
                       {activeTool.example && (
                         <button 
                           onClick={loadExample}
                           className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF4D00] transition-colors"
                         >
                           <Lightbulb size={14} />
                           {t.tryExample}
                         </button>
                       )}
                     </div>
                     
                     <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeTool.placeholder}
                        className="w-full h-60 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#FF4D00] outline-none resize-none text-base leading-relaxed transition-colors"
                      />
                     
                     {/* Character and Word Count */}
                     <div className="flex items-center gap-4 text-xs text-gray-500">
                       <span>{getCharCount()} {t.charCount}</span>
                       <span>•</span>
                       <span>{getWordCount()} {t.wordCount}</span>
                     </div>
                     
                     {[ToolType.IMAGE_TO_PROMPT, ToolType.IMAGE_TO_TEXT, ToolType.TWO_IMAGES_TO_PROMPT].includes(selectedToolId as ToolType) && (
                        <div 
                          className={`border-2 border-dashed h-40 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-[#FF4D00] bg-gray-100' : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                           <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              multiple={selectedToolId === ToolType.TWO_IMAGES_TO_PROMPT} 
                              onChange={handleFileUpload}
                           />
                           {files.length > 0 ? (
                             <div className="flex gap-4">
                               {files.map((f, i) => (
                                 <img key={i} src={f} className="h-24 w-24 object-cover border border-gray-200" />
                               ))}
                             </div>
                           ) : (
                             <div className="text-center text-gray-400">
                               <Upload className="mx-auto mb-2" />
                               <span className="text-sm font-bold">{t.dragDrop}</span>
                             </div>
                           )}
                        </div>
                     )}
                   </div>

                   <button
                     onClick={handleSubmit}
                     disabled={isLoading || (!inputText && files.length === 0)}
                     className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-bold text-lg tracking-widest uppercase hover:bg-[#FF4D00] hover:text-white dark:hover:bg-[#FF4D00] dark:hover:text-white disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                   >
                     {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                     {t.generate}
                   </button>
                 </div>

                 {/* Right Column: Result */}
                 <div className="lg:w-1/2">
                    <div className="sticky top-24">
                       <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex justify-between items-center">
                         <span>{t.output}</span>
                         {result && (
                           <div className="flex items-center gap-2">
                             <button onClick={downloadAsTxt} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D00] hover:text-white transition-colors" title={t.downloadTxt}>
                               <Download size={12}/>
                               TXT
                             </button>
                             <button onClick={downloadAsMd} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D00] hover:text-white transition-colors" title={t.downloadMd}>
                               <FileText size={12}/>
                               MD
                             </button>
                             <button onClick={() => copyToClipboard(result)} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D00] hover:text-white transition-colors">
                               {isCopied ? <Check size={12}/> : <Copy size={12}/>}
                               {isCopied ? t.copied : t.copy}
                             </button>
                           </div>
                         )}
                       </h2>
                       
                       <div className={`min-h-[400px] ${selectedToolId === ToolType.BLOG_TO_THREAD && result ? 'bg-transparent' : 'p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'} leading-loose text-lg whitespace-pre-wrap ${!result && 'flex items-center justify-center text-gray-400 italic'}`}>
                          {result ? (
                             selectedToolId === ToolType.BLOG_TO_THREAD ? renderThreadResult(result) : result
                          ) : t.resultWait}
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* History Sidebar */}
            {showHistory && (
              <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowHistory(false)}>
                <div 
                  className={`fixed top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} h-full w-96 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <History size={20} />
                      {t.history}
                    </h3>
                    <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={14} />
                      {t.clearHistory}
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    {history.length === 0 ? (
                      <p className="text-center text-gray-400 py-10">{t.noHistory}</p>
                    ) : (
                      history.map((entry, idx) => (
                        <div 
                          key={idx}
                          onClick={() => loadFromHistory(entry)}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                          <div className="text-xs font-bold text-[#FF4D00] mb-2">{entry.tool}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{entry.input}</div>
                          <div className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;