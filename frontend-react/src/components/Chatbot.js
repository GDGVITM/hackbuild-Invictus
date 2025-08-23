// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Ad-visor. How can I help you with your marketing questions?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...messages, { from: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      const data = await response.json();
      setMessages([...newMessages, { from: 'bot', text: data.reply || data.error }]);
    } catch (error) {
      setMessages([...newMessages, { from: 'bot', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Marketing Assistant</h3>
          <button onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <div className="chat-box" ref={chatboxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="chat-message bot loading"><span></span><span></span><span></span></div>}
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a marketing question..."
            aria-label="Your message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)} aria-label="Open chat">
        💬
      </button>
    </div>
  );
}