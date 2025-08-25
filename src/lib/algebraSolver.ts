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
      `বীজগাণিতিক গসাগু নির্ণয়: ${expressions.join(', ')}`
    ];

    // Factor each expression
    const factorizations: string[][] = [];
    expressions.forEach(expr => {
      const factors = this.factorExpression(expr);
      factorizations.push(factors);
      const formattedExpr = this.formatMathExpression(expr);
      const formattedFactors = factors.map(f => this.formatMathExpression(f));
      steps.push(`${formattedExpr} = ${formattedFactors.join(' × ')}`);
      console.log(`Factorization of ${expr}:`, factors);
    });

    // Find common factors
    const commonFactors = this.findCommonAlgebraicFactors(factorizations);
    console.log('Common factors:', commonFactors);
    
    if (commonFactors.length > 0) {
      const formattedCommon = commonFactors.map(f => this.formatMathExpression(f));
      steps.push(`সাধারণ উৎপাদক: ${formattedCommon.join(', ')}`);
    } else {
      steps.push('কোনো সাধারণ উৎপাদক নেই');
    }
    
    const hcf = commonFactors.length > 0 ? commonFactors.map(f => this.formatMathExpression(f)).join(' × ') : '1';
    steps.push(`গসাগু = ${hcf}`);

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
      `বীজগাণিতিক লসাগু নির্ণয়: ${expressions.join(', ')}`
    ];

    // Factor each expression
    const factorizations: string[][] = [];
    expressions.forEach(expr => {
      const factors = this.factorExpression(expr);
      factorizations.push(factors);
      const formattedExpr = this.formatMathExpression(expr);
      const formattedFactors = factors.map(f => this.formatMathExpression(f));
      steps.push(`${formattedExpr} = ${formattedFactors.join(' × ')}`);
      console.log(`Factorization of ${expr}:`, factors);
    });

    // Calculate LCM using all unique factors with highest powers
    const lcmFactors = this.calculateAlgebraicLCM(factorizations);
    console.log('LCM factors:', lcmFactors);
    
    const lcm = lcmFactors.length > 0 ? lcmFactors.map(f => this.formatMathExpression(f)).join(' × ') : '1';
    steps.push(`লসাগু = ${lcm}`);

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
    
    // Handle quadratic expressions: ax^2 + bx + c
    let quadMatch = expr.match(/^(\d*)([a-z])\^?2([+-]\d*)([a-z])?([+-]\d+)?$/i);
    if (quadMatch) {
      const a = Number(quadMatch[1] || 1);
      const variable = quadMatch[2];
      const bCoeff = quadMatch[3] ? Number(quadMatch[3]) : 0;
      const c = quadMatch[5] ? Number(quadMatch[5]) : 0;
      
      // Try to factor quadratics
      if (c !== 0) {
        // Look for factors of ac that add to b
        for (let p = 1; p <= Math.abs(c); p++) {
          if (c % p === 0) {
            const q = c / p;
            if (p + q === Math.abs(bCoeff)) {
              const sign1 = bCoeff >= 0 ? '+' : '-';
              const sign2 = c >= 0 ? '+' : '-';
              const result = [`(${variable}${sign1}${p})`, `(${variable}${sign2}${Math.abs(q)})`];
              console.log('Quadratic factorization:', result);
              return result;
            }
          }
        }
      }
    }
    
    // Handle difference of squares: x^2 - a^2
    let diffSquareMatch = expr.match(/^(\d*)([a-z])\^?2-(\d+)$/i);
    if (diffSquareMatch) {
      const coeff = Number(diffSquareMatch[1] || 1);
      const variable = diffSquareMatch[2];
      const constantSq = Number(diffSquareMatch[3]);
      const constant = Math.sqrt(constantSq);
      
      if (Number.isInteger(constant)) {
        let factors = [`(${variable}-${constant})`, `(${variable}+${constant})`];
        if (coeff > 1) factors.unshift(coeff.toString());
        console.log('Difference of squares factorization:', factors);
        return factors;
      }
    }
    
    // Handle linear expressions: ax + b
    let linearMatch = expr.match(/^(\d*)([a-z])([+-]\d+)$/i);
    if (linearMatch) {
      const a = Number(linearMatch[1] || 1);
      const variable = linearMatch[2];
      const b = Number(linearMatch[3]);
      const gcd = this.calculateHCF(Math.abs(a), Math.abs(b));
      
      if (gcd > 1) {
        const newA = a / gcd;
        const newB = b / gcd;
        const bSign = newB >= 0 ? '+' : '';
        const result = [gcd.toString(), `(${newA === 1 ? '' : newA}${variable}${bSign}${newB})`];
        console.log('Factored linear with GCD:', result);
        return result;
      } else {
        console.log('Linear expression (no common factor):', [expr]);
        return [expr];
      }
    }
    
    // Handle simple variable terms: x, 2x, x^2, etc.
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
    console.log('No factorization pattern matched, returning as single factor:', [expr]);
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

  private static calculateAlgebraicLCM(factorizations: string[][]): string[] {
    console.log('Calculating LCM from factorizations:', factorizations);
    
    const factorCounts = new Map<string, number>();
    
    // For each factorization, count occurrences of each factor
    factorizations.forEach(factors => {
      const localCounts = new Map<string, number>();
      
      factors.forEach(factor => {
        const normalizedFactor = this.normalizeFactor(factor);
        localCounts.set(normalizedFactor, (localCounts.get(normalizedFactor) || 0) + 1);
      });
      
      // Update global max counts
      localCounts.forEach((count, factor) => {
        const currentMax = factorCounts.get(factor) || 0;
        factorCounts.set(factor, Math.max(currentMax, count));
      });
    });
    
    // Build LCM from factors with their maximum powers
    const lcmFactors: string[] = [];
    factorCounts.forEach((count, factor) => {
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
