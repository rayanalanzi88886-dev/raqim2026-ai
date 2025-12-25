import React from 'react';
import { 
  Sparkles, 
  SearchCheck, 
  Image as ImageIcon, 
  Video, 
  FileSearch, 
  PenTool, 
  Camera, 
  FileType, 
  Layers, 
  ShoppingCart,
  SlidersHorizontal,
  Share2,
  Languages,
  UserCircle,
  Globe,
  Hash,
  Layout,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { ToolType, ToolMetadata } from './types';

// Shared prompt instructions for the thread structure
const THREAD_INSTRUCTION = `
You are a viral social media growth expert specializing in X (Twitter).
Your task is to take the provided article content and convert it into a high-engagement thread.

Rules:
1. The first tweet must be a "Hook" - provocative, value-driven, or surprising to stop the scroll.
2. Break down the core ideas into 5-10 tweets.
3. Use short, punchy sentences. Avoid long paragraphs.
4. Use emojis sparingly but effectively.
5. The last tweet must be a Call to Action (CTA).
6. CRITICAL: Separate every single tweet with exactly this string: "|||" 
   (Do not number them manually like "1/", I will handle that in code).
`;

export const TOOLS: ToolMetadata[] = [
  {
    id: ToolType.PROMPT_GEN,
    title: 'Prompt Generation',
    description: 'Transform simple ideas into integrated, professional engineering prompts.',
    detailedDescription: 'This tool helps you convert a simple idea into a complete engineering prompt that includes role, context, task, and constraints, ensuring the best results from AI models.',
    icon: <Sparkles />,
    placeholder: 'Example: I want to write an article about the benefits of coffee in a scientific style...',
    promptTemplate: 'You are an expert Prompt Engineer. Convert the following user request into a highly detailed, professional prompt. Use structural components like Role, Context, Task, Constraints, and Output Format. Ensure the prompt is optimized for GPT-4 or Claude 3:',
    example: 'I want to create a blog post about the impact of AI on healthcare, written in a professional yet accessible tone for general readers.'
  },
  {
    id: ToolType.BLOG_TO_THREAD,
    title: 'Blog/Text to X Thread',
    description: 'Convert any article URL or raw text into a viral, ready-to-post Twitter/X thread.',
    detailedDescription: 'Convert long articles or links into engaging and organized threads for X, maintaining core points and a viral writing style.',
    icon: <Share2 />,
    placeholder: 'Paste the article URL (https://...) or simply paste the full text content here...',
    promptTemplate: THREAD_INSTRUCTION + "\n\nConvert this content into a thread:\n",
    example: 'Artificial Intelligence is revolutionizing the healthcare industry. From diagnosing diseases to personalized treatment plans, AI is making healthcare more efficient and accessible. Machine learning algorithms can now detect cancer with accuracy rivaling human doctors.'
  },
  {
    id: ToolType.ADVANCED_PROMPT,
    title: 'Advanced Prompting',
    description: 'Full control over tone, target audience, and complexity level.',
    detailedDescription: 'This tool gives you full control over text generation parameters, allowing you to specify tone, target audience, and complexity level with high precision.',
    icon: <SlidersHorizontal />,
    placeholder: 'Core topic of the prompt...',
    promptTemplate: 'You are a master Prompt Engineer. Create a highly specific prompt based on the user request and the following parameters. Structure the output meticulously.'
  },
  {
    id: ToolType.PROMPT_CHECK,
    title: 'Prompt Check',
    description: 'Analyze the quality of your current prompts and get instant improvement tips.',
    detailedDescription: 'Analyze your current prompts to identify strengths and weaknesses. The tool evaluates the prompt and provides practical tips for improvement and rewriting.',
    icon: <SearchCheck />,
    placeholder: 'Paste the prompt you wrote here for analysis...',
    promptTemplate: 'Act as a Prompt Quality Auditor. Analyze the provided prompt for clarity, ambiguity, and lack of context. Provide a score out of 10 and then rewrite the prompt to be 100% effective:'
  },
  {
    id: ToolType.IMAGE_PROMPT,
    title: 'Image Prompts',
    description: 'Create precise visual descriptions for platforms like Midjourney and DALL-E.',
    detailedDescription: 'Create precise and professional visual descriptions for image generation models like Midjourney and DALL-E, focusing on lighting, angles, and artistic style.',
    icon: <ImageIcon />,
    placeholder: 'Describe the scene: An astronaut riding a horse on Mars...',
    promptTemplate: 'Generate a professional image generation prompt for Midjourney v6. Use descriptive language, artistic styles, lighting details, and technical parameters (like --ar 16:9, --v 6.0). Input:'
  },
  {
    id: ToolType.VIDEO_PROMPT,
    title: 'Video Prompts',
    description: 'Specialize in writing cinematic video prompts for VEO and Sora models.',
    detailedDescription: 'Design cinematic prompts for video generation models like Sora and VEO, with precise descriptions of camera movement, scene progression, and visual effects.',
    icon: <Video />,
    placeholder: 'Describe movement: Camera panning slowly towards a misty forest...',
    promptTemplate: 'Create a cinematic video generation prompt for AI video models (like VEO3). Include camera movement (panning, tracking), lighting (golden hour, moody), and frame-by-frame progression details. Context:'
  },
  {
    id: ToolType.TEXT_DETECTOR,
    title: 'Text Detector',
    description: 'Check if text is written by a human or AI.',
    detailedDescription: 'An advanced analytical tool that detects whether text was written by a human or generated by AI, providing a certainty percentage and justification.',
    icon: <FileSearch />,
    placeholder: 'Paste the text to check here...',
    promptTemplate: `Analyze the following text deeply for AI patterns, model fingerprinting, and translation detection. 
Return your analysis in this EXACT format:
[PERCENTAGE: (0-100)]
[VERDICT: (Human-written / AI-generated / Mixed)]
[FINGERPRINT: (Predicted Model like GPT-4o, Claude 3.5, Gemini, etc.)]
[TRANSLATION_DETECTED: (Yes/No - if it looks like machine-translated from English)]
[LOCAL_NUANCE: (0-100, how much it reflects local Arabic/Saudi culture)]
[PERPLEXITY: (Low/Medium/High)]
[BURSTINESS: (Low/Medium/High)]
[HEATMAP: (The original text but wrap suspicious AI-like sentences in <mark>...</mark> tags)]
[REASONING: (Detailed explanation in English)]
[TIPS: (How to make it more human)]

Text to analyze:`
  },
  {
    id: ToolType.REWRITE,
    title: 'Rewrite & Humanize',
    description: 'Rewrite texts in a natural, engaging human style.',
    detailedDescription: 'Convert rigid or machine-generated texts into natural human-like writing, improving linguistic flow and making it more engaging for the reader.',
    icon: <PenTool />,
    placeholder: 'Paste the text you want to humanize...',
    promptTemplate: 'Humanize the following text. Remove robotic phrasing, vary sentence length, and add natural flow and tone. The goal is to make it indistinguishable from human writing while keeping the exact same meaning:',
    example: 'The utilization of artificial intelligence in contemporary business operations has demonstrated significant efficacy in optimizing workflow processes and enhancing overall productivity metrics.'
  },
  {
    id: ToolType.IMAGE_TO_PROMPT,
    title: 'Image to Prompt',
    description: 'Extract the full engineering description from any uploaded image.',
    detailedDescription: 'Upload any image and AI will analyze it to extract the text prompt that can reproduce a similar image in style and content.',
    icon: <Camera />,
    placeholder: 'Upload an image to reverse-engineer its prompt...',
    promptTemplate: 'Analyze the uploaded image(s) in detail. Reverse-engineer the likely prompt used to create this image. Describe style, composition, subjects, and technical aspects so I can recreate something similar:'
  },
  {
    id: ToolType.IMAGE_TO_TEXT,
    title: 'Image to Text',
    description: 'Accurately extract text and data from images and documents.',
    detailedDescription: 'Extract text and data from images and scanned documents with high accuracy, maintaining the formatting of tables and lists.',
    icon: <FileType />,
    placeholder: 'Upload an image containing text to extract...',
    promptTemplate: 'Extract ALL text from the provided image accurately. Maintain the structure and formatting. If there are tables, represent them clearly in Markdown:'
  },
  {
    id: ToolType.TWO_IMAGES_TO_PROMPT,
    title: 'Merge Images',
    description: 'Combine the style and content of two different images into one prompt.',
    detailedDescription: 'Combine the visual elements of two different images (e.g., the style of the first and the content of the second) to create a unique generation prompt.',
    icon: <Layers />,
    placeholder: 'Upload two images to merge them into one description...',
    promptTemplate: 'Look at both images provided. Create a single generation prompt that combines the artistic style of the first image with the subject matter of the second image. Ensure the transition is seamless:'
  },
  {
    id: ToolType.PRODUCT_DESC,
    title: 'Product Description',
    description: 'Turn product data into professional, high-converting marketing copy.',
    detailedDescription: 'Convert your product specifications into persuasive marketing copy that increases conversion rates, focusing on benefits and calls to action.',
    icon: <ShoppingCart />,
    placeholder: 'Enter product name, features, and price...',
    promptTemplate: `You are a Senior E-commerce Copywriter. Write a high-converting product description based on the provided data.

Your response MUST include these sections clearly marked with the specified markers:

1. [HEADLINES]: Provide 3-5 catchy, eye-grabbing headlines.
2. [STORE_DESC]: A detailed store description focusing on "Feature-to-Benefit" transformation.
3. [KEY_POINTS]: Top 5 features in short, powerful bullet points.
4. [SOCIAL_MEDIA]: A short, ready-to-post version for the selected platform with hashtags.
5. [SEO_META]: A short Meta description (max 160 chars) for search engines.
6. [CTA]: 3 Call to Action (CTA) suggestions.
7. [VISUAL_TIPS]: Photography tips and angles that support this description.
8. [COMPARISON_INSIGHT]: If a competitor link was provided, explain briefly how our product wins. If not, leave this empty.

Required Criteria:
- Target Audience: {audience}
- Tone of Voice: {tone}
- Target Platform: {platform}
- SEO Keywords: {keywords}

{competitor_info}

Product Data:
`
  },
  {
    id: ToolType.DIALECT_CONVERTER,
    title: 'Dialect Converter',
    description: 'Convert between Modern Standard Arabic and various Arabic dialects.',
    detailedDescription: 'Convert texts between Modern Standard Arabic and various Arabic dialects (e.g., Saudi, Egyptian, Levantine) while considering cultural and linguistic differences.',
    icon: <Languages />,
    placeholder: 'Paste the text and specify the target dialect (e.g., Saudi, Egyptian, Levantine)...',
    promptTemplate: 'You are a linguistic expert in Arabic dialects. Convert the following text into the requested dialect while maintaining the original meaning, tone, and cultural nuances. If no dialect is specified, default to a natural Saudi dialect:',
    example: 'كيف حالك اليوم؟ أتمنى أن تكون بخير. (Convert to Egyptian)'
  },
  {
    id: ToolType.AI_PERSONA,
    title: 'AI Persona Creator',
    description: 'Design a unique personality and voice for your AI agents.',
    detailedDescription: 'Design a unique identity and voice for your AI assistant by defining its personality traits, speaking style, and knowledge boundaries.',
    icon: <UserCircle />,
    placeholder: 'Describe the persona: A helpful assistant who is also a bit sarcastic and loves coffee...',
    promptTemplate: 'Create a comprehensive "System Prompt" or "Persona" based on the following description. Define the tone, vocabulary, knowledge boundaries, and specific quirks. The output should be a ready-to-use system instruction:',
    example: 'A professional financial advisor who explains complex concepts using simple analogies and maintains a reassuring tone.'
  },
  {
    id: ToolType.SEO_META,
    title: 'SEO Meta Generator',
    description: 'Generate optimized meta titles and descriptions for better search rankings.',
    detailedDescription: 'Improve your website visibility in search engines by generating professional Meta titles and descriptions that focus on keywords and attract clicks.',
    icon: <Globe />,
    placeholder: 'Enter the page topic or main content...',
    promptTemplate: 'Generate 3 variations of SEO-optimized meta titles (max 60 chars) and meta descriptions (max 160 chars) for the following content. Focus on high-volume keywords and click-through rate (CTR):',
    example: 'A blog post about the best hiking trails in Saudi Arabia for beginners.'
  },
  {
    id: ToolType.HASHTAG_GEN,
    title: 'Hashtag Generator',
    description: 'Generate trending and relevant hashtags for your social media posts.',
    detailedDescription: 'Get a list of trending and relevant hashtags for your content to increase the reach of your posts on various social media platforms.',
    icon: <Hash />,
    placeholder: 'Enter the post content or topic...',
    promptTemplate: 'Generate a list of 15-20 relevant hashtags for the following content. Include a mix of broad, niche, and trending tags to maximize reach on platforms like Instagram, X, and LinkedIn:',
    example: 'A photo of a new specialty coffee shop opening in Riyadh.'
  },
  {
    id: ToolType.PROMPT_BUILDER,
    title: 'Visual Prompt Builder',
    description: 'Build complex prompts using a structured, step-by-step visual interface.',
    detailedDescription: 'An interactive interface that guides you step-by-step to build a complex and professional prompt by breaking down the process into easy-to-understand structural elements.',
    icon: <Layout />,
    placeholder: 'Describe your goal, and we will help you build the prompt structure...',
    promptTemplate: 'You are a Prompt Engineering Architect. Help the user build a structured prompt by identifying the Role, Context, Task, Constraints, and Output Format based on their goal. Provide the final prompt in a clear, structured block:'
  },
  {
    id: ToolType.BRAND_STRATEGY,
    title: 'Visual Identity & Brand Strategy',
    description: 'Professional guidance on building and maintaining a consistent visual identity and brand strategy.',
    detailedDescription: 'This tool acts as a professional brand consultant. It helps you define your brand\'s visual elements (logo, colors, typography) and strategic positioning based on global standards like Apple, Adobe, and Google.',
    icon: <ShieldCheck />,
    placeholder: 'Paste a website URL, upload a brand image, or describe your brand idea...',
    promptTemplate: 'You are a Senior Brand Strategist and Visual Identity Consultant. Analyze the provided input and provide a comprehensive brand strategy. Your response MUST include these sections clearly marked with markdown headers:\n\n### 1. Brand Essence & Archetype\nDefine the brand values and identify which of the 12 Brand Archetypes (e.g., The Creator, The Hero) it belongs to.\n\n### 2. Visual Identity & Color Palette\nSuggest a primary and secondary color palette. For each color, provide the HEX code in this format: [COLOR:#HEX].\n\n### 3. Typography Pairing\nSuggest specific Google Fonts for headings and body text.\n\n### 4. Strategic Positioning\nDefine the unique value proposition.\n\n### 5. Tone of Voice & Content Samples\nProvide 3 short samples (Tweet, Instagram, Ad) reflecting the brand tone.\n\n### 6. Logo Design Concepts\nProvide 2-3 detailed prompts for AI image generators (Midjourney/DALL-E) to design the logo.\n\n### 7. UI/UX Interface Analysis\nAnalyze the website\'s visual interface (if a URL was provided). Identify 3 Strengths and 3 Weaknesses in terms of layout, hierarchy, and user experience.\n\n### 8. Copywriting & Messaging Audit\nEvaluate the current text/headlines. If they are weak, suggest 3 high-impact alternative headlines or phrases that better align with the brand archetype.',
    example: 'https://www.apple.com'
  }
];

export const TOOLS_AR: ToolMetadata[] = [
  {
    id: ToolType.PROMPT_GEN,
    title: 'توليد الأوامر',
    description: 'حول الأفكار البسيطة إلى أوامر هندسية احترافية ومتكاملة.',
    detailedDescription: 'هذه الأداة تساعدك على تحويل فكرة بسيطة إلى أمر (Prompt) هندسي متكامل يتضمن الدور والسياق والمهمة والقيود، مما يضمن الحصول على أفضل نتائج من نماذج الذكاء الاصطناعي.',
    icon: <Sparkles />,
    placeholder: 'مثال: أريد كتابة مقال حول فوائد القهوة بأسلوب علمي...',
    promptTemplate: 'أنت خبير في هندسة الأوامر (Prompt Engineering). قم بتحويل طلب المستخدم التالي إلى أمر (Prompt) احترافي ومفصل للغاية باللغة العربية. استخدم مكونات هيكلية مثل: الدور، السياق، المهمة، القيود، وتنسيق المخرجات. تأكد من أن الأمر محسن لنماذج الذكاء الاصطناعي:',
    example: 'أريد إنشاء مدونة حول تأثير الذكاء الاصطناعي على الرعاية الصحية، مكتوبة بنبرة احترافية ولكن سهلة الفهم للقراء العام.'
  },
  {
    id: ToolType.BLOG_TO_THREAD,
    title: 'رابط/نص إلى ثريد X',
    description: 'حول أي رابط مقال أو نص مكتوب إلى ثريد (سلسلة تغريدات) احترافي لمنصة X.',
    detailedDescription: 'حول المقالات الطويلة أو الروابط إلى سلسلة تغريدات (Thread) جذابة ومنظمة لمنصة X، مع الحفاظ على النقاط الجوهرية وأسلوب الكتابة الفيروسي.',
    icon: <Share2 />,
    placeholder: 'الصق رابط المقال (https://...) أو الصق النص الكامل للمقال هنا...',
    promptTemplate: THREAD_INSTRUCTION + "\n\nقم بتحويل المحتوى التالي إلى ثريد باللغة العربية:\n",
    example: 'الذكاء الاصطناعي يحدث ثورة في مجال الرعاية الصحية. من تشخيص الأمراض إلى خطط العلاج الشخصية، يجعل الذكاء الاصطناعي الرعاية الصحية أكثر كفاءة وإمكانية للوصول.'
  },
  {
    id: ToolType.ADVANCED_PROMPT,
    title: 'أوامر متقدمة',
    description: 'تحكم كامل في نبرة الصوت والجمهور المستهدف ومستوى التعقيد.',
    detailedDescription: 'تمنحك هذه الأداة تحكماً كاملاً في معايير توليد النص، حيث يمكنك تحديد نبرة الصوت، الجمهور المستهدف، ومستوى التعقيد المطلوب بدقة عالية.',
    icon: <SlidersHorizontal />,
    placeholder: 'الموضوع الأساسي للأمر...',
    promptTemplate: 'أنت خبير في هندسة الأوامر. قم بإنشاء أمر محدد للغاية باللغة العربية بناءً على طلب المستخدم والمعلمات التالية. قم بهيكلة المخرجات بدقة.'
  },
  {
    id: ToolType.PROMPT_CHECK,
    title: 'فحص الأوامر',
    description: 'حلل جودة أوامرك الحالية واحصل على نصائح واقتراحات فورية للتحسين.',
    detailedDescription: 'قم بتحليل أوامرك الحالية لمعرفة نقاط الضعف والقوة فيها. ستقوم الأداة بتقييم الأمر وتقديم نصائح عملية لتحسينه وإعادة صياغته ليكون أكثر فعالية.',
    icon: <SearchCheck />,
    placeholder: 'الصق الأمر الذي كتبته هنا للتحليل...',
    promptTemplate: 'تصرف كمدقق لجودة الأوامر. قم بتحليل الأمر المقدم من حيث الوضوح، الغموض، ونقص السياق. قدم تقييماً من 10، ثم أضف قسماً واضحاً بعنوان "### الاقتراحات" واكتب تحته نقاطاً تفصيلية باللغة العربية لتحسين الأمر. أخيراً، أعد كتابة الأمر ليكون فعالاً بنسبة 100% باللغة العربية:'
  },
  {
    id: ToolType.IMAGE_PROMPT,
    title: 'أوامر الصور',
    description: 'أنشئ أوصافاً بصرية دقيقة لمنصات مثل Midjourney و DALL-E.',
    detailedDescription: 'أنشئ أوصافاً بصرية دقيقة واحترافية لموديلات توليد الصور مثل Midjourney و DALL-E، مع التركيز على الإضاءة، الزوايا، والنمط الفني.',
    icon: <ImageIcon />,
    placeholder: 'صف المشهد: رائد فضاء يمتطي حصاناً على المريخ...',
    promptTemplate: 'قم بتوليد وصف احترافي لتوليد الصور (Image Prompt) لبرنامج Midjourney v6 باللغة الإنجليزية (لأن النموذج يفهم الإنجليزية أفضل) ولكن اشرح التفاصيل بالعربية. استخدم لغة وصفية، وأنماط فنية، وتفاصيل الإضاءة، والمعلمات التقنية (مثل --ar 16:9, --v 6.0). المدخلات:'
  },
  {
    id: ToolType.VIDEO_PROMPT,
    title: 'أوامر الفيديو',
    description: 'تخصص في كتابة أوامر فيديو سينمائية لموديلات VEO و Sora.',
    detailedDescription: 'صمم أوامر سينمائية لموديلات توليد الفيديو مثل Sora و VEO، مع وصف دقيق لحركة الكاميرا، وتطور المشاهد، والمؤثرات البصرية.',
    icon: <Video />,
    placeholder: 'صف الحركة: الكاميرا تتحرك ببطء نحو غابة ضبابية...',
    promptTemplate: 'قم بإنشاء وصف سينمائي لتوليد الفيديو (Video Prompt) لنماذج الفيديو بالذكاء الاصطناعي (مثل VEO3). قم بتضمين حركة الكاميرا (التحريك، التتبع)، الإضاءة (الساعة الذهبية، مزاجي)، وتفاصيل التقدم إطاراً تلو الآخر. اكتب الوصف النهائي بالإنجليزية، ولكن قدم الشرح بالعربية. السياق:'
  },
  {
    id: ToolType.TEXT_DETECTOR,
    title: 'كاشف النصوص',
    description: 'تحقق مما إذا كان النص مكتوباً بواسطة بشر أم ذكاء اصطناعي.',
    detailedDescription: 'أداة تحليلية متقدمة تكتشف ما إذا كان النص مكتوباً بواسطة بشر أم تم توليده بواسطة الذكاء الاصطناعي، مع تقديم نسبة يقين وتبرير للنتائج.',
    icon: <FileSearch />,
    placeholder: 'الصق النص للتحقق منه هنا...',
    promptTemplate: `قم بتحليل النص التالي بعمق للكشف عن أنماط الذكاء الاصطناعي، بصمة النموذج، واكتشاف الترجمة الآلية.
يجب أن تكون الإجابة بهذا التنسيق الدقيق (باللغة العربية):
[PERCENTAGE: (رقم من 0 إلى 100)]
[VERDICT: (مكتوب بواسطة بشر / مولد بالذكاء الاصطناعي / مختلط)]
[FINGERPRINT: (النموذج المتوقع مثل GPT-4o, Claude 3.5, Gemini)]
[TRANSLATION_DETECTED: (نعم/لا - هل يبدو النص مترجماً آلياً من الإنجليزية؟)]
[LOCAL_NUANCE: (نسبة من 0 إلى 100 لمدى وجود روح محلية/ثقافية عربية)]
[PERPLEXITY: (منخفض / متوسط / مرتفع)]
[BURSTINESS: (منخفض / متوسط / مرتفع)]
[HEATMAP: (أعد كتابة النص الأصلي مع وضع الجمل المشكوك فيها بين وسم <mark>...</mark>)]
[REASONING: (شرح مفصل للأسباب بالعربية)]
[TIPS: (نصائح لجعل النص يبدو بشرياً أكثر)]

النص المراد تحليله:`
  },
  {
    id: ToolType.REWRITE,
    title: 'إعادة صياغة وأنسنة',
    description: 'أعد صياغة النصوص بأسلوب بشري طبيعي وجذاب.',
    detailedDescription: 'حول النصوص الجامدة أو المولدة آلياً إلى نصوص ذات طابع بشري طبيعي، مع تحسين التدفق اللغوي وجعلها أكثر جاذبية للقارئ.',
    icon: <PenTool />,
    placeholder: 'الصق النص الذي تريد أنسنته...',
    promptTemplate: 'قم بأنسنة النص التالي باللغة العربية. أزل العبارات الروبوتية، ونوع في طول الجمل، وأضف تدفقاً ونبرة طبيعية. الهدف هو جعله غير قابل للتمييز عن الكتابة البشرية مع الحفاظ على نفس المعنى تماماً:'
  },
  {
    id: ToolType.IMAGE_TO_PROMPT,
    title: 'من صورة إلى أمر',
    description: 'استخرج الوصف الهندسي الكامل من أي صورة مرفوعة.',
    detailedDescription: 'ارفع أي صورة وسيقوم الذكاء الاصطناعي بتحليلها هندسياً لاستخراج الأمر النصي الذي يمكنه إعادة إنتاج صورة مشابهة لها في النمط والمحتوى.',
    icon: <Camera />,
    placeholder: 'ارفع صورة لاستخراج الأمر الهندسي منها...',
    promptTemplate: 'قم بتحليل الصورة (الصور) المرفوعة بالتفصيل. قم بالهندسة العكسية للأمر (Prompt) المحتمل المستخدم لإنشاء هذه الصورة. صف النمط، التكوين، الموضوعات، والجوانب التقنية (باللغة العربية والإنجليزية) حتى أتمكن من إعادة إنشاء شيء مشابه:'
  },
  {
    id: ToolType.IMAGE_TO_TEXT,
    title: 'من صورة إلى نص',
    description: 'استخرج النصوص والبيانات بدقة من الصور والمستندات.',
    detailedDescription: 'استخرج النصوص والبيانات من الصور والمستندات الممسوحة ضوئياً بدقة عالية، مع الحفاظ على تنسيق الجداول والقوائم.',
    icon: <FileType />,
    placeholder: 'ارفع صورة تحتوي على نص لاستخراجه...',
    promptTemplate: 'استخرج جميع النصوص من الصورة المقدمة بدقة. حافظ على الهيكل والتنسيق. إذا كانت هناك جداول، قم بتمثيلها بوضوح بصيغة Markdown:'
  },
  {
    id: ToolType.TWO_IMAGES_TO_PROMPT,
    title: 'دمج الصور',
    description: 'اجمع بين أسلوب ومحتوى صورتين مختلفتين في أمر واحد.',
    detailedDescription: 'اجمع بين العناصر البصرية لصورتين مختلفتين (مثلاً نمط الصورة الأولى ومحتوى الصورة الثانية) لإنشاء أمر توليد فريد يدمج بينهما.',
    icon: <Layers />,
    placeholder: 'ارفع صورتين لدمجهما في وصف واحد...',
    promptTemplate: 'انظر إلى كلتا الصورتين المقدمتين. قم بإنشاء أمر توليد واحد يجمع بين النمط الفني للصورة الأولى وموضوع الصورة الثانية. تأكد من أن الانتقال سلس. قدم النتيجة بالإنجليزية مع شرح بالعربية:'
  },
  {
    id: ToolType.PRODUCT_DESC,
    title: 'وصف المنتجات الاحترافي',
    description: 'حول بيانات المنتج إلى نص تسويقي عالي التحويل مع تحسين SEO.',
    detailedDescription: 'أداة متكاملة لكتابة أوصاف المنتجات. تحول المواصفات التقنية إلى فوائد ملموسة، وتولد عناوين جذابة، وأوصاف Meta، واقتراحات للتصوير، مع تنسيق مخصص لكل منصة (أمازون، سلة، انستقرام).',
    icon: <ShoppingCart />,
    placeholder: 'أدخل اسم المنتج، المواصفات التقنية، والسعر...',
    promptTemplate: `أنت خبير كتابة نصوص تسويقية (Copywriter) متخصص في التجارة الإلكترونية.
مهمتك هي تحويل بيانات المنتج المقدمة إلى وصف احترافي وجذاب.

يجب أن يتضمن ردك الأقسام التالية بوضوح باستخدام العلامات المحددة:

1. [HEADLINES]: قدم 3-5 خيارات لعناوين جذابة وخاطفة للعين.
2. [STORE_DESC]: وصف مفصل للمتجر يركز على تحويل "الميزات إلى فوائد" (Feature-to-Benefit).
3. [KEY_POINTS]: أهم 5 ميزات في نقاط مختصرة وقوية.
4. [SOCIAL_MEDIA]: نسخة قصيرة جاهزة للنشر تتناسب مع المنصة المختارة مع هاشتاغات.
5. [SEO_META]: وصف Meta مختصر (160 حرفاً) لمحركات البحث.
6. [CTA]: 3 اقتراحات لعبارات حث على الفعل (Call to Action).
7. [VISUAL_TIPS]: نصائح لنوع الصور وزوايا التصوير التي تدعم هذا الوصف.
8. [COMPARISON_INSIGHT]: إذا تم توفير رابط منافس، اشرح باختصار كيف يتفوق منتجنا عليه. إذا لم يتوفر، اترك هذا القسم فارغاً.

المعايير المطلوبة:
- الجمهور المستهدف: {audience}
- نبرة الصوت: {tone}
- المنصة المستهدفة: {platform}
- الكلمات المفتاحية للـ SEO: {keywords}

{competitor_info}

بيانات المنتج:
`
  },
  {
    id: ToolType.DIALECT_CONVERTER,
    title: 'محول اللهجات',
    description: 'حول النصوص بين العربية الفصحى واللهجات العربية المختلفة.',
    detailedDescription: 'حول النصوص بين العربية الفصحى ومختلف اللهجات العربية (مثل السعودي، المصري، الشامي) مع مراعاة الفروق الثقافية واللغوية لكل لهجة.',
    icon: <Languages />,
    placeholder: 'الصق النص وحدد اللهجة المطلوبة (مثلاً: سعودي، مصري، شامي)...',
    promptTemplate: 'أنت خبير لغوي في اللهجات العربية. قم بتحويل النص التالي إلى اللهجة المطلوبة مع الحفاظ على المعنى الأصلي والنبرة والسياق الثقافي. إذا لم يتم تحديد لهجة، فحول النص إلى لهجة سعودية بيضاء طبيعية:',
    example: 'كيف حالك اليوم؟ أتمنى أن تكون بخير. (حولها للمصري)'
  },
  {
    id: ToolType.AI_PERSONA,
    title: 'باني الشخصية',
    description: 'صمم شخصية وصوت فريد لمساعدك الذكي.',
    detailedDescription: 'صمم هوية وصوتاً فريداً لمساعدك الذكي، من خلال تحديد سماته الشخصية، أسلوبه في الكلام، وحدود معرفته، لإنشاء تجربة تفاعل مخصصة.',
    icon: <UserCircle />,
    placeholder: 'صف الشخصية: مساعد ذكي، مرح، يحب القهوة، ويستخدم أمثلة واقعية...',
    promptTemplate: 'قم بإنشاء "أمر نظام" (System Prompt) أو "شخصية" متكاملة بناءً على الوصف التالي. حدد النبرة، المفردات، حدود المعرفة، والسمات الخاصة. يجب أن تكون المخرجات عبارة عن تعليمات نظام جاهزة للاستخدام:',
    example: 'مستشار مالي محترف يشرح المفاهيم المعقدة باستخدام تشبيهات بسيطة ويحافظ على نبرة مطمئنة.'
  },
  {
    id: ToolType.SEO_META,
    title: 'مولد SEO Meta',
    description: 'أنشئ عناوين وأوصاف meta محسنة لمحركات البحث.',
    detailedDescription: 'حسن ظهور موقعك في محركات البحث من خلال توليد عناوين وأوصاف Meta احترافية تركز على الكلمات المفتاحية وتجذب النقرات.',
    icon: <Globe />,
    placeholder: 'أدخل موضوع الصفحة أو المحتوى الأساسي...',
    promptTemplate: 'قم بتوليد 3 خيارات من عناوين SEO (بحد أقصى 60 حرفاً) وأوصاف meta (بحد أقصى 160 حرفاً) للمحتوى التالي باللغة العربية. ركز على الكلمات المفتاحية ذات معدل البحث العالي وجذب النقرات (CTR):',
    example: 'مقال عن أفضل مسارات المشي لمسافات طويلة في السعودية للمبتدئين.'
  },
  {
    id: ToolType.HASHTAG_GEN,
    title: 'مولد الهاشتاغات',
    description: 'ولد هاشتاغات رائجة وذات صلة لمنشوراتك.',
    detailedDescription: 'احصل على قائمة من الهاشتاغات الرائجة وذات الصلة بمحتواك لزيادة انتشار منشوراتك على مختلف منصات التواصل الاجتماعي.',
    icon: <Hash />,
    placeholder: 'أدخل محتوى المنشور أو الموضوع...',
    promptTemplate: 'قم بتوليد قائمة من 15-20 هاشتاغاً ذا صلة للمحتوى التالي. ادمج بين الهاشتاغات العامة والمتخصصة والرائجة لزيادة الوصول على منصات مثل انستقرام، X، ولينكد إن:',
    example: 'صورة لمقهى مختص جديد يفتتح في الرياض.'
  },
  {
    id: ToolType.PROMPT_BUILDER,
    title: 'باني الأوامر المرئي',
    description: 'ابنِ أوامر معقدة باستخدام واجهة بصرية منظمة خطوة بخطوة.',
    detailedDescription: 'واجهة تفاعلية ترشدك خطوة بخطوة لبناء أمر (Prompt) معقد واحترافي، من خلال تقسيم العملية إلى عناصر هيكلية سهلة الفهم.',
    icon: <Layout />,
    placeholder: 'صف هدفك، وسنساعدك في بناء هيكل الأمر...',
    promptTemplate: 'أنت مهندس معماري للأوامر (Prompt Architect). ساعد المستخدم في بناء أمر مهيكل من خلال تحديد الدور، السياق، المهمة، القيود، وتنسيق المخرجات بناءً على هدفهم. قدم الأمر النهائي في كتلة نصية واضحة ومنظمة:'
  },
  {
    id: ToolType.BRAND_STRATEGY,
    title: 'مستشار الهوية البصرية والاستراتيجية',
    description: 'توجيهات احترافية لبناء والحفاظ على هوية بصرية واستراتيجية علامة تجارية متسقة.',
    detailedDescription: 'تعمل هذه الأداة كمستشار احترافي للعلامات التجارية. تساعدك في تحديد العناصر البصرية لعلامتك (الشعار، الألوان، الخطوط) والتموضع الاستراتيجي بناءً على معايير عالمية مثل آبل وأدوبي وجوجل.',
    icon: <ShieldCheck />,
    placeholder: 'الصق رابط موقع إلكتروني، ارفع صورة للهوية، أو صف فكرة علامتك التجارية...',
    promptTemplate: 'أنت مستشار أول لاستراتيجية العلامات التجارية والهوية البصرية. قم بتحليل المدخلات المقدمة وقدم استراتيجية شاملة للعلامة التجارية باللغة العربية. يجب أن يتضمن ردك الأقسام التالية بوضوح باستخدام عناوين Markdown:\n\n### 1. جوهر العلامة التجارية والنموذج (Archetype)\nحدد قيم العلامة وأي من النماذج الـ 12 العالمية تنتمي إليها (مثل: المبدع، البطل).\n\n### 2. الهوية البصرية ولوحة الألوان\nاقترح لوحة ألوان أساسية وثانوية. لكل لون، قدم كود HEX بهذا التنسيق بالضبط: [COLOR:#HEX].\n\n### 3. الخطوط المقترحة (Typography)\nاقترح خطوطاً محددة من Google Fonts للعناوين والنصوص.\n\n### 4. التموضع الاستراتيجي\nحدد القيمة الفريدة للعلامة في السوق.\n\n### 5. نبرة الصوت ونماذج المحتوى\nقدم 3 نماذج قصيرة (تغريدة، بوست انستقرام، إعلان) تعكس نبرة الصوت.\n\n### 6. مفاهيم تصميم الشعار\nقدم 2-3 أوامر (Prompts) تفصيلية لمولدات الصور بالذكاء الاصطناعي لتصميم الشعار.\n\n### 7. تحليل واجهة المستخدم (UI/UX)\nحلل الواجهة البصرية للموقع (في حال توفر رابط). حدد 3 نقاط قوة و3 نقاط ضعف من حيث التصميم، الهيكلية، وتجربة المستخدم.\n\n### 8. تدقيق المحتوى والنصوص التسويقية\nقيم النصوص والعناوين الحالية. إذا كانت ضعيفة، اقترح 3 بدائل قوية ومؤثرة للعناوين أو العبارات التسويقية تتناسب مع نموذج العلامة التجارية.',
    example: 'https://www.apple.com'
  }
];

export const IMAGE_QUICK_TAGS = [
  { label: 'واقعي جداً', value: 'photorealistic, 8k, highly detailed' },
  { label: 'إضاءة سينمائية', value: 'cinematic lighting, dramatic shadows' },
  { label: 'سايبربانك', value: 'cyberpunk style, neon lights, futuristic' },
  { label: 'مينيماليزم', value: 'minimalist, clean lines, simple' },
  { label: 'رسم زيتي', value: 'oil painting style, thick brushstrokes' },
  { label: 'أنمي', value: 'anime style, vibrant colors, cel shaded' },
  { label: 'ماكرو', value: 'macro photography, extreme close up' },
  { label: 'زاوية واسعة', value: 'wide angle lens, expansive view' }
];

export const VIDEO_QUICK_TAGS = [
  { label: 'تصوير درون', value: 'aerial drone shot, high altitude' },
  { label: 'تصوير بطيء', value: 'slow motion, 120fps' },
  { label: 'تايم لابس', value: 'time-lapse, fast motion' },
  { label: 'منظور الشخص الأول', value: 'POV, first person perspective' },
  { label: 'كاميرا محمولة', value: 'handheld camera, shaky cam, realistic' },
  { label: 'جودة سينمائية', value: 'high-end CGI, movie quality' }
];

export const IMAGE_STYLES = ['بدون', 'واقعي', 'فن رقمي', 'رسم زيتي', 'سكتش', 'رندر 3D', 'أنمي', 'سايبربانك', 'فينتج'];
export const IMAGE_LIGHTING = ['بدون', 'الساعة الذهبية', 'إضاءة استوديو', 'درامي', 'نيون', 'إضاءة ناعمة', 'ظلال حادة'];
export const IMAGE_CAMERA = ['بدون', 'زاوية واسعة', 'ماكرو', 'تليفوتو', 'عين السمكة', 'بورتريه'];
export const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:2', '21:9'];

export const VIDEO_STYLES = ['بدون', 'سينمائي', 'وثائقي', 'أنيميشن', 'فلوج', 'سريالي'];
export const VIDEO_CAMERA_MOVEMENT = ['بدون', 'ثابت', 'تحريك يمين/يسار', 'تحريك فوق/تحت', 'زووم', 'تتبع', 'رافعة'];

export const PRODUCT_AUDIENCES = ['عام', 'جيل الشباب', 'المحترفين', 'الأمهات', 'صائدو الصفقات', 'الرياضيين', 'الطلاب'];
export const PRODUCT_TONES = ['فاخر', 'تقني ومفصل', 'حماسي وسريع', 'عاطفي', 'بسيط ومباشر', 'فكاهي'];
export const PRODUCT_PLATFORMS = ['متجر إلكتروني (سلة/زد)', 'أمازون', 'انستقرام', 'تيك توك', 'فيسبوك'];

export const SMART_ENHANCE_IMAGE_PROMPT = `
أنت مهندس أوامر محترف لـ Midjourney و DALL-E.
قام المستخدم بتقديم وصف بسيط لصورة. مهمتك هي "التحسين الذكي" لهذا الوصف عن طريق إضافة:
1. تفاصيل تقنية (الإضاءة، عدسة الكاميرا، الدقة).
2. النمط الفني والأجواء.
3. تفاصيل التكوين.
4. فحص السلامة: إذا كان الأمر يحتوي على محتوى ضار أو غير لائق، أرجع [SAFETY_VIOLATION] واشرح السبب.

الوصف الأصلي:
`;

export const SMART_ENHANCE_VIDEO_PROMPT = `
أنت مهندس أوامر فيديو محترف لـ Sora و VEO.
قام المستخدم بتقديم فكرة فيديو بسيطة. مهمتك هي "التحسين الذكي" لها عن طريق إضافة:
1. حركة الكاميرا وسرعتها.
2. تطور المشهد والتفاصيل الزمنية.
3. الإضاءة وتصحيح الألوان.
4. فحص السلامة: إذا كان الأمر يحتوي على محتوى ضار أو غير لائق، أرجع [SAFETY_VIOLATION] واشرح السبب.

الفكرة الأصلية:
`;

export const getIcon = (iconName: string) => {
  return null;
};