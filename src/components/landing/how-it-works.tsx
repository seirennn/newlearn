'use client';

import { useTheme } from './theme-context';
import { Upload, MessageSquare, Sparkles, Book, Search, Lightbulb, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    name: 'Upload & Process',
    description: 'Simply upload your PDFs, paste text, or share YouTube videos. Our AI instantly processes and understands your content.',
    icon: Upload,
    demo: 'upload',
    previewImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    name: 'Interactive Learning',
    description: 'Engage in natural conversations with our AI. Ask questions, get explanations, and dive deep into any topic.',
    icon: MessageSquare,
    demo: 'chat',
    previewImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    name: 'Smart Progress',
    description: 'Track your understanding with personalized insights and adaptive learning paths tailored to your needs.',
    icon: Sparkles,
    demo: 'progress',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=300'
  },
];

function UploadDemo({ isDark }: { isDark: boolean }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [dropAnimation, setDropAnimation] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setDropAnimation(true);
    
    // Simulate file drop animation then upload
    setTimeout(() => {
      setDropAnimation(false);
      handleUpload();
    }, 500);
  };

  const handleUpload = () => {
    if (!uploaded) {
      setFileName('learning-material.pdf');
      setShowProgress(true);
      setTimeout(() => {
        setShowProgress(false);
        setUploaded(true);
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-colors relative
          ${isDark
            ? dragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-zinc-700 hover:border-zinc-600'
            : dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-200 hover:border-zinc-300'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        animate={{
          scale: dragActive ? 1.02 : 1,
          borderWidth: dragActive ? '3px' : '2px',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {!uploaded ? (
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{
                scale: dropAnimation ? 0.8 : 1,
                opacity: dropAnimation ? 0 : 1,
              }}
            >
              <motion.div
                className={`p-3 rounded-full ${
                  isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                }`}
                animate={{ 
                  y: dragActive ? -10 : 0,
                  scale: dragActive ? 1.1 : 1,
                }}
              >
                <Upload className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
              </motion.div>
              <div className="text-center">
                <p className={`font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  Drop your PDF here
                </p>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  or click to browse
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Check className="text-green-500" />
              <span className={isDark ? 'text-zinc-200' : 'text-zinc-700'}>
                {fileName} uploaded successfully!
              </span>
            </motion.div>
          )}
        </div>
        {showProgress && (
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-blue-500`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </div>
  );
}

function ChatDemo({ isDark }: { isDark: boolean }) {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);
  const [isDemoComplete, setIsDemoComplete] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const isMountedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const simulateTyping = async (text: string) => {
    if (!isMountedRef.current) return;
    setIsSimulatingTyping(true);
    let currentText = "";

    for (let i = 0; i < text.length; i++) {
      if (!isMountedRef.current) return;
      currentText += text[i];
      setInputMessage(currentText);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    if (!isMountedRef.current) return;
    setMessages(prev => [...prev, { text, isAi: false }]);
    setInputMessage("");
    setIsSimulatingTyping(false);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
    setInputMessage("");
    setIsDemoComplete(false);
    isMountedRef.current = true;

    const conversation = [
      { text: "Hello, I'm here to assist you navigate and understand your material, Let's get started, Feel free to ask me anything related to the PDF document", isAi: true },
      { text: "Can you explain the concept of a neural network from the PDF?", isAi: false },
      { text: "A neural network is like a digital brain that processes information similar to how our brains work. It consists of interconnected nodes that learn patterns from data.", isAi: true },
      { text: "How do they learn from data?", isAi: false },
      { text: "Neural networks learn through a process called training. They analyze examples, adjust their connections, and gradually improve their accuracy in making predictions or decisions.", isAi: true }
    ];

    const addMessage = async (index: number) => {
      if (!isMountedRef.current || index >= conversation.length) {
        if (isMountedRef.current) {
          setIsDemoComplete(true);
          setIsSimulatingTyping(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        return;
      }

      const message = conversation[index];
      if (message.isAi) {
        setIsTyping(true);
        const typingTimeout = window.setTimeout(() => {
          if (!isMountedRef.current) return;
          setMessages(prev => [...prev, message]);
          setIsTyping(false);
          const nextTimeout = window.setTimeout(() => addMessage(index + 1), 1500);
          timeoutsRef.current.push(nextTimeout);
        }, 1000);
        timeoutsRef.current.push(typingTimeout);
      } else {
        await simulateTyping(message.text);
        if (!isMountedRef.current) return;
        const nextTimeout = window.setTimeout(() => addMessage(index + 1), 500);
        timeoutsRef.current.push(nextTimeout);
      }
    };

    addMessage(0);

    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isSimulatingTyping) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setInputMessage("");

    // Keep focus on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Simulate AI response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!isMountedRef.current) return;
    setIsTyping(false);
    setMessages(prev => [...prev, {
      text: "Try out our product instead",
      isAi: true
    }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSimulatingTyping || isDemoComplete) {
      setInputMessage(e.target.value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && (!isSimulatingTyping || isDemoComplete)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
 <div className={`h-full p-4 flex flex-col ${isDark ? 'bg-zinc-900/50' : 'bg-white/50'} overflow-hidden`}>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${message.isAi
                    ? isDark
                      ? 'bg-zinc-800 text-zinc-200'
                      : 'bg-zinc-100 text-zinc-800'
                    : isDark
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-2 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                }`}>
                <div className="flex space-x-1">
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                  />
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input Box */}
      <div
        className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-white'} shadow-lg`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={isDemoComplete ? "Type your message..." : "Type your message..."}
          disabled={isSimulatingTyping && !isDemoComplete}
          className={`flex-1 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
              ? 'bg-zinc-700 text-white placeholder-zinc-400'
              : 'bg-gray-100 text-gray-900 placeholder-gray-400'
            } ${(isSimulatingTyping && !isDemoComplete) ? 'cursor-not-allowed' : ''}`}
        />
        <button
          onClick={() => !((isSimulatingTyping && !isDemoComplete) || !inputMessage.trim()) && handleSendMessage()}
          disabled={(isSimulatingTyping && !isDemoComplete) || !inputMessage.trim()}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${isDark
              ? ((isSimulatingTyping && !isDemoComplete) || !inputMessage.trim())
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              : ((isSimulatingTyping && !isDemoComplete) || !inputMessage.trim())
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProgressDemo({ isDark }: { isDark: boolean }) {
  const [selectedMetric, setSelectedMetric] = useState('mastery');
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const metrics = [
    {
      id: 'mastery',
      title: 'Content Mastery',
      progress: 85,
      icon: Book,
      color: 'green',
      details: ['Chapter 1: 100%', 'Chapter 2: 90%', 'Chapter 3: 65%']
    },
    {
      id: 'coverage',
      title: 'Topic Coverage',
      progress: 60,
      icon: Search,
      color: 'blue',
      details: ['Basic Concepts: 100%', 'Advanced Topics: 45%', 'Practice: 35%']
    },
    {
      id: 'insights',
      title: 'Learning Insights',
      progress: 75,
      icon: Lightbulb,
      color: 'purple',
      details: ['Strong: Data Structures', 'Improving: Algorithms', 'Focus: Dynamic Programming']
    }
  ];

  return (
    <div className={`h-full p-6 ${isDark ? 'bg-zinc-900/50' : 'bg-white/50'} overflow-hidden`}>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={`p-4 rounded-xl transition-colors duration-200 cursor-pointer
              ${isDark 
                ? isHovered === metric.id ? 'bg-zinc-800/90' : 'bg-zinc-800/70' 
                : isHovered === metric.id ? 'bg-zinc-100' : 'bg-zinc-50'
              }
              ${selectedMetric === metric.id ? 'ring-2 ring-offset-2 ' + 
                (isDark ? 'ring-offset-zinc-900' : 'ring-offset-white') + ' ' +
                (metric.color === 'green' ? 'ring-green-500' : 
                 metric.color === 'blue' ? 'ring-blue-500' : 'ring-purple-500')
                : ''
              }
            `}
            onClick={() => setSelectedMetric(metric.id)}
            onMouseEnter={() => setIsHovered(metric.id)}
            onMouseLeave={() => setIsHovered(null)}
            initial={false}
            animate={{
              scale: selectedMetric === metric.id ? 1.02 : 1,
              y: isHovered === metric.id ? -2 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}
                  whileHover={{ rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <metric.icon className={`w-5 h-5 ${
                    metric.color === 'green' ? 'text-green-500' :
                    metric.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                  }`} />
                </motion.div>
                <div>
                  <h3 className={`font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                    {metric.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {metric.progress}% Complete
                  </p>
                </div>
              </div>
              <motion.div 
                className={`h-10 w-10 rounded-full flex items-center justify-center
                  ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`text-sm font-medium ${
                  metric.color === 'green' ? 'text-green-500' :
                  metric.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                }`}>
                  {metric.progress}%
                </span>
              </motion.div>
            </div>
            
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
              <motion.div
                className={`h-full ${
                  metric.color === 'green' ? 'bg-green-500' :
                  metric.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${metric.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>

            {selectedMetric === metric.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                {metric.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
                  >
                    • {detail}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DemoCard({
  step,
  isActive,
  onClick,
  isDark,
  className = ''
}: {
  step: typeof steps[0];
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
  className?: string;
}) {
  const bgClass = isDark
    ? isActive
      ? 'bg-zinc-800/90 ring-1 ring-zinc-700'
      : 'bg-zinc-800/50 hover:bg-zinc-900/70'
    : isActive
      ? 'bg-white ring-1 ring-zinc-200 shadow-lg'
      : 'bg-zinc-200/50 hover:bg-white/90';

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden cursor-pointer backdrop-blur-sm
        transition-colors duration-300
        ${bgClass}
        ${className}
      `}
      whileHover={{ scale: isActive ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full h-full">
        {/* Demo Content */}
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {step.demo === 'upload' && <UploadDemo isDark={isDark} />}
              {step.demo === 'chat' && <ChatDemo isDark={isDark} />}
              {step.demo === 'progress' && <ProgressDemo isDark={isDark} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Overlay */}
        <motion.div
          className={`absolute inset-0 p-6 flex flex-col justify-end
            ${!isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          animate={{ opacity: isActive ? 0 : 1 }}
        >
          {/* Preview Image - only in preview state */}
          {!isActive && (
            <div 
              className="absolute right-1/2 translate-x-1/2 top-4 w-[20rem] h-[11rem] rounded-lg overflow-hidden ring-1 ring-black/5"
              style={{
                backgroundImage: `url(${step.previewImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}

          <div className={`relative p-4 rounded-xl backdrop-blur-sm z-10
            ${isDark
              ? 'bg-zinc-900/70 ring-1 ring-white/10'
              : 'bg-white/70 ring-1 ring-black/5'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg 
                ${isDark
                  ? 'bg-zinc-800 ring-1 ring-white/10'
                  : 'bg-zinc-100 ring-1 ring-black/5'
                }`}
              >
                <step.icon className={`w-5 h-5 ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {step.name}
              </h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {step.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const isProgressActive = activeStep === 2;
  const isUploadActive = activeStep === 0;
  const isChatActive = activeStep === 1;

  const getLayoutClass = () => {
    if (isProgressActive) return 'grid-cols-1 md:grid-cols-[1fr,1.5fr]';
    if (isUploadActive || isChatActive) return 'grid-cols-1 md:grid-cols-[1.5fr,1fr]';
    return 'grid-cols-2 md:grid-cols-3';
  };

  return (
    <section id="how-it-works" className={`py-24 transition-colors duration-300 scroll-mt-32
      ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Experience a new way of learning through our intuitive three-step process
            </p>
          </motion.div>
        </div>

        <div className={`grid gap-6 max-w-6xl mx-auto ${getLayoutClass()}`}>
          {/* Active card container */}
          {(isUploadActive || isChatActive) && (
            <motion.div
              layout
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <DemoCard
                step={steps[activeStep]}
                isActive={true}
                onClick={() => setActiveStep(null)}
                isDark={isDark}
                className="h-full"
              />
            </motion.div>
          )}

          {/* Container for inactive cards */}
          <motion.div
            layout
            className={`${activeStep !== null
              ? 'space-y-6'
              : 'col-span-2 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6'
              }`}
          >
            {steps.map((step, index) => {
              if (index === activeStep) return null;

              return (
                <DemoCard
                  key={index}
                  step={step}
                  isActive={false}
                  onClick={() => setActiveStep(index)}
                  isDark={isDark}
                  className={
                    activeStep !== null
                      ? 'aspect-[4/3]' // More compact when another card is active
                      : 'aspect-square' // Full size when no card is active
                  }
                />
              );
            })}
          </motion.div>

          {/* Progress card when active */}
          {isProgressActive && (
            <motion.div
              layout
              className="col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <DemoCard
                step={steps[2]}
                isActive={true}
                onClick={() => setActiveStep(null)}
                isDark={isDark}
                className="h-full"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
