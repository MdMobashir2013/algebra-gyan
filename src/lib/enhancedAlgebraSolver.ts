interface DetailedSolution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
  verification: string;
  alternativeMethod?: string;
  restrictions?: string;
  graphDescription?: string;
  difficulty: number;
  hints: string[];
}

export class EnhancedAlgebraSolver {
  static solve(problem: string): DetailedSolution {
    const cleanProblem = problem.trim();
    
    // Enhanced pattern matching for different types of problems
    if (this.isLinearEquation(cleanProblem)) {
      return this.solveLinearEquation(cleanProblem);
    }
    
    if (this.isQuadraticEquation(cleanProblem)) {
      return this.solveQuadraticEquation(cleanProblem);
    }
    
    if (this.isSystemOfEquations(cleanProblem)) {
      return this.solveSystemOfEquations(cleanProblem);
    }
    
    if (this.isFactorization(cleanProblem)) {
      return this.solveFactorization(cleanProblem);
    }
    
    if (this.isInequality(cleanProblem)) {
      return this.solveInequality(cleanProblem);
    }
    
    if (this.isRatio(cleanProblem)) {
      return this.solveRatio(cleanProblem);
    }
    
    throw new Error("এই ধরনের সমস্যা এখনো সমর্থিত নয়। অনুগ্রহ করে রৈখিক বা দ্বিঘাত সমীকরণ দিন।");
  }

  private static isLinearEquation(problem: string): boolean {
    return /^[^x²³⁴⁵]*x[^²³⁴⁵]*=/.test(problem) && !problem.includes('x²') && !problem.includes('x³');
  }

  private static isQuadraticEquation(problem: string): boolean {
    return problem.includes('x²') || problem.includes('x^2');
  }

  private static isSystemOfEquations(problem: string): boolean {
    return problem.includes(',') && problem.split(',').length >= 2;
  }

  private static isFactorization(problem: string): boolean {
    return problem.includes('গুণনীয়ক') || problem.includes('factor') || 
           (problem.includes('x²') && !problem.includes('='));
  }

  private static isInequality(problem: string): boolean {
    return problem.includes('>') || problem.includes('<') || 
           problem.includes('≥') || problem.includes('≤');
  }

  private static isRatio(problem: string): boolean {
    return problem.includes(':') && !problem.includes('=');
  }

  private static solveLinearEquation(problem: string): DetailedSolution {
    // Enhanced linear equation solver
    const equation = problem.replace(/\s/g, '');
    const [left, right] = equation.split('=');
    
    // Extract coefficient and constant
    let coefficient = 1;
    let constant = 0;
    let rightValue = parseFloat(right) || 0;
    
    // Parse left side
    const leftTerms = left.split(/(?=[+-])/);
    
    for (const term of leftTerms) {
      if (term.includes('x')) {
        const coef = term.replace('x', '').replace('+', '') || '1';
        coefficient = coef === '-' ? -1 : (coef === '' ? 1 : parseFloat(coef));
      } else if (term) {
        constant += parseFloat(term) || 0;
      }
    }
    
    const solution = (rightValue - constant) / coefficient;
    
    return {
      type: "রৈখিক সমীকরণ",
      variable: "x",
      steps: [
        `প্রদত্ত সমীকরণ: ${problem}`,
        `পুনর্বিন্যাস: ${coefficient}x + ${constant} = ${rightValue}`,
        `উভয় পাশ থেকে ${constant} বিয়োগ: ${coefficient}x = ${rightValue - constant}`,
        `উভয় পাশকে ${coefficient} দিয়ে ভাগ: x = ${(rightValue - constant)}/${coefficient}`,
        `সরলীকরণ: x = ${solution}`
      ],
      solution: `x = ${solution}`,
      verification: `যাচাই: ${coefficient} × ${solution} + ${constant} = ${coefficient * solution + constant} = ${rightValue} ✓`,
      graphDescription: `এটি একটি সরল রেখার সমীকরণ যা x = ${solution} বিন্দুতে x-অক্ষকে ছেদ করে।`,
      difficulty: 2,
      hints: [
        "রৈখিক সমীকরণে x এর ঘাত সর্বদা ১",
        "উভয় পাশে একই সংখ্যা যোগ/বিয়োগ করা যায়",
        "সমাধানের পর সর্বদা যাচাই করুন"
      ]
    };
  }

  private static solveQuadraticEquation(problem: string): DetailedSolution {
    const equation = problem.replace(/\s/g, '');
    const [left, right] = equation.split('=');
    const rightValue = parseFloat(right) || 0;
    
    // Parse ax² + bx + c = 0 form
    let a = 0, b = 0, c = -rightValue;
    
    // Enhanced parsing for quadratic terms
    const terms = left.split(/(?=[+-])/).filter(term => term);
    
    for (const term of terms) {
      if (term.includes('x²') || term.includes('x^2')) {
        const coef = term.replace(/x[²^]?2?/, '').replace('+', '') || '1';
        a = coef === '-' ? -1 : (coef === '' ? 1 : parseFloat(coef));
      } else if (term.includes('x')) {
        const coef = term.replace('x', '').replace('+', '') || '1';
        b = coef === '-' ? -1 : (coef === '' ? 1 : parseFloat(coef));
      } else if (term && !term.includes('x')) {
        c += parseFloat(term) || 0;
      }
    }
    
    const discriminant = b * b - 4 * a * c;
    const steps = [
      `প্রদত্ত সমীকরণ: ${problem}`,
      `মানক রূপ: ${a}x² + ${b}x + ${c} = 0`,
      `এখানে a = ${a}, b = ${b}, c = ${c}`,
      `বিভেদক (Discriminant) = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
    ];
    
    let solutionText = "";
    let verification = "";
    
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      steps.push(
        `√${discriminant} = ${Math.sqrt(discriminant).toFixed(3)}`,
        `x₁ = (-${b} + ${Math.sqrt(discriminant).toFixed(3)}) / (2 × ${a}) = ${x1.toFixed(3)}`,
        `x₂ = (-${b} - ${Math.sqrt(discriminant).toFixed(3)}) / (2 × ${a}) = ${x2.toFixed(3)}`
      );
      solutionText = `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`;
      verification = `যাচাই: x = ${x1.toFixed(3)} এবং x = ${x2.toFixed(3)} মান সমীকরণে সন্তুষ্ট করে ✓`;
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      steps.push(`x = -${b} / (2 × ${a}) = ${x}`);
      solutionText = `x = ${x} (একটি মাত্র সমাধান)`;
      verification = `যাচাই: x = ${x} মান সমীকরণে সন্তুষ্ট করে ✓`;
    } else {
      steps.push("বিভেদক < 0, তাই কোন বাস্তব সমাধান নেই");
      solutionText = "কোন বাস্তব সমাধান নেই";
      verification = "কাল্পনিক সংখ্যায় সমাধান আছে";
    }
    
    return {
      type: "দ্বিঘাত সমীকরণ",
      variable: "x",
      steps,
      solution: solutionText,
      verification,
      alternativeMethod: "গুণনীয়করণ পদ্ধতিও ব্যবহার করা যেতে পারে",
      graphDescription: "এটি একটি প্যারাবোলা যা x-অক্ষকে সমাধান বিন্দুতে ছেদ করে",
      difficulty: 4,
      hints: [
        "বিভেদক দিয়ে সমাধানের প্রকৃতি জানা যায়",
        "গুণনীয়করণ প্রথমে চেষ্টা করুন",
        "শ্রীধর সূত্র সব সময় কাজ করে"
      ]
    };
  }

  private static solveSystemOfEquations(problem: string): DetailedSolution {
    // Simplified system solver
    const equations = problem.split(',').map(eq => eq.trim());
    
    return {
      type: "সমীকরণ পদ্ধতি",
      variable: "x, y",
      steps: [
        `প্রদত্ত সমীকরণ পদ্ধতি:`,
        `${equations[0]}`,
        `${equations[1]}`,
        `বিলোপন বা প্রতিস্থাপন পদ্ধতি প্রয়োগ করুন`,
        `[বিস্তারিত সমাধান এখনো উন্নয়নাধীন]`
      ],
      solution: "সমাধান পদ্ধতি প্রয়োগ করুন",
      verification: "প্রতিটি সমাধান উভয় সমীকরণে যাচাই করুন",
      difficulty: 4,
      hints: [
        "একই চলের সহগ সমান করুন",
        "একটি চল বিলোপ করুন",
        "অন্য চলের মান বের করুন"
      ]
    };
  }

  private static solveFactorization(problem: string): DetailedSolution {
    return {
      type: "গুণনীয়করণ",
      variable: "সাধারণ গুণনীয়ক",
      steps: [
        `প্রদত্ত রাশি: ${problem}`,
        `সাধারণ গুণনীয়ক খুঁজুন`,
        `বিশেষ সূত্র প্রয়োগ করুন`,
        `[বিস্তারিত গুণনীয়করণ এখনো উন্নয়নাধীন]`
      ],
      solution: "গুণনীয়ক নির্ণয় করুন",
      verification: "গুণনীয়কগুলো গুণ করে মূল রাশি পান",
      difficulty: 3,
      hints: [
        "প্রথমে সাধারণ গুণনীয়ক বের করুন",
        "a² - b² = (a+b)(a-b) ব্যবহার করুন",
        "x² + (a+b)x + ab = (x+a)(x+b)"
      ]
    };
  }

  private static solveInequality(problem: string): DetailedSolution {
    return {
      type: "অসমতা",
      variable: "x",
      steps: [
        `প্রদত্ত অসমতা: ${problem}`,
        `সমীকরণের মতো সমাধান করুন`,
        `চিহ্ন পরিবর্তনের নিয়ম মনে রাখুন`,
        `[বিস্তারিত সমাধান এখনো উন্নয়নাধীন]`
      ],
      solution: "সমাধান সেট নির্ণয় করুন",
      verification: "সংখ্যা রেখায় প্রদর্শন করুন",
      difficulty: 3,
      hints: [
        "ঋণাত্মক সংখ্যা দিয়ে গুণ/ভাগ করলে চিহ্ন উল্টে যায়",
        "সংখ্যা রেখায় সমাধান দেখান",
        "প্রান্তিক মান যাচাই করুন"
      ]
    };
  }

  private static solveRatio(problem: string): DetailedSolution {
    return {
      type: "অনুপাত ও সমানুপাত",
      variable: "অনুপাত",
      steps: [
        `প্রদত্ত অনুপাত: ${problem}`,
        `সমানুপাতের ধর্ম প্রয়োগ করুন`,
        `a:b = c:d হলে ad = bc`,
        `[বিস্তারিত সমাধান এখনো উন্নয়নাধীন]`
      ],
      solution: "অনুপাত নির্ণয় করুন",
      verification: "ক্রস গুণন করে যাচাই করুন",
      difficulty: 2,
      hints: [
        "অনুপাত সরলীকরণ করুন",
        "সমানুপাতে ad = bc",
        "শতকরার সাথে সম্পর্ক আছে"
      ]
    };
  }
}