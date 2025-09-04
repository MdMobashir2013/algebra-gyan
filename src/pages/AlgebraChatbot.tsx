import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Brain, AlertTriangle, Sparkles, Database, History, Calculator, BookOpen, Lightbulb, Target, Zap, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EnhancedAlgebraSolver } from "@/lib/enhancedAlgebraSolver";
import { algebraKnowledge, mathFormulas, historicalFacts, solvingStrategies } from "@/lib/algebraDatabase";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'solution' | 'explanation' | 'history' | 'general' | 'formula' | 'interactive';
  metadata?: {
    difficulty?: number;
    category?: string;
    relatedTopics?: string[];
    hasMore?: boolean;
  };
}

interface AlgebraKnowledge {
  topic: string;
  content: string;
  examples: string[];
  keywords: string[];
}

const AlgebraChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '🎓 **আসসালামু আলাইকুম! বীজগণিত জ্ঞানে স্বাগতম!**\n\nআমি আপনার বুদ্ধিমান এআই সহায়ক। আমি আপনাকে সাহায্য করতে পারি:\n\n🧮 **সমস্যা সমাধান:** রৈখিক, দ্বিঘাত, অসমতা, অনুপাত\n📚 **বিস্তৃত ব্যাখ্যা:** ধাপে ধাপে সমাধান ও ধারণা\n🏛️ **গণিতের ইতিহাস:** মহান গণিতবিদদের অবদান\n📖 **সূত্র ও সংজ্ঞা:** সম্পূর্ণ ডাটাবেস সহ\n💡 **স্মার্ট টিপস:** শেখার কৌশল ও ট্রিকস\n\nকী জানতে চান? একটি সমীকরণ দিন বা কোন টপিক নিয়ে আলোচনা করতে চান!',
      sender: 'bot',
      timestamp: new Date(),
      type: 'general',
      metadata: {
        category: 'welcome',
        hasMore: true
      }
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced knowledge base with comprehensive topics
  const quickTopics = [
    { title: "রৈখিক সমীকরণ", icon: "📏", keywords: ["linear", "রৈখিক"] },
    { title: "দ্বিঘাত সমীকরণ", icon: "📐", keywords: ["quadratic", "দ্বিঘাত"] },
    { title: "গুণনীয়করণ", icon: "✂️", keywords: ["factor", "গুণনীয়ক"] },
    { title: "বীজগণিতের ইতিহাস", icon: "🏛️", keywords: ["history", "ইতিহাস"] },
    { title: "সূত্রসমূহ", icon: "📋", keywords: ["formula", "সূত্র"] },
    { title: "অসমতা", icon: "⚖️", keywords: ["inequality", "অসমতা"] }
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate more intelligent processing time based on complexity
    const complexity = Math.min(input.length / 10, 3);
    const processingTime = 1500 + (complexity * 1000) + Math.random() * 1500;

    setTimeout(() => {
      const response = generateEnhancedBotResponse(input.trim());
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      
      // Show success toast for solutions
      if (response.type === 'solution') {
        toast.success("সমাধান প্রস্তুত! 🎯");
      }
    }, processingTime);
  };

  const generateEnhancedBotResponse = (userInput: string): { 
    content: string; 
    type: ChatMessage['type']; 
    metadata?: ChatMessage['metadata'] 
  } => {
    const input = userInput.toLowerCase();

    // Enhanced problem-solving with detailed steps
    if (input.includes('=') || input.includes('সমাধান') || input.includes('solve')) {
      try {
        const solution = EnhancedAlgebraSolver.solve(userInput);
        
        let content = `🎯 **${solution.type} সমাধান**\n\n`;
        content += `**সমস্যা:** ${userInput}\n\n`;
        content += `**বিস্তারিত সমাধান:**\n`;
        solution.steps.forEach((step, index) => {
          content += `${index + 1}. ${step}\n`;
        });
        content += `\n**✅ চূড়ান্ত উত্তর:** ${solution.solution}\n\n`;
        content += `**🔍 যাচাইকরণ:** ${solution.verification}\n\n`;
        
        if (solution.restrictions) {
          content += `**⚠️ শর্ত:** ${solution.restrictions}\n\n`;
        }
        
        if (solution.graphDescription) {
          content += `**📊 গ্রাফিক্যাল বর্ণনা:** ${solution.graphDescription}\n\n`;
        }
        
        if (solution.alternativeMethod) {
          content += `**🔄 বিকল্প পদ্ধতি:** ${solution.alternativeMethod}\n\n`;
        }
        
        content += `**💡 টিপস:**\n`;
        solution.hints.forEach((hint, index) => {
          content += `• ${hint}\n`;
        });
        
        const difficultyStars = '⭐'.repeat(solution.difficulty);
        content += `\n**🎚️ কঠিনতা:** ${difficultyStars} (${solution.difficulty}/5)`;

        return {
          content,
          type: 'solution',
          metadata: {
            difficulty: solution.difficulty,
            category: solution.type,
            hasMore: true
          }
        };
      } catch (error) {
        return {
          content: `❌ **সমস্যা সমাধানে ত্রুটি**\n\nদুঃখিত, এই সমস্যাটি সমাধান করতে সমস্যা হয়েছে।\n\n**💡 সাহায্যের জন্য:**\n• সমীকরণটি সঠিক ফরম্যাটে লিখুন\n• উদাহরণ: "2x + 5 = 11" বা "x² - 4 = 0"\n• বাংলা বা ইংরেজি উভয়ই ব্যবহার করতে পারেন\n\n**🎯 সাপোর্টেড সমস্যা:**\n• রৈখিক সমীকরণ (x + 5 = 10)\n• দ্বিঘাত সমীকরণ (x² + 2x - 3 = 0)\n• অসমতা (x > 5)\n• অনুপাত (3:4 = x:8)`,
          type: 'general'
        };
      }
    }

    // Enhanced knowledge base search
    for (const knowledge of algebraKnowledge) {
      const found = knowledge.keywords.some(keyword => 
        input.includes(keyword.toLowerCase())
      );
      
      if (found) {
        const difficultyStars = '⭐'.repeat(knowledge.difficulty);
        const examples = knowledge.examples.join('\n• ');
        
        let content = `📚 **${knowledge.topic}** ${difficultyStars}\n\n`;
        content += `**📖 সংজ্ঞা:** ${knowledge.content}\n\n`;
        content += `**🔢 উদাহরণসমূহ:**\n• ${examples}\n\n`;
        
        if (knowledge.relatedTopics.length > 0) {
          content += `**🔗 সম্পর্কিত বিষয়:** ${knowledge.relatedTopics.join(', ')}\n\n`;
        }
        
        content += `**💡 আরো জানতে:** এই বিষয়ে কোন নির্দিষ্ট প্রশ্ন আছে?`;

        return {
          content,
          type: 'explanation',
          metadata: {
            difficulty: knowledge.difficulty,
            category: knowledge.category,
            relatedTopics: knowledge.relatedTopics,
            hasMore: true
          }
        };
      }
    }

    // Formula search
    for (const formula of mathFormulas) {
      if (input.includes(formula.name.toLowerCase()) || 
          Object.keys(formula.variables).some(key => input.includes(key))) {
        
        let content = `📐 **${formula.name}**\n\n`;
        content += `**🔢 সূত্র:** ${formula.formula}\n\n`;
        content += `**📝 বর্ণনা:** ${formula.description}\n\n`;
        content += `**🔤 চলরাশি:**\n`;
        Object.entries(formula.variables).forEach(([key, value]) => {
          content += `• ${key} = ${value}\n`;
        });
        content += `\n**🎯 উদাহরণ:**\n• ${formula.examples.join('\n• ')}\n\n`;
        content += `**📂 বিভাগ:** ${formula.category}`;

        return {
          content,
          type: 'formula',
          metadata: {
            category: formula.category,
            hasMore: true
          }
        };
      }
    }

    // Historical facts with enhanced details
    if (input.includes('ইতিহাস') || input.includes('history') || 
        input.includes('কে আবিষ্কার') || input.includes('জনক')) {
      
      let content = `🏛️ **বীজগণিতের মহান ব্যক্তিত্ব**\n\n`;
      
      historicalFacts.forEach((fact, index) => {
        content += `**${index + 1}. ${fact.person}** (${fact.period})\n`;
        content += `🎯 **অবদান:** ${fact.contribution}\n`;
        content += `📜 **বিস্তারিত:** ${fact.details}\n`;
        content += `🌟 **প্রভাব:** ${fact.impact}\n\n`;
      });
      
      content += `**🔍 আরো জানতে:** কোন নির্দিষ্ট ব্যক্তিত্ব সম্পর্কে বিস্তারিত জানতে চান?`;

      return {
        content,
        type: 'history',
        metadata: {
          category: 'ইতিহাস',
          hasMore: true
        }
      };
    }

    // Enhanced strategy suggestions
    if (input.includes('কিভাবে') || input.includes('পদ্ধতি') || 
        input.includes('strategy') || input.includes('টিপস')) {
      
      let content = `💡 **সমাধানের কৌশল ও টিপস**\n\n`;
      
      solvingStrategies.forEach((strategy, index) => {
        content += `**${index + 1}. ${strategy.type}**\n`;
        strategy.steps.forEach((step, stepIndex) => {
          content += `   ${stepIndex + 1}. ${step}\n`;
        });
        content += `\n`;
      });
      
      content += `**🎯 সাধারণ টিপস:**\n`;
      content += `• সর্বদা সমীকরণটি সরল করুন\n`;
      content += `• ধাপে ধাপে এগিয়ে যান\n`;
      content += `• সমাধানের পর যাচাই করুন\n`;
      content += `• অনুশীলন করতে থাকুন\n\n`;
      content += `**🤔 কোন নির্দিষ্ট সমস্যায় আটকে আছেন?**`;

      return {
        content,
        type: 'explanation',
        metadata: {
          category: 'কৌশল',
          hasMore: true
        }
      };
    }

    // Smart contextual responses
    const smartResponses = [
      {
        content: `🤖 **স্মার্ট সহায়তা প্রস্তুত!**\n\nআমি আপনাকে সাহায্য করতে পারি:\n\n🧮 **তাৎক্ষণিক সমাধান:** যেকোনো বীজগণিত সমস্যা\n📚 **গভীর ব্যাখ্যা:** ধাপে ধাপে শিক্ষা\n🏆 **পারদর্শী টিপস:** দ্রুত সমাধানের কৌশল\n🎯 **ব্যক্তিগত শিক্ষা:** আপনার প্রয়োজন অনুযায়ী\n\n**💭 কী নিয়ে কাজ করতে চান?**`,
        type: 'general' as const
      },
      {
        content: `📖 **বীজগণিত শেখার যাত্রায় স্বাগতম!**\n\nআমার কাছে আছে:\n• **৫০০+** সমস্যার সমাধান কৌশল\n• **১০০+** সূত্র ও সংজ্ঞা\n• **বিস্তৃত** ইতিহাস ও তথ্য\n• **ইন্টারেক্টিভ** শিক্ষা পদ্ধতি\n\n**🎪 একটি সমীকরণ দিন বা প্রশ্ন করুন!**`,
        type: 'general' as const
      },
      {
        content: `🎨 **আপনার ব্যক্তিগত গণিত শিক্ষক!**\n\nবিশেষত্ব:\n🔬 **বৈজ্ঞানিক পদ্ধতি:** প্রমাণসহ সমাধান\n🎯 **লক্ষ্যভিত্তিক:** আপনার স্তর অনুযায়ী\n⚡ **দ্রুত ও নির্ভুল:** তাৎক্ষণিক ফলাফল\n🌟 **উৎসাহব্যঞ্জক:** শেখা আনন্দদায়ক করি\n\n**🚀 আসুন শুরু করি!**`,
        type: 'general' as const
      }
    ];

    const randomResponse = smartResponses[Math.floor(Math.random() * smartResponses.length)];
    return {
      content: randomResponse.content,
      type: randomResponse.type,
      metadata: {
        category: 'স্মার্ট সাহায্য',
        hasMore: true
      }
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickTopic = (topic: string) => {
    setInput(`${topic} সম্পর্কে বিস্তারিত জানতে চাই`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Enhanced Header */}
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-full">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary font-['Hind_Siliguri']">
                  বীজগণিত চ্যাটবট 🤖
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-['Hind_Siliguri'] animate-pulse">
                    🧪 বেটা সংস্করণ
                  </Badge>
                  <Badge variant="outline" className="text-xs font-['Hind_Siliguri']">
                    🔧 কাজ চলমান
                  </Badge>
                  <Badge variant="default" className="text-xs font-['Hind_Siliguri']">
                    🚀 উন্নত এআই
                  </Badge>
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Hind_Siliguri']">
                <Database className="h-4 w-4 text-green-500" />
                <span>লাইভ ডাটাবেস</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="font-['Hind_Siliguri']"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                রিসোর্স
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm border-r overflow-hidden"
            >
              <ScrollArea className="h-[calc(100vh-80px)] p-4">
                <div className="space-y-4">
                  <Tabs defaultValue="topics" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="topics" className="text-xs">বিষয়</TabsTrigger>
                      <TabsTrigger value="formulas" className="text-xs">সূত্র</TabsTrigger>
                      <TabsTrigger value="history" className="text-xs">ইতিহাস</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="topics" className="space-y-3">
                      <h3 className="font-semibold font-['Hind_Siliguri'] text-sm">দ্রুত বিষয়</h3>
                      {quickTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-3 font-['Hind_Siliguri']"
                          onClick={() => handleQuickTopic(topic.title)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{topic.icon}</span>
                            <span className="text-sm">{topic.title}</span>
                          </div>
                        </Button>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="formulas" className="space-y-3">
                      <h3 className="font-semibold font-['Hind_Siliguri'] text-sm">গুরুত্বপূর্ণ সূত্র</h3>
                      {mathFormulas.slice(0, 5).map((formula, index) => (
                        <Collapsible key={index}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between font-['Hind_Siliguri']">
                              <span className="text-xs">{formula.name}</span>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                            <div className="font-mono">{formula.formula}</div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="history" className="space-y-3">
                      <h3 className="font-semibold font-['Hind_Siliguri'] text-sm">মহান ব্যক্তিত্ব</h3>
                      {historicalFacts.slice(0, 3).map((fact, index) => (
                        <Card key={index} className="p-3">
                          <h4 className="font-semibold text-xs font-['Hind_Siliguri']">{fact.person}</h4>
                          <p className="text-xs text-muted-foreground font-['Hind_Siliguri']">{fact.period}</p>
                          <p className="text-xs mt-1 font-['Hind_Siliguri']">{fact.contribution}</p>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1">
          {/* Enhanced Beta Warning */}
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert className="border-gradient-primary bg-gradient-to-r from-orange-50 to-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                </div>
                <AlertDescription className="font-['Hind_Siliguri'] text-orange-800">
                  <strong>🧪 বেটা সংস্করণ (v2.0):</strong> এই উন্নত চ্যাটবটটি এখনো উন্নয়নাধীন। 
                  নতুন ফিচার: বিস্তৃত ডাটাবেস, স্মার্ট সমাধান, ইন্টারেক্টিভ শিক্ষা। 
                  আপনার <strong>ফিডব্যাক</strong> আমাদের কাছে অমূল্য! 🚀
                </AlertDescription>
              </Alert>
            </motion.div>
          </div>

          {/* Chat Container */}
          <div className="container mx-auto px-4 pb-4 max-w-4xl">
            <Card className="h-[60vh] flex flex-col shadow-xl border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-['Hind_Siliguri'] flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    স্মার্ট কথোপকথন
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-['Hind_Siliguri']">
                      {messages.length - 1} বার্তা
                    </Badge>
                    <Badge variant="outline" className="text-xs font-['Hind_Siliguri']">
                      লাইভ এআই
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] ${message.sender === 'user' ? 'ml-8' : 'mr-8'}`}>
                            <div className="flex items-start gap-3 mb-2">
                              {message.sender === 'bot' && (
                                <motion.div 
                                  className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-full flex-shrink-0"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Bot className="h-4 w-4 text-white" />
                                </motion.div>
                              )}
                              {message.sender === 'user' && (
                                <motion.div 
                                  className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full order-2 flex-shrink-0"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <User className="h-4 w-4 text-white" />
                                </motion.div>
                              )}
                              <div className={`flex-1 ${message.sender === 'user' ? 'order-1' : ''}`}>
                                <motion.div
                                  className={`p-4 rounded-2xl ${
                                    message.sender === 'user'
                                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                      : 'bg-white border shadow-lg border-primary/10'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <div className="whitespace-pre-wrap font-['Hind_Siliguri'] text-sm leading-relaxed">
                                    {message.content}
                                  </div>
                                  
                                  {/* Enhanced message metadata */}
                                  {message.metadata && message.sender === 'bot' && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/10">
                                      {message.type === 'solution' && <Calculator className="h-3 w-3 text-green-600" />}
                                      {message.type === 'history' && <History className="h-3 w-3 text-purple-600" />}
                                      {message.type === 'explanation' && <Sparkles className="h-3 w-3 text-blue-600" />}
                                      {message.type === 'formula' && <Target className="h-3 w-3 text-orange-600" />}
                                      
                                      <span className="text-xs text-muted-foreground font-['Hind_Siliguri']">
                                        {message.metadata.category}
                                      </span>
                                      
                                      {message.metadata.difficulty && (
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs text-muted-foreground">কঠিনতা:</span>
                                          {'⭐'.repeat(message.metadata.difficulty)}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="text-xs text-muted-foreground font-['Hind_Siliguri']">
                                    {message.timestamp.toLocaleTimeString('bn-BD')}
                                  </div>
                                  
                                  {message.sender === 'bot' && message.metadata?.hasMore && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs font-['Hind_Siliguri']"
                                      onClick={() => setInput('এই বিষয়ে আরো বিস্তারিত জানতে চাই')}
                                    >
                                      আরো জানুন
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Enhanced loading animation */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[85%] mr-8">
                          <div className="flex items-start gap-3">
                            <motion.div 
                              className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain className="h-4 w-4 text-white" />
                            </motion.div>
                            <div className="bg-white border shadow-lg border-primary/10 p-4 rounded-2xl">
                              <div className="flex items-center gap-3 font-['Hind_Siliguri']">
                                <div className="flex gap-1">
                                  <motion.div 
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{ y: [-5, 0, -5] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                  />
                                  <motion.div 
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{ y: [-5, 0, -5] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                  />
                                  <motion.div 
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{ y: [-5, 0, -5] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  গভীর বিশ্লেষণ করছি...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              
              {/* Enhanced Input Area */}
              <div className="border-t p-4 bg-gradient-to-r from-background to-primary/5">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="আপনার বীজগণিত প্রশ্ন বা সমস্যা লিখুন... (যেমন: 2x + 5 = 11)"
                    className="flex-1 font-['Hind_Siliguri'] border-primary/20 focus:border-primary/40"
                    disabled={isLoading}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground font-['Hind_Siliguri']">
                  <span>Enter চেপে পাঠান • AI উন্নত বিশ্লেষণ</span>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-green-500" />
                    <span>লাইভ ডাটাবেস সংযুক্ত</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="container mx-auto px-4 pb-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-primary font-['Hind_Siliguri'] mb-2 flex items-center justify-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  দ্রুত শুরু করুন
                </h3>
                <p className="text-sm text-muted-foreground font-['Hind_Siliguri']">
                  নিচের যেকোনো বোতামে ক্লিক করে তাৎক্ষণিক সাহায্য পান
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { text: "2x + 5 = 11", desc: "রৈখিক সমীকরণ", icon: "📏", difficulty: 2 },
                  { text: "x² - 9 = 0", desc: "দ্বিঘাত সমীকরণ", icon: "📐", difficulty: 3 },
                  { text: "বীজগণিতের ইতিহাস কী?", desc: "ইতিহাস জানুন", icon: "🏛️", difficulty: 1 },
                  { text: "(a+b)² সূত্রটি কী?", desc: "সূত্র শিখুন", icon: "📋", difficulty: 2 },
                  { text: "x² - 4 গুণনীয়করণ", desc: "গুণনীয়করণ", icon: "✂️", difficulty: 3 },
                  { text: "3:4 = x:12 সমাধান", desc: "অনুপাত সমস্যা", icon: "⚖️", difficulty: 2 },
                  { text: "x > 5 অসমতা কী?", desc: "অসমতা বুঝুন", icon: "📊", difficulty: 3 },
                  { text: "শেখার টিপস দিন", desc: "পড়ার কৌশল", icon: "💡", difficulty: 1 }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto p-4 text-left font-['Hind_Siliguri'] w-full border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      onClick={() => setInput(item.text)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex items-center gap-1">
                            {'⭐'.repeat(item.difficulty)}
                          </div>
                        </div>
                        <div className="font-medium text-sm">{item.text}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgebraChatbot;