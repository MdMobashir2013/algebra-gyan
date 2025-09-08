// বর্গ করার সোলভার - ধাপে ধাপে সূত্র ব্যবহার করে
export interface SquaringResult {
  original: string;
  steps: string[];
  result: string;
  formula: string;
  type: 'binomial' | 'trinomial' | 'number' | 'variable';
}

export const squaringSolver = {
  // প্রধান বর্গ করার ফাংশন
  square: (expression: string): SquaringResult => {
    const cleaned = expression.trim().replace(/\s+/g, '');
    
    // সংখ্যা বর্গ করা
    if (/^\d+$/.test(cleaned)) {
      return squareNumber(cleaned);
    }
    
    // চলরাশি বর্গ করা (x, y ইত্যাদি)
    if (/^[a-z]$/.test(cleaned)) {
      return squareVariable(cleaned);
    }
    
    // দ্বিপদী বর্গ করা (a+b) বা (a-b)
    if (/^\([^)]+[\+\-][^)]+\)$/.test(cleaned)) {
      return squareBinomial(cleaned);
    }
    
    // ত্রিপদী বর্গ করা (a+b+c)
    if (/^\([^)]+[\+\-][^)]+[\+\-][^)]+\)$/.test(cleaned)) {
      return squareTrinomial(cleaned);
    }
    
    // সহগসহ চলরাশি (2x, 3y ইত্যাদি)
    if (/^\d*[a-z]$/.test(cleaned)) {
      return squareVariableWithCoefficient(cleaned);
    }
    
    throw new Error('অসমর্থিত বীজগাণিতিক রাশি');
  }
};

// সংখ্যা বর্গ করা
function squareNumber(num: string): SquaringResult {
  const n = parseInt(num);
  const result = n * n;
  
  return {
    original: num,
    steps: [
      `${num}² = ${num} × ${num}`,
      `= ${result}`
    ],
    result: result.toString(),
    formula: 'a² = a × a',
    type: 'number'
  };
}

// চলরাশি বর্গ করা
function squareVariable(variable: string): SquaringResult {
  return {
    original: variable,
    steps: [
      `${variable}² = ${variable} × ${variable}`,
      `= ${variable}²`
    ],
    result: `${variable}²`,
    formula: 'x² = x × x',
    type: 'variable'
  };
}

// সহগসহ চলরাশি বর্গ করা
function squareVariableWithCoefficient(expr: string): SquaringResult {
  const match = expr.match(/^(\d*)([a-z])$/);
  if (!match) throw new Error('ভুল ফরম্যাট');
  
  const coeff = match[1] || '1';
  const variable = match[2];
  const coeffNum = parseInt(coeff);
  const coeffSquared = coeffNum * coeffNum;
  
  return {
    original: expr,
    steps: [
      `(${expr})² = (${coeff} × ${variable})²`,
      `= ${coeff}² × ${variable}²`,
      `= ${coeffSquared} × ${variable}²`,
      `= ${coeffSquared}${variable}²`
    ],
    result: `${coeffSquared}${variable}²`,
    formula: '(ax)² = a²x²',
    type: 'variable'
  };
}

// দ্বিপদী বর্গ করা
function squareBinomial(expr: string): SquaringResult {
  // (a+b) বা (a-b) ফরম্যাট চেক
  const match = expr.match(/^\(([^)]+)([\+\-])([^)]+)\)$/);
  if (!match) throw new Error('ভুল দ্বিপদী ফরম্যাট');
  
  const a = match[1].trim();
  const operator = match[2];
  const b = match[3].trim();
  
  const isAddition = operator === '+';
  const formula = isAddition ? '(a + b)² = a² + 2ab + b²' : '(a - b)² = a² - 2ab + b²';
  
  const steps = [
    `${expr}² এর জন্য সূত্র প্রয়োগ করি`,
    `সূত্র: ${formula}`,
    `এখানে a = ${a}, b = ${b}`,
    `${expr}² = ${a}² ${isAddition ? '+' : '-'} 2(${a})(${b}) + ${b}²`
  ];
  
  // চূড়ান্ত ফলাফল গণনা
  const aSquared = formatSquare(a);
  const bSquared = formatSquare(b);
  const middleTerm = formatMiddleTerm(a, b, isAddition);
  
  const finalResult = `${aSquared} ${isAddition ? '+' : '-'} ${middleTerm} + ${bSquared}`;
  steps.push(`= ${finalResult}`);
  
  return {
    original: expr,
    steps,
    result: finalResult,
    formula,
    type: 'binomial'
  };
}

// ত্রিপদী বর্গ করা
function squareTrinomial(expr: string): SquaringResult {
  const match = expr.match(/^\(([^)]+)([\+\-])([^)]+)([\+\-])([^)]+)\)$/);
  if (!match) throw new Error('ভুল ত্রিপদী ফরম্যাট');
  
  const a = match[1].trim();
  const op1 = match[2];
  const b = match[3].trim();
  const op2 = match[4];
  const c = match[5].trim();
  
  const formula = '(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca';
  
  const steps = [
    `${expr}² এর জন্য ত্রিপদী সূত্র প্রয়োগ করি`,
    `সূত্র: ${formula}`,
    `এখানে a = ${a}, b = ${b}, c = ${c}`,
    `= ${a}² + ${b}² + ${c}² + 2(${a})(${b}) + 2(${b})(${c}) + 2(${c})(${a})`
  ];
  
  const aSquared = formatSquare(a);
  const bSquared = formatSquare(b);
  const cSquared = formatSquare(c);
  const ab = formatProduct(a, b, op1 === '+');
  const bc = formatProduct(b, c, op2 === '+');
  const ca = formatProduct(c, a, true);
  
  const result = `${aSquared} + ${bSquared} + ${cSquared} + ${ab} + ${bc} + ${ca}`;
  steps.push(`= ${result}`);
  
  return {
    original: expr,
    steps,
    result,
    formula,
    type: 'trinomial'
  };
}

// সহায়ক ফাংশনসমূহ
function formatSquare(term: string): string {
  if (/^\d+$/.test(term)) {
    const num = parseInt(term);
    return (num * num).toString();
  }
  if (/^[a-z]$/.test(term)) {
    return `${term}²`;
  }
  if (/^\d*[a-z]$/.test(term)) {
    const match = term.match(/^(\d*)([a-z])$/);
    if (match) {
      const coeff = match[1] || '1';
      const variable = match[2];
      const coeffNum = parseInt(coeff);
      return `${coeffNum * coeffNum}${variable}²`;
    }
  }
  return `(${term})²`;
}

function formatMiddleTerm(a: string, b: string, isPositive: boolean): string {
  const sign = isPositive ? '' : '-';
  return `${sign}2${a}${b}`;
}

function formatProduct(term1: string, term2: string, isPositive: boolean): string {
  const sign = isPositive ? '+' : '-';
  return `${sign}2(${term1})(${term2})`;
}

// বর্গ করার উদাহরণ প্রদান
export const getSquaringExamples = (): string[] => [
  "5² = 25",
  "x² = x²", 
  "(x + 3)² = x² + 6x + 9",
  "(2x - 1)² = 4x² - 4x + 1",
  "(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca",
  "3x² = 9x²"
];