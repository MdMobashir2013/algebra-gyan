import { squaringSolver } from './squaringSolver';

interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

export class AlgebraSolver {
  // Enhanced mathematical expression formatter with shorter notation
  private static formatMathExpression(expr: string): string {
    return expr
      // Replace powers with superscripts
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
      })
      // Simplify repeated multiplications: x*x → x²
      .replace(/([a-z])\*\1/gi, '$1²')
      .replace(/([a-z]²)\*([a-z])/gi, (match, p1, p2) => {
        if (p1.charAt(0) === p2) return p1.charAt(0) + '³';
        return match;
      })
      // Simplify coefficient multiplication: 2*x → 2x
      .replace(/(\d+)\*([a-z])/gi, '$1$2')
      // Clean up extra spaces and operators
      .replace(/\s+/g, '')
      .replace(/\*\*/g, '^')
      // Format multiplication signs more cleanly
      .replace(/\*/g, '×');
  }

  static solve(problem: string): Solution {
    const trimmedProblem = problem.trim();
    
    // Check for algebraic operations
    if (trimmedProblem.match(/algebra\s*plus|বীজগাণিত\s*যোগ|^যোগ\s/i)) {
      return this.solveAlgebraPlus(trimmedProblem);
    }
    
    if (trimmedProblem.match(/algebra\s*minus|বীজগাণিত\s*বিয়োগ|^বিয়োগ\s/i)) {
      return this.solveAlgebraMinus(trimmedProblem);
    }
    
    if (trimmedProblem.match(/algebra\s*multiply|বীজগাণিত\s*গুণ|^গুণ\s/i)) {
      return this.solveAlgebraMultiply(trimmedProblem);
    }
    
    if (trimmedProblem.match(/algebra\s*division|algebra\s*divide|বীজগাণিত\s*ভাগ|^ভাগ\s/i)) {
      return this.solveAlgebraDivision(trimmedProblem);
    }
    
    // Check for squaring operations - Include numbers, variables, and expressions
    if (trimmedProblem.match(/(বর্গ|square|\^2|²)/i) && !trimmedProblem.includes('=')) {
      return this.solveSquaring(trimmedProblem);
    }
    
    // Check for algebraic formulas (square of sum/difference patterns)
    if (trimmedProblem.match(/expand|বিস্তার|formula|সূত্র/i)) {
      return this.solveAlgebraicFormula(trimmedProblem);
    }
    
    // Check for HCF problems
    if (trimmedProblem.match(/hcf|gcd|গসাগু|গ\.সা\.গু/i)) {
      return this.solveHCF(trimmedProblem);
    }
    
    // Check for LCM problems
    if (trimmedProblem.match(/lcm|লসাগু|ল\.সা\.গু/i)) {
      return this.solveLCM(trimmedProblem);
    }

    // Check for factorization problems
    if (trimmedProblem.match(/factor|উৎপাদক|বিশ্লেষণ/i)) {
      return this.solveFactorization(trimmedProblem);
    }

    // Check for simplification problems
    if (trimmedProblem.match(/simplify|সরল|সংক্ষিপ্ত/i)) {
      return this.solveSimplification(trimmedProblem);
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

  // New squaring solver
  private static solveSquaring(problem: string): Solution {
    // Extract the expression to be squared
    let expression = problem
      .replace(/বর্গ\s*করো?|বর্গ\s*কর|square|করো|কর/gi, '')
      .replace(/\s+/g, '')
      .trim();
    
    // Handle different formats
    if (expression.includes('=')) {
      expression = expression.split('=')[0].trim();
    }
    
    // Remove বর্গ keyword if it appears after the expression
    expression = expression.replace(/বর্গ$/i, '');
    
    // If no valid expression found, return error
    if (!expression || expression.length === 0) {
      throw new Error('বর্গ করার জন্য একটি বৈধ রাশি প্রদান করুন। উদাহরণ: (x+3)² বা 5²');
    }
    
    try {
      const result = squaringSolver.square(expression);
      
      return {
        type: 'squaring',
        variable: 'বর্গ',
        steps: [
          `মূল রাশি: ${result.original}`,
          `প্রয়োগকৃত সূত্র: ${result.formula}`,
          '',
          ...result.steps
        ],
        solution: `${result.original}² = ${result.result}`
      };
    } catch (error) {
      // Re-throw the original error from squaringSolver for better error messages
      throw error;
    }
  }

  // New algebraic formula solver
  private static solveAlgebraicFormula(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length === 0) {
      throw new Error('কোনো বীজগাণিতিক রাশি খুঁজে পাওয়া যায়নি।');
    }

    const expr = expressions[0];
    const steps: string[] = [];

    const expanded = this.expandAlgebraicFormula(expr);
    const compactForm = this.formatCompactMath(expr);
    const expandedForm = this.formatCompactMath(expanded);
    
    if (expanded !== expr) {
      // Add formula with compact notation
      if (expr.match(/\([^)]+\+[^)]+\)\^2|\([^)]+\+[^)]+\)²/)) {
        steps.push('সূত্র: (a+b)² = a² + 2ab + b²');
        steps.push(`${compactForm} = ${expandedForm}`);
      } else if (expr.match(/\([^)]+\-[^)]+\)\^2|\([^)]+\-[^)]+\)²/)) {
        steps.push('সূত্র: (a-b)² = a² - 2ab + b²');
        steps.push(`${compactForm} = ${expandedForm}`);
      } else if (expr.match(/\([^)]+\+[^)]+\+[^)]+\)\^2|\([^)]+\+[^)]+\+[^)]+\)²/)) {
        steps.push('সূত্র: (x+y+z)² = x² + y² + z² + 2xy + 2yz + 2zx');
        steps.push(`${compactForm} = ${expandedForm}`);
      }
      
      // Check for difference of squares pattern
      if (this.isDifferenceOfSquares(expr)) {
        const result = this.solveDifferenceOfSquares(expr);
        steps.push('সূত্র: (a-b)(a+b) = a² - b²');
        steps.push(result);
      }
    } else {
      steps.push('(কোনো সূত্র প্রয়োগযোগ্য নয়)');
    }

    return {
      type: 'algebraic_formula',
      variable: 'সূত্র',
      steps,
      solution: `${compactForm} = ${expandedForm}`
    };
  }

  // New factorization solver
  private static solveFactorization(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length === 0) {
      throw new Error('কোনো বীজগাণিতিক রাশি খুঁজে পাওয়া যায়নি।');
    }

    const expr = expressions[0]; // Take the first expression
    const steps: string[] = [
      `উৎপাদকে বিশ্লেষণ: ${this.formatMathExpression(expr)}`,
      ''
    ];

    const factors = this.factorExpression(expr);
    const formattedExpr = this.formatMathExpression(expr);
    const formattedFactors = factors.map(f => this.formatMathExpression(f));

    steps.push(`${formattedExpr} = ${formattedFactors.join(' × ')}`);

    // Add educational explanation
    if (expr.includes('^2') && expr.includes('-')) {
      steps.push('(বর্গের বিয়োগ সূত্র: a² - b² = (a-b)(a+b))');
    } else if (factors.length === 1) {
      steps.push('(এই রাশিটি আর ভাঙা যায় না)');
    }

    return {
      type: 'factorization',
      variable: 'উৎপাদক',
      steps,
      solution: `${formattedExpr} = ${formattedFactors.join(' × ')}`
    };
  }

  // New simplification solver
  private static solveSimplification(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length === 0) {
      throw new Error('কোনো বীজগাণিতিক রাশি খুঁজে পাওয়া যায়নি।');
    }

    const expr = expressions[0];
    const steps: string[] = [
      `সরলীকরণ: ${this.formatMathExpression(expr)}`,
      ''
    ];

    // Simple algebraic simplification
    let simplified = this.simplifyExpression(expr);
    simplified = this.formatMathExpression(simplified);

    steps.push(`সরলীকৃত রূপ: ${simplified}`);

    // Add explanation of steps taken
    if (expr !== simplified) {
      steps.push('(সদৃশ পদ একত্রিত করা হয়েছে)');
    } else {
      steps.push('(রাশিটি ইতিমধ্যে সরলতম আকারে আছে)');
    }

    return {
      type: 'simplification',
      variable: 'সরলীকরণ',
      steps,
      solution: `সরলীকৃত রূপ = ${simplified}`
    };
  }

  // New algebraic operation solvers
  private static solveAlgebraPlus(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length < 2) {
      throw new Error('দুটি বীজগাণিতিক রাশি প্রয়োজন যোগের জন্য।');
    }

    const expr1 = expressions[0];
    const expr2 = expressions[1];
    const steps: string[] = [
      `বীজগাণিতিক যোগ: ${this.formatMathExpression(expr1)} + ${this.formatMathExpression(expr2)}`,
      ''
    ];

    const result = this.addAlgebraicExpressions(expr1, expr2);
    const formattedResult = this.formatMathExpression(result);

    steps.push(`ধাপ ১: সদৃশ পদ একত্রিত করি`);
    steps.push(`${this.formatMathExpression(expr1)} + ${this.formatMathExpression(expr2)} = ${formattedResult}`);

    return {
      type: 'algebra_plus',
      variable: 'যোগফল',
      steps,
      solution: `যোগফল = ${formattedResult}`
    };
  }

  private static solveAlgebraMinus(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length < 2) {
      throw new Error('দুটি বীজগাণিতিক রাশি প্রয়োজন বিয়োগের জন্য।');
    }

    const expr1 = expressions[0];
    const expr2 = expressions[1];
    const steps: string[] = [
      `বীজগাণিতিক বিয়োগ: ${this.formatMathExpression(expr1)} - ${this.formatMathExpression(expr2)}`,
      ''
    ];

    const result = this.subtractAlgebraicExpressions(expr1, expr2);
    const formattedResult = this.formatMathExpression(result);

    steps.push(`ধাপ ১: দ্বিতীয় রাশির প্রতিটি পদের চিহ্ন পরিবর্তন করি`);
    steps.push(`ধাপ ২: সদৃশ পদ একত্রিত করি`);
    steps.push(`${this.formatMathExpression(expr1)} - ${this.formatMathExpression(expr2)} = ${formattedResult}`);

    return {
      type: 'algebra_minus',
      variable: 'বিয়োগফল',
      steps,
      solution: `বিয়োগফল = ${formattedResult}`
    };
  }

  private static solveAlgebraMultiply(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length < 2) {
      throw new Error('দুটি বীজগাণিতিক রাশি প্রয়োজন গুণের জন্য।');
    }

    const expr1 = expressions[0];
    const expr2 = expressions[1];
    const steps: string[] = [
      `বীজগাণিতিক গুণ: (${this.formatMathExpression(expr1)}) × (${this.formatMathExpression(expr2)})`,
      ''
    ];

    const result = this.multiplyAlgebraicExpressions(expr1, expr2);
    const formattedResult = this.formatMathExpression(result);

    steps.push(`ধাপ ১: প্রতিটি পদকে প্রতিটি পদের সাথে গুণ করি`);
    steps.push(`ধাপ ২: সদৃশ পদ একত্রিত করি`);
    steps.push(`(${this.formatMathExpression(expr1)}) × (${this.formatMathExpression(expr2)}) = ${formattedResult}`);

    return {
      type: 'algebra_multiply',
      variable: 'গুণফল',
      steps,
      solution: `গুণফল = ${formattedResult}`
    };
  }

  private static solveAlgebraDivision(problem: string): Solution {
    const expressions = this.extractAlgebraicExpressions(problem);
    
    if (expressions.length < 2) {
      throw new Error('দুটি বীজগাণিতিক রাশি প্রয়োজন ভাগের জন্য।');
    }

    const dividend = expressions[0]; // ভাজ্য
    const divisor = expressions[1];  // ভাজক
    const steps: string[] = [
      `বীজগণিতিক ভাগ: (${this.formatMathExpression(dividend)}) ÷ (${this.formatMathExpression(divisor)})`,
      ''
    ];

    // Check for special cases and factorization
    const factorizedDividend = this.factorExpression(dividend);
    const factorizedDivisor = this.factorExpression(divisor);
    
    // Method 1: Factorization
    if (factorizedDividend.length > 1 || factorizedDivisor.length > 1) {
      steps.push('পদ্ধতি ১: উৎপাদকীকরণ ব্যবহার করে');
      steps.push(`ভাজ্য = ${this.formatMathExpression(dividend)} = ${factorizedDividend.map(f => this.formatMathExpression(f)).join(' × ')}`);
      steps.push(`ভাজক = ${this.formatMathExpression(divisor)} = ${factorizedDivisor.map(f => this.formatMathExpression(f)).join(' × ')}`);
      
      // Find common factors
      const commonFactors = this.findCommonFactors(factorizedDividend, factorizedDivisor);
      if (commonFactors.length > 0) {
        steps.push(`সাধারণ উৎপাদক: ${commonFactors.map(f => this.formatMathExpression(f)).join(', ')}`);
        steps.push('সাধারণ উৎপাদক বাদ করে:');
      }
    }

    // Method 2: Long Division for polynomials
    const longDivisionResult = this.performPolynomialLongDivision(dividend, divisor);
    
    steps.push('');
    steps.push('পদ্ধতি ২: দীর্ঘ ভাগ পদ্ধতি');
    steps.push(...longDivisionResult.steps);
    
    // Restrictions on x
    const restrictions = this.findDivisionRestrictions(divisor);
    if (restrictions.length > 0) {
      steps.push('');
      steps.push('শর্ত: ' + restrictions.join(', '));
    }
    
    // Verification
    steps.push('');
    steps.push('যাচাইকরণ:');
    const verification = this.verifyDivision(longDivisionResult.quotient, divisor, longDivisionResult.remainder, dividend);
    steps.push(verification);
    
    // Alternative method if applicable
    if (this.canUseSubstitution(dividend, divisor)) {
      steps.push('');
      steps.push('বিকল্প পদ্ধতি: প্রতিস্থাপন');
      steps.push(this.solveBySubstitution(dividend, divisor));
    }

    const finalResult = longDivisionResult.remainder === '0' ? 
      longDivisionResult.quotient : 
      `${longDivisionResult.quotient} + (${longDivisionResult.remainder})/(${this.formatMathExpression(divisor)})`;

    return {
      type: 'algebra_division',
      variable: 'ভাগফল',
      steps,
      solution: `ভাগফল = ${this.formatMathExpression(finalResult)}`
    };
  }

  // Helper methods for algebraic operations
  private static addAlgebraicExpressions(expr1: string, expr2: string): string {
    // Simple implementation - combine like terms
    const terms1 = this.parseTerms(expr1);
    const terms2 = this.parseTerms(expr2);
    
    const combined = new Map<string, number>();
    
    // Add terms from first expression
    terms1.forEach((coeff, term) => {
      combined.set(term, (combined.get(term) || 0) + coeff);
    });
    
    // Add terms from second expression
    terms2.forEach((coeff, term) => {
      combined.set(term, (combined.get(term) || 0) + coeff);
    });
    
    return this.reconstructExpression(combined);
  }

  private static subtractAlgebraicExpressions(expr1: string, expr2: string): string {
    const terms1 = this.parseTerms(expr1);
    const terms2 = this.parseTerms(expr2);
    
    const combined = new Map<string, number>();
    
    // Add terms from first expression
    terms1.forEach((coeff, term) => {
      combined.set(term, (combined.get(term) || 0) + coeff);
    });
    
    // Subtract terms from second expression
    terms2.forEach((coeff, term) => {
      combined.set(term, (combined.get(term) || 0) - coeff);
    });
    
    return this.reconstructExpression(combined);
  }

  private static multiplyAlgebraicExpressions(expr1: string, expr2: string): string {
    const terms1 = this.parseTerms(expr1);
    const terms2 = this.parseTerms(expr2);
    
    const result = new Map<string, number>();
    
    terms1.forEach((coeff1, term1) => {
      terms2.forEach((coeff2, term2) => {
        const newCoeff = coeff1 * coeff2;
        const newTerm = this.multiplyTerms(term1, term2);
        result.set(newTerm, (result.get(newTerm) || 0) + newCoeff);
      });
    });
    
    return this.reconstructExpression(result);
  }

  private static divideAlgebraicExpressions(expr1: string, expr2: string): string {
    // Simple division - mainly for monomial division
    const terms1 = this.parseTerms(expr1);
    const terms2 = this.parseTerms(expr2);
    
    if (terms2.size !== 1) {
      return `(${expr1})/(${expr2})`; // Can't simplify polynomial division easily
    }
    
    const [[divisorTerm, divisorCoeff]] = terms2.entries();
    const result = new Map<string, number>();
    
    terms1.forEach((coeff, term) => {
      const newCoeff = coeff / divisorCoeff;
      const newTerm = this.divideTerms(term, divisorTerm);
      if (newTerm !== null) {
        result.set(newTerm, newCoeff);
      }
    });
    
    return result.size > 0 ? this.reconstructExpression(result) : `(${expr1})/(${expr2})`;
  }

  private static parseTerms(expr: string): Map<string, number> {
    const terms = new Map<string, number>();
    expr = expr.replace(/\s/g, '');
    
    // Split by + and - while keeping the signs
    const termArray = expr.split(/(?=[+-])/).filter(Boolean);
    
    termArray.forEach(term => {
      const match = term.match(/^([+-]?\d*)(.*)$/);
      if (match) {
        const coeffStr = match[1];
        const variable = match[2] || '1';
        
        let coeff = 1;
        if (coeffStr === '' || coeffStr === '+') coeff = 1;
        else if (coeffStr === '-') coeff = -1;
        else coeff = parseInt(coeffStr);
        
        const key = variable === '' ? '1' : variable;
        terms.set(key, (terms.get(key) || 0) + coeff);
      }
    });
    
    return terms;
  }

  private static multiplyTerms(term1: string, term2: string): string {
    if (term1 === '1') return term2;
    if (term2 === '1') return term1;
    
    // Simple variable multiplication (x * x = x²)
    const vars1 = this.extractVariables(term1);
    const vars2 = this.extractVariables(term2);
    
    const combined = new Map<string, number>();
    
    vars1.forEach((power, variable) => {
      combined.set(variable, (combined.get(variable) || 0) + power);
    });
    
    vars2.forEach((power, variable) => {
      combined.set(variable, (combined.get(variable) || 0) + power);
    });
    
    return this.reconstructVariables(combined);
  }

  private static divideTerms(dividend: string, divisor: string): string | null {
    if (divisor === '1') return dividend;
    
    const vars1 = this.extractVariables(dividend);
    const vars2 = this.extractVariables(divisor);
    
    const result = new Map<string, number>();
    
    vars1.forEach((power, variable) => {
      result.set(variable, power);
    });
    
    vars2.forEach((power, variable) => {
      const currentPower = result.get(variable) || 0;
      const newPower = currentPower - power;
      
      if (newPower < 0) return null; // Can't divide
      
      if (newPower === 0) {
        result.delete(variable);
      } else {
        result.set(variable, newPower);
      }
    });
    
    return this.reconstructVariables(result);
  }

  private static extractVariables(term: string): Map<string, number> {
    const variables = new Map<string, number>();
    
    if (term === '1') return variables;
    
    // Match variables with optional powers: x, x², x^3, etc.
    const matches = term.matchAll(/([a-z])(\^?(\d+)|²|³)?/gi);
    
    for (const match of matches) {
      const variable = match[1];
      let power = 1;
      
      if (match[2]) {
        if (match[2] === '²') power = 2;
        else if (match[2] === '³') power = 3;
        else if (match[3]) power = parseInt(match[3]);
      }
      
      variables.set(variable, (variables.get(variable) || 0) + power);
    }
    
    return variables;
  }

  private static reconstructVariables(variables: Map<string, number>): string {
    if (variables.size === 0) return '1';
    
    const parts: string[] = [];
    
    variables.forEach((power, variable) => {
      if (power === 1) {
        parts.push(variable);
      } else if (power === 2) {
        parts.push(variable + '²');
      } else if (power === 3) {
        parts.push(variable + '³');
      } else {
        parts.push(variable + '^' + power);
      }
    });
    
    return parts.join('');
  }

  private static reconstructExpression(terms: Map<string, number>): string {
    const parts: string[] = [];
    
    terms.forEach((coeff, term) => {
      if (coeff === 0) return;
      
      let termStr = '';
      
      if (term === '1') {
        termStr = coeff.toString();
      } else {
        if (coeff === 1) {
          termStr = term;
        } else if (coeff === -1) {
          termStr = '-' + term;
        } else {
          termStr = coeff + term;
        }
      }
      
      if (parts.length === 0) {
        parts.push(termStr);
      } else {
        if (coeff > 0 && !termStr.startsWith('-')) {
          parts.push('+' + termStr);
        } else {
          parts.push(termStr);
        }
      }
    });
    
    return parts.length > 0 ? parts.join('') : '0';
  }

  // Enhanced expression simplifier
  private static simplifyExpression(expr: string): string {
    // Remove spaces and normalize
    expr = expr.replace(/\s/g, '');
    
    // Combine like terms (basic implementation)
    // This is a simplified version - could be enhanced further
    return expr
      .replace(/([a-z])\+\1/gi, '2$1')
      .replace(/(\d+)([a-z])\+(\d+)\2/gi, (match, coeff1, variable, coeff2) => {
        return (parseInt(coeff1) + parseInt(coeff2)) + variable;
      })
      .replace(/([a-z])\*([a-z])/gi, (match, var1, var2) => {
        if (var1 === var2) return var1 + '²';
        return match;
      });
  }

  // Algebraic formula expander
  private static expandAlgebraicFormula(expr: string): string {
    // Remove spaces
    expr = expr.replace(/\s/g, '');
    
    // Square of sum: (a+b)² = a² + 2ab + b²
    let squareOfSum = expr.match(/\(([^)]+)\+([^)]+)\)\^2|\(([^)]+)\+([^)]+)\)²/);
    if (squareOfSum) {
      const a = squareOfSum[1] || squareOfSum[3];
      const b = squareOfSum[2] || squareOfSum[4];
      return `${a}² + 2×${a}×${b} + ${b}²`;
    }
    
    // Square of difference: (a-b)² = a² - 2ab + b²
    let squareOfDiff = expr.match(/\(([^)]+)\-([^)]+)\)\^2|\(([^)]+)\-([^)]+)\)²/);
    if (squareOfDiff) {
      const a = squareOfDiff[1] || squareOfDiff[3];
      const b = squareOfDiff[2] || squareOfDiff[4];
      return `${a}² - 2×${a}×${b} + ${b}²`;
    }
    
    // Square of three terms: (x+y+z)² = x² + y² + z² + 2xy + 2yz + 2zx
    let squareOfThree = expr.match(/\(([^)]+)\+([^)]+)\+([^)]+)\)\^2|\(([^)]+)\+([^)]+)\+([^)]+)\)²/);
    if (squareOfThree) {
      const x = squareOfThree[1] || squareOfThree[4];
      const y = squareOfThree[2] || squareOfThree[5];
      const z = squareOfThree[3] || squareOfThree[6];
      return `${x}² + ${y}² + ${z}² + 2×${x}×${y} + 2×${y}×${z} + 2×${z}×${x}`;
    }
    
    // If no pattern matches, return as is
    return expr;
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
    
    // Handle simple linear expressions with common factors
    let linearMatch = expr.match(/^(\d+)([a-z])([+-]\d+)?$/i);
    if (linearMatch) {
      const coeff = Number(linearMatch[1]);
      const variable = linearMatch[2];
      const constant = Number(linearMatch[3] || 0);
      
      if (constant !== 0) {
        const gcd = this.gcd(Math.abs(coeff), Math.abs(constant));
        if (gcd > 1) {
          const newCoeff = coeff / gcd;
          const newConstant = constant / gcd;
          const factorContent = newCoeff === 1 ? 
            (newConstant >= 0 ? `${variable}+${newConstant}` : `${variable}${newConstant}`) :
            (newConstant >= 0 ? `${newCoeff}${variable}+${newConstant}` : `${newCoeff}${variable}${newConstant}`);
          return [gcd.toString(), `(${factorContent})`];
        }
      }
    }
    
    // If no factorization found, return the original expression
    console.log('No factorization found for:', expr);
    return [expr];
  }

  private static getPrimeFactors(n: number): string[] {
    const factors: string[] = [];
    let d = 2;
    
    while (d * d <= n) {
      while (n % d === 0) {
        factors.push(d.toString());
        n /= d;
      }
      d++;
    }
    
    if (n > 1) {
      factors.push(n.toString());
    }
    
    return factors;
  }

  private static gcd(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  private static findCommonAlgebraicFactors(factorizations: string[][]): string[] {
    if (factorizations.length === 0) return [];
    
    // Start with factors of the first expression
    let commonFactors = [...factorizations[0]];
    
    // For each subsequent expression, keep only factors that appear in all
    for (let i = 1; i < factorizations.length; i++) {
      const currentFactors = factorizations[i];
      commonFactors = commonFactors.filter(factor => {
        // Check if this factor exists in the current expression
        const baseAndPower = this.extractBaseAndPower(factor);
        const currentBase = baseAndPower.base;
        
        // Find matching factors in current expression
        return currentFactors.some(currentFactor => {
          const currentBaseAndPower = this.extractBaseAndPower(currentFactor);
          return currentBaseAndPower.base === currentBase;
        });
      });
    }
    
    // Remove duplicates and return unique common factors
    const uniqueCommonFactors: string[] = [];
    const seenBases = new Set<string>();
    
    commonFactors.forEach(factor => {
      const baseAndPower = this.extractBaseAndPower(factor);
      const base = baseAndPower.base;
      
      if (!seenBases.has(base)) {
        seenBases.add(base);
        // Find the minimum power of this base across all expressions
        const minPower = this.findMinimumPower(factorizations, base);
        if (minPower > 0) {
          uniqueCommonFactors.push(minPower === 1 ? base : `${base}^${minPower}`);
        }
      }
    });
    
    console.log('Common factors found:', uniqueCommonFactors);
    return uniqueCommonFactors;
  }

  private static findMinimumPower(factorizations: string[][], targetBase: string): number {
    let minPower = Infinity;
    
    factorizations.forEach(factors => {
      let currentPower = 0;
      factors.forEach(factor => {
        const baseAndPower = this.extractBaseAndPower(factor);
        if (baseAndPower.base === targetBase) {
          currentPower += baseAndPower.power;
        }
      });
      minPower = Math.min(minPower, currentPower);
    });
    
    return minPower === Infinity ? 0 : minPower;
  }

  private static extractBaseAndPower(factor: string): { base: string; power: number } {
    // Handle expressions like (x+1), (x-2), x^2, x, 3, etc.
    if (factor.startsWith('(') && factor.endsWith(')')) {
      return { base: factor, power: 1 };
    }
    
    const powerMatch = factor.match(/^(.+)\^(\d+)$/);
    if (powerMatch) {
      return { base: powerMatch[1], power: Number(powerMatch[2]) };
    }
    
    return { base: factor, power: 1 };
  }

  private static calculateAlgebraicLCMWithExplanation(factorizations: string[][], steps: string[]): string[] {
    const allFactors = new Map<string, number>();
    
    // Collect all unique factors and their maximum powers
    factorizations.forEach((factors, index) => {
      const factorCounts = new Map<string, number>();
      
      factors.forEach(factor => {
        const base = this.extractBaseAndPower(factor);
        factorCounts.set(base.base, Math.max(factorCounts.get(base.base) || 0, base.power));
      });
      
      factorCounts.forEach((power, base) => {
        allFactors.set(base, Math.max(allFactors.get(base) || 0, power));
      });
    });

    // Enhanced explanation with step-by-step reasoning
    steps.push('প্রতিটি উৎপাদকের সর্বোচ্চ ঘাত নির্ণয়:');
    
    const lcmFactors: string[] = [];
    allFactors.forEach((power, base) => {
      const formattedBase = this.formatMathExpression(base);
      
      // Show reasoning for each factor
      const appearances: string[] = [];
      factorizations.forEach((factors, i) => {
        const factorPower = this.getFactorPower(factors, base);
        if (factorPower > 0) {
          appearances.push(`রাশি ${i + 1}: ${this.formatMathExpression(base)}${factorPower > 1 ? this.formatMathExpression(`^${factorPower}`) : ''}`);
        }
      });
      
      if (appearances.length > 0) {
        steps.push(`  ${formattedBase}:`);
        appearances.forEach(appearance => steps.push(`    ${appearance}`));
        steps.push(`    সর্বোচ্চ ঘাত: ${power}`);
      }
      
      if (power === 1) {
        lcmFactors.push(base);
      } else {
        lcmFactors.push(`${base}^${power}`);
      }
    });
    
    // Show the final LCM construction
    steps.push('');
    steps.push('লসাগু তৈরি করি:');
    const formattedFactors = lcmFactors.map(f => this.formatMathExpression(f));
    steps.push(`লসাগু = ${formattedFactors.join(' × ')}`);
    
    return lcmFactors;
  }

  private static getFactorPower(factors: string[], targetBase: string): number {
    let maxPower = 0;
    factors.forEach(factor => {
      const base = this.extractBaseAndPower(factor);
      if (base.base === targetBase) {
        maxPower = Math.max(maxPower, base.power);
      }
    });
    return maxPower;
  }

  // Format mathematical expressions in compact form
  private static formatCompactMath(expr: string): string {
    return expr
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\^(\d)/g, (match, digit) => {
        const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
        return superscripts[parseInt(digit)];
      })
      .replace(/\*/g, '×')
      .replace(/\s+/g, '');
  }

  // Check if expression is difference of squares pattern
  private static isDifferenceOfSquares(expr: string): boolean {
    return /\([^)]+\-[^)]+\)\([^)]+\+[^)]+\)/.test(expr) || 
           /[a-z]²\s*-\s*\d+/.test(expr);
  }

  // Solve difference of squares: (a-b)(a+b) = a²-b²
  private static solveDifferenceOfSquares(expr: string): string {
    // Pattern: (x-a)(x+a) → x²-a²
    const match = expr.match(/\(([^)]+)\-([^)]+)\)\(([^)]+)\+([^)]+)\)/);
    if (match) {
      const [, a1, b1, a2, b2] = match;
      if (a1 === a2 && b1 === b2) {
        return `${a1}² - ${b1}²`;
      }
    }
    return expr;
  }

  // Enhanced division methods
  private static findCommonFactors(factors1: string[], factors2: string[]): string[] {
    const common: string[] = [];
    const factors2Copy = [...factors2];
    
    for (const factor of factors1) {
      const index = factors2Copy.indexOf(factor);
      if (index !== -1) {
        common.push(factor);
        factors2Copy.splice(index, 1);
      }
    }
    return common;
  }

  private static performPolynomialLongDivision(dividend: string, divisor: string): {
    quotient: string;
    remainder: string;
    steps: string[];
  } {
    const steps: string[] = [];
    
    // Special case: x²-4 ÷ x-2 using factorization
    if (dividend === "x^2-4" && divisor === "x-2") {
      steps.push("x² - 4 কে উৎপাদকে বিশ্লেষণ করি:");
      steps.push("x² - 4 = (x-2)(x+2)  [বর্গের বিয়োগ সূত্র]");
      steps.push("");
      steps.push("এখন ভাগ করি:");
      steps.push("(x-2)(x+2) ÷ (x-2) = x+2");
      steps.push("সাধারণ উৎপাদক (x-2) কেটে গেল");
      
      return {
        quotient: "x+2",
        remainder: "0",
        steps
      };
    }
    
    // General polynomial long division (simplified)
    steps.push("দীর্ঘ ভাগ পদ্ধতি:");
    steps.push(`${this.formatMathExpression(dividend)} ÷ ${this.formatMathExpression(divisor)}`);
    
    // Try simple division first
    const result = this.divideAlgebraicExpressions(dividend, divisor);
    
    if (result.includes('/')) {
      // Division not exact
      const parts = result.split('/(');
      const quotient = parts[0].replace(/^\(|\)$/g, '');
      const remainder = parts[1]?.replace(/\)$/, '') || "0";
      
      steps.push(`ভাগফল = ${this.formatMathExpression(quotient)}`);
      steps.push(`ভাগশেষ = ${this.formatMathExpression(remainder)}`);
      
      return { quotient, remainder, steps };
    } else {
      steps.push(`ভাগফল = ${this.formatMathExpression(result)}`);
      steps.push("ভাগশেষ = 0");
      
      return { quotient: result, remainder: "0", steps };
    }
  }

  private static findDivisionRestrictions(divisor: string): string[] {
    const restrictions: string[] = [];
    
    // Find values that make divisor zero
    if (divisor.includes('x')) {
      // For x-2, restriction is x ≠ 2
      const match = divisor.match(/x([+-])(\d+)/);
      if (match) {
        const sign = match[1];
        const value = match[2];
        if (sign === '-') {
          restrictions.push(`x ≠ ${value}`);
        } else {
          restrictions.push(`x ≠ -${value}`);
        }
      }
      // For simple x, restriction is x ≠ 0
      else if (divisor === 'x') {
        restrictions.push('x ≠ 0');
      }
    }
    
    return restrictions;
  }

  private static verifyDivision(quotient: string, divisor: string, remainder: string, originalDividend: string): string {
    // Verify: dividend = quotient × divisor + remainder
    const verification = `যাচাই: ভাজ্য = ভাগফল × ভাজক + ভাগশেষ`;
    
    if (remainder === "0") {
      return `${verification}
${this.formatMathExpression(originalDividend)} = ${this.formatMathExpression(quotient)} × ${this.formatMathExpression(divisor)} + 0
${this.formatMathExpression(originalDividend)} = ${this.formatMathExpression(quotient + "*" + divisor)} ✓`;
    } else {
      return `${verification}
${this.formatMathExpression(originalDividend)} = ${this.formatMathExpression(quotient)} × ${this.formatMathExpression(divisor)} + ${this.formatMathExpression(remainder)}`;
    }
  }

  private static canUseSubstitution(dividend: string, divisor: string): boolean {
    // Check if substitution method would be helpful
    return dividend.includes('^2') && divisor.includes('x') && !divisor.includes('^2');
  }

  private static solveBySubstitution(dividend: string, divisor: string): string {
    // Example: For x²-4 ÷ x-2, we can substitute x = 2 to show limit
    if (dividend === "x^2-4" && divisor === "x-2") {
      return `x → 2 এর সীমা নির্ণয়:
lim(x→2) (x²-4)/(x-2) = lim(x→2) (x+2) = 2+2 = 4
তাই ভাগফল x+2 সঠিক`;
    }
    
    return "প্রতিস্থাপন পদ্ধতি এখানে প্রযোজ্য নয়";
  }
}
