import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, BookOpen, Sparkles, Calculator, Divide } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useState, useEffect } from "react";

interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

interface SolutionDisplayProps {
  problem: string;
  solution: Solution | null;
  isLoading: boolean;
  error: string | null;
}

export const SolutionDisplay = ({ problem, solution, isLoading, error }: SolutionDisplayProps) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (solution && !isLoading && !error) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [solution, isLoading, error]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'linear':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quadratic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hcf':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lcm':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'linear':
        return <Target className="h-4 w-4" />;
      case 'quadratic':
        return <Sparkles className="h-4 w-4" />;
      case 'hcf':
        return <Divide className="h-4 w-4" />;
      case 'lcm':
        return <Calculator className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getExplanation = (type: string) => {
    const explanations = {
      'linear': 'এক বা একাধিক চলকের সরল সমীকরণ সমাধানের জন্য, চলককে এক পাশে এবং সংখ্যা অন্য পাশে এনে চলকের মান নির্ণয় করা হয়।',
      'quadratic': 'দ্বিঘাত সমীকরণ সমাধানের জন্য, সমীকরণকে ax²+bx+c=0 আকারে এনে বিচারক (D) ব্যবহার করে মূল বের করা হয়।',
      'hcf': 'গরিষ্ঠ সাধারণ উৎপাদক (গসাগু) নির্ণয়ের জন্য ইউক্লিডের অ্যালগরিদম ব্যবহার করা হয়। এটি দুই বা ততোধিক সংখ্যার সবচেয়ে বড় সাধারণ ভাজক।',
      'lcm': 'লঘিষ্ঠ সাধারণ গুণিতক (লসাগু) নির্ণয়ের জন্য মৌলিক উৎপাদকে বিশ্লেষণ করা হয়। এটি দুই বা ততোধিক সংখ্যার সবচেয়ে ছোট সাধারণ গুণিতক।'
    };
    
    return explanations[type as keyof typeof explanations] || 'এই সমীকরণ সমাধানের জন্য বীজগণিতের মৌলিক নিয়ম প্রয়োগ করা হয়েছে।';
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <Card className="card-gradient shadow-medium border-primary/20 overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="font-['Hind_Siliguri'] text-2xl text-primary flex items-center justify-center gap-3">
            <BookOpen className="h-6 w-6" />
            সমাধান
            <CheckCircle className="h-6 w-6 text-green-500" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-16 space-y-6"
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
                  <div className="absolute inset-2 w-12 h-12 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-2"
                >
                  <p className="text-lg font-['Hind_Siliguri'] font-medium text-primary">
                    গণনা করা হচ্ছে...
                  </p>
                  <p className="text-sm text-muted-foreground font-['Hind_Siliguri']">
                    আপনার সমীকরণ সমাধান করা হচ্ছে
                  </p>
                </motion.div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="p-6 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <h3 className="font-['Hind_Siliguri'] font-semibold text-red-800">ত্রুটি</h3>
                </div>
                <p className="text-red-700 font-['Hind_Siliguri']">{error}</p>
              </motion.div>
            )}

            {!isLoading && !error && !solution && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 space-y-4"
              >
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                </motion.div>
                <p className="text-muted-foreground font-['Hind_Siliguri'] text-lg">
                  আপনার বীজগণিত সমস্যা লিখুন এবং "সমাধান করুন" বাটনে ক্লিক করুন
                </p>
              </motion.div>
            )}

            {solution && !isLoading && !error && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="space-y-8"
              >
                {/* Problem Display */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-['Hind_Siliguri']">
                      সমস্যা
                    </Badge>
                    <Badge className={getTypeColor(solution.type)}>
                      {getTypeIcon(solution.type)}
                      <span className="ml-1 font-['Hind_Siliguri']">
                        {solution.type === 'linear' ? 'সরল সমীকরণ' : 
                         solution.type === 'quadratic' ? 'দ্বিঘাত সমীকরণ' :
                         solution.type === 'hcf' ? 'গসাগু' :
                         solution.type === 'lcm' ? 'লসাগু' : 'অন্যান্য'}
                      </span>
                    </Badge>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg border border-secondary">
                    <p className="text-xl font-mono font-bold text-primary">
                      {problem}
                    </p>
                  </div>
                </motion.div>

                {/* Solution Steps */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="font-['Hind_Siliguri'] font-semibold text-lg text-primary flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    সমাধান পদ্ধতি
                  </h3>
                  
                  <div className="space-y-3">
                    {solution.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-4 p-3 bg-gradient-card rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-lg font-mono text-primary font-semibold leading-relaxed">
                          {step}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Final Answer */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="p-6 bg-gradient-success rounded-xl border border-green-200 shadow-success">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                      <h3 className="font-['Hind_Siliguri'] font-bold text-white text-lg">
                        চূড়ান্ত উত্তর
                      </h3>
                    </div>
                    <motion.p 
                      className="text-2xl font-mono font-bold text-white"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {solution.solution}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Explanation */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h4 className="font-['Hind_Siliguri'] font-semibold text-blue-800">
                      ব্যাখ্যা
                    </h4>
                  </div>
                  <p className="text-blue-700 font-['Hind_Siliguri'] leading-relaxed">
                    {getExplanation(solution.type)}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};