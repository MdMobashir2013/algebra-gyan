import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, BookOpen } from "lucide-react";

export const AlgebraHero = () => {
  return (
    <motion.section 
      className="relative overflow-hidden bg-gradient-hero min-h-[60vh] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 text-white/20 text-8xl font-bold"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ∑
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-20 text-white/20 text-6xl font-bold"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ∫
        </motion.div>
        <motion.div 
          className="absolute top-40 right-10 text-white/20 text-7xl font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          π
        </motion.div>
      </div>

      <div className="container mx-auto px-4 text-center text-white relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Calculator className="h-16 w-16 text-yellow-300" />
            </motion.div>
            <Sparkles className="h-12 w-12 text-yellow-300 animate-pulse" />
            <BookOpen className="h-14 w-14 text-yellow-300" />
          </div>

          <h1 
            className="font-['Hind_Siliguri'] text-hero font-bold mb-4 tracking-tight"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: '1.1'
            }}
          >
            বীজগণিত জ্ঞান 🚀
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl font-['Hind_Siliguri'] font-medium opacity-90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ক্লাস ৬-৮ এর জন্য সবচেয়ে উন্নত ও চমৎকার বীজগণিত সমাধানকারী
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-4 font-['Hind_Siliguri'] font-semibold"
              onClick={() => document.getElementById('problem-input')?.focus()}
            >
              <Calculator className="h-5 w-5" />
              এখনই শুরু করুন
            </Button>
            
            <motion.div 
              className="text-sm text-white/80 font-['Hind_Siliguri']"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ ফ্রি ও সম্পূর্ণ বাংলায়
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating mathematical symbols */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-4xl font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['x', 'y', '=', '+', '-', '²', '√', '∞'][i]}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};