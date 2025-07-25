interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

export class AlgebraSolver {
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
      `${a}x² + ${b}x + ${c} = 0`,
      `বিচারক (D) = b² - 4ac = (${b})² - 4×(${a})×(${c}) = ${discriminant}`
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
    // Extract algebraic expressions from the problem
    const expressions = this.extractAlgebraicExpressions(problem);
    
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
      steps.push(`${expr} = ${factors.join(' × ')}`);
    });

    // Find common factors
    const commonFactors = this.findCommonAlgebraicFactors(factorizations);
    steps.push(`সাধারণ উৎপাদক: ${commonFactors.join(', ')}`);
    
    const hcf = commonFactors.length > 0 ? commonFactors.join(' × ') : '1';
    steps.push(`গসাগু = ${hcf}`);

    return {
      type: 'hcf',
      variable: 'গসাগু',
      steps,
      solution: `গসাগু = ${hcf}`
    };
  }

  private static solveLCM(problem: string): Solution {
    // Extract algebraic expressions from the problem
    const expressions = this.extractAlgebraicExpressions(problem);
    
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
      steps.push(`${expr} = ${factors.join(' × ')}`);
    });

    // Calculate LCM using all unique factors with highest powers
    const lcmFactors = this.calculateAlgebraicLCM(factorizations);
    const lcm = lcmFactors.join(' × ');
    
    steps.push(`লসাগু = ${lcm}`);

    return {
      type: 'lcm',
      variable: 'লসাগু',
      steps,
      solution: `লসাগু = ${lcm}`
    };
  }

  private static extractNumbers(text: string): number[] {
    const matches = text.match(/\d+/g);
    if (!matches) return [];
    return matches.map(Number).filter(n => n > 0);
  }

  private static calculateHCF(a: number, b: number): number {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  private static calculateLCM(a: number, b: number): number {
    return (a * b) / this.calculateHCF(a, b);
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
    
    return factors.length > 0 ? factors : [n.toString()];
  }

  private static getCommonFactors(numbers: number[]): number[] {
    if (numbers.length === 0) return [];
    
    const allFactors = numbers.map(num => this.getAllFactors(num));
    const common = allFactors[0].filter(factor => 
      allFactors.every(factors => factors.includes(factor))
    );
    
    return common.sort((a, b) => a - b);
  }

  private static getAllFactors(n: number): number[] {
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
          factors.push(n / i);
        }
      }
    }
    return factors.sort((a, b) => a - b);
  }

  private static extractAlgebraicExpressions(text: string): string[] {
    // Remove common words and extract expressions
    const cleanText = text.replace(/hcf|lcm|গসাগু|লসাগু|গ\.সা\.গু|ল\.সা\.গু|নির্ণয়|করুন|এর|of|and/gi, '');
    
    // Match algebraic expressions like x+2, x^2-1, (x+1), etc.
    const matches = cleanText.match(/\(?[a-z\d\+\-\*\^\(\)]+\)?/gi);
    if (!matches) return [];
    
    return matches
      .map(expr => expr.trim().replace(/^,|,$/, ''))
      .filter(expr => expr.length > 0 && expr.match(/[a-z]/i));
  }

  private static factorExpression(expr: string): string[] {
    // Remove parentheses if surrounding the entire expression
    expr = expr.replace(/^\((.+)\)$/, '$1');
    
    // Handle common algebraic patterns
    
    // Difference of squares: x^2 - a^2 = (x-a)(x+a)
    let diffSquareMatch = expr.match(/^([a-z])(\^?2)?\s*-\s*(\d+)$/i);
    if (diffSquareMatch) {
      const variable = diffSquareMatch[1];
      const constant = Math.sqrt(Number(diffSquareMatch[3]));
      if (Number.isInteger(constant)) {
        return [`(${variable}-${constant})`, `(${variable}+${constant})`];
      }
    }
    
    // Perfect square: x^2 + 2ax + a^2 = (x+a)^2
    let perfectSquareMatch = expr.match(/^([a-z])(\^?2)?\s*\+\s*(\d+)([a-z])?\s*\+\s*(\d+)$/i);
    if (perfectSquareMatch) {
      const variable = perfectSquareMatch[1];
      const middleTerm = Number(perfectSquareMatch[3]);
      const constant = Number(perfectSquareMatch[5]);
      const a = Math.sqrt(constant);
      if (Number.isInteger(a) && middleTerm === 2 * a) {
        return [`(${variable}+${a})`, `(${variable}+${a})`];
      }
    }
    
    // Simple quadratic: x^2 + bx + c
    let quadMatch = expr.match(/^([a-z])(\^?2)?\s*([+-]?\d*)([a-z])?\s*([+-]?\d+)$/i);
    if (quadMatch) {
      const variable = quadMatch[1];
      const b = Number(quadMatch[3] || 1);
      const c = Number(quadMatch[5]);
      
      // Find factors of c that add up to b
      for (let i = 1; i <= Math.abs(c); i++) {
        if (c % i === 0) {
          const factor1 = i;
          const factor2 = c / i;
          if (factor1 + factor2 === b) {
            return [`(${variable}+${factor1})`, `(${variable}+${factor2})`];
          }
          if (factor1 - factor2 === b) {
            return [`(${variable}+${factor1})`, `(${variable}-${factor2})`];
          }
          if (-factor1 + factor2 === b) {
            return [`(${variable}-${factor1})`, `(${variable}+${factor2})`];
          }
        }
      }
    }
    
    // Linear expressions: ax + b
    let linearMatch = expr.match(/^(\d*)([a-z])\s*([+-]?\d+)$/i);
    if (linearMatch) {
      const coeff = Number(linearMatch[1] || 1);
      const variable = linearMatch[2];
      const constant = Number(linearMatch[3]);
      const gcd = this.calculateHCF(Math.abs(coeff), Math.abs(constant));
      if (gcd > 1) {
        return [`${gcd}`, `(${coeff/gcd}${variable}${constant >= 0 ? '+' : ''}${constant/gcd})`];
      }
    }
    
    // If no pattern matches, return the expression as is
    return [expr];
  }

  private static findCommonAlgebraicFactors(factorizations: string[][]): string[] {
    if (factorizations.length === 0) return [];
    
    const common: string[] = [];
    const firstFactors = factorizations[0];
    
    firstFactors.forEach(factor => {
      const isCommonToAll = factorizations.every(factors => 
        factors.some(f => this.areFactorsEqual(f, factor))
      );
      
      if (isCommonToAll && !common.some(c => this.areFactorsEqual(c, factor))) {
        common.push(factor);
      }
    });
    
    return common;
  }

  private static calculateAlgebraicLCM(factorizations: string[][]): string[] {
    const allFactors = new Set<string>();
    const factorCounts = new Map<string, number>();
    
    // Collect all unique factors and their maximum occurrences
    factorizations.forEach(factors => {
      const localCounts = new Map<string, number>();
      
      factors.forEach(factor => {
        allFactors.add(factor);
        localCounts.set(factor, (localCounts.get(factor) || 0) + 1);
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
    
    return lcmFactors.length > 0 ? lcmFactors : ['1'];
  }

  private static areFactorsEqual(factor1: string, factor2: string): boolean {
    // Normalize factors for comparison
    const normalize = (f: string) => f.replace(/\s/g, '').toLowerCase();
    return normalize(factor1) === normalize(factor2);
  }
}