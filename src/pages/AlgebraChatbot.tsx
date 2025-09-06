import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Brain, AlertTriangle, Sparkles, Database, History, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlgebraSolver } from "@/lib/algebraSolver";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'solution' | 'explanation' | 'history' | 'general';
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
      content: 'আসসালামু আলাইকুম! আমি বীজগণিত জ্ঞানের এআই সহায়ক। আমি আপনাকে বীজগণিত সমস্যা সমাধান, ইতিহাস এবং ব্যাখ্যায় সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extensive algebra knowledge base
  const algebraKnowledge: AlgebraKnowledge[] = [
    {
      topic: "রৈখিক সমীকরণ",
      content: "রৈখিক সমীকরণ হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ১। যেমন: ax + b = 0",
      examples: ["2x + 5 = 11", "3x - 7 = 8", "x/2 + 3 = 7"],
      keywords: ["রৈখিক", "linear", "সমীকরণ", "equation", "ঘাত", "degree"]
    },
    {
      topic: "দ্বিঘাত সমীকরণ",
      content: "দ্বিঘাত সমীকরণ হল এমন সমীকরণ যেখানে চলরাশির সর্বোচ্চ ঘাত ২। সাধারণ রূপ: ax² + bx + c = 0",
      examples: ["x² + 5x + 6 = 0", "2x² - 7x + 3 = 0", "x² - 4 = 0"],
      keywords: ["দ্বিঘাত", "quadratic", "বর্গ", "square", "শ্রীধর", "discriminant"]
    },
    {
      topic: "বীজগণিতের ইতিহাস",
      content: "বীজগণিত শব্দটি এসেছে আরবি 'আল-জাবর' থেকে। আল-খোয়ারিজমি (৭৮০-৮৫০ খ্রি.) কে বীজগণিতের জনক বলা হয়।",
      examples: ["আল-খোয়ারিজমির অবদান", "ব্রহ্মগুপ্তের কাজ", "আর্যভট্টের গণনা"],
      keywords: ["ইতিহাস", "history", "আল-খোয়ারিজমি", "al-khwarizmi", "আরবি", "arabic"]
    },
    {
      topic: "গুণনীয়করণ",
      content: "গুণনীয়করণ হল একটি বহুপদকে দুই বা ততোধিক সরল গুণনীয়কের গুণফল হিসেবে প্রকাশ করা।",
      examples: ["x² - 4 = (x+2)(x-2)", "x² + 5x + 6 = (x+2)(x+3)", "a² - b² = (a+b)(a-b)"],
      keywords: ["গুণনীয়করণ", "factorization", "গুণনীয়ক", "factor", "বহুপদ", "polynomial"]
    },
    {
      topic: "অনুপাত ও সমানুপাত",
      content: "অনুপাত হল দুইটি রাশির তুলনা। a:b = c:d হলে এটি সমানুপাত, যেখানে a×d = b×c",
      examples: ["3:4 = 6:8", "x:5 = 4:10", "2:3 = 8:12"],
      keywords: ["অনুপাত", "ratio", "সমানুপাত", "proportion", "তুলনা", "comparison"]
    },
    {
      topic: "বীজগণিতীয় সূত্র",
      content: "প্রয়োজনীয় সূত্রসমূহ: (a+b)² = a² + 2ab + b², (a-b)² = a² - 2ab + b², a² - b² = (a+b)(a-b)",
      examples: ["(x+3)² = x² + 6x + 9", "(2x-1)² = 4x² - 4x + 1", "x² - 9 = (x+3)(x-3)"],
      keywords: ["সূত্র", "formula", "বর্গ", "square", "ঘন", "cube", "বিস্তৃতি", "expansion"]
    }
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

    // Simulate processing time
    setTimeout(() => {
      const response = generateBotResponse(input.trim());
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userInput: string): { content: string; type: ChatMessage['type'] } => {
    const input = userInput.toLowerCase();

    // Check if it's a math problem that needs solving
    if (input.includes('=') || input.includes('সমাধান') || input.includes('solve')) {
      try {
        const solution = AlgebraSolver.solve(userInput);
        return {
          content: `🔍 **সমাধান:**\n\n**সমস্যা:** ${userInput}\n\n**ধাপসমূহ:**\n${solution.steps.join('\n')}\n\n**উত্তর:** ${solution.solution}\n\n**ব্যাখ্যা:** এটি একটি ${solution.type} সমস্যা যেখানে আমরা ${solution.variable} এর মান বের করেছি।`,
          type: 'solution'
        };
      } catch (error) {
        return {
          content: `দুঃখিত, এই সমস্যাটি সমাধান করতে সমস্যা হয়েছে। অনুগ্রহ করে সমস্যাটি সঠিক ফরম্যাটে লিখুন। উদাহরণ: "x + 5 = 10" বা "2x² - 8 = 0"`,
          type: 'general'
        };
      }
    }

    // Search through knowledge base
    for (const knowledge of algebraKnowledge) {
      const found = knowledge.keywords.some(keyword => 
        input.includes(keyword.toLowerCase())
      );
      
      if (found) {
        const examples = knowledge.examples.join('\n• ');
        return {
          content: `📚 **${knowledge.topic}**\n\n${knowledge.content}\n\n**উদাহরণসমূহ:**\n• ${examples}\n\nআরো কিছু জানতে চান?`,
          type: 'explanation'
        };
      }
    }

    // History-related responses
    if (input.includes('ইতিহাস') || input.includes('history') || input.includes('কে আবিষ্কার')) {
      return {
        content: `🏛️ **বীজগণিতের ইতিহাস**\n\n• **আল-খোয়ারিজমি (৭৮০-৮৫০):** বীজগণিতের জনক\n• **ব্রহ্মগুপ্ত (৬২৮-৬৬৮):** শূন্যের ব্যবহার\n• **আর্যভট্ট (৪৭৬-৫৫০):** ভারতীয় গণিতবিদ\n• **আল-জাবর:** বীজগণিত শব্দের উৎস (আরবি)\n\nবিস্তারিত জানতে "ইতিহাস" ট্যাবে যান!`,
        type: 'history'
      };
    }

    // Default responses
    const defaultResponses = [
      "দুর্দান্ত প্রশ্ন! আমি আপনাকে বীজগণিত সমস্যা সমাধান, সূত্র এবং ব্যাখ্যায় সাহায্য করতে পারি। একটি সমীকরণ দিন বা কোন টপিক সম্পর্কে জানতে চান বলুন।",
      "আমি এখানে আছি সাহায্য করার জন্য! রৈখিক সমীকরণ, দ্বিঘাত সমীকরণ, গুণনীয়করণ - যেকোনো বিষয়ে প্রশ্ন করুন।",
      "বীজগণিত নিয়ে কোন সমস্যায় আছেন? আমি ধাপে ধাপে সমাধান ও ব্যাখ্যা দিতে পারি।",
      "কী জানতে চান? সমীকরণ সমাধান, সূত্র, নাকি বীজগণিতের ইতিহাস?"
    ];

    return {
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      type: 'general'
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
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary font-['Hind_Siliguri']">
                  বীজগণিত চ্যাটবট
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-['Hind_Siliguri']">
                    বেটা সংস্করণ
                  </Badge>
                  <Badge variant="outline" className="text-xs font-['Hind_Siliguri']">
                    কাজ চলমান
                  </Badge>
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Hind_Siliguri']">
              <Database className="h-4 w-4" />
              <span>এআই চালিত</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beta Warning */}
      <div className="container mx-auto px-4 py-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="font-['Hind_Siliguri'] text-orange-800">
            <strong>বেটা সংস্করণ:</strong> এই চ্যাটবটটি এখনো উন্নয়নাধীন। কিছু উত্তর সঠিক নাও হতে পারে। আপনার মতামত আমাদের কাছে গুরুত্বপূর্ণ!
          </AlertDescription>
        </Alert>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 pb-4 max-w-4xl">
        <Card className="h-[70vh] flex flex-col">
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
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                        <div className="flex items-start gap-2 mb-2">
                          {message.sender === 'bot' && (
                            <div className="p-1.5 bg-primary/10 rounded-full">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          {message.sender === 'user' && (
                            <div className="p-1.5 bg-blue-100 rounded-full order-2">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <div className={`flex-1 ${message.sender === 'user' ? 'order-1' : ''}`}>
                            <div
                              className={`p-4 rounded-lg ${
                                message.sender === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white border shadow-sm'
                              }`}
                            >
                              <div className="whitespace-pre-wrap font-['Hind_Siliguri']">
                                {message.content}
                              </div>
                              {message.type && message.sender === 'bot' && (
                                <div className="flex items-center gap-1 mt-2 opacity-70">
                                  {message.type === 'solution' && <Calculator className="h-3 w-3" />}
                                  {message.type === 'history' && <History className="h-3 w-3" />}
                                  {message.type === 'explanation' && <Sparkles className="h-3 w-3" />}
                                  <span className="text-xs capitalize">
                                    {message.type === 'solution' && 'সমাধান'}
                                    {message.type === 'history' && 'ইতিহাস'}
                                    {message.type === 'explanation' && 'ব্যাখ্যা'}
                                    {message.type === 'general' && 'সাধারণ'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 font-['Hind_Siliguri']">
                              {message.timestamp.toLocaleTimeString('bn-BD')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] mr-12">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <Bot className="h-4 w-4 text-primary animate-pulse" />
                        </div>
                        <div className="bg-white border shadow-sm p-4 rounded-lg">
                          <div className="flex items-center gap-2 font-['Hind_Siliguri']">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                            </div>
                            <span className="text-sm text-muted-foreground">চিন্তা করছি...</span>
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
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="আপনার বীজগণিত প্রশ্ন লিখুন... (উদাহরণ: x + 5 = 10)"
                className="flex-1 font-['Hind_Siliguri']"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-['Hind_Siliguri']">
              <span>Enter চেপে পাঠান</span>
              <span>Powered by AI + Database</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-primary font-['Hind_Siliguri'] mb-2">
            দ্রুত শুরু করুন
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { text: "x + 5 = 10", desc: "রৈখিক সমীকরণ" },
            { text: "x² - 4 = 0", desc: "দ্বিঘাত সমীকরণ" },
            { text: "বীজগণিতের ইতিহাস", desc: "ইতিহাস জানুন" },
            { text: "গুণনীয়করণ কী?", desc: "ব্যাখ্যা পান" }
          ].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-3 text-left font-['Hind_Siliguri']"
              onClick={() => setInput(item.text)}
            >
              <div>
                <div className="font-medium text-sm">{item.text}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgebraChatbot;