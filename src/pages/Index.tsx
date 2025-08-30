import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlgebraHero } from "@/components/AlgebraHero";
import { ProblemInput } from "@/components/ProblemInput";
import { SolutionDisplay } from "@/components/SolutionDisplay";
import { AlgebraHistory } from "@/components/AlgebraHistory";
import { AlgebraSolver } from "@/lib/algebraSolver";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, Trophy, Zap, Heart, Facebook, Twitter, Instagram, Linkedin, Share2, Calculator, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Solution {
  type: string;
  variable: string;
  steps: string[];
  solution: string;
}

const Index = () => {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast.error("দয়া করে একটি বীজগণিত সমস্যা লিখুন");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Simulate solving delay for better UX
    setTimeout(() => {
      try {
        const result = AlgebraSolver.solve(problem);
        setSolution(result);
        toast.success("সমাধান সম্পন্ন হয়েছে! 🎉");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'সমস্যাটি সমাধান করতে ব্যর্থ হয়েছে';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const stats = [
    { icon: Users, label: "সন্তুষ্ট শিক্ষার্থী", value: "১০,০০০+" },
    { icon: Trophy, label: "সমাধান সম্পন্ন", value: "৫০,০০০+" },
    { icon: Star, label: "রেটিং", value: "৪.৯/৫" },
    { icon: Zap, label: "দ্রুততা", value: "তাৎক্ষণিক" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AlgebraHero />

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-primary/5 to-transparent"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3"
                >
                  <stat.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <div className="text-2xl font-bold text-primary font-['Hind_Siliguri']">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-['Hind_Siliguri']">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <Tabs defaultValue="solver" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="solver" className="font-['Hind_Siliguri'] flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              বীজগণিত সমাধানকারী
            </TabsTrigger>
            <TabsTrigger value="history" className="font-['Hind_Siliguri'] flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              বীজগণিতের ইতিহাস
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solver" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Problem Input */}
              <div className="space-y-6">
                <ProblemInput 
                  problem={problem}
                  setProblem={setProblem}
                  onSolve={handleSolve}
                  isLoading={isLoading}
                />
              </div>

              {/* Solution Display */}
              <div className="space-y-6">
                <SolutionDisplay 
                  problem={problem}
                  solution={solution}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <AlgebraHistory />
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <motion.section 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Separator className="my-12" />
          
          <h2 className="text-3xl font-bold text-primary font-['Hind_Siliguri'] mb-8">
            কেন বীজগণিত জ্ঞান বেছে নেবেন?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-card rounded-xl border border-primary/20 shadow-soft"
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-primary font-['Hind_Siliguri'] mb-2">
                অত্যাধুনিক প্রযুক্তি
              </h3>
              <p className="text-muted-foreground font-['Hind_Siliguri']">
                সর্বশেষ এআই প্রযুক্তি ব্যবহার করে তাৎক্ষণিক ও নির্ভুল সমাধান
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-card rounded-xl border border-primary/20 shadow-soft"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-primary font-['Hind_Siliguri'] mb-2">
                ধাপে ধাপে ব্যাখ্যা
              </h3>
              <p className="text-muted-foreground font-['Hind_Siliguri']">
                প্রতিটি সমাধানের বিস্তারিত ব্যাখ্যা সহ শেখার সুবিধা
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-card rounded-xl border border-primary/20 shadow-soft"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-primary font-['Hind_Siliguri'] mb-2">
                ১০০% বাংলা
              </h3>
              <p className="text-muted-foreground font-['Hind_Siliguri']">
                সম্পূর্ণ বাংলা ভাষায় সহজ ও বোধগম্য সমাধান
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="font-['Hind_Siliguri']">
                ক্লাস ৬-৮ এর জন্য বিশেষভাবে প্রস্তুত
              </Badge>
            </div>
            
            <p className="text-muted-foreground font-['Hind_Siliguri'] text-lg">
              বীজগণিত শেখা এখন আরও সহজ ও আনন্দদায়ক
            </p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-['Hind_Siliguri']">
                হাজারো শিক্ষার্থীর পছন্দ
              </span>
            </div>

            {/* Share Buttons */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-primary font-['Hind_Siliguri'] mb-4">
                শেয়ার করুন
              </h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="font-['Hind_Siliguri']"
                >
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="font-['Hind_Siliguri']"
                >
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('বীজগণিত জ্ঞান - বাংলায় বীজগণিত সমাধান')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    X (Twitter)
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="font-['Hind_Siliguri']"
                >
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="font-['Hind_Siliguri']"
                >
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent('বীজগণিত জ্ঞান - বাংলায় বীজগণিত সমাধান ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Donation Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                asChild
                variant="hero"
                className="font-['Hind_Siliguri'] text-lg px-8 py-3"
              >
                <a href="mailto:mdmobashir291@gmail.com?subject=বীজগণিত জ্ঞান - অনুদান">
                  <Heart className="h-5 w-5 mr-2" />
                  অনুদান করুন
                </a>
              </Button>
              <p className="text-xs text-muted-foreground font-['Hind_Siliguri'] mt-2">
                এই প্রকল্পটি বিনামূল্যে রাখতে সাহায্য করুন
              </p>
            </motion.div>
            
            <p className="text-sm text-muted-foreground font-['Hind_Siliguri'] mt-8">
              © ২০২৫ বীজগণিত জ্ঞান - মোঃ মোবাশশির হোসেন - সকল অধিকার সংরক্ষিত
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
