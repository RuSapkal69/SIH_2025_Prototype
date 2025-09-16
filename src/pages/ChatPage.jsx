import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Link } from 'react-router-dom';
import './ChatPage.css'; // Your custom CSS for animations

// --- Constants & Theme ---
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Using the secure .env variable
const backgroundImageUrl = 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2692&auto-format&fit-crop';
const systemInstruction = "You are a kind, empathetic, and professional therapist. Your primary goal is to provide a safe space for the user to express their feelings and to offer supportive, non-judgmental guidance. Use active listening, reflective questions, and validation. Do not give medical advice. Your responses should be calm, understanding, and focused on helping the user explore their emotions and thoughts. Your responses should be a few sentences long, never a single word. Based on my message, I have included a sentiment analysis of what I'm feeling (Positive, Negative, or Neutral). Use this information to tailor your response to my emotional state. If the user expresses severe distress or suicidal thoughts, strongly suggest professional help in India, as the user is from India. In such cases, provide contact details for a well-known mental health support organization like Aasra (Helpline: +91-9820466726) or Vandrevala Foundation (Helpline: +91-9999666555).";

// --- SVG Icons ---
const SmileIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg> );
const FrownIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg> );
const MehIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="8" x2="16" y1="15" y2="15" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg> );
const SendIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" /></svg> );
const HomeIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );

// --- Helper Functions from your new code ---
const getSentiment = (text) => {
    const lowerText = text.toLowerCase();
    const negativeWords = ['sad', 'down', 'anxious', 'depressed', 'lonely', 'terrible', 'awful', 'scared'];
    const positiveWords = ['happy', 'excited', 'great', 'joy', 'wonderful', 'amazing', 'love'];
    if (negativeWords.some(word => lowerText.includes(word))) return { label: 'Negative', icon: <FrownIcon className="w-4 h-4" /> };
    if (positiveWords.some(word => lowerText.includes(word))) return { label: 'Positive', icon: <SmileIcon className="w-4 h-4" /> };
    return { label: 'Neutral', icon: <MehIcon className="w-4 h-4" /> };
};

// --- State Management from your new code ---
const chatReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload];
        // Note: UPDATE_LAST_MESSAGE is available if you need streaming in the future
        case 'UPDATE_LAST_MESSAGE': 
            const newState = [...state];
            newState[newState.length - 1] = { ...newState[newState.length - 1], ...action.payload };
            return newState;
        default:
            return state;
    }
};

// --- Main Chat Component ---
const ChatPage = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, dispatchChat] = useReducer(chatReducer, []);
    const messagesEndRef = useRef(null);
    const welcomeMessageSent = useRef(false);

    useEffect(() => {
        if (!welcomeMessageSent.current) {
            dispatchChat({ type: 'ADD_MESSAGE', payload: { sender: 'therapist', text: "Hello, I'm here to listen. Feel free to share whatever is on your mind. This is a safe and non-judgmental space." }});
            welcomeMessageSent.current = true;
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // --- Merged sendMessage function with Safety Handling ---
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userSentiment = getSentiment(inputText);
        const userMessage = { sender: 'user', text: inputText, sentiment: userSentiment };
        dispatchChat({ type: 'ADD_MESSAGE', payload: userMessage });
        setInputText('');
        setIsLoading(true);

        const apiConversationHistory = [...chatHistory, userMessage].map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.sender === 'user' ? `${msg.text} (Sentiment: ${msg.sentiment.label})` : msg.text }]
        }));
        
        try {
            const payload = {
                contents: apiConversationHistory,
                systemInstruction: { parts: [{ text: systemInstruction }] },
            };

            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                console.warn("API response was blocked due to safety filters.", data);
                const safetyMessage = { sender: 'therapist', text: "It sounds like you are in serious distress. Please reach out for immediate help. You are not alone, and there is support available.\n\n**Aasra (India):**\nHelpline: +91-9820466726 (24/7)\nWebsite: aasra.info" };
                dispatchChat({ type: 'ADD_MESSAGE', payload: safetyMessage });
            } else {
                const therapistResponse = data.candidates[0]?.content?.parts?.[0]?.text;
                if (therapistResponse) {
                    dispatchChat({ type: 'ADD_MESSAGE', payload: { sender: 'therapist', text: therapistResponse } });
                } else {
                    throw new Error("Invalid response structure from API.");
                }
            }
        } catch (error) {
            console.error('Error fetching from Gemini API:', error);
            const fallbackMessage = { sender: 'therapist', text: "I'm sorry, I seem to be having trouble connecting. If you are in distress, please seek professional help. You can contact Aasra, a non-profit organization in India, at +91-9820466726." };
            dispatchChat({ type: 'ADD_MESSAGE', payload: fallbackMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className="w-full h-screen p-4 flex justify-center items-center bg-cover bg-center font-sans"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            <Link to="/" className="absolute top-5 left-5 p-3 bg-slate-50/70 backdrop-blur-lg rounded-full shadow-lg hover:bg-slate-50/90 transition-all group">
                <HomeIcon className="w-6 h-6 text-indigo-700 group-hover:scale-110 transition-transform" />
            </Link>

            <div className="bg-slate-50/70 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col border border-white/50">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex items-end gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'therapist' && <div className="w-8 h-8 rounded-full bg-indigo-200 flex-shrink-0"></div>}
                            <div className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                                message.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white text-slate-800 rounded-bl-none'
                            }`}>
                                {message.sender === 'user' && message.sentiment && (
                                    <div className="flex items-center gap-2 text-xs font-bold opacity-80 mb-2 pb-1 border-b border-white/20">
                                        {message.sentiment.icon}
                                        <span>{message.sentiment.label}</span>
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start">
                             <div className="w-8 h-8 rounded-full bg-indigo-200 flex-shrink-0"></div>
                             <div className="max-w-[75%] p-4 rounded-2xl shadow-md bg-white rounded-bl-none animate-pulse-custom">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-300 rounded"></div>
                                  <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/50">
                    <form onSubmit={sendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 p-4 rounded-full border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white/80"
                            placeholder="Type your thoughts here..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-4 bg-indigo-600 text-white rounded-full shadow-lg transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!inputText.trim() || isLoading}
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChatPage;