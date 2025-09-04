export interface AlgebraKnowledge {
  topic: string;
  content: string;
  examples: string[];
  keywords: string[];
  category: 'basic' | 'intermediate' | 'advanced' | 'history' | 'formula' | 'definition';
  relatedTopics: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface MathFormula {
  name: string;
  formula: string;
  description: string;
  variables: { [key: string]: string };
  examples: string[];
  category: string;
}

export interface HistoricalFact {
  person: string;
  period: string;
  contribution: string;
  details: string;
  impact: string;
}

// Comprehensive Algebra Knowledge Base
export const algebraKnowledge: AlgebraKnowledge[] = [
  // Basic Concepts
  {
    topic: "চল বা অজানা রাশি",
    content: "চল হল এমন একটি প্রতীক (সাধারণত x, y, z) যার মান অজানা এবং আমাদের খুঁজে বের করতে হয়। এটি গণিতের মূল ভিত্তি।",
    examples: ["x = 5", "y + 3 = 10", "2a - 7 = 1"],
    keywords: ["চল", "variable", "অজানা", "unknown", "x", "y", "z", "প্রতীক"],
    category: "basic",
    relatedTopics: ["সমীকরণ", "রৈখিক সমীকরণ"],
    difficulty: 1
  },
  {
    topic: "রৈখিক সমীকরণ",
    content: "রৈখিক সমীকরণ হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ১। এর গ্রাফ একটি সরল রেখা হয়। সাধারণ রূপ: ax + b = 0",
    examples: ["2x + 5 = 11", "3x - 7 = 8", "x/2 + 3 = 7", "4x = 20"],
    keywords: ["রৈখিক", "linear", "সমীকরণ", "equation", "ঘাত", "degree", "সরল রেখা"],
    category: "basic",
    relatedTopics: ["চল", "গ্রাফ", "সমাধান"],
    difficulty: 2
  },
  {
    topic: "দ্বিঘাত সমীকরণ",
    content: "দ্বিঘাত সমীকরণ হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ২। সাধারণ রূপ: ax² + bx + c = 0। এর সমাধান শ্রীধর আচার্যের সূত্র দিয়ে করা যায়।",
    examples: ["x² + 5x + 6 = 0", "2x² - 7x + 3 = 0", "x² - 4 = 0", "3x² + 2x - 1 = 0"],
    keywords: ["দ্বিঘাত", "quadratic", "বর্গ", "square", "শ্রীধর", "discriminant", "প্যারাবোলা"],
    category: "intermediate",
    relatedTopics: ["শ্রীধর সূত্র", "গুণনীয়করণ", "প্যারাবোলা"],
    difficulty: 3
  },
  {
    topic: "গুণনীয়করণ",
    content: "গুণনীয়করণ হল একটি বহুপদকে দুই বা ততোধিক সরল গুণনীয়কের গুণফল হিসেবে প্রকাশ করা। এটি সমীকরণ সমাধানের জন্য অত্যন্ত গুরুত্বপূর্ণ।",
    examples: ["x² - 4 = (x+2)(x-2)", "x² + 5x + 6 = (x+2)(x+3)", "a² - b² = (a+b)(a-b)", "x² - 9 = (x+3)(x-3)"],
    keywords: ["গুণনীয়করণ", "factorization", "গুণনীয়ক", "factor", "বহুপদ", "polynomial"],
    category: "intermediate",
    relatedTopics: ["বীজগণিতীয় সূত্র", "দ্বিঘাত সমীকরণ"],
    difficulty: 3
  },
  {
    topic: "অনুপাত ও সমানুপাত",
    content: "অনুপাত হল দুইটি রাশির তুলনা। a:b = c:d হলে এটি সমানুপাত, যেখানে a×d = b×c। এটি বাস্তব জীবনে ব্যাপকভাবে ব্যবহৃত হয়।",
    examples: ["3:4 = 6:8", "x:5 = 4:10", "2:3 = 8:12", "1:2 = 5:10"],
    keywords: ["অনুপাত", "ratio", "সমানুপাত", "proportion", "তুলনা", "comparison"],
    category: "basic",
    relatedTopics: ["ভগ্নাংশ", "শতকরা"],
    difficulty: 2
  },
  {
    topic: "বীজগণিতীয় সূত্র",
    content: "প্রয়োজনীয় সূত্রসমূহ যা বীজগণিতে ব্যাপকভাবে ব্যবহৃত হয়। এগুলো মুখস্থ রাখা অত্যন্ত গুরুত্বপূর্ণ।",
    examples: [
      "(a+b)² = a² + 2ab + b²", 
      "(a-b)² = a² - 2ab + b²", 
      "a² - b² = (a+b)(a-b)",
      "(a+b)³ = a³ + 3a²b + 3ab² + b³"
    ],
    keywords: ["সূত্র", "formula", "বর্গ", "square", "ঘন", "cube", "বিস্তৃতি", "expansion"],
    category: "basic",
    relatedTopics: ["গুণনীয়করণ", "বহুপদ"],
    difficulty: 2
  },
  // Advanced Topics
  {
    topic: "সমীকরণ পদ্ধতি",
    content: "দুই বা ততোধিক সমীকরণের সমন্বয়ে গঠিত পদ্ধতি। বিলোপন পদ্ধতি, প্রতিস্থাপন পদ্ধতি দিয়ে সমাধান করা যায়।",
    examples: ["x + y = 5, x - y = 1", "2x + 3y = 7, x - y = 1", "3x + 2y = 12, x + y = 5"],
    keywords: ["সমীকরণ পদ্ধতি", "system", "বিলোপন", "elimination", "প্রতিস্থাপন", "substitution"],
    category: "intermediate",
    relatedTopics: ["রৈখিক সমীকরণ", "গ্রাফ"],
    difficulty: 3
  },
  {
    topic: "অসমতা",
    content: "অসমতা হল এমন গাণিতিক বিবৃতি যেখানে দুটি রাশি সমান নয়। >, <, ≥, ≤ চিহ্ন ব্যবহার করা হয়।",
    examples: ["x > 5", "2x + 3 < 10", "x² ≥ 4", "-1 ≤ x ≤ 5"],
    keywords: ["অসমতা", "inequality", "বড়", "greater", "ছোট", "less", "সমান বা বড়"],
    category: "intermediate",
    relatedTopics: ["সংখ্যা রেখা", "ব্যবধি"],
    difficulty: 3
  },
  {
    topic: "ঘাত ও মূল",
    content: "ঘাত হল সংখ্যাকে কতবার নিজের সাথে গুণ করতে হবে। মূল হল ঘাতের বিপরীত প্রক্রিয়া। √a = b মানে b² = a",
    examples: ["2³ = 8", "√16 = 4", "x^(1/2) = √x", "5² = 25"],
    keywords: ["ঘাত", "exponent", "power", "মূল", "root", "বর্গমূল", "square root"],
    category: "intermediate",
    relatedTopics: ["লগারিদম", "সূচক"],
    difficulty: 3
  },
  {
    topic: "ফাংশন",
    content: "ফাংশন হল এমন একটি নিয়ম যা প্রতিটি ইনপুটের জন্য একটি নির্দিষ্ট আউটপুট দেয়। f(x) = 2x + 1 একটি ফাংশনের উদাহরণ।",
    examples: ["f(x) = x + 1", "g(x) = x²", "h(x) = 2x - 3", "f(x) = √x"],
    keywords: ["ফাংশন", "function", "ইনপুট", "input", "আউটপুট", "output", "ডোমেইন", "রেঞ্জ"],
    category: "advanced",
    relatedTopics: ["গ্রাফ", "সমীকরণ"],
    difficulty: 4
  }
];

// Mathematical Formulas Database
export const mathFormulas: MathFormula[] = [
  {
    name: "দ্বিপদী উৎপাদক",
    formula: "(a ± b)² = a² ± 2ab + b²",
    description: "দুটি পদের যোগ বা বিয়োগের বর্গ",
    variables: { "a": "প্রথম পদ", "b": "দ্বিতীয় পদ" },
    examples: ["(x+3)² = x² + 6x + 9", "(2x-1)² = 4x² - 4x + 1"],
    category: "বীজগণিতীয় সূত্র"
  },
  {
    name: "দুই বর্গের অন্তর",
    formula: "a² - b² = (a+b)(a-b)",
    description: "দুটি বর্গের বিয়োগ ফল",
    variables: { "a": "প্রথম পদ", "b": "দ্বিতীয় পদ" },
    examples: ["x² - 9 = (x+3)(x-3)", "4x² - 1 = (2x+1)(2x-1)"],
    category: "গুণনীয়করণ"
  },
  {
    name: "শ্রীধর সূত্র",
    formula: "x = (-b ± √(b²-4ac)) / 2a",
    description: "দ্বিঘাত সমীকরণের সমাধান সূত্র",
    variables: { "a": "x² এর সহগ", "b": "x এর সহগ", "c": "ধ্রুবক পদ" },
    examples: ["x² + 5x + 6 = 0 এর জন্য a=1, b=5, c=6"],
    category: "দ্বিঘাত সমীকরণ"
  },
  {
    name: "ত্রিপদী উৎপাদক",
    formula: "(a ± b)³ = a³ ± 3a²b + 3ab² ± b³",
    description: "দুটি পদের যোগ বা বিয়োগের ঘন",
    variables: { "a": "প্রথম পদ", "b": "দ্বিতীয় পদ" },
    examples: ["(x+2)³ = x³ + 6x² + 12x + 8"],
    category: "বীজগণিতীয় সূত্র"
  },
  {
    name: "দুই ঘনের যোগ/বিয়োগ",
    formula: "a³ ± b³ = (a ± b)(a² ∓ ab + b²)",
    description: "দুটি ঘনের যোগ বা বিয়োগ ফল",
    variables: { "a": "প্রথম পদ", "b": "দ্বিতীয় পদ" },
    examples: ["x³ + 8 = (x+2)(x²-2x+4)", "x³ - 27 = (x-3)(x²+3x+9)"],
    category: "গুণনীয়করণ"
  }
];

// Historical Facts Database
export const historicalFacts: HistoricalFact[] = [
  {
    person: "আল-খোয়ারিজমি",
    period: "৭৮০-৮৫০ খ্রিস্টাব্দ",
    contribution: "বীজগণিতের জনক",
    details: "তিনি 'কিতাব আল-জাবর ওয়াল-মুকাবালা' নামে প্রথম বীজগণিত গ্রন্থ রচনা করেন।",
    impact: "আধুনিক বীজগণিতের ভিত্তি স্থাপন করেন এবং 'অ্যালজেব্রা' শব্দটি তার কাজ থেকেই এসেছে।"
  },
  {
    person: "ব্রহ্মগুপ্ত",
    period: "৬২৮-৬৬৮ খ্রিস্টাব্দ",
    contribution: "শূন্যের ব্যবহার ও নেগেটিভ সংখ্যা",
    details: "তিনি প্রথম শূন্যকে একটি সংখ্যা হিসেবে ব্যবহার করেন এবং নেগেটিভ সংখ্যার নিয়ম প্রতিষ্ঠা করেন।",
    impact: "গণিতে শূন্য ও ঋণাত্মক সংখ্যার ধারণা প্রতিষ্ঠা করে আধুনিক গণিতের পথ সুগম করেন।"
  },
  {
    person: "আর্যভট্ট",
    period: "৪৭৬-৫৫০ খ্রিস্টাব্দ",
    contribution: "স্থানীয় মান পদ্ধতি",
    details: "তিনি দশভিত্তিক সংখ্যা পদ্ধতি ও স্থানীয় মানের ধারণা প্রতিষ্ঠা করেন।",
    impact: "আধুনিক সংখ্যা পদ্ধতির ভিত্তি স্থাপন করেন যা আজও ব্যবহৃত হয়।"
  },
  {
    person: "উমর খৈয়াম",
    period: "১০৪৮-১১৩১ খ্রিস্টাব্দ",
    contribution: "ত্রিঘাত সমীকরণের সমাধান",
    details: "তিনি জ্যামিতিক পদ্ধতিতে ত্রিঘাত সমীকরণের সমাধান করেন।",
    impact: "উচ্চতর বীজগণিতের ক্ষেত্রে গুরুত্বপূর্ণ অগ্রগতি সাধন করেন।"
  },
  {
    person: "ফ্রাঁসোয়া ভিয়েতা",
    period: "১৫৪০-১৬০৩ খ্রিস্টাব্দ",
    contribution: "প্রতীকী বীজগণিত",
    details: "তিনি প্রথম অক্ষর ব্যবহার করে অজানা রাশি প্রকাশ করেন।",
    impact: "আধুনিক বীজগণিতীয় প্রতীক পদ্ধতির সূচনা করেন।"
  }
];

// Problem-solving strategies
export const solvingStrategies = [
  {
    type: "রৈখিক সমীকরণ",
    steps: [
      "সমীকরণটি ax + b = 0 আকারে লিখুন",
      "উভয় পাশ থেকে b বিয়োগ করুন",
      "উভয় পাশকে a দিয়ে ভাগ করুন",
      "x = -b/a পান"
    ]
  },
  {
    type: "দ্বিঘাত সমীকরণ",
    steps: [
      "সমীকরণটি ax² + bx + c = 0 আকারে লিখুন",
      "গুণনীয়করণ সম্ভব কিনা দেখুন",
      "না হলে শ্রীধর সূত্র ব্যবহার করুন",
      "x = (-b ± √(b²-4ac)) / 2a"
    ]
  },
  {
    type: "গুণনীয়করণ",
    steps: [
      "সাধারণ গুণনীয়ক বের করুন",
      "বিশেষ সূত্র প্রয়োগ করুন",
      "গ্রুপিং পদ্ধতি ব্যবহার করুন",
      "ফলাফল যাচাই করুন"
    ]
  }
];