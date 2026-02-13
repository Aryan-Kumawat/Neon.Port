import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

// Using a type guard for safety with the environment variable
const API_KEY = process.env.API_KEY || '';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const GeminiChat: React.FC = () => {
  const { content, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Default to config value but allow local state override for animation/updates
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages with the configurable welcome message
  useEffect(() => {
    // Only set initial message if empty to avoid overwriting chat history during editing
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: content.ui.chat.welcomeMessage }]);
    }
  }, [content.ui.chat.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !API_KEY) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const contextPrompt = `
        You are an AI portfolio assistant.
        Here is the profile data:
        Name: ${content.about.name}
        Role: ${content.about.roles.join(', ')}
        Bio: ${content.about.bio}
        Projects: ${content.projects.map(p => `${p.title}: ${p.description}`).join('; ')}
        
        Answer questions concisely and professionally.
        Keep the tone enthusiastic, tech-savvy, and friendly.
        If asked about contact info, provide: ${content.about.email}.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        contents: [
          { role: 'user', parts: [{ text: contextPrompt + "\n\nUser Question: " + userMsg.text }] }
        ],
      });

      const text = response.text || "I'm having trouble connecting to the neural network right now.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: AI offline. Check API Key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        <div className={`
          pointer-events-auto
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}
          glass-panel rounded-2xl w-80 sm:w-96 shadow-2xl overflow-hidden mb-4 border border-primary/30
        `}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/50 to-secondary/50 p-4 border-b border-white/10 flex justify-between items-center group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-display font-bold text-sm tracking-wider uppercase">{content.ui.chat.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-white/50 hover:text-white mr-2"
                  title="Edit Chat Settings"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] rounded-2xl p-3 text-sm
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl p-3 rounded-bl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-black/60 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={content.ui.chat.placeholder}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder-white/30"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            pointer-events-auto
            w-14 h-14 rounded-full glass-panel border-primary/50
            flex items-center justify-center shadow-[0_0_30px_rgba(var(--color-primary),0.4)]
            hover:scale-110 transition-transform duration-300
            bg-gradient-to-br from-primary/80 to-black
          `}
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </button>
      </div>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(data) => {
          updateUI('chat', data);
          // Update local state to reflect change immediately if chat is open
          if (messages.length > 0 && messages[0].role === 'model') {
             const newMsgs = [...messages];
             newMsgs[0] = { ...newMsgs[0], text: data.welcomeMessage };
             setMessages(newMsgs);
          }
          setIsEditing(false);
        }}
        title="Chat Settings"
        initialData={content.ui.chat}
        schema={[
          { key: 'title', label: 'Chat Window Title', type: 'text' },
          { key: 'welcomeMessage', label: 'Welcome Message', type: 'textarea' },
          { key: 'placeholder', label: 'Input Placeholder', type: 'text' },
        ]}
      />
    </>
  );
};
