import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Eraser, Lightbulb, Zap } from "lucide-react";

interface ProblemInputProps {
  problem: string;
  setProblem: (problem: string) => void;
  onSolve: () => void;
  isLoading: boolean;
}

export const ProblemInput = ({ problem, setProblem, onSolve, isLoading }: ProblemInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const clearInput = () => {
    setProblem("");
  };

  const examples = [
    { equation: "x + 7 = 15", description: "এক চলক বিশিষ্ট সমীকরণ" },
    { equation: "2y - 5 = 11", description: "গুণনীয়ক সহ সমীকরণ" },
    { equation: "x^2 + 5x + 6 = 0", description: "দ্বিঘাত সমীকরণ" },
    { equation: "(x + 3)/2 = 5", description: "ভগ্নাংশ সমীকরণ" },
    { equation: "HCF x^2-4, x+2", description: "বীজগণিতিক গসাগু" },
    { equation: "LCM x-1, x^2-1", description: "বীজগণিতিক লসাগু" },
    { equation: "গসাগু 2x+4, 3x+6", description: "সরল রাশির গসাগু" },
    { equation: "algebra plus 2x+3, x-1", description: "বীজগণিতিক যোগ" },
    { equation: "algebra minus 3x+5, x+2", description: "বীজগণিতিক বিয়োগ" },
    { equation: "algebra multiply x+2, x-3", description: "বীজগণিতিক গুণ" },
    { equation: "algebra division x^2-4, x-2", description: "বীজগণিতিক ভাগ" },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-gradient shadow-medium border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="font-['Hind_Siliguri'] text-2xl text-primary flex items-center justify-center gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            আপনার সমস্যা লিখুন
            <Lightbulb className="h-6 w-6 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div
            className="relative"
            animate={{ 
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused ? "var(--shadow-glow)" : "var(--shadow-soft)"
            }}
            transition={{ duration: 0.3 }}
          >
            <Textarea
              id="problem-input"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="যেমন: x + 5 = 10, x^2 + 5x + 6 = 0, HCF x^2-4, x+2, LCM x-1, x^2-1..."
              className="min-h-[120px] text-lg font-['Hind_Siliguri'] resize-none border-primary/30 focus:border-primary transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
            />
            
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    <Zap className="h-3 w-3 inline mr-1" />
                    লিখুন
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button 
                variant="solve" 
                size="lg"
                onClick={onSolve}
                disabled={isLoading || !problem.trim()}
                className="w-full text-lg font-['Hind_Siliguri'] font-bold py-6"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Calculator className="h-5 w-5" />
                      </motion.div>
                      সমাধান করা হচ্ছে...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="solve"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Calculator className="h-5 w-5" />
                      সমাধান করুন
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-none"
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={clearInput}
                className="w-full sm:w-auto text-lg font-['Hind_Siliguri'] py-6 px-8"
              >
                <Eraser className="h-5 w-5" />
                পরিষ্কার করুন
              </Button>
            </motion.div>
          </div>

          {/* Quick Examples */}
          <div className="space-y-4">
            <h3 className="font-['Hind_Siliguri'] font-semibold text-lg text-center text-muted-foreground">
              দ্রুত উদাহরণ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="example"
                    className="w-full p-4 h-auto text-left font-['Hind_Siliguri'] justify-start"
                    onClick={() => setProblem(example.equation)}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-primary math-gradient">
                        {example.equation}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {example.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};