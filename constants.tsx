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
  Share2
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
    icon: <Sparkles />,
    placeholder: 'Example: I want to write an article about the benefits of coffee in a scientific style...',
    promptTemplate: 'You are an expert Prompt Engineer. Convert the following user request into a highly detailed, professional prompt. Use structural components like Role, Context, Task, Constraints, and Output Format. Ensure the prompt is optimized for GPT-4 or Claude 3:',
    example: 'I want to create a blog post about the impact of AI on healthcare, written in a professional yet accessible tone for general readers.'
  },
  {
    id: ToolType.BLOG_TO_THREAD,
    title: 'Blog/Text to X Thread',
    description: 'Convert any article URL or raw text into a viral, ready-to-post Twitter/X thread.',
    icon: <Share2 />,
    placeholder: 'Paste the article URL (https://...) or simply paste the full text content here...',
    promptTemplate: THREAD_INSTRUCTION + "\n\nConvert this content into a thread:\n",
    example: 'Artificial Intelligence is revolutionizing the healthcare industry. From diagnosing diseases to personalized treatment plans, AI is making healthcare more efficient and accessible. Machine learning algorithms can now detect cancer with accuracy rivaling human doctors.'
  },
  {
    id: ToolType.ADVANCED_PROMPT,
    title: 'Advanced Prompting',
    description: 'Full control over tone, target audience, and complexity level.',
    icon: <SlidersHorizontal />,
    placeholder: 'Core topic of the prompt...',
    promptTemplate: 'You are a master Prompt Engineer. Create a highly specific prompt based on the user request and the following parameters. Structure the output meticulously.'
  },
  {
    id: ToolType.PROMPT_CHECK,
    title: 'Prompt Check',
    description: 'Analyze the quality of your current prompts and get instant improvement tips.',
    icon: <SearchCheck />,
    placeholder: 'Paste the prompt you wrote here for analysis...',
    promptTemplate: 'Act as a Prompt Quality Auditor. Analyze the provided prompt for clarity, ambiguity, and lack of context. Provide a score out of 10 and then rewrite the prompt to be 100% effective:'
  },
  {
    id: ToolType.IMAGE_PROMPT,
    title: 'Image Prompts',
    description: 'Create precise visual descriptions for platforms like Midjourney and DALL-E.',
    icon: <ImageIcon />,
    placeholder: 'Describe the scene: An astronaut riding a horse on Mars...',
    promptTemplate: 'Generate a professional image generation prompt for Midjourney v6. Use descriptive language, artistic styles, lighting details, and technical parameters (like --ar 16:9, --v 6.0). Input:'
  },
  {
    id: ToolType.VIDEO_PROMPT,
    title: 'Video Prompts',
    description: 'Specialize in writing cinematic video prompts for VEO and Sora models.',
    icon: <Video />,
    placeholder: 'Describe movement: Camera panning slowly towards a misty forest...',
    promptTemplate: 'Create a cinematic video generation prompt for AI video models (like VEO3). Include camera movement (panning, tracking), lighting (golden hour, moody), and frame-by-frame progression details. Context:'
  },
  {
    id: ToolType.TEXT_DETECTOR,
    title: 'Text Detector',
    description: 'Check if text is written by a human or AI.',
    icon: <FileSearch />,
    placeholder: 'Paste the text to check here...',
    promptTemplate: 'Analyze the following text deeply. Look for common AI patterns, repetitive structures, and lack of nuanced human emotion. Give your verdict on whether it is AI-generated or Human-written with a percentage of certainty and detailed reasoning:'
  },
  {
    id: ToolType.REWRITE,
    title: 'Rewrite & Humanize',
    description: 'Rewrite texts in a natural, engaging human style.',
    icon: <PenTool />,
    placeholder: 'Paste the text you want to humanize...',
    promptTemplate: 'Humanize the following text. Remove robotic phrasing, vary sentence length, and add natural flow and tone. The goal is to make it indistinguishable from human writing while keeping the exact same meaning:',
    example: 'The utilization of artificial intelligence in contemporary business operations has demonstrated significant efficacy in optimizing workflow processes and enhancing overall productivity metrics.'
  },
  {
    id: ToolType.IMAGE_TO_PROMPT,
    title: 'Image to Prompt',
    description: 'Extract the full engineering description from any uploaded image.',
    icon: <Camera />,
    placeholder: 'Upload an image to reverse-engineer its prompt...',
    promptTemplate: 'Analyze the uploaded image(s) in detail. Reverse-engineer the likely prompt used to create this image. Describe style, composition, subjects, and technical aspects so I can recreate something similar:'
  },
  {
    id: ToolType.IMAGE_TO_TEXT,
    title: 'Image to Text',
    description: 'Accurately extract text and data from images and documents.',
    icon: <FileType />,
    placeholder: 'Upload an image containing text to extract...',
    promptTemplate: 'Extract ALL text from the provided image accurately. Maintain the structure and formatting. If there are tables, represent them clearly in Markdown:'
  },
  {
    id: ToolType.TWO_IMAGES_TO_PROMPT,
    title: 'Merge Images',
    description: 'Combine the style and content of two different images into one prompt.',
    icon: <Layers />,
    placeholder: 'Upload two images to merge them into one description...',
    promptTemplate: 'Look at both images provided. Create a single generation prompt that combines the artistic style of the first image with the subject matter of the second image. Ensure the transition is seamless:'
  },
  {
    id: ToolType.PRODUCT_DESC,
    title: 'Product Description',
    description: 'Turn product data into professional, high-converting marketing copy.',
    icon: <ShoppingCart />,
    placeholder: 'Enter product name, features, and price...',
    promptTemplate: 'Write a high-converting e-commerce product description for the following item. Include an attention-grabbing title, bullet points of key benefits, and a strong Call to Action (CTA):'
  }
];

export const TOOLS_AR: ToolMetadata[] = [
  {
    id: ToolType.PROMPT_GEN,
    title: 'توليد الأوامر',
    description: 'حول الأفكار البسيطة إلى أوامر هندسية احترافية ومتكاملة.',
    icon: <Sparkles />,
    placeholder: 'مثال: أريد كتابة مقال حول فوائد القهوة بأسلوب علمي...',
    promptTemplate: 'أنت خبير في هندسة الأوامر (Prompt Engineering). قم بتحويل طلب المستخدم التالي إلى أمر (Prompt) احترافي ومفصل للغاية باللغة العربية. استخدم مكونات هيكلية مثل: الدور، السياق، المهمة، القيود، وتنسيق المخرجات. تأكد من أن الأمر محسن لنماذج الذكاء الاصطناعي:',
    example: 'أريد إنشاء مدونة حول تأثير الذكاء الاصطناعي على الرعاية الصحية، مكتوبة بنبرة احترافية ولكن سهلة الفهم للقراء العام.'
  },
  {
    id: ToolType.BLOG_TO_THREAD,
    title: 'رابط/نص إلى ثريد X',
    description: 'حول أي رابط مقال أو نص مكتوب إلى ثريد (سلسلة تغريدات) احترافي لمنصة X.',
    icon: <Share2 />,
    placeholder: 'الصق رابط المقال (https://...) أو الصق النص الكامل للمقال هنا...',
    promptTemplate: THREAD_INSTRUCTION + "\n\nقم بتحويل المحتوى التالي إلى ثريد باللغة العربية:\n",
    example: 'الذكاء الاصطناعي يحدث ثورة في مجال الرعاية الصحية. من تشخيص الأمراض إلى خطط العلاج الشخصية، يجعل الذكاء الاصطناعي الرعاية الصحية أكثر كفاءة وإمكانية للوصول.'
  },
  {
    id: ToolType.ADVANCED_PROMPT,
    title: 'أوامر متقدمة',
    description: 'تحكم كامل في نبرة الصوت والجمهور المستهدف ومستوى التعقيد.',
    icon: <SlidersHorizontal />,
    placeholder: 'الموضوع الأساسي للأمر...',
    promptTemplate: 'أنت خبير في هندسة الأوامر. قم بإنشاء أمر محدد للغاية باللغة العربية بناءً على طلب المستخدم والمعلمات التالية. قم بهيكلة المخرجات بدقة.'
  },
  {
    id: ToolType.PROMPT_CHECK,
    title: 'فحص الأوامر',
    description: 'حلل جودة أوامرك الحالية واحصل على نصائح واقتراحات فورية للتحسين.',
    icon: <SearchCheck />,
    placeholder: 'الصق الأمر الذي كتبته هنا للتحليل...',
    promptTemplate: 'تصرف كمدقق لجودة الأوامر. قم بتحليل الأمر المقدم من حيث الوضوح، الغموض، ونقص السياق. قدم تقييماً من 10، ثم أضف قسماً واضحاً بعنوان "### الاقتراحات" واكتب تحته نقاطاً تفصيلية باللغة العربية لتحسين الأمر. أخيراً، أعد كتابة الأمر ليكون فعالاً بنسبة 100% باللغة العربية:'
  },
  {
    id: ToolType.IMAGE_PROMPT,
    title: 'أوامر الصور',
    description: 'أنشئ أوصافاً بصرية دقيقة لمنصات مثل Midjourney و DALL-E.',
    icon: <ImageIcon />,
    placeholder: 'صف المشهد: رائد فضاء يمتطي حصاناً على المريخ...',
    promptTemplate: 'قم بتوليد وصف احترافي لتوليد الصور (Image Prompt) لبرنامج Midjourney v6 باللغة الإنجليزية (لأن النموذج يفهم الإنجليزية أفضل) ولكن اشرح التفاصيل بالعربية. استخدم لغة وصفية، وأنماط فنية، وتفاصيل الإضاءة، والمعلمات التقنية (مثل --ar 16:9, --v 6.0). المدخلات:'
  },
  {
    id: ToolType.VIDEO_PROMPT,
    title: 'أوامر الفيديو',
    description: 'تخصص في كتابة أوامر فيديو سينمائية لموديلات VEO و Sora.',
    icon: <Video />,
    placeholder: 'صف الحركة: الكاميرا تتحرك ببطء نحو غابة ضبابية...',
    promptTemplate: 'قم بإنشاء وصف سينمائي لتوليد الفيديو (Video Prompt) لنماذج الفيديو بالذكاء الاصطناعي (مثل VEO3). قم بتضمين حركة الكاميرا (التحريك، التتبع)، الإضاءة (الساعة الذهبية، مزاجي)، وتفاصيل التقدم إطاراً تلو الآخر. اكتب الوصف النهائي بالإنجليزية، ولكن قدم الشرح بالعربية. السياق:'
  },
  {
    id: ToolType.TEXT_DETECTOR,
    title: 'كاشف النصوص',
    description: 'تحقق مما إذا كان النص مكتوباً بواسطة بشر أم ذكاء اصطناعي.',
    icon: <FileSearch />,
    placeholder: 'الصق النص للتحقق منه هنا...',
    promptTemplate: 'قم بتحليل النص التالي بعمق. ابحث عن أنماط الذكاء الاصطناعي الشائعة، والهياكل المتكررة، ونقص العاطفة البشرية الدقيقة. أعط حكمك (باللغة العربية) حول ما إذا كان تم إنشاؤه بواسطة ذكاء اصطناعي أو كتبه بشر مع نسبة مئوية لليقين وتبرير مفصل:'
  },
  {
    id: ToolType.REWRITE,
    title: 'إعادة صياغة وأنسنة',
    description: 'أعد صياغة النصوص بأسلوب بشري طبيعي وجذاب.',
    icon: <PenTool />,
    placeholder: 'الصق النص الذي تريد أنسنته...',
    promptTemplate: 'قم بأنسنة النص التالي باللغة العربية. أزل العبارات الروبوتية، ونوع في طول الجمل، وأضف تدفقاً ونبرة طبيعية. الهدف هو جعله غير قابل للتمييز عن الكتابة البشرية مع الحفاظ على نفس المعنى تماماً:'
  },
  {
    id: ToolType.IMAGE_TO_PROMPT,
    title: 'من صورة إلى أمر',
    description: 'استخرج الوصف الهندسي الكامل من أي صورة مرفوعة.',
    icon: <Camera />,
    placeholder: 'ارفع صورة لاستخراج الأمر الهندسي منها...',
    promptTemplate: 'قم بتحليل الصورة (الصور) المرفوعة بالتفصيل. قم بالهندسة العكسية للأمر (Prompt) المحتمل المستخدم لإنشاء هذه الصورة. صف النمط، التكوين، الموضوعات، والجوانب التقنية (باللغة العربية والإنجليزية) حتى أتمكن من إعادة إنشاء شيء مشابه:'
  },
  {
    id: ToolType.IMAGE_TO_TEXT,
    title: 'من صورة إلى نص',
    description: 'استخرج النصوص والبيانات بدقة من الصور والمستندات.',
    icon: <FileType />,
    placeholder: 'ارفع صورة تحتوي على نص لاستخراجه...',
    promptTemplate: 'استخرج جميع النصوص من الصورة المقدمة بدقة. حافظ على الهيكل والتنسيق. إذا كانت هناك جداول، قم بتمثيلها بوضوح بصيغة Markdown:'
  },
  {
    id: ToolType.TWO_IMAGES_TO_PROMPT,
    title: 'دمج الصور',
    description: 'اجمع بين أسلوب ومحتوى صورتين مختلفتين في أمر واحد.',
    icon: <Layers />,
    placeholder: 'ارفع صورتين لدمجهما في وصف واحد...',
    promptTemplate: 'انظر إلى كلتا الصورتين المقدمتين. قم بإنشاء أمر توليد واحد يجمع بين النمط الفني للصورة الأولى وموضوع الصورة الثانية. تأكد من أن الانتقال سلس. قدم النتيجة بالإنجليزية مع شرح بالعربية:'
  },
  {
    id: ToolType.PRODUCT_DESC,
    title: 'وصف المنتجات',
    description: 'حول بيانات المنتج إلى نص تسويقي احترافي عالي التحويل.',
    icon: <ShoppingCart />,
    placeholder: 'أدخل اسم المنتج والمميزات والسعر...',
    promptTemplate: 'اكتب وصفاً لمنتج تجارة إلكترونية عالي التحويل للعنصر التالي باللغة العربية. قم بتضمين عنوان يجذب الانتباه، ونقاط للمزايا الرئيسية، ودعوة قوية لاتخاذ إجراء (CTA):'
  }
];

export const getIcon = (iconName: string) => {
  return null;
};