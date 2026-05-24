import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Send, User, Bot, AlertCircle, Paperclip, FileText, Trash2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import './Chatbot.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const QUICK_SUGGESTIONS = [
  'Best universities for AI research?',
  'Which professors work on Computer Vision?',
  'Compare ML programs in USA vs Europe',
  'Top universities for NLP research',
  'Suggest universities for my profile',
  'What are admission requirements for PhD?',
];

const formatTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Simple markdown-like formatter for AI responses.
 * Handles **bold**, bullet points, numbered lists, headings (###), and newlines.
 */
const formatAIResponse = (text) => {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h3>$1</h3>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Bullet points
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Numbered lists
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h3>)/g, '$1');
  html = html.replace(/(<\/h3>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');

  return html;
};

const GeminiChat = ({ universities }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFileText, setAttachedFileText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const handleFileUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    try {
      let text = '';
      if (f.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ') + '\n';
        }
      } else {
        text = await f.text();
      }
      setAttachedFile({ name: f.name, size: f.size });
      setAttachedFileText(text.substring(0, 8000)); // limit
    } catch (err) {
      console.error('Failed to read file:', err);
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setAttachedFileText('');
  };

  const sendMessage = useCallback(
    async (messageText) => {
      const text = messageText || input.trim();
      if (!text && !attachedFileText) return;

      const userMessage = {
        role: 'user',
        content: text + (attachedFile ? `\n\n[Attached file: ${attachedFile.name}]` : ''),
        time: formatTime(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      const fileContext = attachedFileText
        ? `\n\nThe user has attached a file "${attachedFile?.name}" with the following content:\n${attachedFileText}\n\n`
        : '';

      // Clear attachment after sending
      setAttachedFile(null);
      setAttachedFileText('');

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            fileContext,
            history: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error ${res.status}`);
        }

        const data = await res.json();
        const aiMessage = {
          role: 'assistant',
          content: data.response || 'No response received.',
          time: formatTime(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: err.message || 'Failed to get response from Gemini.',
            time: formatTime(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, attachedFile, attachedFileText]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChipClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`gemini-fab ${isOpen ? 'gemini-fab--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Gemini AI Chat"
        id="gemini-chat-fab"
      >
        <Sparkles size={22} />
        <span className="gemini-fab__label">AI Advisor</span>
      </button>

      {/* Overlay */}
      <div
        className={`chatbot-overlay ${isOpen ? 'chatbot-overlay--visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`chatbot-drawer ${isOpen ? 'chatbot-drawer--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header__title-group">
            <Sparkles size={20} className="chatbot-header__icon" />
            <span className="chatbot-header__title">Gemini AI Advisor</span>
          </div>
          <button
            className="chatbot-header__close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <>
              <div className="chatbot-welcome">
                <div className="chatbot-welcome__avatar">
                  <Sparkles size={24} />
                </div>
                <p className="chatbot-welcome__text">
                  Hi! I'm your <strong>Gemini AI Advisor</strong>. Ask me about
                  universities, professors, research areas, admission
                  requirements, or upload your resume for personalized
                  suggestions. 🎓
                </p>
              </div>
              <div className="chatbot-chips">
                {QUICK_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chatbot-chip"
                    onClick={() => handleChipClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((msg, idx) => {
            if (msg.role === 'error') {
              return (
                <div key={idx} className="chatbot-error">
                  <AlertCircle size={16} />
                  <span>{msg.content}</span>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`chatbot-msg chatbot-msg--${msg.role}`}
              >
                <div className="chatbot-msg__label">
                  {msg.role === 'user' ? (
                    <>
                      <User size={13} /> You
                    </>
                  ) : (
                    <>
                      <Bot size={13} /> Gemini
                    </>
                  )}
                </div>
                <div
                  className="chatbot-msg__bubble"
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.role === 'assistant'
                        ? formatAIResponse(msg.content)
                        : msg.content.replace(/\n/g, '<br/>'),
                  }}
                />
                <span className="chatbot-msg__time">{msg.time}</span>
              </div>
            );
          })}

          {isLoading && (
            <div className="chatbot-typing">
              <div className="chatbot-typing__label">
                <Bot size={13} /> Gemini is thinking...
              </div>
              <div className="chatbot-typing__dots">
                <div className="chatbot-typing__dot" />
                <div className="chatbot-typing__dot" />
                <div className="chatbot-typing__dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File attachment preview */}
        {attachedFile && (
          <div className="chatbot-attachment">
            <FileText size={14} />
            <span className="chatbot-attachment__name">{attachedFile.name}</span>
            <span className="chatbot-attachment__size">
              ({Math.round(attachedFile.size / 1024)}KB)
            </span>
            <button
              className="chatbot-attachment__remove"
              onClick={removeAttachment}
              aria-label="Remove attachment"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="chatbot-input-area">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.doc,.docx,.csv"
            style={{ display: 'none' }}
            id="chat-file-upload"
          />
          <button
            className="chatbot-input-area__attach-btn"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            title="Upload a file (PDF, TXT, CSV)"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input-area__field"
            placeholder="Ask about universities, professors, admissions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="chatbot-input-area__send-btn"
            onClick={() => sendMessage()}
            disabled={isLoading || (!input.trim() && !attachedFileText)}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default GeminiChat;
