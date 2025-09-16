import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import NewsletterPage from './pages/NewsletterPage';
import ChatPage from './pages/ChatPage'; // 1. Import the new ChatPage

const App = () => {
  return (
    <div className='h-full w-full'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<NewsletterPage />} />
          <Route path="/chat" element={<ChatPage />} /> {/* 2. Add the route for the chat page */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;