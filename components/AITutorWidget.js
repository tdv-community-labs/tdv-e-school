import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const AITutorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Salam! Mən sizin şəxsi Süni İntellekt Müəlliminizəm. Hansı dərsdə və ya tapşırıqda çətinlik çəkirsiniz?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Bu çox maraqlı sualdır! Riyazi baxımdan yanaşsaq, ilk növbədə verilənləri diqqətlə təhlil etməliyik. Əgər istəsəniz, bu mövzunu addım-addım birlikdə həll edə bilərik.'
      };
      setMessages(prev => [...prev, aiReply]);
    }, 2000);
  };

  return html`
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Chat Window */}
      ${isOpen && html`
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl w-[320px] sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden origin-bottom-right transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Gemini AI Müəllim</h3>
                <p className="text-indigo-100 text-[10px] uppercase tracking-wider">Həmişə onlayndır</p>
              </div>
            </div>
            <button onClick=${() => setIsOpen(false)} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref=${chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/50">
            ${messages.map(msg => html`
              <div key=${msg.id} className=\`flex \${msg.sender === 'user' ? 'justify-end' : 'justify-start'}\`>
                <div className=\`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm \${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50 rounded-tl-sm'
                }\`>
                  ${msg.text}
                </div>
              </div>
            `)}
            
            {/* Typing Indicator */}
            ${isTyping && html`
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1.5 items-center w-16">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style=${{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style=${{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style=${{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            `}
          </div>

          {/* Input Area */}
          <form onSubmit=${handleSend} className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <input 
              type="text" 
              value=${input}
              onChange=${(e) => setInput(e.target.value)}
              placeholder="Sualınızı bura yazın..." 
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              type="submit"
              disabled=${!input.trim()}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>

        </div>
      `}

      {/* Floating Button */}
      <button 
        onClick=${() => setIsOpen(!isOpen)}
        className=\`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-110 \${
          isOpen ? 'bg-zinc-800 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-blue-500 hover:shadow-[0_10px_40px_rgba(79,70,229,0.6)]'
        }\`
      >
        <i className=\`fa-solid \${isOpen ? 'fa-xmark text-xl' : 'fa-robot text-2xl'}\`></i>
      </button>

    </div>
  `;
};
