interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

export class AlgebraSolver {
  static solve(problem: string): Solution {
    const equation = problem.replace(/\s/g, '');

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
    return this.solveLinear(left, right, problem);
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
}