import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Navbar, Footer } from './components/Layout';
import SocialContentVisual from './components/SocialContentVisual';
import PromptEngineeringVisual from './components/PromptEngineeringVisual';
import VisualIntelligenceVisual from './components/VisualIntelligenceVisual';
import { 
  TOOLS, 
  TOOLS_AR,
  IMAGE_QUICK_TAGS,
  VIDEO_QUICK_TAGS,
  IMAGE_STYLES,
  IMAGE_LIGHTING,
  IMAGE_CAMERA,
  ASPECT_RATIOS,
  VIDEO_STYLES,
  VIDEO_CAMERA_MOVEMENT,
  SMART_ENHANCE_IMAGE_PROMPT,
  SMART_ENHANCE_VIDEO_PROMPT,
  PRODUCT_AUDIENCES,
  PRODUCT_TONES,
  PRODUCT_PLATFORMS
} from './constants';
import { ToolType, ToolMetadata } from './types';
import { generateAI, fetchUrlContent, generateMedia } from './services/aiClient';
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
  Lightbulb,
  Mic,
  MicOff,
  Share2,
  ShoppingCart,
  Globe,
  Camera,
  ShieldCheck
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

const ADVANCED_OPTIONS = {
  tone: ['Professional', 'Creative', 'Casual', 'Academic', 'Formal'],
  audience: ['General', 'Experts', 'Children', 'Business', 'Technical'],
  complexity: ['Low', 'Medium', 'High']
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
    advanced: {
      tone: 'Tone',
      audience: 'Audience',
      complexity: 'Complexity',
      options: {
        Professional: 'Professional',
        Creative: 'Creative',
        Casual: 'Casual',
        Academic: 'Academic',
        Formal: 'Formal',
        General: 'General',
        Experts: 'Experts',
        Children: 'Children',
        Business: 'Business',
        Technical: 'Technical',
        Low: 'Low',
        Medium: 'Medium',
        High: 'High'
      }
    },
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
    advanced: {
      tone: 'نبرة الصوت',
      audience: 'الجمهور المستهدف',
      complexity: 'مستوى التعقيد',
      options: {
        Professional: 'احترافي',
        Creative: 'إبداعي',
        Casual: 'ودي',
        Academic: 'أكاديمي',
        Formal: 'رسمي',
        General: 'عام',
        Experts: 'خبراء',
        Children: 'أطفال',
        Business: 'أعمال',
        Technical: 'تقني',
        Low: 'منخفض',
        Medium: 'متوسط',
        High: 'مرتفع'
      }
    },
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
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  
  // Customization State
  const [iconColor, setIconColor] = useState('#FF4D00');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, [lang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition', e);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedTool = params.get('tool');
    const sharedInput = params.get('input');
    
    if (sharedTool && Object.values(ToolType).includes(sharedTool as ToolType)) {
      setSelectedToolId(sharedTool as ToolType);
      setView('tool');
      if (sharedInput) {
        try {
          setInputText(decodeURIComponent(atob(sharedInput)));
        } catch (e) {
          console.error('Failed to decode shared input', e);
        }
      }
    }
  }, []);
  
  // Smooth Scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('vision');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Advanced Tool State
  const [advancedParams, setAdvancedParams] = useState({
    tone: 'Professional',
    audience: 'General',
    complexity: 'Medium'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfLang, setPdfLang] = useState<'en' | 'ar' | null>(null);
  const [isIncognito, setIsIncognito] = useState(false);

  // Image/Video Tool State
  const [imageStyle, setImageStyle] = useState('بدون');
  const [imageLighting, setImageLighting] = useState('بدون');
  const [imageCamera, setImageCamera] = useState('بدون');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [videoStyle, setVideoStyle] = useState('بدون');
  const [videoMovement, setVideoMovement] = useState('بدون');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Product Description State
  const [productAudience, setProductAudience] = useState('عام');
  const [productTone, setProductTone] = useState('بسيط ومباشر');
  const [productPlatform, setProductPlatform] = useState('متجر إلكتروني (سلة/زد)');
  const [productKeywords, setProductKeywords] = useState('');
  const [productCompetitorUrl, setProductCompetitorUrl] = useState('');
  const [productActiveTab, setProductActiveTab] = useState('store');
  const [isExporting, setIsExporting] = useState(false);

  // Gemini Media State
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

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
    setCompareResult(null);
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

  const handleSmartEnhance = async () => {
    if (!inputText.trim()) return;
    
    setIsEnhancing(true);
    try {
      const systemPrompt = selectedToolId === ToolType.IMAGE_PROMPT 
        ? SMART_ENHANCE_IMAGE_PROMPT 
        : SMART_ENHANCE_VIDEO_PROMPT;
        
      const res = await generateAI({
        tool: 'SMART_ENHANCE',
        prompt: inputText,
        system: systemPrompt,
        temperature: 0.8,
        locale: lang
      });
      
      const enhanced = res.text;
      
      if (enhanced.includes('[SAFETY_VIOLATION]')) {
        alert(lang === 'ar' ? 'عذراً، هذا الطلب قد ينتهك سياسات المحتوى.' : 'Sorry, this request might violate content policies.');
      } else {
        setInputText(enhanced.trim());
      }
    } catch (error) {
      console.error('Enhancement failed', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGeminiMediaGeneration = async (promptToUse?: string) => {
    const targetPrompt = promptToUse || result;
    if (!targetPrompt) return;
    
    // Safety check (basic)
    const harmfulKeywords = ['explicit', 'violence', 'hate', 'illegal', 'عنف', 'كراهية', 'إباحي'];
    if (harmfulKeywords.some(word => targetPrompt.toLowerCase().includes(word))) {
      alert(lang === 'ar' ? 'عذراً، النص المولد قد يحتوي على محتوى لا يتوافق مع سياسات السلامة.' : 'Sorry, the generated text may contain content that does not comply with safety policies.');
      return;
    }

    setIsGeneratingMedia(true);
    setGeneratedMediaUrl(null);
    
    try {
      const type = selectedToolId === ToolType.IMAGE_PROMPT ? 'image' : 'video';
      const res = await generateMedia(targetPrompt, type);
      setGeneratedMediaUrl(res.url);
      setMediaType(res.type);
    } catch (error: any) {
      console.error('Media generation failed', error);
      alert(error.message || (lang === 'ar' ? 'فشل توليد المحتوى. يرجى المحاولة مرة أخرى.' : 'Failed to generate content. Please try again.'));
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputText && files.length === 0) return;
    setIsLoading(true);
    setResult(null);
    setCompareResult(null);
    setGeneratedMediaUrl(null);
    setMediaType(null);
    
    try {
      let finalPrompt = "";
      let systemPrompt = "";
      
      if (selectedToolId === ToolType.BLOG_TO_THREAD || selectedToolId === ToolType.BRAND_STRATEGY || selectedToolId === ToolType.TEXT_DETECTOR) {
        let contentToProcess = inputText;
        if (isUrl(inputText.trim())) {
          try {
             contentToProcess = await fetchUrlContent(inputText.trim());
          } catch (e) {
             console.warn("Could not fetch URL, treating as text.", e);
          }
        }
        
        if (selectedToolId === ToolType.BRAND_STRATEGY) {
          systemPrompt = activeTool.promptTemplate;
          finalPrompt = `Analyze the following content (from a website or user description) and provide a brand strategy. If images are provided, analyze them as part of the visual identity.\n\nContent:\n${contentToProcess}`;
        } else if (selectedToolId === ToolType.TEXT_DETECTOR) {
          systemPrompt = activeTool.promptTemplate;
          finalPrompt = `Analyze the following text for AI detection. If images are provided, extract text from them and analyze it too.\n\nText:\n${contentToProcess}`;
        } else {
          finalPrompt = `${activeTool.promptTemplate}\n\n[CONTENT_START]\n${contentToProcess}\n[CONTENT_END]`;
        }
      } else {
        systemPrompt = activeTool.promptTemplate;
        if (selectedToolId === ToolType.ADVANCED_PROMPT) {
          systemPrompt += `\n\nConfig:\n- Tone: ${advancedParams.tone}\n- Audience: ${advancedParams.audience}\n- Complexity: ${advancedParams.complexity}`;
        }
        
        if (selectedToolId === ToolType.IMAGE_PROMPT) {
          systemPrompt += `\n\nTechnical Parameters:\n- Style: ${imageStyle}\n- Lighting: ${imageLighting}\n- Camera: ${imageCamera}\n- Aspect Ratio: ${aspectRatio}`;
        }
        
        if (selectedToolId === ToolType.VIDEO_PROMPT) {
          systemPrompt += `\n\nTechnical Parameters:\n- Style: ${videoStyle}\n- Camera Movement: ${videoMovement}`;
        }

        if (selectedToolId === ToolType.PRODUCT_DESC) {
          let competitorInfo = "";
          if (productCompetitorUrl && isUrl(productCompetitorUrl.trim())) {
            try {
              const competitorContent = await fetchUrlContent(productCompetitorUrl.trim());
              competitorInfo = lang === 'ar' 
                ? `\n[معلومات المنافس]:\n${competitorContent}\n\nالمهمة الإضافية: قم بتحليل منتج المنافس أعلاه، واكتب وصف منتجنا بحيث يبرز نقاط قوتنا وتفوقنا عليه بشكل ذكي وغير مباشر.`
                : `\n[COMPETITOR INFO]:\n${competitorContent}\n\nAdditional Task: Analyze the competitor's product above, and write our product description in a way that highlights our strengths and superiority over them in a smart and indirect way.`;
            } catch (e) {
              console.warn("Could not fetch competitor URL", e);
            }
          }

          systemPrompt = systemPrompt
            .replace('{audience}', productAudience)
            .replace('{tone}', productTone)
            .replace('{platform}', productPlatform)
            .replace('{keywords}', productKeywords || 'غير محددة')
            .replace('{competitor_info}', competitorInfo);
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

  const handleCompare = async () => {
    if (!inputText && files.length === 0) return;
    setIsComparing(true);
    setCompareResult(null);
    
    try {
      let finalPrompt = "";
      let systemPrompt = "";
      
      if (selectedToolId === ToolType.BLOG_TO_THREAD || selectedToolId === ToolType.BRAND_STRATEGY || selectedToolId === ToolType.TEXT_DETECTOR) {
        let contentToProcess = inputText;
        if (isUrl(inputText.trim())) {
          try {
             contentToProcess = await fetchUrlContent(inputText.trim());
          } catch (e) {
             console.warn("Could not fetch URL, treating as text.", e);
          }
        }

        if (selectedToolId === ToolType.BRAND_STRATEGY) {
          systemPrompt = activeTool.promptTemplate;
          finalPrompt = `Analyze the following content and provide a brand strategy. If images are provided, analyze them as part of the visual identity.\n\nContent:\n${contentToProcess}`;
        } else if (selectedToolId === ToolType.TEXT_DETECTOR) {
          systemPrompt = activeTool.promptTemplate;
          finalPrompt = `Analyze the following text for AI detection. If images are provided, extract text from them and analyze it too.\n\nText:\n${contentToProcess}`;
        } else {
          finalPrompt = `${activeTool.promptTemplate}\n\n[CONTENT_START]\n${contentToProcess}\n[CONTENT_END]`;
        }
      } else {
        systemPrompt = activeTool.promptTemplate;
        
        if (selectedToolId === ToolType.PRODUCT_DESC) {
          let competitorInfo = "";
          if (productCompetitorUrl && isUrl(productCompetitorUrl.trim())) {
            try {
              const competitorContent = await fetchUrlContent(productCompetitorUrl.trim());
              competitorInfo = lang === 'ar' 
                ? `\n[معلومات المنافس]:\n${competitorContent}\n\nالمهمة الإضافية: قم بتحليل منتج المنافس أعلاه، واكتب وصف منتجنا بحيث يبرز نقاط قوتنا وتفوقنا عليه بشكل ذكي وغير مباشر.`
                : `\n[COMPETITOR INFO]:\n${competitorContent}\n\nAdditional Task: Analyze the competitor's product above, and write our product description in a way that highlights our strengths and superiority over them in a smart and indirect way.`;
            } catch (e) {
              console.warn("Could not fetch competitor URL", e);
            }
          }

          systemPrompt = systemPrompt
            .replace('{audience}', productAudience)
            .replace('{tone}', productTone)
            .replace('{platform}', productPlatform)
            .replace('{keywords}', productKeywords || 'غير محددة')
            .replace('{competitor_info}', competitorInfo);
        }

        finalPrompt = inputText;
      }

      const res = await generateAI({
        tool: selectedToolId as string,
        prompt: finalPrompt,
        system: systemPrompt || undefined,
        temperature: 0.9, // Higher temperature for variety
        maxOutputTokens: 2048,
        locale: lang,
        images: files.length > 0 ? files : undefined
      });
      
      setCompareResult(res.text);
    } catch (error: any) {
      console.error(error);
      setCompareResult("Error generating comparison.");
    } finally {
      setIsComparing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const downloadPDF = async (targetLang?: 'en' | 'ar') => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    
    if (targetLang) {
      setPdfLang(targetLang);
      // Wait for state update and re-render
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Raqim-AI-Brand-Strategy-${targetLang || lang}-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      setIsDownloading(false);
      setPdfLang(null);
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
    [ToolType.PROMPT_GEN, ToolType.ADVANCED_PROMPT, ToolType.PROMPT_CHECK, ToolType.AI_PERSONA, ToolType.PROMPT_BUILDER],
    [ToolType.BLOG_TO_THREAD, ToolType.REWRITE, ToolType.PRODUCT_DESC, ToolType.DIALECT_CONVERTER, ToolType.SEO_META, ToolType.HASHTAG_GEN, ToolType.TEXT_DETECTOR],
    [ToolType.IMAGE_TO_PROMPT, ToolType.IMAGE_TO_TEXT, ToolType.TWO_IMAGES_TO_PROMPT, ToolType.IMAGE_PROMPT, ToolType.VIDEO_PROMPT, ToolType.BRAND_STRATEGY]
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

  const renderBrandResult = (text: string) => {
    // Regex to find [COLOR:#HEX]
    const colorRegex = /\[COLOR:(#[0-9A-Fa-f]{6})\]/g;
    const colors = Array.from(text.matchAll(colorRegex)).map(m => m[1]);
    const displayLang = pdfLang || lang;

    return (
      <div className="space-y-8 relative">
        <div className="flex flex-wrap justify-end gap-3 mb-4">
          {lang === 'ar' && (
            <button
              onClick={() => downloadPDF('en')}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              {isDownloading && pdfLang === 'en' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download English PDF
            </button>
          )}
          <button
            onClick={() => downloadPDF()}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#e64500] transition-colors disabled:opacity-50"
          >
            {isDownloading && !pdfLang ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {lang === 'ar' ? 'تحميل التقرير PDF' : 'Download PDF Report'}
          </button>
        </div>

        <div ref={reportRef} className={`space-y-8 p-4 md:p-8 bg-white dark:bg-black rounded-2xl ${displayLang === 'ar' ? 'rtl' : 'ltr'}`} dir={displayLang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Header for PDF */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-[#FF4D00]">RAQIM AI</h2>
            <p className="text-sm text-gray-500">{displayLang === 'ar' ? 'تقرير استراتيجية الهوية البصرية' : 'Visual Identity & Brand Strategy Report'}</p>
          </div>

          {colors.length > 0 && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#FF4D00]">
                {displayLang === 'ar' ? 'لوحة الألوان المقترحة' : 'Suggested Color Palette'}
              </h3>
              <div className="flex flex-wrap gap-4">
                {colors.map((color, idx) => (
                  <div key={idx} className="group relative">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700"
                      style={{ backgroundColor: color }}
                    />
                    <div className="mt-2 text-[10px] font-mono text-center text-gray-500">{color}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="whitespace-pre-wrap leading-relaxed text-lg">
            {text.replace(colorRegex, (match, color) => color)}
          </div>
          
          {/* Footer for PDF */}
          <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
            Generated by Raqim AI - {new Date().toLocaleDateString(displayLang === 'ar' ? 'ar-EG' : 'en-US')}
          </div>
        </div>
      </div>
    );
  };

  const renderDetectorResult = (text: string) => {
    const extract = (marker: string) => {
      const regex = new RegExp(`\\[${marker}:\\s*([\\s\\S]*?)\\]`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const percentage = parseInt(extract('PERCENTAGE')) || 0;
    const verdict = extract('VERDICT');
    const fingerprint = extract('FINGERPRINT');
    const translationDetected = extract('TRANSLATION_DETECTED');
    const localNuance = parseInt(extract('LOCAL_NUANCE')) || 0;
    const perplexity = extract('PERPLEXITY');
    const burstiness = extract('BURSTINESS');
    const heatmap = extract('HEATMAP');
    const reasoning = extract('REASONING');
    const tips = extract('TIPS');

    if (!verdict && !reasoning) return <div className="whitespace-pre-wrap">{text}</div>;

    return (
      <div className="space-y-6 relative">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => downloadPDF()}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-colors disabled:opacity-50 text-sm font-bold"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {lang === 'ar' ? 'تحميل تقرير رقيم المعتمد' : 'Download Certified Report'}
          </button>
        </div>

        <div ref={reportRef} className={`space-y-6 p-6 md:p-10 bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Certified Header */}
          <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#FF4D00]">RAQIM AI</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'نظام كشف الانتحال والذكاء الاصطناعي' : 'AI & Plagiarism Detection System'}</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-[#FF4D00]/20 flex items-center justify-center text-[#FF4D00] font-bold text-[10px] text-center leading-tight rotate-12">
              CERTIFIED<br/>VERIFIED
            </div>
          </div>

          {/* Main Score & Fingerprint */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <div className="relative w-48 h-24 mx-auto overflow-hidden">
                <div className="absolute inset-0 w-48 h-48 rounded-full border-[16px] border-gray-200 dark:border-gray-800"></div>
                <div 
                  className="absolute inset-0 w-48 h-48 rounded-full border-[16px] transition-all duration-1000"
                  style={{ 
                    borderColor: percentage > 70 ? '#ef4444' : percentage > 30 ? '#f59e0b' : '#10b981',
                    clipPath: `polygon(50% 50%, -50% -50%, ${percentage}% -50%)`,
                    transform: `rotate(${percentage * 1.8}deg)`
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <span className="text-4xl font-black">{percentage}%</span>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">AI Probability</p>
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-black">{verdict}</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {fingerprint && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">
                    <Sparkles size={12} />
                    {lang === 'ar' ? 'البصمة:' : 'Fingerprint:'} {fingerprint}
                  </div>
                )}
                {translationDetected && translationDetected.toLowerCase().includes(lang === 'ar' ? 'نعم' : 'yes') && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">
                    <LinkIcon size={12} />
                    {lang === 'ar' ? 'ترجمة آلية مكتشفة' : 'Machine Translation Detected'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] uppercase text-gray-500 mb-2">{lang === 'ar' ? 'الروح المحلية' : 'Local Nuance'}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4D00]" style={{ width: `${localNuance}%` }}></div>
                  </div>
                  <span className="font-bold text-sm">{localNuance}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] uppercase text-gray-500 mb-1">Perplexity</p>
                  <span className="font-bold text-xs">{perplexity}</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] uppercase text-gray-500 mb-1">Burstiness</p>
                  <span className="font-bold text-xs">{burstiness}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Section */}
          {heatmap && (
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Palette size={16} className="text-[#FF4D00]" />
                {lang === 'ar' ? 'الخارطة الحرارية للنص' : 'Text Heatmap'}
              </h4>
              <div 
                className="text-sm leading-relaxed whitespace-pre-wrap heatmap-content"
                dangerouslySetInnerHTML={{ 
                  __html: heatmap.replace(/<mark>/g, '<mark style="background-color: rgba(239, 68, 68, 0.2); color: inherit; padding: 2px 0; border-bottom: 2px solid #ef4444;">') 
                }}
              />
              <p className="mt-4 text-[10px] text-gray-400 italic">
                {lang === 'ar' ? '* الجمل المظللة بالأحمر تحمل خصائص الذكاء الاصطناعي.' : '* Red highlighted sentences show AI-like characteristics.'}
              </p>
            </div>
          )}

          {/* Reasoning */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <FileText size={16} className="text-[#FF4D00]" />
              {lang === 'ar' ? 'التحليل التفصيلي' : 'Detailed Analysis'}
            </h4>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{reasoning}</p>
          </div>

          {/* Tips */}
          <div className="p-6 bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-2xl">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#FF4D00]">
              <Lightbulb size={16} />
              {lang === 'ar' ? 'نصائح للأنسنة' : 'Humanization Tips'}
            </h4>
            <p className="text-sm leading-relaxed">{tips}</p>
          </div>

          {/* Footer for PDF */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400">
            <span>Raqim AI Verification ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Button (Outside PDF) */}
        {percentage > 20 && (
          <button 
            onClick={() => setSelectedToolId(ToolType.REWRITE)}
            className="w-full py-4 bg-[#FF4D00] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#e64500] transition-all shadow-lg shadow-[#FF4D00]/20"
          >
            <Sparkles size={18} />
            {lang === 'ar' ? 'أنسنة هذا النص الآن' : 'Humanize this text now'}
          </button>
        )}
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        windowWidth: 800 // Fixed width for consistent PDF layout
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`raqim-analysis-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderProductResult = (text: string) => {
    const extract = (marker: string) => {
      const regex = new RegExp(`\\[${marker}\\]:?([\\s\\S]*?)(?=\\[[A-Z_]+\\]|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const headlines = extract('HEADLINES').split('\n').filter(h => h.trim());
    const storeDesc = extract('STORE_DESC');
    const keyPoints = extract('KEY_POINTS').split('\n').filter(p => p.trim());
    const socialMedia = extract('SOCIAL_MEDIA');
    const seoMeta = extract('SEO_META');
    const cta = extract('CTA').split('\n').filter(c => c.trim());
    const visualTips = extract('VISUAL_TIPS');
    const comparisonInsight = extract('COMPARISON_INSIGHT');

    if (!storeDesc && !headlines.length) return <div className="whitespace-pre-wrap">{text}</div>;

    const tabs = [
      { id: 'store', label: lang === 'ar' ? 'وصف المتجر' : 'Store Description', icon: <ShoppingCart size={14} /> },
      { id: 'points', label: lang === 'ar' ? 'نقاط القوة' : 'Key Points', icon: <Check size={14} /> },
      { id: 'social', label: lang === 'ar' ? 'منصات التواصل' : 'Social Media', icon: <Share2 size={14} /> },
      { id: 'seo', label: lang === 'ar' ? 'SEO & Meta' : 'SEO & Meta', icon: <Globe size={14} /> },
      { id: 'visual', label: lang === 'ar' ? 'اقتراحات التصوير' : 'Visual Tips', icon: <Camera size={14} /> }
    ];

    if (comparisonInsight) {
      tabs.push({ id: 'comparison', label: lang === 'ar' ? 'تحليل المنافس' : 'Competitor Analysis', icon: <ShieldCheck size={14} /> });
    }

    return (
      <div ref={resultRef} className="space-y-6 animate-in fade-in duration-500 relative">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-2 no-print">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileText size={14} className="text-[#FF4D00]" />
            )}
            {lang === 'ar' ? 'تحميل التقرير PDF' : 'Download PDF Report'}
          </button>
        </div>

        {/* Hidden Printable Version */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={pdfRef} className={`p-10 w-[800px] space-y-8 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center border-b-2 border-[#FF4D00] pb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter">RAQIM AI</h1>
                <p className="text-sm opacity-60">{lang === 'ar' ? 'تقرير تحليل المنتج الذكي' : 'Smart Product Analysis Report'}</p>
              </div>
              <div className="text-right text-xs opacity-40">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">{lang === 'ar' ? 'العناوين المقترحة' : 'Suggested Headlines'}</h2>
              <div className="grid grid-cols-1 gap-3">
                {headlines.map((h, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 font-serif italic">
                    {h.replace(/^[-*•\d.]+\s*/, '')}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">{lang === 'ar' ? 'وصف المتجر' : 'Store Description'}</h2>
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl text-base leading-relaxed whitespace-pre-wrap">
                {storeDesc}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">{lang === 'ar' ? 'نقاط القوة والمميزات' : 'Key Features & Points'}</h2>
              <div className="grid grid-cols-1 gap-3">
                {keyPoints.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-[#FF4D00]"></div>
                    <p className="text-sm">{p.replace(/^[-*•\d.]+\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">{lang === 'ar' ? 'محتوى التواصل الاجتماعي' : 'Social Media Content'}</h2>
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl font-mono text-sm whitespace-pre-wrap">
                {socialMedia}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">SEO & Meta</h2>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm italic">
                  {seoMeta}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-bold border-s-4 border-[#FF4D00] ps-3">{lang === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'}</h2>
                <div className="flex flex-wrap gap-2">
                  {productKeywords.split(',').map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold">
                      #{k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {comparisonInsight && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold border-s-4 border-blue-500 ps-3">{lang === 'ar' ? 'التحليل التنافسي' : 'Competitive Analysis'}</h2>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm italic border border-blue-100 dark:border-blue-800">
                  {comparisonInsight}
                </div>
              </div>
            )}

            <div className="pt-10 border-t border-gray-100 dark:border-gray-800 text-center text-[10px] opacity-30">
              Generated by Raqim AI - Creative Prompt Engineering & Branding Analysis
            </div>
          </div>
        </div>

        {/* Headlines Section */}
        <div className="p-6 bg-black text-white dark:bg-white dark:text-black rounded-2xl shadow-xl">
          <h4 className="text-[10px] uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
            <Sparkles size={12} />
            {lang === 'ar' ? 'عناوين مقترحة خاطفة للعين' : 'Catchy Headlines'}
          </h4>
          <div className="space-y-3">
            {headlines.map((h, i) => (
              <div key={i} className="text-lg font-serif font-bold border-s-2 border-[#FF4D00] ps-4 py-1">
                {h.replace(/^[-*•\d.]+\s*/, '')}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setProductActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative ${
                productActiveTab === tab.id 
                ? 'text-[#FF4D00]' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {productActiveTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4D00] animate-in slide-in-from-left-full duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          {productActiveTab === 'store' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="prose dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
                {storeDesc}
              </div>
              {cta.length > 0 && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h5 className="text-xs font-bold uppercase text-[#FF4D00] mb-3">{lang === 'ar' ? 'عبارات الحث على الفعل (CTA)' : 'Call to Action'}</h5>
                  <div className="flex flex-wrap gap-2">
                    {cta.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium">
                        {c.replace(/^[-*•\d.]+\s*/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {productActiveTab === 'points' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {keyPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00]/10 text-[#FF4D00] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{p.replace(/^[-*•\d.]+\s*/, '')}</p>
                </div>
              ))}
            </div>
          )}

          {productActiveTab === 'social' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {socialMedia}
              </div>
              <button 
                onClick={() => copyToClipboard(socialMedia)}
                className="flex items-center gap-2 text-xs font-bold text-[#FF4D00] hover:underline"
              >
                <Copy size={14} />
                {lang === 'ar' ? 'نسخ للنشر الفوري' : 'Copy for instant posting'}
              </button>
            </div>
          )}

          {productActiveTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h5 className="text-xs font-bold uppercase text-blue-500 mb-2">Meta Description (160 chars)</h5>
                <p className="text-sm leading-relaxed italic">"{seoMeta}"</p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">{lang === 'ar' ? 'الكلمات المفتاحية المستخدمة' : 'Keywords Used'}</h5>
                <div className="flex flex-wrap gap-2">
                  {productKeywords.split(',').map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-[10px] font-bold">
                      #{k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {productActiveTab === 'visual' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 p-4 bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-xl">
                <Camera className="text-[#FF4D00]" size={20} />
                <p className="text-sm font-bold">{lang === 'ar' ? 'توصيات التصوير الفوتوغرافي' : 'Photography Recommendations'}</p>
              </div>
              <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {visualTips}
              </div>
            </div>
          )}

          {productActiveTab === 'comparison' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <ShieldCheck className="text-blue-500" size={20} />
                <p className="text-sm font-bold">{lang === 'ar' ? 'تحليل التميز التنافسي' : 'Competitive Excellence Analysis'}</p>
              </div>
              <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 text-sm leading-relaxed whitespace-pre-wrap italic">
                {comparisonInsight}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGeminiButton = (promptText: string) => {
    if (generatedMediaUrl) {
      return (
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative group rounded-3xl overflow-hidden border-4 border-black dark:border-white shadow-2xl">
            {mediaType === 'image' ? (
              <img src={generatedMediaUrl} alt="Generated" className="w-full h-auto" />
            ) : (
              <video src={generatedMediaUrl} controls className="w-full h-auto" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button 
                 onClick={() => {
                   const a = document.createElement('a');
                   a.href = generatedMediaUrl;
                   a.download = `raqim-gemini-${Date.now()}.${mediaType === 'image' ? 'png' : 'mp4'}`;
                   a.click();
                 }}
                 className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl"
               >
                 <Download size={24} />
               </button>
            </div>
          </div>
          <div className="flex justify-center">
             <button 
               onClick={() => setGeneratedMediaUrl(null)}
               className="text-xs text-gray-500 hover:text-[#FF4D00] underline"
             >
               {lang === 'ar' ? 'إعادة التوليد' : 'Regenerate'}
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-xl text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-[#FF4D00] mb-1">
              <Lightbulb size={14} />
              {lang === 'ar' ? 'كيفية الاستخدام:' : 'How to use:'}
            </div>
            {lang === 'ar' 
              ? 'انسخ النص المولد أعلاه، ثم اضغط على زر Gemini للانتقال وتوليد المحتوى هناك مباشرة.' 
              : 'Copy the generated text above, then click the Gemini button to go and generate content there directly.'}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleGeminiMediaGeneration(promptText)}
              disabled={isGeneratingMedia}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 text-sm"
            >
              {isGeneratingMedia ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} className="text-[#FF4D00]" />
              )}
              {lang === 'ar' ? 'توليد عبر API' : 'Generate via API'}
            </button>

            <a
              href="https://gemini.google.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg text-sm"
            >
              <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d473530393318e422bb7.svg" alt="Gemini" className="w-5 h-5" />
              {lang === 'ar' ? 'الانتقال إلى Gemini' : 'Go to Gemini'}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col transition-colors duration-500 bg-white dark:bg-black text-black dark:text-white"
      style={{ fontFamily: `"${fontFamily}", sans-serif` }}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onNavigate={setView} lang={lang} setLang={setLang} scrollToAbout={scrollToAbout} />

      <main className="flex-grow pt-20">
        {view === 'home' ? (
          <div className="animate-in fade-in duration-700">
            
            {/* Static Tools Grid */}
            <section className="max-w-7xl mx-auto px-6 md:px-10 py-10">
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {currentTools.map((tool, i) => (
                    <button 
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-[#FF4D00] hover:shadow-md transition-all group text-center"
                    >
                       <div className="text-gray-400 group-hover:text-[#FF4D00] transition-colors">
                          {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 24 })}
                       </div>
                       <span className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-tight">{tool.title}</span>
                    </button>
                  ))}
               </div>
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

            {/* Prompts 2025 Section */}
            <section className="py-16 px-6 md:px-10" id="prompts-2025">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3">{lang === 'ar' ? 'برومتات 2025' : 'Prompts 2025'}</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{lang === 'ar' ? 'استعرض أفضل 50 برومبت الأكثر استخداماً وفعالية في 2025 — جاهزة للاستخدام في الأعمال، التسويق، توليد الصور، البرمجة و SEO.' : 'Browse the Top 50 most effective prompts of 2025 — ready-to-use for productivity, marketing, image generation, coding, and SEO.'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="/prompts-2025.html" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#FF4D00] text-white rounded-xl font-bold hover:bg-[#e64600] transition-all shadow-lg text-sm">
                      {lang === 'ar' ? 'فتح المكتبة' : 'Open Library'}
                    </a>
                  </div>
                </div>
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
                      {activeTool.detailedDescription && (
                        <div className="mt-4 p-4 bg-[#FF4D00]/5 border-s-4 border-[#FF4D00] text-sm text-gray-700 dark:text-gray-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                          {activeTool.detailedDescription}
                        </div>
                      )}
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
                               <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                                 {(t as any).advanced[key]}
                               </label>
                               <select 
                                 className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 text-sm rounded-sm"
                                 value={val}
                                 onChange={(e) => setAdvancedParams({...advancedParams, [key]: e.target.value})}
                               >
                                 {(ADVANCED_OPTIONS as any)[key].map((opt: string) => (
                                   <option key={opt} value={opt}>
                                     {(t as any).advanced.options[opt]}
                                   </option>
                                 ))}
                               </select>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <label className="block font-bold text-sm uppercase tracking-wide">{t.inputReq}</label>
                       <div className="flex items-center gap-4">
                         {activeTool.example && (
                           <button 
                             onClick={loadExample}
                             className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF4D00] transition-colors"
                           >
                             <Lightbulb size={14} />
                             {t.tryExample}
                           </button>
                         )}
                         <button 
                           onClick={toggleListening}
                           className={`flex items-center gap-1 text-xs font-bold transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-[#FF4D00]'}`}
                         >
                           {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                           {isListening ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop Listening') : (lang === 'ar' ? 'إدخال صوتي' : 'Voice Input')}
                         </button>
                       </div>
                     </div>

                     {/* Image/Video Specific Toolbar */}
                     {(selectedToolId === ToolType.IMAGE_PROMPT || selectedToolId === ToolType.VIDEO_PROMPT) && (
                       <div className="flex flex-wrap items-center gap-2 mb-2">
                         <button
                           onClick={handleSmartEnhance}
                           disabled={isEnhancing || !inputText.trim()}
                           className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isEnhancing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FF4D00] text-white hover:bg-[#E64500] shadow-lg shadow-[#FF4D00]/20'}`}
                         >
                           {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                           {lang === 'ar' ? 'تحسين ذكي' : 'Smart Enhance'}
                         </button>
                         
                         <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2"></div>
                         
                         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
                           {(selectedToolId === ToolType.IMAGE_PROMPT ? IMAGE_QUICK_TAGS : VIDEO_QUICK_TAGS).map((tag) => (
                             <button
                               key={tag.label}
                               onClick={() => setInputText(prev => prev + (prev ? ', ' : '') + tag.value)}
                               className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-[10px] font-medium transition-colors border border-gray-200 dark:border-gray-700"
                             >
                               + {tag.label}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Product Description Specific Toolbar */}
                     {selectedToolId === ToolType.PRODUCT_DESC && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-500">
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</label>
                           <select 
                             value={productAudience} 
                             onChange={(e) => setProductAudience(e.target.value)} 
                             className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg focus:border-[#FF4D00] outline-none"
                           >
                             {PRODUCT_AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">{lang === 'ar' ? 'نبرة الصوت' : 'Tone'}</label>
                           <select 
                             value={productTone} 
                             onChange={(e) => setProductTone(e.target.value)} 
                             className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg focus:border-[#FF4D00] outline-none"
                           >
                             {PRODUCT_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">{lang === 'ar' ? 'المنصة' : 'Platform'}</label>
                           <select 
                             value={productPlatform} 
                             onChange={(e) => setProductPlatform(e.target.value)} 
                             className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg focus:border-[#FF4D00] outline-none"
                           >
                             {PRODUCT_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                         </div>
                         <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">{lang === 'ar' ? 'الكلمات المفتاحية (SEO)' : 'SEO Keywords'}</label>
                             <input 
                               type="text"
                               value={productKeywords}
                               onChange={(e) => setProductKeywords(e.target.value)}
                               placeholder={lang === 'ar' ? 'مثال: قهوة مختصة، عضوية، تحميص محلي...' : 'Example: specialty coffee, organic, local roast...'}
                               className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg focus:border-[#FF4D00] outline-none"
                             />
                           </div>
                           <div>
                             <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold flex items-center gap-1">
                               {lang === 'ar' ? 'رابط منتج منافس (اختياري)' : 'Competitor Product Link (Optional)'}
                               <LinkIcon size={10} className="text-blue-500" />
                             </label>
                             <input 
                               type="url"
                               value={productCompetitorUrl}
                               onChange={(e) => setProductCompetitorUrl(e.target.value)}
                               placeholder={lang === 'ar' ? 'https://competitor.com/product' : 'https://competitor.com/product'}
                               className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg focus:border-[#FF4D00] outline-none"
                             />
                           </div>
                         </div>
                       </div>
                     )}
                     
                     <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeTool.placeholder}
                        className="w-full h-60 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#FF4D00] outline-none resize-none text-base leading-relaxed transition-colors"
                      />

                     {/* Image Technical Selectors */}
                     {selectedToolId === ToolType.IMAGE_PROMPT && (
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'النمط' : 'Style'}</label>
                           <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'الإضاءة' : 'Lighting'}</label>
                           <select value={imageLighting} onChange={(e) => setImageLighting(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {IMAGE_LIGHTING.map(l => <option key={l} value={l}>{l}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'الكاميرا' : 'Camera'}</label>
                           <select value={imageCamera} onChange={(e) => setImageCamera(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {IMAGE_CAMERA.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'الأبعاد' : 'Aspect Ratio'}</label>
                           <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                           </select>
                         </div>
                       </div>
                     )}

                     {/* Video Technical Selectors */}
                     {selectedToolId === ToolType.VIDEO_PROMPT && (
                       <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'النمط' : 'Style'}</label>
                           <select value={videoStyle} onChange={(e) => setVideoStyle(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {VIDEO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">{lang === 'ar' ? 'حركة الكاميرا' : 'Camera Movement'}</label>
                           <select value={videoMovement} onChange={(e) => setVideoMovement(e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg">
                             {VIDEO_CAMERA_MOVEMENT.map(m => <option key={m} value={m}>{m}</option>)}
                           </select>
                         </div>
                       </div>
                     )}
                     
                     {/* Character and Word Count */}
                     <div className="flex items-center gap-4 text-xs text-gray-500">
                       <span>{getCharCount()} {t.charCount}</span>
                       <span>•</span>
                       <span>{getWordCount()} {t.wordCount}</span>
                     </div>
                     
                     {[ToolType.IMAGE_TO_PROMPT, ToolType.IMAGE_TO_TEXT, ToolType.TWO_IMAGES_TO_PROMPT, ToolType.BRAND_STRATEGY, ToolType.TEXT_DETECTOR].includes(selectedToolId as ToolType) && (
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
                              accept="image/*,application/pdf,.doc,.docx" 
                              multiple={selectedToolId === ToolType.TWO_IMAGES_TO_PROMPT || selectedToolId === ToolType.TEXT_DETECTOR} 
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

                     {/* Text Detector Specific Options */}
                     {selectedToolId === ToolType.TEXT_DETECTOR && (
                       <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isIncognito ? 'bg-[#FF4D00]' : 'bg-gray-300'}`} onClick={() => setIsIncognito(!isIncognito)}>
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isIncognito ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`}></div>
                             </div>
                             <span className="text-xs font-bold">{lang === 'ar' ? 'وضع الخصوصية القصوى' : 'Incognito Mode'}</span>
                           </div>
                           <div className="text-[10px] text-gray-400 italic">{lang === 'ar' ? '* لن يتم تخزين بياناتك للتدريب' : '* Data won\'t be used for training'}</div>
                         </div>
                         
                         <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                           <div className="flex items-center gap-2 text-[#FF4D00]">
                             <Sparkles size={14} />
                             <span className="text-xs font-black uppercase tracking-widest">{lang === 'ar' ? 'تحدي رقيم' : 'Raqim Challenge'}</span>
                           </div>
                           <p className="text-[10px] text-gray-500 mt-1">
                             {lang === 'ar' ? 'هل يمكنك كتابة نص يخدع الكاشف ويحصل على 0% ذكاء اصطناعي؟' : 'Can you write a text that tricks the detector and gets 0% AI?'}
                           </p>
                         </div>
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
                             <button 
                               onClick={handleCompare} 
                               disabled={isComparing}
                               className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D00] hover:text-white transition-colors disabled:opacity-50"
                             >
                               {isComparing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12}/>}
                               {lang === 'ar' ? 'مقارنة (A/B)' : 'Compare (A/B)'}
                             </button>
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
                             <button 
                               onClick={() => {
                                 const url = new URL(window.location.href);
                                 url.searchParams.set('tool', selectedToolId || '');
                                 url.searchParams.set('input', btoa(encodeURIComponent(inputText)));
                                 navigator.clipboard.writeText(url.toString());
                                 alert(lang === 'ar' ? 'تم نسخ رابط المشاركة!' : 'Share link copied!');
                               }} 
                               className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D00] hover:text-white transition-colors"
                             >
                               <Share2 size={12}/>
                               {lang === 'ar' ? 'مشاركة' : 'Share'}
                             </button>
                           </div>
                         )}
                       </h2>
                       
                       <div className={`min-h-[400px] ${(selectedToolId === ToolType.BLOG_TO_THREAD || selectedToolId === ToolType.BRAND_STRATEGY || selectedToolId === ToolType.TEXT_DETECTOR || selectedToolId === ToolType.PRODUCT_DESC) && result ? 'bg-transparent' : 'p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'} leading-loose text-lg whitespace-pre-wrap ${!result && 'flex items-center justify-center text-gray-400 italic'}`}>
                          {result ? (
                             compareResult ? (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                   <div className="text-xs font-bold uppercase text-[#FF4D00] border-b border-[#FF4D00] pb-1 mb-4">Version A</div>
                                   {selectedToolId === ToolType.BLOG_TO_THREAD ? renderThreadResult(result) : 
                                    selectedToolId === ToolType.BRAND_STRATEGY ? renderBrandResult(result) : 
                                    selectedToolId === ToolType.TEXT_DETECTOR ? renderDetectorResult(result) : 
                                    selectedToolId === ToolType.PRODUCT_DESC ? renderProductResult(result) : result}
                                   
                                   {/* Gemini Media Button for Version A (Left) */}
                                   {(selectedToolId === ToolType.IMAGE_PROMPT || selectedToolId === ToolType.VIDEO_PROMPT) && (
                                     <div className="pt-4">
                                       {renderGeminiButton(result)}
                                     </div>
                                   )}
                                 </div>
                                 <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 md:pl-8 pt-8 md:pt-0">
                                   <div className="text-xs font-bold uppercase text-[#FF4D00] border-b border-[#FF4D00] pb-1 mb-4">Version B</div>
                                   {selectedToolId === ToolType.BLOG_TO_THREAD ? renderThreadResult(compareResult) : 
                                    selectedToolId === ToolType.BRAND_STRATEGY ? renderBrandResult(compareResult) : 
                                    selectedToolId === ToolType.TEXT_DETECTOR ? renderDetectorResult(compareResult) : 
                                    selectedToolId === ToolType.PRODUCT_DESC ? renderProductResult(compareResult) : compareResult}
                                   
                                   {/* Gemini Media Button for Version B (Right) */}
                                   {(selectedToolId === ToolType.IMAGE_PROMPT || selectedToolId === ToolType.VIDEO_PROMPT) && (
                                     <div className="pt-4">
                                       {renderGeminiButton(compareResult)}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             ) : (
                               <div className="space-y-6">
                                 {selectedToolId === ToolType.BLOG_TO_THREAD ? renderThreadResult(result) : 
                                  selectedToolId === ToolType.BRAND_STRATEGY ? renderBrandResult(result) : 
                                  selectedToolId === ToolType.TEXT_DETECTOR ? renderDetectorResult(result) : 
                                  selectedToolId === ToolType.PRODUCT_DESC ? renderProductResult(result) : result}

                                 {/* Gemini Media Generation Button */}
                                 {(selectedToolId === ToolType.IMAGE_PROMPT || selectedToolId === ToolType.VIDEO_PROMPT) && (
                                   <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                     {renderGeminiButton(result)}
                                   </div>
                                 )}
                               </div>
                             )
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

        {/* Vision Section */}
        <section id="vision" className="py-20 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-2 border-2 border-[#FF4D00] rounded-full text-sm font-bold text-[#FF4D00] mb-8">
              {lang === 'ar' ? 'الرؤية' : 'Vision'}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {lang === 'ar' ? (
                <>
                  أين يلتقي الإبداع البشري بدقة الآلة.
                </>
              ) : (
                <>
                  Where Human Creativity Meets Machine Precision.
                </>
              )}
            </h2>
            
            <div className={`text-lg md:text-xl leading-loose text-gray-700 dark:text-gray-300 space-y-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {lang === 'ar' ? (
                <>
                  <p>
                    في <span className="font-bold text-[#FF4D00]">رقيم</span>، نؤمن بأن الذكاء الاصطناعي هو أقوى أداة في عصرنا، ونحن شركاؤك الإبداعيون في صناعة الحوار مع الآلة لتحويل الأفكار المجردة إلى نتائج مذهلة.
                  </p>
                  <p>
                    لا ندّعي أننا الأذكى أو الأفضل، في هذا العالم التقني المتسارع، إنما نملك طموحًا سعوديًا لا يعرف الحدود للتطور والتعلم المستمر. نحن نؤمن بأن الكمال رحلة وليس وجهة، وأن أفضل نسخة من <span className="font-bold text-[#FF4D00]">رقيم</span> هي التي سنبنيها معًا. أفكاركم وملاحظاتكم هي المحرك الأساسي لتطويرنا، فلا تترددوا في مشاركتنا أي مقترح أو فكرة عبر رابط التواصل أسفل الصفحة. طموحنا يكبر بكم.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    At <span className="font-bold text-[#FF4D00]">Raqim</span>, we believe that AI is the most powerful tool of our era, and we are your creative partners in crafting the dialogue with machines to transform abstract ideas into stunning results.
                  </p>
                  <p>
                    We don't claim to be the smartest or the best in this fast-paced technical world. Instead, we have a boundless Saudi ambition for continuous development and learning. We believe that perfection is a journey, not a destination, and that the best version of <span className="font-bold text-[#FF4D00]">Raqim</span> is the one we will build together. Your ideas and feedback are the main driver of our development, so don't hesitate to share any suggestions or ideas via the contact link at the bottom of the page. Our ambition grows with you.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;