// Enhanced arithmetic solver for accurate calculations
export const evaluateBasicArithmetic = (expression: string): string => {
  try {
    // Clean the expression
    const cleaned = expression.replace(/[^\d+\-*/().\s]/g, '');
    
    // Replace Bengali/English operators if any
    const normalized = cleaned
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\s+/g, '');
    
    // Validate expression
    if (!/^[\d+\-*/().]+$/.test(normalized)) {
      throw new Error('Invalid expression');
    }
    
    // Evaluate safely
    const result = Function('"use strict"; return (' + normalized + ')')();
    
    // Check if result is a number
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation result');
    }
    
    // Format result (handle decimals nicely)
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
    
  } catch (error) {
    throw new Error('গণনায় ভুল হয়েছে');
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