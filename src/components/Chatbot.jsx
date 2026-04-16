import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Mic, MicOff, Play, FileText, HelpCircle, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

// Move outside component so it doesn't recreate every render
const chatbotResponses = {
  en: {
    greeting: "Hello! I am your NeuroSense assistant. How can I help you today?",
    explainApp: "NeuroSense-AI is a voice-based system that helps detect early signs of dementia by analyzing speech patterns and cognitive responses.",
    startTest: "Let's start your voice assessment. Redirecting you...",
    howToUse: "You can ask me to start a test, show your results, or play memory games. Just tap the quick buttons below or speak to me!",
    showResults: "Taking you to your progress and risk results...",
    games: "Let's play some cognitive games. Redirecting...",
    help: "I can help you navigate. Try saying 'Start test', 'Games', or 'Show results'.",
    
    feelings: "I am glad to hear! Can you tell me more about how you are feeling today?",
    eat: "That sounds interesting! What did you eat today?",
    day: "Can you describe how your day went today?",
    
    fallback: "I'm sorry, I didn't quite catch that. You can ask me to explain the app, start a test, or click the quick actions below.",

    quickActionPlay: "Start test",
    quickActionResults: "Show results",
    quickActionHelp: "Help",
    quickActionGames: "Games",

    quickActionPlayLabel: "Start Test",
    quickActionResultsLabel: "View Results",
    quickActionHelpLabel: "Help",
    quickActionGamesLabel: "Play Games",
    
    inputPlaceholder: "Type here..."
  },
  mr: {
    greeting: "नमस्कार! मी तुमचा न्यूरोसेन्स असिस्टंट आहे. मी तुम्हाला कशी मदत करू शकतो?",
    explainApp: "NeuroSense-AI हे एक व्हॉइस-आधारित सिस्टम आहे जे बोलण्याच्या पद्धतीवरून डिमेंशियाचे सुरुवातीचे संकेत ओळखते.",
    startTest: "चला तुमची व्हॉइस चाचणी सुरू करूया. तुम्हाला तिथे नेत आहे...",
    howToUse: "तुम्ही मला चाचणी सुरू करायला, निकाल दाखवायला किंवा गेम्स खेळायला सांगू शकता. खालील बटणे दाबा किंवा माझ्याशी बोला!",
    showResults: "तुम्हाला तुमच्या प्रगती आणि जोखमीच्या निकालांवर नेत आहे...",
    games: "चला काही गेम खेळूया. गेम पेजवर नेत आहे...",
    help: "मी तुम्हाला मदत करू शकतो. 'चाचणी सुरू करा', 'गेम', किंवा 'निकाल दाखवा' असे विचारून पहा.",

    feelings: "हे ऐकून आनंद झाला! आज तुम्हाला कसं वाटत आहे, याबद्दल आणखी सांगू शकाल का?",
    eat: "छान! आज तुम्ही काय खाल्लं?",
    day: "तुमचा आजचा दिवस कसा गेला, हे सांगू शकाल का?",

    fallback: "क्षमस्व, मला ते समजले नाही. तुम्ही मला अॅपबद्दल विचारू शकता, चाचणी सुरू करायला सांगू शकता किंवा खालील बटणे क्लिक करू शकता.",
    
    quickActionPlay: "चाचणी सुरू करा",
    quickActionResults: "निकाल पहा",
    quickActionHelp: "मदत",
    quickActionGames: "गेम्स खेळा",
    
    quickActionPlayLabel: "चाचणी सुरू करा",
    quickActionResultsLabel: "निकाल पहा",
    quickActionHelpLabel: "मदत",
    quickActionGamesLabel: "गेम्स खेळा",

    inputPlaceholder: "येथे टाइप करा..."
  }
};

export default function Chatbot() {
  const { language } = useApp();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', key: 'greeting' }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, language]);

  // Speech Recognition Setup
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported in your browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getBotIntentKey = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('what is this app') || lowerText.includes('explain') || lowerText.includes('काय आहे') || lowerText.includes('माहिती द्या') || lowerText.includes('app')) {
      return 'explainApp';
    }
    if (lowerText.includes('start test') || lowerText.includes('voice assessment') || lowerText.includes('चाचणी सुरू') || lowerText.includes('test')) {
      setTimeout(() => navigate('/dashboard/speech'), 1500);
      return 'startTest';
    }
    if (lowerText.includes('how to use') || lowerText.includes('कस वापरायचं') || lowerText.includes('कसे वापरावे')) {
      return 'howToUse';
    }
    if (lowerText.includes('show results') || lowerText.includes('progress') || lowerText.includes('निकाल') || lowerText.includes('प्रगती') || lowerText.includes('results')) {
      setTimeout(() => navigate('/dashboard/progress'), 1500);
      return 'showResults';
    }
    if (lowerText.includes('help') || lowerText.includes('मदत')) {
      return 'help';
    }
    if (lowerText.includes('game') || lowerText.includes('गेम') || lowerText.includes('खेळा')) {
      setTimeout(() => navigate('/dashboard/games'), 1500);
      return 'games';
    }

    // Cognitive tracking intents
    if (lowerText.includes('feel') || lowerText.includes('वाटत')) {
      return 'feelings';
    }
    if (lowerText.includes('eat') || lowerText.includes('food') || lowerText.includes('खाल्लं') || lowerText.includes('जेवण')) {
      return 'eat';
    }
    if (lowerText.includes('day') || lowerText.includes('दिवस')) {
      return 'day';
    }

    // Default fallback - Ask a cognitive question back randomly to keep elder engaged
    const cognitives = ['feelings', 'eat', 'day'];
    const randomCognitiveKey = cognitives[Math.floor(Math.random() * cognitives.length)];
    
    return lowerText.length > 3 ? randomCognitiveKey : 'fallback';
  };

  const submitMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');

    // Simulate thinking
    setTimeout(() => {
      const intentKey = getBotIntentKey(text);
      setMessages(prev => [...prev, { sender: 'bot', key: intentKey }]);
    }, 800);
  };

  const handleSend = (e) => {
    e.preventDefault();
    submitMessage(inputValue);
  };

  const currentStrings = chatbotResponses[language] || chatbotResponses.en;

  const QuickActions = () => (
    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
      <button onClick={() => submitMessage(currentStrings.quickActionPlay)} className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm md:text-base rounded-xl transition-colors text-slate-800 dark:text-slate-200 font-medium">
        <Play className="h-5 w-5 text-primary-600 dark:text-primary-400" /> {currentStrings.quickActionPlayLabel}
      </button>
      <button onClick={() => submitMessage(currentStrings.quickActionResults)} className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm md:text-base rounded-xl transition-colors text-slate-800 dark:text-slate-200 font-medium">
        <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" /> {currentStrings.quickActionResultsLabel}
      </button>
      <button onClick={() => submitMessage(currentStrings.quickActionHelp)} className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm md:text-base rounded-xl transition-colors text-slate-800 dark:text-slate-200 font-medium">
        <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" /> {currentStrings.quickActionHelpLabel}
      </button>
      <button onClick={() => submitMessage(currentStrings.quickActionGames)} className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm md:text-base rounded-xl transition-colors text-slate-800 dark:text-slate-200 font-medium">
        <Gamepad2 className="h-5 w-5 text-primary-600 dark:text-primary-400" /> {currentStrings.quickActionGamesLabel}
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-5 shadow-xl transition-all hover:scale-105 flex items-center justify-center animate-bounce duration-1000"
          aria-label="Open Chat"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl w-[90vw] sm:w-[400px] flex flex-col h-[600px] max-h-[85vh] overflow-hidden transition-colors shadow-primary-500/10">
          {/* Header */}
          <div className="bg-primary-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <Bot className="h-7 w-7 opacity-90" />
              <div>
                <h3 className="font-bold text-xl leading-tight">NeuroSense AI</h3>
                <p className="text-sm text-primary-100 font-medium">Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-primary-100 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="h-7 w-7" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-slate-50 dark:bg-slate-950 space-y-5">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-auto shadow-sm">
                    <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div 
                  className={`p-4 rounded-2xl shadow-sm text-base sm:text-lg ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-sm leading-relaxed'
                  }`}
                >
                  {msg.sender === 'user' ? msg.text : currentStrings[msg.key] || msg.key}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Quick Actions */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <QuickActions />
            <form onSubmit={handleSend} className="flex relative mt-4 gap-2">
              <button
                type="button"
                onClick={toggleListen}
                className={`p-3 sm:p-4 rounded-full flex-shrink-0 transition-colors shadow-sm ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                aria-label="Voice Input"
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStrings.inputPlaceholder}
                className="flex-1 px-5 py-3 sm:py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full text-base sm:text-lg outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-inner"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 sm:p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full disabled:opacity-50 disabled:bg-slate-400 dark:disabled:bg-slate-700 transition-colors flex items-center justify-center flex-shrink-0 shadow-sm"
                aria-label="Send Message"
              >
                <Send className="h-6 w-6" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
