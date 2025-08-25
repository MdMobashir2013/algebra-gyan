interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

export class AlgebraSolver {
  // Format mathematical expressions for display
  private static formatMathExpression(expr: string): string {
    return expr
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\^4/g, '⁴')
      .replace(/\^5/g, '⁵')
      .replace(/\^6/g, '⁶')
      .replace(/\^7/g, '⁷')
      .replace(/\^8/g, '⁸')
      .replace(/\^9/g, '⁹')
      .replace(/\^(\d+)/g, (match, num) => {
        const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
        return num.split('').map((digit: string) => superscripts[parseInt(digit)]).join('');
      });
  }

  static solve(problem: string): Solution {
    const trimmedProblem = problem.trim();
    
    // Check for HCF problems
    if (trimmedProblem.match(/hcf|gcd|গসাগু|গ\.সা\.গু/i)) {
      return this.solveHCF(trimmedProblem);
    }
    
    // Check for LCM problems
    if (trimmedProblem.match(/lcm|লসাগু|ল\.সা\.গু/i)) {
      return this.solveLCM(trimmedProblem);
    }

    const equation = trimmedProblem.replace(/\s/g, '');

    if (!equation.includes('=')) {
      throw new Error('এটি একটি বৈধ সমীকরণ নয়। দয়া করে "=" চিহ্ন যুক্ত সমীকরণ দিন।');
    }

    let [left, right] = equation.split('=');
    if (!left || !right) {
      throw new Error('সমীকরণটি সঠিকভাবে লিখুন।');
    }

    // Quadratic detection
    if ((left.includes('^2') || right.includes('^2')) && (left.match(/[a-z]/i) || right.match(/[a-z]/i))) {
      return this.solveQuadratic(left, right);
    }

    // Linear equation
    return this.solveLinear(left, right, trimmedProblem);
  }

  private static solveQuadratic(left: string, right: string): Solution {
    // Only support ax^2+bx+c=0 format
    let quadSide = left.includes('^2') ? left : right;
    let quadRight = left.includes('^2') ? right : left;
    
    if (quadRight !== '0') {
      throw new Error('শুধুমাত্র ax²+bx+c=0 ধরনের সমীকরণ সমর্থিত');
    }

    // Enhanced regex to handle more variations
    let match = quadSide.match(/([+-]?\d*)x\^?2([+-]?\d*)x?([+-]?\d*)/i);
    if (!match) {
      throw new Error('দয়া করে ax²+bx+c=0 এর মত সমীকরণ দিন');
    }

    let a = this.parseCoefficient(match[1], 1);
    let b = this.parseCoefficient(match[2], 0);
    let c = this.parseCoefficient(match[3], 0);

    let discriminant = b * b - 4 * a * c;
    
    let steps = [
      this.formatMathExpression(`${a}x^2 + ${b}x + ${c} = 0`),
      this.formatMathExpression(`বিচারক (D) = b^2 - 4ac = (${b})^2 - 4×(${a})×(${c}) = ${discriminant}`)
    ];

    if (discriminant < 0) {
      steps.push('D < 0 হওয়ায় এই সমীকরণের বাস্তব সমাধান নেই');
      return {
        type: 'quadratic',
        variable: 'x',
        steps,
        solution: 'বাস্তব সমাধান নেই'
      };
    }

    if (discriminant === 0) {
      let x = -b / (2 * a);
      steps.push('D = 0 হওয়ায় দুটি সমান মূল রয়েছে');
      steps.push(`x = -b/2a = -(${b})/(2×${a}) = ${x}`);
      return {
        type: 'quadratic',
        variable: 'x',
        steps,
        solution: `x = ${x} (দ্বিগুণ মূল)`
      };
    }

    let sqrtD = Math.sqrt(discriminant);
    let x1 = (-b + sqrtD) / (2 * a);
    let x2 = (-b - sqrtD) / (2 * a);

      steps.push(`√D = √${discriminant} = ${sqrtD.toFixed(3)}`);
      steps.push(`x = [-b ± √D]/2a`);
      steps.push(`x₁ = [-(${b}) + ${sqrtD.toFixed(3)}]/(2×${a}) = ${x1.toFixed(3)}`);
      steps.push(`x₂ = [-(${b}) - ${sqrtD.toFixed(3)}]/(2×${a}) = ${x2.toFixed(3)}`);

    return {
      type: 'quadratic',
      variable: 'x',
      steps,
      solution: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`
    };
  }

  private static solveLinear(left: string, right: string, originalProblem: string): Solution {
    let variableMatch = left.match(/[a-z]/i) || right.match(/[a-z]/i);
    if (!variableMatch) {
      throw new Error('চলক (variable) খুঁজে পাওয়া যায়নি।');
    }
    
    let variable = variableMatch[0];

    // Handle fraction equations like (x+3)/2 = 5
    if (left.match(/^\(.+\)\/\d+$/)) {
      return this.solveFractionEquation(left, right, variable);
    }

    // Parse both sides
    let leftParsed = this.parseSide(left, variable);
    let rightParsed = this.parseSide(right, variable);

    // Move all variable terms to left, constants to right
    let finalCoeff = leftParsed.coeff - rightParsed.coeff;
    let finalConst = rightParsed.constant - leftParsed.constant;

    if (finalCoeff === 0) {
      if (finalConst === 0) {
        return {
          type: 'linear',
          variable,
          steps: [
            originalProblem,
            'সব চলক বাদ দিলে: 0 = 0',
            'সমীকরণের অসীম সমাধান আছে'
          ],
          solution: 'অসমাপ্ত/অনন্ত সমাধান'
        };
      } else {
        return {
          type: 'linear',
          variable,
          steps: [
            originalProblem,
            `সব চলক বাদ দিলে: 0 = ${finalConst}`,
            'কোনো সমাধান নেই'
          ],
          solution: 'সমাধান নেই'
        };
      }
    }

    let solution = finalConst / finalCoeff;
    
    let steps = [
      originalProblem,
      `চলক এক পাশে স্থানান্তর: ${finalCoeff}${variable} = ${finalConst}`,
      `${variable} = ${finalConst} ÷ ${finalCoeff}`,
      `${variable} = ${solution}`
    ];

    return {
      type: 'linear',
      variable,
      steps,
      solution: `${variable} = ${solution}`
    };
  }

  private static solveFractionEquation(left: string, right: string, variable: string): Solution {
    let match = left.match(/^\((.+)\)\/(\d+)$/);
    if (!match) throw new Error('ভগ্নাংশ সমীকরণ পার্স করতে সমস্যা');
    
    let numerator = match[1];
    let denominator = Number(match[2]);
    let result = Number(right);
    
    let steps = [
      `${left} = ${right}`,
      `${numerator} = ${result} × ${denominator}`,
      `${numerator} = ${result * denominator}`
    ];

    // Now solve the simplified equation
    let numeratorParsed = this.parseSide(numerator, variable);
    let finalValue = (result * denominator - numeratorParsed.constant) / numeratorParsed.coeff;
    
    steps.push(`${variable} = (${result * denominator} - ${numeratorParsed.constant}) ÷ ${numeratorParsed.coeff}`);
    steps.push(`${variable} = ${finalValue}`);

    return {
      type: 'linear',
      variable,
      steps,
      solution: `${variable} = ${finalValue}`
    };
  }

  private static parseSide(side: string, variable: string): { coeff: number; constant: number } {
    let coeff = 0;
    let constant = 0;
    
    // Replace - with +- for easier parsing
    side = side.replace(/-/g, '+-');
    let terms = side.split('+').filter(Boolean);
    
    terms.forEach(term => {
      if (term.includes(variable)) {
        let coeffStr = term.replace(variable, '');
        if (coeffStr === '' || coeffStr === '+') coeffStr = '1';
        if (coeffStr === '-') coeffStr = '-1';
        coeff += Number(coeffStr);
      } else if (term !== '') {
        constant += Number(term);
      }
    });
    
    return { coeff, constant };
  }

  private static parseCoefficient(coeffStr: string, defaultValue: number): number {
    if (!coeffStr || coeffStr === '+') return defaultValue;
    if (coeffStr === '-') return -defaultValue;
    return Number(coeffStr) || defaultValue;
  }

  private static solveHCF(problem: string): Solution {
    console.log('Solving HCF for problem:', problem);
    
    // Extract algebraic expressions from the problem
    const expressions = this.extractAlgebraicExpressions(problem);
    console.log('Extracted expressions:', expressions);
    
    if (expressions.length < 2) {
      throw new Error('কমপক্ষে দুটি বীজগাণিতিক রাশি প্রয়োজন গসাগু নির্ণয়ের জন্য।');
    }

    const steps: string[] = [
      `বীজগাণিতিক গসাগু নির্ণয়: ${expressions.join(', ')}`,
      ``,
      `ধাপ ১: প্রতিটি রাশিকে উৎপাদকে বিশ্লেষণ করি`
    ];

    // Factor each expression with educational explanations
    const factorizations: string[][] = [];
    expressions.forEach((expr, index) => {
      const factors = this.factorExpression(expr);
      factorizations.push(factors);
      const formattedExpr = this.formatMathExpression(expr);
      const formattedFactors = factors.map(f => this.formatMathExpression(f));
      
      steps.push(`${formattedExpr} = ${formattedFactors.join(' × ')}`);
      
      // Add educational notes for specific cases
      if (expr.includes('^2') && expr.includes('-')) {
        steps.push(`   (এটি বর্গের বিয়োগ: a² - b² = (a-b)(a+b))`);
      } else if (factors.length === 1 && factors[0] === expr) {
        steps.push(`   (এই রাশিটি আর ভাঙা যায় না)`);
      }
      
      console.log(`Factorization of ${expr}:`, factors);
    });

    steps.push(``, `ধাপ ২: সাধারণ উৎপাদক খুঁজে বের করি`);

    // Find common factors with detailed explanation
    const commonFactors = this.findCommonAlgebraicFactors(factorizations);
    console.log('Common factors:', commonFactors);
    
    if (commonFactors.length > 0) {
      const formattedCommon = commonFactors.map(f => this.formatMathExpression(f));
      steps.push(`সব রাশিতে মিল আছে এমন উৎপাদক: ${formattedCommon.join(', ')}`);
      steps.push(`মনে রাখি: গসাগু হলো সবচেয়ে বড় সাধারণ উৎপাদক`);
    } else {
      steps.push('কোনো সাধারণ উৎপাদক নেই (সব রাশি সহমৌলিক)');
    }
    
    const hcf = commonFactors.length > 0 ? commonFactors.map(f => this.formatMathExpression(f)).join(' × ') : '1';
    steps.push(``, `∴ গসাগু = ${hcf}`);

    return {
      type: 'hcf',
      variable: 'গসাগু',
      steps,
      solution: `গসাগু = ${hcf}`
    };
  }

  private static solveLCM(problem: string): Solution {
    console.log('Solving LCM for problem:', problem);
    
    // Extract algebraic expressions from the problem
    const expressions = this.extractAlgebraicExpressions(problem);
    console.log('Extracted expressions:', expressions);
    
    if (expressions.length < 2) {
      throw new Error('কমপক্ষে দুটি বীজগাণিতিক রাশি প্রয়োজন লসাগু নির্ণয়ের জন্য।');
    }

    const steps: string[] = [
      `বীজগাণিতিক লসাগু নির্ণয়: ${expressions.join(', ')}`,
      ``,
      `ধাপ ১: প্রতিটি রাশিকে উৎপাদকে বিশ্লেষণ করি`
    ];

    // Factor each expression with educational guidance
    const factorizations: string[][] = [];
    expressions.forEach((expr, index) => {
      const factors = this.factorExpression(expr);
      factorizations.push(factors);
      const formattedExpr = this.formatMathExpression(expr);
      const formattedFactors = factors.map(f => this.formatMathExpression(f));
      
      steps.push(`${formattedExpr} = ${formattedFactors.join(' × ')}`);
      
      // Add educational notes
      if (expr.includes('^2') && expr.includes('-')) {
        steps.push(`   (বর্গের বিয়োগ সূত্র ব্যবহার করেছি)`);
      }
      
      console.log(`Factorization of ${expr}:`, factors);
    });

    steps.push(``, `ধাপ ২: লসাগু নির্ণয় করি`);
    steps.push(`মনে রাখি: লসাগু = সব আলাদা উৎপাদকের সর্বোচ্চ ঘাত`);

    // Calculate LCM with educational explanation
    const lcmFactors = this.calculateAlgebraicLCMWithExplanation(factorizations, steps);
    console.log('LCM factors:', lcmFactors);
    
    const lcm = lcmFactors.length > 0 ? lcmFactors.map(f => this.formatMathExpression(f)).join(' × ') : '1';
    steps.push(``, `∴ লসাগু = ${lcm}`);

    return {
      type: 'lcm',
      variable: 'লসাগু',
      steps,
      solution: `লসাগু = ${lcm}`
    };
  }

  private static extractAlgebraicExpressions(text: string): string[] {
    console.log('Extracting expressions from:', text);
    
    // More comprehensive regex patterns for algebraic expressions
    const patterns = [
      /\b\d*[a-z](\^?\d+)?([+-]\d*[a-z](\^?\d+)?)*([+-]\d+)?\b/gi, // Multi-term expressions like 2x+3, x^2-4
      /\b\d*[a-z](\^?\d+)?\b/gi, // Simple terms like x, 2x, x^2
      /\b\d+\b/g // Pure numbers
    ];
    
    const expressions: string[] = [];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.trim();
          if (this.isValidAlgebraicExpression(cleaned) && !expressions.includes(cleaned)) {
            expressions.push(cleaned);
          }
        });
      }
    }
    
    console.log('Valid expressions found:', expressions);
    return expressions.slice(0, 4);
  }

  private static isValidAlgebraicExpression(expr: string): boolean {
    // Accept pure numbers for HCF/LCM
    if (/^\d+$/.test(expr)) return true;
    
    // Must contain at least one variable (letter) for algebraic expressions
    if (!/[a-z]/i.test(expr)) return false;
    
    // Must be longer than single letter unless it's a simple variable
    if (expr.length === 1 && /[a-z]/i.test(expr)) return true;
    
    // Should contain valid algebraic characters
    if (!/^[a-z0-9+\-^()]+$/i.test(expr)) return false;
    
    // Should not start or end with operators
    if (/^[+\-^]|[+\-^]$/.test(expr)) return false;
    
    return true;
  }

  private static factorExpression(expr: string): string[] {
    console.log('Factoring expression:', expr);
    
    // Clean and normalize the expression
    expr = expr.replace(/^\((.+)\)$/, '$1').replace(/\s/g, '');
    
    // Handle pure constants first
    if (/^\d+$/.test(expr)) {
      const num = Number(expr);
      if (num <= 1) return [expr];
      const factors = this.getPrimeFactors(num);
      console.log('Prime factorization of', num, ':', factors);
      return factors;
    }
    
    // Handle difference of squares: x²-a² or ax²-b²
    let diffSquareMatch = expr.match(/^(\d*)([a-z])\^?2-(\d+)$/i);
    if (diffSquareMatch) {
      const coeff = Number(diffSquareMatch[1] || 1);
      const variable = diffSquareMatch[2];
      const constantSq = Number(diffSquareMatch[3]);
      const constant = Math.sqrt(constantSq);
      
      if (Number.isInteger(constant)) {
        let factors = [];
        if (coeff > 1) factors.push(coeff.toString());
        factors.push(`(${variable}-${constant})`);
        factors.push(`(${variable}+${constant})`);
        console.log('Difference of squares factorization:', factors);
        return factors;
      }
    }
    
    // Handle perfect square trinomials: x²+2ax+a² or x²-2ax+a²
    let perfectSquareMatch = expr.match(/^([a-z])\^?2([+-])(\d+)([a-z])([+-])(\d+)$/i);
    if (perfectSquareMatch) {
      const variable = perfectSquareMatch[1];
      const middleSign = perfectSquareMatch[2];
      const middleCoeff = Number(perfectSquareMatch[3]);
      const constant = Number(perfectSquareMatch[6]);
      
      // Check if it's a perfect square: (x±a)²
      const a = Math.sqrt(constant);
      if (Number.isInteger(a) && middleCoeff === 2 * a) {
        const sign = middleSign === '+' ? '+' : '-';
        const result = [`(${variable}${sign}${a})`, `(${variable}${sign}${a})`];
        console.log('Perfect square trinomial:', result);
        return result;
      }
    }
    
    // Handle quadratic expressions: ax²+bx+c
    let quadMatch = expr.match(/^(\d*)([a-z])\^?2([+-]\d*)([a-z])?([+-]\d+)?$/i);
    if (quadMatch) {
      const a = Number(quadMatch[1] || 1);
      const variable = quadMatch[2];
      const bStr = quadMatch[3] || '0';
      const b = bStr === '+' || bStr === '' ? 0 : Number(bStr);
      const cStr = quadMatch[5] || '0';
      const c = cStr === '+' || cStr === '' ? 0 : Number(cStr);
      
      if (c !== 0 && a === 1) {
        // Try to factor x²+bx+c = (x+p)(x+q) where p+q=b and p*q=c
        for (let p = -Math.abs(c); p <= Math.abs(c); p++) {
          if (p === 0) continue;
          const q = c / p;
          if (Number.isInteger(q) && p + q === b) {
            const factors = [`(${variable}${p >= 0 ? '+' : ''}${p})`, `(${variable}${q >= 0 ? '+' : ''}${q})`];
            console.log('Quadratic factorization:', factors);
            return factors;
          }
        }
      }
    }
    
    // Handle linear expressions: ax+b or ax-b
    let linearMatch = expr.match(/^(\d*)([a-z])([+-]\d+)$/i);
    if (linearMatch) {
      const a = Number(linearMatch[1] || 1);
      const variable = linearMatch[2];
      const b = Number(linearMatch[3]);
      
      // Check if we can factor out a common factor
      const gcd = this.calculateHCF(Math.abs(a), Math.abs(b));
      
      if (gcd > 1) {
        const newA = a / gcd;
        const newB = b / gcd;
        const bSign = newB >= 0 ? '+' : '';
        const factors = [gcd.toString()];
        if (newA === 1) {
          factors.push(`(${variable}${bSign}${newB})`);
        } else {
          factors.push(`(${newA}${variable}${bSign}${newB})`);
        }
        console.log('Factored linear with GCD:', factors);
        return factors;
      } else {
        // Linear expression cannot be factored further
        console.log('Linear expression (prime):', [expr]);
        return [expr];
      }
    }
    
    // Handle simple variable terms: x, 2x, x², 3x²
    let variableMatch = expr.match(/^(\d*)([a-z])(\^?\d+)?$/i);
    if (variableMatch) {
      const coeff = Number(variableMatch[1] || 1);
      const variable = variableMatch[2];
      const power = variableMatch[3] || '';
      
      let factors = [];
      if (coeff > 1) factors.push(coeff.toString());
      factors.push(`${variable}${power}`);
      
      console.log('Variable term factorization:', factors);
      return factors;
    }
    
    // If no pattern matches, return as single factor
    console.log('Expression cannot be factored further:', [expr]);
    return [expr];
  }

  private static calculateHCF(a: number, b: number): number {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  private static getPrimeFactors(n: number): string[] {
    const factors: string[] = [];
    let divisor = 2;
    
    while (divisor * divisor <= n) {
      while (n % divisor === 0) {
        factors.push(divisor.toString());
        n /= divisor;
      }
      divisor++;
    }
    
    if (n > 1) {
      factors.push(n.toString());
    }
    
    return factors.length > 0 ? factors : ['1'];
  }

  private static findCommonAlgebraicFactors(factorizations: string[][]): string[] {
    console.log('Finding common factors from:', factorizations);
    
    if (factorizations.length === 0) return [];
    
    // Count occurrences of each factor across all factorizations
    const factorCounts = new Map<string, number>();
    
    factorizations.forEach(factors => {
      const uniqueFactors = new Set(factors.map(f => this.normalizeFactor(f)));
      uniqueFactors.forEach(factor => {
        factorCounts.set(factor, (factorCounts.get(factor) || 0) + 1);
      });
    });
    
    // Find factors that appear in ALL factorizations
    const common: string[] = [];
    factorCounts.forEach((count, factor) => {
      if (count === factorizations.length) {
        // Find the minimum occurrence count across all factorizations
        let minCount = Infinity;
        factorizations.forEach(factors => {
          const normalizedFactors = factors.map(f => this.normalizeFactor(f));
          const occurrences = normalizedFactors.filter(f => f === factor).length;
          minCount = Math.min(minCount, occurrences);
        });
        
        // Add the factor the minimum number of times it appears
        for (let i = 0; i < minCount; i++) {
          common.push(factor);
        }
      }
    });
    
    console.log('Common factors found:', common);
    return common;
  }

  // Educational LCM calculation with step-by-step explanation
  private static calculateAlgebraicLCMWithExplanation(factorizations: string[][], steps: string[]): string[] {
    console.log('Calculating LCM with educational explanation:', factorizations);
    
    // Collect all unique factors with their maximum powers
    const factorMap = new Map<string, { count: number; expressions: number[] }>();
    
    factorizations.forEach((factors, exprIndex) => {
      // Count occurrences of each factor in this expression
      const localFactorCounts = new Map<string, number>();
      
      factors.forEach(factor => {
        const normalized = this.normalizeFactor(factor);
        localFactorCounts.set(normalized, (localFactorCounts.get(normalized) || 0) + 1);
      });
      
      // Update the global tracking
      localFactorCounts.forEach((count, factor) => {
        const current = factorMap.get(factor) || { count: 0, expressions: [] };
        if (count > current.count) {
          current.count = count;
          current.expressions = [exprIndex];
        } else if (count === current.count && !current.expressions.includes(exprIndex)) {
          current.expressions.push(exprIndex);
        }
        factorMap.set(factor, current);
      });
    });

    // Provide educational explanation
    steps.push(`প্রতিটি আলাদা উৎপাদকের জন্য সর্বোচ্চ ঘাত নিব:`);
    
    const lcmFactors: string[] = [];
    const sortedFactors = Array.from(factorMap.keys()).sort((a, b) => {
      const aIsNumber = /^\d+$/.test(a);
      const bIsNumber = /^\d+$/.test(b);
      
      if (aIsNumber && !bIsNumber) return -1;
      if (!aIsNumber && bIsNumber) return 1;
      if (aIsNumber && bIsNumber) return Number(a) - Number(b);
      return a.localeCompare(b);
    });
    
    sortedFactors.forEach(factor => {
      const info = factorMap.get(factor)!;
      const formattedFactor = this.formatMathExpression(factor);
      
      if (info.count === 1) {
        steps.push(`• ${formattedFactor}: সর্বোচ্চ ঘাত = ¹ (১ বার)`);
        lcmFactors.push(factor);
      } else {
        steps.push(`• ${formattedFactor}: সর্বোচ্চ ঘাত = ${info.count} (${info.count} বার)`);
        for (let i = 0; i < info.count; i++) {
          lcmFactors.push(factor);
        }
      }
    });

    if (lcmFactors.length === 0) {
      steps.push(`কোনো উৎপাদক পাওয়া যায়নি, তাই লসাগু = 1`);
      return ['1'];
    }

    console.log('LCM factors calculated with explanation:', lcmFactors);
    return lcmFactors;
  }

  private static calculateAlgebraicLCM(factorizations: string[][]): string[] {
    console.log('Calculating LCM from factorizations:', factorizations);
    
    // Collect all unique factors with their maximum powers
    const factorMap = new Map<string, number>();
    
    factorizations.forEach(factors => {
      // Count occurrences of each factor in this expression
      const localFactorCounts = new Map<string, number>();
      
      factors.forEach(factor => {
        const normalized = this.normalizeFactor(factor);
        localFactorCounts.set(normalized, (localFactorCounts.get(normalized) || 0) + 1);
      });
      
      // Update the global maximum for each factor
      localFactorCounts.forEach((count, factor) => {
        const currentMax = factorMap.get(factor) || 0;
        factorMap.set(factor, Math.max(currentMax, count));
      });
    });
    
    // Build LCM by including each factor the maximum number of times it appears
    const lcmFactors: string[] = [];
    
    // Sort factors to ensure consistent output (numbers first, then variables)
    const sortedFactors = Array.from(factorMap.keys()).sort((a, b) => {
      const aIsNumber = /^\d+$/.test(a);
      const bIsNumber = /^\d+$/.test(b);
      
      if (aIsNumber && !bIsNumber) return -1;
      if (!aIsNumber && bIsNumber) return 1;
      if (aIsNumber && bIsNumber) return Number(a) - Number(b);
      return a.localeCompare(b);
    });
    
    sortedFactors.forEach(factor => {
      const count = factorMap.get(factor) || 0;
      for (let i = 0; i < count; i++) {
        lcmFactors.push(factor);
      }
    });
    
    console.log('LCM factors calculated:', lcmFactors);
    return lcmFactors.length > 0 ? lcmFactors : ['1'];
  }

  private static normalizeFactor(factor: string): string {
    return factor.replace(/\s/g, '').toLowerCase();
  }

  private static areFactorsEqual(factor1: string, factor2: string): boolean {
    return this.normalizeFactor(factor1) === this.normalizeFactor(factor2);
  }
}
