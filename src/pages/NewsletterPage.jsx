import React, { useState, useEffect } from "react";
// 1. Import 'Link' in addition to 'useNavigate'
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// The single, permanent background image URL
const backgroundImageUrl = 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2692&auto-format&fit-crop';

// 2. Define the HomeIcon SVG component
const HomeIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );

const NewsletterPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with:", inputValue);
    setIsSignedUp(true);
  };

  useEffect(() => {
    if (isSignedUp) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [isSignedUp, navigate]);

  return (
    <section
      className="w-full h-screen px-4 py-32 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* 3. Add the Link component for the Home Icon */}
      <Link to="/" className="absolute top-5 left-5 p-3 bg-slate-50/70 backdrop-blur-lg rounded-full shadow-lg hover:bg-slate-50/90 transition-all group">
          <HomeIcon className="w-6 h-6 text-indigo-700 group-hover:scale-110 transition-transform" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "easeOut" }}
        className="bg-slate-50/70 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/50"
      >
        {isSignedUp ? (
          // --- UPDATED THANK YOU PAGE CONTENT ---
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
            >
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-3">
              Thank you for joining us
            </h2>
            <p className="text-slate-600 italic text-md mb-6">
              The journey to wellness is built on small, consistent steps. You just took a wonderful one by showing up for yourself.
            </p>
            <p className="text-slate-600 text-sm">
              Your first edition of 'Your Weekly Anchor' will arrive this Tuesday. We're so glad you're here.
            </p>
            <div className="my-6 border-t border-slate-300"></div>
            <button
              onClick={() => navigate('/chat')}
              className="w-full bg-indigo-100 text-indigo-700 font-semibold py-3 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              Chat with your AI Companion
            </button>
          </div>
        ) : (
          // --- UPDATED NEWSLETTER SIGNUP PAGE CONTENT ---
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Your Weekly Anchor
            </h2>
            <p className="text-slate-600 mb-6">
              A moment of calm and clarity delivered to your inbox every Tuesday. A gentle space for reflection and growth.
            </p>
            <div className="text-left text-slate-700 mb-6 px-2">
                <p className="font-semibold mb-2">In each edition, you'll find:</p>
                <ul className="list-none space-y-1 text-sm">
                    <li>✅ One actionable tip for managing stress or anxiety.</li>
                    <li>🧘 A short, guided mindfulness exercise.</li>
                    <li>🔗 Insightful articles on mental wellbeing.</li>
                </ul>
            </div>

            {/* --- MOTIVATIONAL QUOTE ADDED HERE --- */}
            <div className="my-8 text-left">
              <blockquote className="border-l-4 border-indigo-300 pl-4">
                <p className="text-slate-600 italic">
                  "You don't have to have it all figured out to move forward. Just take the next step."
                </p>
              </blockquote>
              <p className="text-right text-slate-500 text-sm mt-2 pr-2">
                - A person goin' through things
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4 bg-white/80 text-slate-900 placeholder-slate-500 transition-all"
                required
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Subscribe
              </motion.button>
            </form>
            <p className="text-xs text-slate-500 mt-4">
              We respect your privacy. No spam, ever. Unsubscribe at any time.
            </p>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default NewsletterPage;