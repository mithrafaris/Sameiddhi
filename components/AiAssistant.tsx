'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hi there! I am Preethika AI. How can I assist you with your premium shopping experience today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiText = "I'm currently a demo assistant, but I can help you find products, track orders, or answer questions about our brand!";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiText = 'Hello! Welcome to Preethika. Are you looking for anything specific today?';
      } else if (lowerInput.includes('order') || lowerInput.includes('track')) {
        aiText = 'You can track your latest orders by heading over to the Orders section in your profile dashboard.';
      } else if (lowerInput.includes('recommend') || lowerInput.includes('best')) {
        aiText = 'Based on current trends, our AeroBuds Pro and Chronos Smartwatch are bestsellers this week. Check them out in the catalog!';
      } else if (lowerInput.includes('return') || lowerInput.includes('refund')) {
        aiText = 'We offer a 30-day seamless return policy. If you are not satisfied, you can initiate a return from your order history.';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow group"
          >
            <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] glass-card border border-zinc-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-zinc-950/80 px-5 py-4 border-b border-zinc-850">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Preethika AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-900/30 custom-scrollbar">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.sender === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm' 
                        : 'bg-zinc-950/80 border border-zinc-850 text-zinc-300 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 rounded-tl-sm flex items-center gap-1.5">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950/80 border-t border-zinc-850">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 rounded-full bg-zinc-900 border border-zinc-800 py-3 pl-5 pr-12 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
