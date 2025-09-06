export interface AlgebraKnowledge {
  topic: string;
  content: string;
  examples: string[];
  keywords: string[];
  category: 'basic' | 'intermediate' | 'advanced' | 'history' | 'formula';
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const expandedAlgebraDatabase: AlgebraKnowledge[] = [
  // Basic Topics
  {
    topic: "রৈখিক সমীকরণ",
    content: "**রৈখিক সমীকরণ** হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ১। সাধারণ রূপ: `ax + b = 0` যেখানে a ≠ 0।\n\n**সমাধানের পদ্ধতি:**\n1. সমস্ত পদ একপাশে নিয়ে আসুন\n2. একইরকম পদগুলো একত্রিত করুন\n3. x এর মান বের করুন",
    examples: ["2x + 5 = 11 → x = 3", "3x - 7 = 8 → x = 5", "x/2 + 3 = 7 → x = 8"],
    keywords: ["রৈখিক", "linear", "সমীকরণ", "equation", "ঘাত", "degree", "একঘাত"],
    category: 'basic',
    difficulty: 1
  },
  {
    topic: "দ্বিঘাত সমীকরণ",
    content: "**দ্বিঘাত সমীকরণ** হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ২। সাধারণ রূপ: `ax² + bx + c = 0` (a ≠ 0)।\n\n**সমাধানের পদ্ধতি:**\n1. **গুণনীয়করণ পদ্ধতি**\n2. **সূত্র পদ্ধতি:** x = (-b ± √(b² - 4ac)) / 2a\n3. **পূর্ণবর্গ করণ পদ্ধতি**",
    examples: ["x² + 5x + 6 = 0 → (x+2)(x+3) = 0", "2x² - 7x + 3 = 0", "x² - 4 = 0 → x = ±2"],
    keywords: ["দ্বিঘাত", "quadratic", "বর্গ", "square", "শ্রীধর", "discriminant", "বিবেচক"],
    category: 'intermediate',
    difficulty: 3
  },
  {
    topic: "গুণনীয়করণ",
    content: "**গুণনীয়করণ** হল একটি বহুপদকে দুই বা ততোধিক সরল গুণনীয়কের গুণফল হিসেবে প্রকাশ করা।\n\n**প্রধান পদ্ধতিসমূহ:**\n1. সাধারণ উৎপাদক বের করা\n2. পূর্ণবর্গ ত্রিপদ\n3. দুই বর্গের অন্তর\n4. ত্রিপদ গুণনীয়করণ",
    examples: ["x² - 4 = (x+2)(x-2)", "x² + 5x + 6 = (x+2)(x+3)", "a² - b² = (a+b)(a-b)", "4x² - 9 = (2x+3)(2x-3)"],
    keywords: ["গুণনীয়করণ", "factorization", "গুণনীয়ক", "factor", "বহুপদ", "polynomial"],
    category: 'intermediate',
    difficulty: 2
  },
  {
    topic: "অনুপাত ও সমানুপাত",
    content: "**অনুপাত** হল দুইটি রাশির তুলনা। **সমানুপাত** হল দুইটি অনুপাতের সমতা।\n\n**নিয়ম:** a:b = c:d হলে → a×d = b×c\n\n**বৈশিষ্ট্য:**\n- যোগ নিয়ম: (a+b):b = (c+d):d\n- বিয়োগ নিয়ম: (a-b):b = (c-d):d",
    examples: ["3:4 = 6:8", "x:5 = 4:10 → x = 2", "2:3 = 8:12", "5:7 = 15:21"],
    keywords: ["অনুপাত", "ratio", "সমানুপাত", "proportion", "তুলনা", "comparison"],
    category: 'basic',
    difficulty: 2
  },
  {
    topic: "বীজগণিতীয় সূত্র",
    content: "**প্রয়োজনীয় সূত্রাবলী:**\n\n**বর্গের সূত্র:**\n- (a+b)² = a² + 2ab + b²\n- (a-b)² = a² - 2ab + b²\n- a² - b² = (a+b)(a-b)\n\n**ঘনের সূত্র:**\n- (a+b)³ = a³ + 3a²b + 3ab² + b³\n- (a-b)³ = a³ - 3a²b + 3ab² - b³\n- a³ + b³ = (a+b)(a² - ab + b²)",
    examples: ["(x+3)² = x² + 6x + 9", "(2x-1)² = 4x² - 4x + 1", "x² - 9 = (x+3)(x-3)", "(x+2)³ = x³ + 6x² + 12x + 8"],
    keywords: ["সূত্র", "formula", "বর্গ", "square", "ঘন", "cube", "বিস্তৃতি", "expansion"],
    category: 'basic',
    difficulty: 1
  },
  {
    topic: "সূচক ও লগারিদম",
    content: "**সূচক (Exponent):** aⁿ = a × a × ... × a (n বার)\n\n**নিয়মাবলী:**\n- aᵐ × aⁿ = aᵐ⁺ⁿ\n- aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n- (aᵐ)ⁿ = aᵐⁿ\n- a⁰ = 1\n\n**লগারিদম:** যদি aˣ = b হয় তাহলে x = log_a(b)",
    examples: ["2³ = 8", "10² × 10³ = 10⁵", "log₂(8) = 3", "log₁₀(100) = 2"],
    keywords: ["সূচক", "exponent", "লগারিদম", "logarithm", "ঘাত", "power"],
    category: 'intermediate',
    difficulty: 3
  },
  {
    topic: "বহুপদ ও বহুপদ উৎপাদন",
    content: "**বহুপদ (Polynomial):** চলরাশি ও ধ্রুবক পদের যোগফল।\n\n**প্রকারভেদ:**\n- একপদী (Monomial): 3x²\n- দ্বিপদী (Binomial): 2x + 5\n- ত্রিপদী (Trinomial): x² + 3x + 2\n\n**ডিগ্রি:** সর্বোচ্চ ঘাতের মান",
    examples: ["3x² + 2x - 5", "x³ - 4x + 1", "2x⁴ + x² - 7"],
    keywords: ["বহুপদ", "polynomial", "একপদী", "দ্বিপদী", "ত্রিপদী", "ডিগ্রি"],
    category: 'intermediate',
    difficulty: 2
  },
  {
    topic: "অসমতা",
    content: "**অসমতা (Inequality):** দুইটি রাশির মধ্যে তুলনা যেখানে সমতা নেই।\n\n**চিহ্নসমূহ:**\n- > (বৃহত্তর)\n- < (ক্ষুদ্রতর)\n- ≥ (বৃহত্তর বা সমান)\n- ≤ (ক্ষুদ্রতর বা সমান)\n\n**সমাধানের নিয়ম:** ঋণাত্মক সংখ্যা দিয়ে গুণ বা ভাগ করলে চিহ্ন উল্টে যায়।",
    examples: ["2x + 3 > 7 → x > 2", "x² < 9 → -3 < x < 3", "-2x ≤ 6 → x ≥ -3"],
    keywords: ["অসমতা", "inequality", "বৃহত্তর", "ক্ষুদ্রতর", "greater", "less"],
    category: 'intermediate',
    difficulty: 2
  },
  {
    topic: "ম্যাট্রিক্স",
    content: "**ম্যাট্রিক্স:** সংখ্যাগুলোর আয়তাকার বিন্যাস।\n\n**প্রকারভেদ:**\n- বর্গ ম্যাট্রিক্স\n- একক ম্যাট্রিক্স\n- শূন্য ম্যাট্রিক্স\n\n**ক্রিয়াসমূহ:**\n- যোগ ও বিয়োগ\n- গুণ\n- নির্ণায়ক (Determinant)",
    examples: ["[1 2; 3 4]", "[a b; c d] × [e f; g h]"],
    keywords: ["ম্যাট্রিক্স", "matrix", "নির্ণায়ক", "determinant", "বর্গ"],
    category: 'advanced',
    difficulty: 4
  },
  {
    topic: "সমুচ্চয় তত্ত্ব",
    content: "**সমুচ্চয় (Set):** নির্দিষ্ট বস্তুর সংগ্রহ।\n\n**প্রতীকসমূহ:**\n- ∈ (অন্তর্ভুক্ত)\n- ∉ (অন্তর্ভুক্ত নয়)\n- ∪ (সংযোগ)\n- ∩ (ছেদ)\n- ⊆ (উপসেট)\n\n**বেন চিত্র দিয়ে উপস্থাপনা সম্ভব।**",
    examples: ["A = {1, 2, 3}", "A ∪ B", "A ∩ B", "A ⊆ B"],
    keywords: ["সমুচ্চয়", "set", "সংযোগ", "ছেদ", "উপসেট", "বেন"],
    category: 'intermediate',
    difficulty: 3
  },
  // Historical Topics
  {
    topic: "বীজগণিতের ইতিহাস - প্রাচীন কাল",
    content: "**প্রাচীন সভ্যতায় বীজগণিত:**\n\n**ব্যাবিলনীয় সভ্যতা (২০০০ খ্রি.পূ.):**\n- দ্বিঘাত সমীকরণের সমাধান\n- ৬০ ভিত্তিক সংখ্যা পদ্ধতি\n\n**মিশরীয় সভ্যতা:**\n- প্যাপিরাসে গাণিতিক সমস্যা\n- ভগ্নাংশের ব্যবহার",
    examples: ["ব্যাবিলনীয় কিউনিফর্ম লিপি", "রাইন্ড প্যাপিরাস", "আহমেস প্যাপিরাস"],
    keywords: ["ইতিহাস", "history", "ব্যাবিলন", "মিশর", "প্রাচীন", "প্যাপিরাস"],
    category: 'history',
    difficulty: 2
  },
  {
    topic: "ইসলামী স্বর্ণযুগে বীজগণিত",
    content: "**আল-খোয়ারিজমি (৭৮০-৮৫০ খ্রি.):**\n- 'আল-জাবর ওয়াল-মুকাবালা' গ্রন্থ রচনা\n- বীজগণিত শব্দের জনক\n- পদ্ধতিগত সমাধান পদ্ধতি প্রবর্তন\n\n**আল-কারাজি (৯৫৩-১০২৯):**\n- ঋণাত্মক সংখ্যার ব্যবহার\n- বহুপদ বীজগণিত",
    examples: ["আল-জাবর থেকে Algebra", "দশমিক সংখ্যা পদ্ধতি", "অ্যালগরিদম"],
    keywords: ["আল-খোয়ারিজমি", "al-khwarizmi", "আরবি", "arabic", "ইসলামী", "স্বর্ণযুগ"],
    category: 'history',
    difficulty: 2
  },
  {
    topic: "ভারতীয় গণিতবিদদের অবদান",
    content: "**আর্যভট্ট (৪৭৬-৫৫০ খ্রি.):**\n- 'আর্যভট্টীয়' গ্রন্থ\n- পাই (π) এর মান নির্ণয়\n\n**ব্রহ্মগুপ্ত (৬২৮-৬৬৮ খ্রি.):**\n- শূন্যের গাণিতিক ব্যবহার\n- ঋণাত্মক সংখ্যার নিয়ম\n\n**ভাস্কর II (১১১৪-১১৮৫):**\n- 'লীলাবতী' ও 'বীজগণিত' গ্রন্থ",
    examples: ["শূন্যের আবিষ্কার", "দশমিক স্থানীয় মান", "চক্রবাল পদ্ধতি"],
    keywords: ["আর্যভট্ট", "ব্রহ্মগুপ্ত", "ভাস্কর", "ভারতীয়", "শূন্য", "লীলাবতী"],
    category: 'history',
    difficulty: 3
  },
  {
    topic: "আধুনিক বীজগণিতের বিকাশ",
    content: "**রেনেসাঁর যুগ:**\n\n**ফ্রাঁসোয়া ভিয়েত (১৫৪০-১৬০৩):**\n- চলরাশি হিসেবে অক্ষরের ব্যবহার\n- প্রতীকী বীজগণিতের জনক\n\n**রেনে দেকার্ত (১৫৯৬-১৬৫০):**\n- কার্তেসীয় স্থানাঙ্ক পদ্ধতি\n- জ্যামিতি ও বীজগণিতের সমন্বয়",
    examples: ["x, y, z চলরাশি", "কার্তেসীয় তল", "বিশ্লেষণী জ্যামিতি"],
    keywords: ["ভিয়েত", "দেকার্ত", "রেনেসাঁ", "আধুনিক", "প্রতীকী", "স্থানাঙ্ক"],
    category: 'history',
    difficulty: 3
  },
  // Advanced Topics
  {
    topic: "জটিল সংখ্যা",
    content: "**জটিল সংখ্যা:** a + bi আকারের সংখ্যা, যেখানে i² = -1\n\n**বৈশিষ্ট্য:**\n- বাস্তব অংশ: a\n- কাল্পনিক অংশ: bi\n- মডুলাস: |z| = √(a² + b²)\n\n**ক্রিয়াসমূহ:**\n- যোগ, বিয়োগ, গুণ, ভাগ\n- De Moivre's উপপাদ্য",
    examples: ["3 + 4i", "i² = -1", "|3 + 4i| = 5", "(1 + i)² = 2i"],
    keywords: ["জটিল", "complex", "কাল্পনিক", "imaginary", "মডুলাস", "modulus"],
    category: 'advanced',
    difficulty: 4
  },
  {
    topic: "গ্রুপ তত্ত্ব",
    content: "**গ্রুপ:** একটি সেট যেখানে একটি দ্বিমিক ক্রিয়া আছে যা চারটি স্বতঃসিদ্ধ পূরণ করে।\n\n**স্বতঃসিদ্ধসমূহ:**\n1. বন্ধতা (Closure)\n2. সহযোগিতা (Associativity)\n3. অভেদ উপাদান (Identity)\n4. বিপরীত উপাদান (Inverse)\n\n**উদাহরণ:** পূর্ণ সংখ্যার যোগ গ্রুপ",
    examples: ["(Z, +)", "(Q*, ×)", "সমতা গ্রুপ"],
    keywords: ["গ্রুপ", "group", "স্বতঃসিদ্ধ", "axiom", "বন্ধতা", "সহযোগিতা"],
    category: 'advanced',
    difficulty: 5
  },
  {
    topic: "রিং ও ফিল্ড তত্ত্ব",
    content: "**রিং:** দুইটি দ্বিমিক ক্রিয়া (যোগ ও গুণ) সহ একটি সেট।\n\n**ফিল্ড:** একটি কমিউটেটিভ রিং যেখানে প্রতিটি অশূন্য উপাদানের গুণের বিপরীত আছে।\n\n**উদাহরণ:**\n- রিং: পূর্ণ সংখ্যা (Z)\n- ফিল্ড: মূলদ সংখ্যা (Q), বাস্তব সংখ্যা (R)",
    examples: ["(Z, +, ×)", "(Q, +, ×)", "(R, +, ×)", "(C, +, ×)"],
    keywords: ["রিং", "ring", "ফিল্ড", "field", "কমিউটেটিভ", "commutative"],
    category: 'advanced',
    difficulty: 5
  }
];

// Helper functions for database queries
export const searchDatabase = (query: string): AlgebraKnowledge[] => {
  const searchTerm = query.toLowerCase();
  return expandedAlgebraDatabase.filter(item => 
    item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    item.topic.toLowerCase().includes(searchTerm) ||
    item.content.toLowerCase().includes(searchTerm)
  );
};

export const getByCategory = (category: AlgebraKnowledge['category']): AlgebraKnowledge[] => {
  return expandedAlgebraDatabase.filter(item => item.category === category);
};

export const getByDifficulty = (difficulty: number): AlgebraKnowledge[] => {
  return expandedAlgebraDatabase.filter(item => item.difficulty === difficulty);
};

export const getRandomTopic = (): AlgebraKnowledge => {
  const randomIndex = Math.floor(Math.random() * expandedAlgebraDatabase.length);
  return expandedAlgebraDatabase[randomIndex];
};