import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Trash2, RotateCcw, Copy, ArrowLeft, Plus, Minus, X as MultiplyIcon, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

const MatrixSolver = () => {
  const [matrixA, setMatrixA] = useState<Matrix>({
    rows: 2,
    cols: 2,
    data: [[1, 2], [3, 4]]
  });
  
  const [matrixB, setMatrixB] = useState<Matrix>({
    rows: 2,
    cols: 2,
    data: [[5, 6], [7, 8]]
  });

  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<Matrix | null>(null);
  const [determinant, setDeterminant] = useState<number | null>(null);
  const [inverse, setInverse] = useState<Matrix | null>(null);

  const createMatrix = (rows: number, cols: number): Matrix => ({
    rows,
    cols,
    data: Array(rows).fill(0).map(() => Array(cols).fill(0))
  });

  const updateMatrixSize = (matrix: Matrix, setMatrix: React.Dispatch<React.SetStateAction<Matrix>>, rows: number, cols: number) => {
    const newMatrix = createMatrix(rows, cols);
    for (let i = 0; i < Math.min(rows, matrix.rows); i++) {
      for (let j = 0; j < Math.min(cols, matrix.cols); j++) {
        newMatrix.data[i][j] = matrix.data[i]?.[j] || 0;
      }
    }
    setMatrix(newMatrix);
  };

  const updateMatrixValue = (matrix: Matrix, setMatrix: React.Dispatch<React.SetStateAction<Matrix>>, row: number, col: number, value: string) => {
    const newMatrix = { ...matrix };
    newMatrix.data = matrix.data.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? (parseFloat(value) || 0) : c)
    );
    setMatrix(newMatrix);
  };

  const addMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new Error("ম্যাট্রিক্সের আকার একই হতে হবে");
    }
    
    const result = createMatrix(a.rows, a.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.data[i][j] = a.data[i][j] + b.data[i][j];
      }
    }
    return result;
  };

  const subtractMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new Error("ম্যাট্রিক্সের আকার একই হতে হবে");
    }
    
    const result = createMatrix(a.rows, a.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return result;
  };

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.cols !== b.rows) {
      throw new Error("প্রথম ম্যাট্রিক্সের কলাম = দ্বিতীয় ম্যাট্রিক্সের রো হতে হবে");
    }
    
    const result = createMatrix(a.rows, b.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  };

  const calculateDeterminant = (matrix: Matrix): number => {
    if (matrix.rows !== matrix.cols) {
      throw new Error("নির্ণায়ক শুধু বর্গ ম্যাট্রিক্সের জন্য");
    }

    const n = matrix.rows;
    if (n === 1) return matrix.data[0][0];
    if (n === 2) {
      return matrix.data[0][0] * matrix.data[1][1] - matrix.data[0][1] * matrix.data[1][0];
    }

    // For larger matrices, use cofactor expansion
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = createMatrix(n - 1, n - 1);
      for (let i = 1; i < n; i++) {
        let col = 0;
        for (let k = 0; k < n; k++) {
          if (k !== j) {
            minor.data[i - 1][col] = matrix.data[i][k];
            col++;
          }
        }
      }
      det += Math.pow(-1, j) * matrix.data[0][j] * calculateDeterminant(minor);
    }
    return det;
  };

  const calculateInverse = (matrix: Matrix): Matrix => {
    if (matrix.rows !== matrix.cols) {
      throw new Error("বিপরীত ম্যাট্রিক্স শুধু বর্গ ম্যাট্রিক্সের জন্য");
    }

    const det = calculateDeterminant(matrix);
    if (Math.abs(det) < 1e-10) {
      throw new Error("নির্ণায়ক শূন্য - বিপরীত ম্যাট্রিক্স নেই");
    }

    const n = matrix.rows;
    if (n === 2) {
      const result = createMatrix(2, 2);
      result.data[0][0] = matrix.data[1][1] / det;
      result.data[0][1] = -matrix.data[0][1] / det;
      result.data[1][0] = -matrix.data[1][0] / det;
      result.data[1][1] = matrix.data[0][0] / det;
      return result;
    }

    throw new Error("৩×৩ এর বেশি ম্যাট্রিক্স এখনো সমর্থিত নয়");
  };

  const performOperation = () => {
    try {
      let newResult: Matrix | null = null;

      switch (operation) {
        case "add":
          newResult = addMatrices(matrixA, matrixB);
          break;
        case "subtract":
          newResult = subtractMatrices(matrixA, matrixB);
          break;
        case "multiply":
          newResult = multiplyMatrices(matrixA, matrixB);
          break;
        case "determinant":
          const det = calculateDeterminant(matrixA);
          setDeterminant(det);
          toast.success(`নির্ণায়ক: ${det}`);
          return;
        case "inverse":
          const inv = calculateInverse(matrixA);
          setInverse(inv);
          toast.success("বিপরীত ম্যাট্রিক্স গণনা সম্পন্ন");
          return;
      }

      setResult(newResult);
      toast.success("গণনা সম্পন্ন হয়েছে!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "গণনায় ত্রুটি");
    }
  };

  const renderMatrix = (matrix: Matrix, label: string, setMatrix?: React.Dispatch<React.SetStateAction<Matrix>>) => (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-primary font-['Hind_Siliguri'] flex items-center gap-2">
          {label}
          {setMatrix && (
            <div className="flex gap-2 ml-auto">
              <Select value={`${matrix.rows}`} onValueChange={(value) => updateMatrixSize(matrix, setMatrix, parseInt(value), matrix.cols)}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">২</SelectItem>
                  <SelectItem value="3">৩</SelectItem>
                  <SelectItem value="4">৪</SelectItem>
                </SelectContent>
              </Select>
              <X className="text-muted-foreground" />
              <Select value={`${matrix.cols}`} onValueChange={(value) => updateMatrixSize(matrix, setMatrix, matrix.rows, parseInt(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">২</SelectItem>
                  <SelectItem value="3">৩</SelectItem>
                  <SelectItem value="4">৪</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix.cols}, 1fr)` }}>
          {matrix.data.map((row, i) =>
            row.map((cell, j) => (
              <Input
                key={`${i}-${j}`}
                type="number"
                value={cell}
                onChange={(e) => setMatrix && updateMatrixValue(matrix, setMatrix, i, j, e.target.value)}
                disabled={!setMatrix}
                className="text-center h-12"
                step="any"
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const copyMatrixToClipboard = (matrix: Matrix) => {
    const text = matrix.data.map(row => `[${row.join(', ')}]`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success("ম্যাট্রিক্স কপি হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  প্রধান পেজ
                </Link>
              </Button>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary font-['Hind_Siliguri']">
                  ম্যাট্রিক্স সলভার
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-['Hind_Siliguri']">
                    গণিত সহায়ক
                  </Badge>
                  <Badge variant="outline" className="text-xs font-['Hind_Siliguri']">
                    ইন্টারঅ্যাক্টিভ
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="calculator" className="font-['Hind_Siliguri'] flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ম্যাট্রিক্স ক্যালকুলেটর
            </TabsTrigger>
            <TabsTrigger value="theory" className="font-['Hind_Siliguri'] flex items-center gap-2">
              <Eye className="h-4 w-4" />
              তত্ত্ব ও ব্যাখ্যা
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            {/* Operation Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-primary font-['Hind_Siliguri'] mb-4">
                কিয়াকলাপ নির্বাচন করুন
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  className="font-['Hind_Siliguri'] flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  যোগ
                </Button>
                <Button
                  variant={operation === "subtract" ? "default" : "outline"}
                  onClick={() => setOperation("subtract")}
                  className="font-['Hind_Siliguri'] flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                  বিয়োগ
                </Button>
                <Button
                  variant={operation === "multiply" ? "default" : "outline"}
                  onClick={() => setOperation("multiply")}
                  className="font-['Hind_Siliguri'] flex items-center gap-2"
                >
                  <MultiplyIcon className="h-4 w-4" />
                  গুণ
                </Button>
                <Button
                  variant={operation === "determinant" ? "default" : "outline"}
                  onClick={() => setOperation("determinant")}
                  className="font-['Hind_Siliguri']"
                >
                  নির্ণায়ক
                </Button>
                <Button
                  variant={operation === "inverse" ? "default" : "outline"}
                  onClick={() => setOperation("inverse")}
                  className="font-['Hind_Siliguri']"
                >
                  বিপরীত
                </Button>
              </div>
            </motion.div>

            {/* Matrix Input Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {renderMatrix(matrixA, "ম্যাট্রিক্স A", setMatrixA)}
              </motion.div>

              {(operation === "add" || operation === "subtract" || operation === "multiply") && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {renderMatrix(matrixB, "ম্যাট্রিক্স B", setMatrixB)}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button onClick={performOperation} size="lg" className="font-['Hind_Siliguri']">
                <Calculator className="h-5 w-5 mr-2" />
                গণনা করুন
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setDeterminant(null);
                  setInverse(null);
                }}
                size="lg"
                className="font-['Hind_Siliguri']"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                রিসেট
              </Button>
            </motion.div>

            {/* Results Section */}
            {(result || determinant !== null || inverse) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-primary font-['Hind_Siliguri'] mb-4">
                    📊 ফলাফল
                  </h3>
                </div>

                {result && (
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary font-['Hind_Siliguri']">
                        ফলাফল ম্যাট্রিক্স
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMatrixToClipboard(result)}
                        className="font-['Hind_Siliguri']"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        কপি
                      </Button>
                    </div>
                    {renderMatrix(result, "")}
                  </div>
                )}

                {determinant !== null && (
                  <Card className="max-w-md mx-auto border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <h4 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2">
                        নির্ণায়ক (Determinant)
                      </h4>
                      <div className="text-2xl font-bold text-primary">
                        {determinant.toFixed(4)}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {inverse && (
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary font-['Hind_Siliguri']">
                        বিপরীত ম্যাট্রিক্স (A⁻¹)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMatrixToClipboard(inverse)}
                        className="font-['Hind_Siliguri']"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        কপি
                      </Button>
                    </div>
                    {renderMatrix(inverse, "")}
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="theory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary font-['Hind_Siliguri'] mb-4">
                  ম্যাট্রিক্স তত্ত্ব ও ব্যাখ্যা
                </h2>
                <p className="text-muted-foreground font-['Hind_Siliguri'] max-w-2xl mx-auto">
                  ম্যাট্রিক্স সম্পর্কে বিস্তারিত জানুন এবং এর ব্যবহার বুঝুন
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-['Hind_Siliguri'] text-primary">
                      🧮 ম্যাট্রিক্স কী?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-['Hind_Siliguri'] space-y-3">
                    <p>ম্যাট্রিক্স হল সংখ্যাগুলোর একটি আয়তাকার বিন্যাস যা সারি ও কলামে সাজানো থাকে।</p>
                    <p><strong>প্রকারভেদ:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>বর্গ ম্যাট্রিক্স (সারি = কলাম)</li>
                      <li>একক ম্যাট্রিক্স (প্রধান কর্ণে ১, অন্যত্র ০)</li>
                      <li>শূন্য ম্যাট্রিক্স (সব উপাদান ০)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-['Hind_Siliguri'] text-primary">
                      ➕ যোগ ও বিয়োগ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-['Hind_Siliguri'] space-y-3">
                    <p>দুটি ম্যাট্রিক্সের যোগ ও বিয়োগের জন্য তাদের আকার একই হতে হবে।</p>
                    <p><strong>নিয়ম:</strong> সংশ্লিষ্ট অবস্থানের উপাদানগুলো যোগ বা বিয়োগ করুন।</p>
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      [a b] + [e f] = [a+e b+f]<br />
                      [c d]   [g h]   [c+g d+h]
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-['Hind_Siliguri'] text-primary">
                      ✖️ ম্যাট্রিক্স গুণ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-['Hind_Siliguri'] space-y-3">
                    <p>গুণের জন্য প্রথম ম্যাট্রিক্সের কলাম সংখ্যা = দ্বিতীয় ম্যাট্রিক্সের সারি সংখ্যা।</p>
                    <p><strong>পদ্ধতি:</strong> সারি × কলাম এর ডট প্রোডাক্ট।</p>
                    <p className="text-sm text-muted-foreground">
                      উদাহরণ: (m×n) × (n×p) = (m×p) ম্যাট্রিক্স
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-['Hind_Siliguri'] text-primary">
                      🔢 নির্ণায়ক ও বিপরীত
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-['Hind_Siliguri'] space-y-3">
                    <p><strong>নির্ণায়ক:</strong> বর্গ ম্যাট্রিক্সের একটি বিশেষ মান।</p>
                    <p><strong>২×২ এর জন্য:</strong> ad - bc</p>
                    <p><strong>বিপরীত ম্যাট্রিক্স:</strong> AA⁻¹ = I (একক ম্যাট্রিক্স)</p>
                    <p className="text-sm text-muted-foreground">
                      নির্ণায়ক ≠ 0 হলেই বিপরীত ম্যাট্রিক্স আছে।
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-['Hind_Siliguri'] text-primary text-center">
                    🎯 ব্যবহারিক প্রয়োগ
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-['Hind_Siliguri']">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">🏗️ ইঞ্জিনিয়ারিং</h4>
                      <p className="text-sm">স্ট্রাকচারাল বিশ্লেষণ, সিগনাল প্রসেসিং</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">💻 কম্পিউটার গ্রাফিক্স</h4>
                      <p className="text-sm">3D ট্রান্সফরমেশন, রোটেশন</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">📊 পরিসংখ্যান</h4>
                      <p className="text-sm">ডেটা বিশ্লেষণ, মেশিন লার্নিং</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatrixSolver;