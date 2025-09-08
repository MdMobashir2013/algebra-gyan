// Enhanced arithmetic solver for accurate calculations
export const evaluateBasicArithmetic = (expression: string): string => {
  try {
    // Convert Bengali numerals to English if present
    let cleaned = expression
      .replace(/[০-৯]/g, (match) => {
        const bengaliNumerals = '০১২৩৪৫৬৭৮৯';
        return bengaliNumerals.indexOf(match).toString();
      })
      .replace(/[^\d+\-*/().\s]/g, '');
    
    // Replace various operators with standard ones
    cleaned = cleaned
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\s+/g, '');
    
    // Validate expression contains only valid characters
    if (!/^[\d+\-*/().]+$/.test(cleaned)) {
      throw new Error('Invalid expression format');
    }
    
    // Enhanced validation to prevent malicious code
    if (cleaned.includes('--') || cleaned.includes('++') || 
        cleaned.match(/[*/]{2,}/) || cleaned.match(/[+\-*/]{3,}/)) {
      throw new Error('Invalid operation sequence');
    }
    
    // Evaluate using a safer method
    const result = new Function('"use strict"; return (' + cleaned + ')')();
    
    // Comprehensive result validation
    if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) {
      throw new Error('Invalid calculation result');
    }
    
    // Enhanced formatting with better decimal handling
    if (Number.isInteger(result)) {
      return result.toString();
    } else {
      // Round to reasonable decimal places
      const rounded = Math.round(result * 1000000) / 1000000;
      return rounded.toString();
    }
    
  } catch (error) {
    throw new Error('গণনায় ভুল হয়েছে - সঠিক ফরম্যাট ব্যবহার করুন');
  }
};

// Verify equation solution
export const verifySolution = (equation: string, solution: string): boolean => {
  try {
    // Extract left and right sides of equation
    const [left, right] = equation.split('=').map(s => s.trim());
    
    // Replace x with the solution value
    const leftSide = left.replace(/x/g, `(${solution})`);
    const rightSide = right.replace(/x/g, `(${solution})`);
    
    // Evaluate both sides
    const leftValue = Function('"use strict"; return (' + leftSide + ')')();
    const rightValue = Function('"use strict"; return (' + rightSide + ')')();
    
    // Check if they're approximately equal (accounting for floating point errors)
    return Math.abs(leftValue - rightValue) < 0.0001;
    
  } catch (error) {
    return false;
  }
};