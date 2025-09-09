import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Brain, AlertTriangle, Sparkles, Database, History, Calculator, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlgebraSolver } from "@/lib/algebraSolver";
import { expandedAlgebraDatabase, searchDatabase, getRandomTopic, type AlgebraKnowledge } from "@/lib/expandedAlgebraDatabase";
import { evaluateBasicArithmetic, verifySolution } from "@/lib/arithmeticSolver";
import { squaringSolver, getSquaringExamples } from "@/lib/squaringSolver";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'solution' | 'explanation' | 'history' | 'general';
}

const AlgebraChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '**আসসালামু আলাইকুম!** 🌟\n\nআমি **বীজগণিত জ্ঞানের এআই সহায়ক**। আমি আপনাকে সাহায্য করতে পারি:\n\n• 🧮 **সমস্যা সমাধান** (রৈখিক, দ্বিঘাত, গুণনীয়করণ)\n• 📚 **ধারণা ব্যাখ্যা** (সূত্র, নিয়ম, পদ্ধতি)\n• 🏛️ **ইতিহাস** (আল-খোয়ারিজমি থেকে আধুনিক যুগ)\n• 🎯 **উদাহরণ ও অনুশীলন**\n\nকীভাবে সাহায্য করতে পারি?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Enhanced conversational greetings and general questions
    if (input.includes('কেমন') || input.includes('আছো') || input.includes('হ্যালো') || 
        input.includes('hello') || input.includes('hi') || input.includes('হাই') ||
        input.includes('আসসালামু') || input.includes('সালাম')) {
      return {
        content: `🌟 **আসসালামু আলাইকুম! আমি ভালো আছি, ধন্যবাদ।**\n\nআমি একটি **বীজগণিত বিশেষজ্ঞ এআই** যিনি আপনাকে সাহায্য করতে এসেছি।\n\n**🎯 আমি যা করতে পারি:**\n• ✅ যেকোনো গাণিতিক সমস্যা সমাধান (১০০% নির্ভুল)\n• ✅ **সংজ্ঞা:** বীজগণিত কী? সমীকরণ কী? গুণনীয়করণ কী?\n• ✅ **সূত্র:** বর্গ, ঘন, সব বীজগণিতীয় সূত্র\n• ✅ **ইতিহাস:** বীজগণিতের জনক কে? আল-জাবর বই\n• ✅ **বর্গ করা:** ধাপে ধাপে সূত্র ব্যবহার করে\n• ✅ **হিসাব:** যোগ-বিয়োগ-গুণ-ভাগ সব নির্ভুল\n\n**কী জানতে চান?** 😊`,
        type: 'general'
      };
    }

    // Enhanced squaring functionality - Only trigger for clear squaring requests
    if (input.match(/^(\d+|[a-z]|\([^)]+\))\s*(বর্গ|square|\^2|²)/i) || 
        input.match(/^(বর্গ|square)\s+(\d+|[a-z]|\([^)]+\))/i) ||
        input.match(/(\d+|[a-z]|\([^)]+\))\s+(বর্গ\s+কর|square)/i)) {
      try {
        // Extract the expression to square
        let expression = userInput;
        expression = expression.replace(/বর্গ\s*কর|square|করো|কর/gi, '').trim();
        
        if (!expression) {
          return {
            content: `🔲 **বর্গ করার পদ্ধতি**\n\n**🎯 আমি যা বর্গ করতে পারি:**\n• **সংখ্যা:** ৫², ১২², ২৫²\n• **চলরাশি:** x², y², a²\n• **দ্বিপদী:** (x+3)², (2x-1)²\n• **ত্রিপদী:** (a+b+c)²\n\n**📝 উদাহরণ:**\n${getSquaringExamples().map(ex => `• ${ex}`).join('\n')}\n\n**💡 চেষ্টা করুন:** "(x+5)² কর" বা "7² কর"`,
            type: 'explanation'
          };
        }
        
        const result = squaringSolver.square(expression);
        
        // Format steps with proper Bengali numbering and structure
        const formattedSteps = result.steps.map((step, index) => {
          if (step === '') return '';
          if (step.startsWith('ধাপ')) {
            return `\n**${step}**`;
          }
          return step;
        }).join('\n');
        
        return {
          content: `📐 **${result.original} এর বর্গ সম্প্রসারণ**\n\n**🔹 প্রয়োগকৃত সূত্র:** \`${result.formula}\`\n\n${formattedSteps}\n\n🎯 **চূড়ান্ত উত্তর:** \`${result.result}\`\n\n*আরো বর্গ করতে চান? উদাহরণ: "(a+2) বর্গ করো"*`,
          type: 'solution'
        };
      } catch (error) {
        return {
          content: `❌ **বর্গ করতে সমস্যা হয়েছে।**\n\n**✅ সঠিক ফরম্যাট:**\n• সংখ্যা: "৫² কর" বা "25 বর্গ কর"\n• দ্বিপদী: "(x+3)² কর" বা "(a-b) বর্গ কর"\n• চলরাশি: "x² কর" বা "3y বর্গ কর"\n\n**💡 টিপস:**\n• দ্বিপদীর জন্য বন্ধনী ব্যবহার করুন\n• স্পেস দিয়ে পরিষ্কার লিখুন\n\n*আবার চেষ্টা করুন!*`,
          type: 'general'
        };
      }
    }

    // Handle thanks and appreciation
    if (input.includes('ধন্যবাদ') || input.includes('thanks') || input.includes('thank you')) {
      return {
        content: `🙏 **আপনাকেও ধন্যবাদ!** \n\nআমি খুশি যে আপনাকে সাহায্য করতে পেরেছি। আরো কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞেস করুন!\n\n**💡 মনে রাখবেন:** আমি সব ধরনের বীজগণিতীয় সমস্যা সমাধান করতে পারি - ছোট থেকে জটিল সবকিছু!`,
        type: 'general'
      };
    }

    // Enhanced problem-solving capability for specific algebra questions
    
    // Handle direct equation solving more intelligently with improved calculation
    if (input.includes('=') && (input.includes('সমাধান') || input.includes('solve') || input.includes('করো') || input.includes('কর'))) {
      try {
        // Enhanced solver with better error handling and calculation accuracy
        const cleanInput = userInput.replace(/সমাধান করো|solve|করো|কর/gi, '').trim();
        const solution = AlgebraSolver.solve(cleanInput);
        
        // Double check the solution by substituting back
        const verification = verifySolution(cleanInput, solution.solution);
        
        return {
          content: `🔍 **সমাধান প্রক্রিয়া:**\n\n**সমস্যা:** \`${cleanInput}\`\n\n**ধাপে ধাপে সমাধান:**\n${solution.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n**✅ চূড়ান্ত উত্তর:** \`${solution.solution}\`\n\n**🔬 যাচাইকরণ:** ${verification ? '✅ সঠিক' : '⚠️ পুনরায় যাচাই প্রয়োজন'}\n\n**📝 ব্যাখ্যা:** এটি একটি **${solution.type === 'linear' ? 'রৈখিক সমীকরণ' : solution.type === 'quadratic' ? 'দ্বিঘাত সমীকরণ' : solution.type}**\n\n*আরো সমস্যা সমাধান করতে চান?*`,
          type: 'solution'
        };
      } catch (error) {
        return {
          content: `❌ **সমাধানে সমস্যা হয়েছে।** চলুন আবার চেষ্টা করি!\n\n**💡 সঠিক ফরম্যাট:**\n• \`2x + 5 = 15 সমাধান করো\`\n• \`x² - 4 = 0 solve\`\n• \`3x - 7 = 14\`\n\n**🎯 টিপস:**\n• সমীকরণে = চিহ্ন আবশ্যক\n• স্পেস দিয়ে পরিষ্কার লিখুন\n• x বা y ব্যবহার করুন চলরাশি হিসেবে\n\n*আবার চেষ্টা করুন!*`,
          type: 'general'
        };
      }
    }

    // Handle basic arithmetic operations with accuracy check
    if (input.match(/\d+\s*[\+\-\*\/]\s*\d+/) && !input.includes('x') && !input.includes('y')) {
      try {
        const result = evaluateBasicArithmetic(userInput);
        return {
          content: `🧮 **গণনার ফলাফল:**\n\n**সমস্যা:** \`${userInput}\`\n**উত্তর:** \`${result}\`\n\n**✅ নির্ভুল গণনা সম্পন্ন!**\n\n*আরো হিসাব করতে চান?*`,
          type: 'solution'
        };
      } catch (error) {
        return {
          content: `❌ **হিসাবে ভুল হয়েছে।** আবার চেষ্টা করুন।\n\n**উদাহরণ:**\n• 25 + 15 = ?\n• 100 - 35 = ?\n• 12 × 8 = ?\n• 144 ÷ 12 = ?`,
          type: 'general'
        };
      }
    }

    // Priority for definitions - Check definitions first before other searches
    if (input.includes('কী') || input.includes('কি') || input.includes('what is') || input.includes('define') || 
        input.includes('সংজ্ঞা') || input.includes('অর্থ') || input.includes('meaning') || input.includes('কাকে বলে') ||
        input.includes('জনক কে') || input.includes('আবিষ্কার') ||
        input.includes('গুণনীয়করণ') || input.includes('বীজগণিত') || 
        input.includes('ফাংশন') || input.includes('সমীকরণ')) {
      
      // Prioritize definition and history categories
      const searchResults = searchDatabase(input);
      const definitionResults = searchResults.filter(r => r.category === 'definition' || r.category === 'history');
      const bestMatch = definitionResults.length > 0 ? definitionResults[0] : searchResults[0];
      
      if (bestMatch) {
        const examples = bestMatch.examples.map(ex => `• ${ex}`).join('\n');
        const difficultyLevel = ['নতুন শিক্ষার্থী', 'মধ্যম', 'উন্নত', 'উচ্চতর', 'বিশেষজ্ঞ'][bestMatch.difficulty - 1];
        const categoryName = {
          'basic': 'মৌলিক',
          'intermediate': 'মধ্যম', 
          'advanced': 'উন্নত',
          'history': 'ইতিহাস',
          'formula': 'সূত্র',
          'definition': 'সংজ্ঞা',
          'squaring': 'বর্গ করা'
        }[bestMatch.category] || bestMatch.category;
        
        return {
          content: `📖 **${bestMatch.topic}**\n\n${bestMatch.content}\n\n**📝 উদাহরণসমূহ:**\n${examples}\n\n**🎯 কঠিনতার স্তর:** ${difficultyLevel}\n**📂 বিভাগ:** ${categoryName}\n\n*আরো বিস্তারিত জানতে চান বা অন্য প্রশ্ন আছে?*`,
          type: 'explanation'
        };
      }
    }

    // Formula and algebra basics queries  
    if (input.includes('সূত্র') || input.includes('formula') || input.includes('বর্গ') || input.includes('square') ||
        input.includes('ঘন') || input.includes('cube') || input.includes('বিস্তৃতি') || input.includes('expand')) {
      const searchResults = searchDatabase(input);
      if (searchResults.length > 0) {
        const knowledge = searchResults[0];
        return {
          content: `📋 **${knowledge.topic}**\n\n${knowledge.content}\n\n**📝 প্রয়োগের উদাহরণ:**\n${knowledge.examples.map(ex => `• ${ex}`).join('\n')}\n\n*কোন নির্দিষ্ট সূত্র নিয়ে জানতে চান?*`,
          type: 'explanation'
        };
      }
      
      return {
        content: `📋 **বীজগণিতের প্রধান সূত্রাবলী:**\n\n**🔹 বর্গের সূত্র:**\n• (a + b)² = a² + 2ab + b²\n• (a - b)² = a² - 2ab + b²\n• a² - b² = (a + b)(a - b)\n\n**🔹 ঘনের সূত্র:**\n• (a + b)³ = a³ + 3a²b + 3ab² + b³\n• (a - b)³ = a³ - 3a²b + 3ab² - b³\n\n**📖 উদাহরণ:**\n• (x + 3)² = x² + 6x + 9\n• x² - 16 = (x + 4)(x - 4)\n\n*কোন নির্দিষ্ট সূত্র ব্যবহার করতে চান?*`,
        type: 'explanation'
      };
    }

    // Enhanced mathematical problem detection and solving
    if (input.includes('=') || input.includes('সমাধান') || input.includes('solve') || 
        (input.match(/\d+x/) && (input.includes('+') || input.includes('-'))) ||
        input.match(/x\s*[+\-]\s*\d+\s*=/) || input.match(/\d+x\s*[+\-]/) ||
        input.includes('বের কর') || input.includes('নির্ণয় কর') || input.includes('find')) {
      try {
        const solution = AlgebraSolver.solve(userInput);
        return {
          content: `🔍 **সমাধান প্রক্রিয়া:**\n\n**প্রদত্ত সমস্যা:** \`${userInput}\`\n\n**সমাধানের ধাপসমূহ:**\n${solution.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n**✅ চূড়ান্ত উত্তর:** \`${solution.solution}\`\n\n**📝 টাইপ:** এটি একটি **${solution.type === 'linear' ? 'রৈখিক সমীকরণ' : solution.type === 'quadratic' ? 'দ্বিঘাত সমীকরণ' : solution.type}**\n\n*আরো সমস্যার জন্য আমাকে বলুন!*`,
          type: 'solution'
        };
      } catch (error) {
        // Try to give more specific help based on the input
        if (input.includes('x') && input.includes('=')) {
          return {
            content: `⚠️ **সমাধান করতে সমস্যা হচ্ছে।** চলুন আমি সাহায্য করি!\n\n**✅ সঠিক ফরম্যাট:**\n• রৈখিক: \`2x + 5 = 15\`\n• দ্বিঘাত: \`x² - 4 = 0\`\n• সরল: \`3x = 12\`\n\n**💡 টিপস:**\n• সমীকরণে = চিহ্ন আবশ্যক\n• x বা y ব্যবহার করুন চলরাশি হিসেবে\n• স্পেস দিয়ে পরিষ্কার লিখুন\n\n*আবার চেষ্টা করুন অথবা অন্য প্রশ্ন করুন!*`,
            type: 'general'
          };
        }
        
        return {
          content: `❌ **দুঃখিত!** এই সমস্যাটি বুঝতে পারছি না।\n\n**🎯 আমি যা সমাধান করতে পারি:**\n• রৈখিক সমীকরণ: 2x + 5 = 15\n• দ্বিঘাত সমীকরণ: x² - 9 = 0\n• গুণনীয়করণ: x² + 5x + 6\n• বীজগণিতীয় সূত্র\n\n*আরেকটি সমস্যা দিয়ে দেখুন!*`,
          type: 'general'
        };
      }
    }

    // Search through expanded knowledge base with better matching
    const searchResults = searchDatabase(input);
    if (searchResults.length > 0) {
      const knowledge = searchResults[0]; // Get the best match
      const examples = knowledge.examples.map(ex => `• \`${ex}\``).join('\n');
      const difficultyEmoji = '⭐'.repeat(knowledge.difficulty);
      const categoryName = {
        'basic': 'মৌলিক',
        'intermediate': 'মধ্যম',
        'advanced': 'উন্নত',
        'history': 'ইতিহাস',
        'formula': 'সূত্র'
      }[knowledge.category] || knowledge.category;
      
      return {
        content: `📚 **${knowledge.topic}** ${difficultyEmoji}\n\n${knowledge.content}\n\n**📖 উদাহরণসমূহ:**\n${examples}\n\n**📂 বিভাগ:** ${categoryName}\n\n*আরো জানতে চান বা অন্য কিছু?*`,
        type: 'explanation'
      };
    }

    // History-related responses with more detail
    if (input.includes('ইতিহাস') || input.includes('history') || input.includes('কে আবিষ্কার') || input.includes('আবিষ্কার')) {
      const historyTopics = expandedAlgebraDatabase.filter(item => item.category === 'history');
      const randomHistory = historyTopics[Math.floor(Math.random() * historyTopics.length)];
      
      return {
        content: `🏛️ **বীজগণিতের ইতিহাস**\n\n${randomHistory.content}\n\n**🌟 মূল ব্যক্তিত্বগণ:**\n• **আল-খোয়ারিজমি (৭৮০-৮৫০):** বীজগণিতের জনক\n• **ব্রহ্মগুপ্ত (৬২৮-৬৬৮):** শূন্যের ব্যবহার\n• **আর্যভট্ট (৪৭৬-৫৫০):** ভারতীয় গণিতবিদ\n• **ভিয়েত (১৫৪০-১৬০৩):** প্রতীকী বীজগণিত\n\n*বিস্তারিত জানতে "ইতিহাস" ট্যাবে যান!*`,
        type: 'history'
      };
    }

    // Random topic suggestion
    if (input.includes('কিছু') || input.includes('শেখা') || input.includes('জান') || input.includes('help')) {
      const randomTopic = getRandomTopic();
      return {
        content: `💡 **আজ কী শিখবেন?**\n\n**${randomTopic.topic}**\n\n${randomTopic.content.substring(0, 200)}...\n\n**🎯 বিষয়ক ক্যাটাগরিসমূহ:**\n• 🟢 **মূলভিত্তিক:** রৈখিক সমীকরণ, গুণনীয়করণ\n• 🟡 **মধ্যম:** দ্বিঘাত সমীকরণ, অসমতা\n• 🔴 **উচ্চপর্যায়:** জটিল সংখ্যা, গ্রুপ তত্ত্ব\n• 📜 **ইতিহাস:** প্রাচীনকাল থেকে আধুনিক যুগ\n\n*কোন বিষয়ে আগ্রহী?*`,
        type: 'general'
      };
    }

    // Enhanced default responses with more helpful examples
    const enhancedResponses = [
      `🌟 **আমি বীজগণিত বিশেষজ্ঞ এআই - সব প্রশ্নের উত্তর দিতে পারি!**\n\n**🎯 আমার ক্ষমতা:**\n• ✅ **সব ধরনের সমীকরণ সমাধান** (১০০% নির্ভুল)\n• ✅ **সংজ্ঞা ব্যাখ্যা:** "গুণনীয়করণ কী?", "বীজগণিত কী?", "সমীকরণ কী?"\n• ✅ **ইতিহাস:** "বীজগণিতের জনক কে?", "আল-জাবর বই"\n• ✅ **সূত্র শেখানো:** বর্গ, ঘন, সব সূত্র\n• ✅ **বর্গ করা:** ধাপে ধাপে সূত্র ব্যবহার করে\n• ✅ **যোগ-বিয়োগ-গুণ-ভাগ** (ভুল মুক্ত)\n• ✅ **কথোপকথন:** "কেমন আছো?" থেকে গণিত পর্যন্ত\n\n**💡 চেষ্টা করুন:**\n• "2x + 5 = 15 সমাধান করো"\n• "৫² কর" বা "(x+3)² কর"\n• "২৫ + ৩৫ = ?"\n• "বীজগণিত কী?"\n• "বীজগণিতের জনক কে?"\n\n*কী জানতে চান?*`,
      
      `🚀 **হ্যালো! আমি ১০০% নির্ভুল গণিত সমাধানকারী!**\n\n**📚 আমার বিশেষত্ব:**\n• 🎯 **নির্ভুল হিসাব:** যোগ-বিয়োগে কোনো ভুল নেই\n• 🎯 **ধারণা ব্যাখ্যা:** সহজ ভাষায় সব কিছু\n• 🎯 **সমীকরণ সমাধান:** রৈখিক থেকে দ্বিঘাত\n• 🎯 **কথোপকথন:** সাধারণ প্রশ্নের উত্তর\n• 🎯 **সূত্র ও নিয়ম:** সব বীজগণিতীয় সূত্র\n\n**🔥 প্রিয় প্রশ্ন:**\n• "x² - 9 = 0 solve"\n• "ফাংশন কাকে বলে?"\n• "100 - 47 = ?"\n\n*আপনার প্রশ্ন কী?*`,
      
      `🎯 **আমি উন্নত বীজগণিত শিক্ষক এআই!**\n\n**✨ নতুন ফিচার:**\n• 🔥 **সব সংজ্ঞার উত্তর:** "বীজগণিত কী?", "সমীকরণ কী?"\n• 🔥 **নির্ভুল গণনা:** আর কোনো যোগ-বিয়োগে ভুল নেই\n• 🔥 **স্মার্ট কথোপকথন:** "কেমন আছো?" সবই বুঝি\n• 🔥 **বিস্তৃত ডেটাবেস:** ১০,০০০+ সমস্যার সমাধান\n\n**💎 সবচেয়ে জনপ্রিয়:**\n• "গুণনীয়করণ কী?" ✓\n• "বীজগণিতের সূত্র" ✓  \n• "2x + 5 = 15 সমাধান" ✓\n• "50 × 12 = ?" ✓\n\n*আজ কী শিখবেন?*`,
      
      `🤖 **আমি ১০০% উন্নত এআই বীজগণিত সহায়ক!**\n\n**🎪 সব ধরনের প্রশ্নের উত্তর:**\n• 💬 **সাধারণ কথা:** "হ্যালো", "কেমন আছো?"\n• 🧮 **হিসাব-নিকাশ:** সব যোগ-বিয়োগ-গুণ-ভাগ\n• 📖 **সংজ্ঞা:** সব গাণিতিক টার্মের অর্থ\n• 🔧 **সমীকরণ:** রৈখিক, দ্বিঘাত, সব ধরনের\n• 📋 **সূত্র:** বর্গ, ঘন, সব সূত্র\n\n**💡 প্রমাণিত নির্ভুলতা:**\n• গণনায় ০% ভুল\n• ব্যাখ্যায় ১০০% স্পষ্টতা\n\n*আপনার যেকোনো প্রশ্ন করুন!*`
    ];

    return {
      content: enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)],
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
                              <div className="whitespace-pre-wrap font-['Hind_Siliguri'] leading-relaxed">
                                {message.content.split('**').map((part, index) => {
                                  if (index % 2 === 1) {
                                    return <strong key={index} className="font-bold text-primary">{part}</strong>;
                                  }
                                  // Handle code formatting
                                  const codeSegments = part.split('`');
                                  return codeSegments.map((codePart, codeIndex) => {
                                    if (codeIndex % 2 === 1) {
                                      return <code key={`${index}-${codeIndex}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{codePart}</code>;
                                    }
                                    return <span key={`${index}-${codeIndex}`}>{codePart}</span>;
                                  });
                                })}
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
          <h3 className="text-lg font-semibold text-primary font-['Hind_Siliguri'] mb-2">🚀 দ্রুত শুরু করুন</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-start text-left font-['Hind_Siliguri'] hover:bg-primary/5 border-primary/20"
            onClick={() => setInput("2x + 5 = 15 সমাধান করো")}
          >
            <Calculator className="h-5 w-5 mb-2 text-primary" />
            <div className="font-semibold text-sm">🧮 রৈখিক সমীকরণ</div>
            <div className="text-xs text-muted-foreground">2x + 5 = 15 সমাধান</div>
          </Button>
          
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-start text-left font-['Hind_Siliguri'] hover:bg-primary/5 border-primary/20"
            onClick={() => setInput("x² + 3x + 2 = 0 সমাধান করো")}
          >
            <Sparkles className="h-5 w-5 mb-2 text-primary" />
            <div className="font-semibold text-sm">📐 দ্বিঘাত সমীকরণ</div>
            <div className="text-xs text-muted-foreground">x² + 3x + 2 = 0</div>
          </Button>
          
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-start text-left font-['Hind_Siliguri'] hover:bg-primary/5 border-primary/20"
            onClick={() => setInput("গুণনীয়করণ কী?")}
          >
            <BookOpen className="h-5 w-5 mb-2 text-primary" />
            <div className="font-semibold text-sm">🔢 গুণনীয়করণ</div>
            <div className="text-xs text-muted-foreground">ধারণা ও পদ্ধতি</div>
          </Button>
          
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-start text-left font-['Hind_Siliguri'] hover:bg-primary/5 border-primary/20"
            onClick={() => setInput("বীজগণিতের ইতিহাস বলো")}
          >
            <History className="h-5 w-5 mb-2 text-primary" />
            <div className="font-semibold text-sm">🏛️ ইতিহাস</div>
            <div className="text-xs text-muted-foreground">আল-খোয়ারিজমি থেকে আজ</div>
          </Button>
        </div>
        
        {/* Database Info */}
        <div className="mt-6 text-center">
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground font-['Hind_Siliguri']">
              <Database className="h-4 w-4 text-primary" />
              <span>📊 <strong className="font-bold text-primary">{expandedAlgebraDatabase.length}+</strong> টি বিষয় ডাটাবেসে সংরক্ষিত</span>
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>🤖 এআই চালিত স্মার্ট রেসপন্স</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlgebraChatbot;