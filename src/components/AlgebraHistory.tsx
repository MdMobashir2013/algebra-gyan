import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Globe, Users, ArrowRight, Clock, Star } from "lucide-react";

interface HistoryPeriod {
  id: string;
  title: string;
  period: string;
  description: string;
  keyFigures: string[];
  contributions: string[];
  icon: string;
  color: string;
}

const historyPeriods: HistoryPeriod[] = [
  {
    id: "ancient",
    title: "প্রাচীন যুগ",
    period: "৩০০০ খ্রিস্টপূর্ব - ৬০০ খ্রিস্টাব্দ",
    description: "বীজগণিতের প্রথম সূচনা প্রাচীন সভ্যতায়। মিশর ও ব্যাবিলনে গাণিতিক সমস্যা সমাধানের প্রাথমিক পদ্ধতি।",
    keyFigures: ["আহমেস", "ডিওফান্টাস", "ব্রহ্মগুপ্ত"],
    contributions: [
      "রৈখিক সমীকরণ সমাধান",
      "জ্যামিতিক পদ্ধতি",
      "প্রাথমিক বীজগাণিতিক প্রতীক"
    ],
    icon: "🏛️",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "golden",
    title: "স্বর্ণযুগ",
    period: "৮০০ - ১২০০ খ্রিস্টাব্দ",
    description: "ইসলামী স্বর্ণযুগে বীজগণিতের আধুনিক ভিত্তি স্থাপিত হয়। আল-খোয়ারিজমির অবদান অসামান্য।",
    keyFigures: ["আল-খোয়ারিজমি", "আল-কারাজি", "উমর খৈয়াম"],
    contributions: [
      "বীজগণিত শব্দের উৎপত্তি",
      "দ্বিঘাত সমীকরণের পদ্ধতিগত সমাধান",
      "ঘনীক সমীকরণের জ্যামিতিক সমাধান"
    ],
    icon: "🌟",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "renaissance",
    title: "নবজাগরণ",
    period: "১৪০০ - ১৬০০ খ্রিস্টাব্দ",
    description: "ইউরোপীয় নবজাগরণে প্রতীকী বীজগণিতের বিকাশ। জটিল সমীকরণ সমাধানের নতুন পদ্ধতি আবিষ্কার।",
    keyFigures: ["ভিয়েতা", "কার্দানো", "ফেরারি"],
    contributions: [
      "প্রতীকী স্বরলিপি",
      "ত্রিঘাত ও চতুর্ঘাত সমীকরণের সাধারণ সমাধান",
      "বীজগাণিতিক জ্যামিতি"
    ],
    icon: "🎨",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "modern",
    title: "আধুনিক যুগ",
    period: "১৬০০ - বর্তমান",
    description: "আধুনিক বীজগণিতের জন্ম। বিমূর্ত বীজগণিত, গ্রুপ তত্ত্ব এবং ক্ষেত্র তত্ত্বের বিকাশ।",
    keyFigures: ["গ্যালোয়া", "আবেল", "নোয়েথার"],
    contributions: [
      "গ্রুপ তত্ত্ব",
      "ক্ষেত্র তত্ত্ব",
      "বিমূর্ত বীজগণিত",
      "কম্পিউটার বীজগণিত"
    ],
    icon: "🚀",
    color: "from-blue-500 to-cyan-500"
  }
];

const timelineEvents = [
  { year: "৩০০০ খ্রি.পূ.", event: "প্রাচীন মিশরে প্রথম রৈখিক সমীকরণ" },
  { year: "৮২০ খ্রি.", event: "আল-খোয়ারিজমির 'আল-জাবর' গ্রন্থ" },
  { year: "১২০২ খ্রি.", event: "ফিবোনাচির 'লিবার আবাচি'" },
  { year: "১৫৯১ খ্রি.", event: "ভিয়েতার প্রতীকী বীজগণিত" },
  { year: "১৮৩২ খ্রি.", event: "গ্যালোয়া তত্ত্ব" },
  { year: "১৯৬০ খ্রি.", event: "কম্পিউটার বীজগণিতের শুরু" }
];

export function AlgebraHistory() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [activeTimeline, setActiveTimeline] = useState(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary font-['Hind_Siliguri']">
            বীজগণিতের ইতিহাস
          </h1>
        </div>
        <p className="text-lg text-muted-foreground font-['Hind_Siliguri'] max-w-2xl mx-auto">
          প্রাচীন কাল থেকে আধুনিক যুগ পর্যন্ত বীজগণিতের বিকাশের রোমাঞ্চকর যাত্রা
        </p>
      </motion.div>

      {/* Interactive Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-card rounded-xl p-6 border border-primary/20"
      >
        <h2 className="text-2xl font-semibold text-primary font-['Hind_Siliguri'] mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          কালপঞ্জী
        </h2>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30"></div>
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                  activeTimeline === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActiveTimeline(index)}
              >
                <div className={`relative z-10 w-8 h-8 rounded-full border-4 transition-all duration-300 ${
                  activeTimeline === index 
                    ? 'bg-primary border-primary shadow-glow' 
                    : 'bg-background border-primary/30 hover:border-primary/60'
                }`}>
                  {activeTimeline === index && (
                    <motion.div
                      layoutId="timeline-indicator"
                      className="absolute inset-0 rounded-full bg-primary/20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                  activeTimeline === index 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-background/50 hover:bg-primary/5'
                }`}>
                  <div className="font-semibold text-primary font-['Hind_Siliguri']">
                    {event.year}
                  </div>
                  <div className="text-muted-foreground font-['Hind_Siliguri']">
                    {event.event}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Historical Periods Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-primary font-['Hind_Siliguri'] mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6" />
          ঐতিহাসিক যুগসমূহ
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {historyPeriods.map((period, index) => (
            <motion.div
              key={period.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedPeriod(period.id === selectedPeriod ? null : period.id)}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${period.color} text-white relative`}>
                  <div className="absolute top-2 right-2 text-2xl">
                    {period.icon}
                  </div>
                  <CardTitle className="font-['Hind_Siliguri'] text-xl">
                    {period.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit font-['Hind_Siliguri']">
                    {period.period}
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground font-['Hind_Siliguri'] leading-relaxed">
                    {period.description}
                  </p>
                  
                  <AnimatePresence>
                    {selectedPeriod === period.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            মুখ্য ব্যক্তিত্ব
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {period.keyFigures.map((figure, idx) => (
                              <Badge key={idx} variant="outline" className="font-['Hind_Siliguri']">
                                {figure}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            প্রধান অবদান
                          </h4>
                          <ul className="space-y-1">
                            {period.contributions.map((contribution, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground font-['Hind_Siliguri'] flex items-center gap-2">
                                <ArrowRight className="h-3 w-3 text-primary" />
                                {contribution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full font-['Hind_Siliguri']"
                  >
                    {selectedPeriod === period.id ? 'কম দেখুন' : 'আরও দেখুন'}
                    <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${
                      selectedPeriod === period.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Fun Facts */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20"
      >
        <h2 className="text-2xl font-semibold text-primary font-['Hind_Siliguri'] mb-6 text-center">
          🤔 আকর্ষণীয় তথ্য
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-background/50 rounded-lg"
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2">
              'বীজগণিত' শব্দের উৎপত্তি
            </h3>
            <p className="text-sm text-muted-foreground font-['Hind_Siliguri']">
              আরবি 'আল-জাবর' থেকে এসেছে, যার অর্থ 'পুনরায় সংযোজন'
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-background/50 rounded-lg"
          >
            <div className="text-3xl mb-2">🧮</div>
            <h3 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2">
              প্রথম বীজগাণিতিক প্রতীক
            </h3>
            <p className="text-sm text-muted-foreground font-['Hind_Siliguri']">
              + এবং - চিহ্ন প্রথম ব্যবহৃত হয় ১৪৮৯ সালে
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-background/50 rounded-lg"
          >
            <div className="text-3xl mb-2">👩‍🔬</div>
            <h3 className="font-semibold text-primary font-['Hind_Siliguri'] mb-2">
              প্রথম মহিলা গণিতবিদ
            </h3>
            <p className="text-sm text-muted-foreground font-['Hind_Siliguri']">
              এমি নোয়েথার আধুনিক বীজগণিতের জননী হিসেবে পরিচিত
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}