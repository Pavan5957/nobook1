import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  Menu, 
  X,
  Award,
  Globe,
  Zap,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react';

const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSf9SM-hv3LVOG6cP4zaQin4QjmUE-MuloPdYsrUeUYDvkTkQQ/viewform?usp=dialog";
const WHATSAPP_LINK = "https://wa.me/917899865427";

// Reusable Neo-Pop Button Component
const NeoButton = ({ children, variant = "primary", className = "", href, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-black px-6 py-3 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";
  
  const variants = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600",
    secondary: "bg-yellow-400 text-black hover:bg-yellow-500",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    white: "bg-white text-black hover:bg-gray-50",
    outline: "bg-transparent text-black border-black hover:bg-gray-100",
    magic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
  };

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Reusable Neo-Pop Card
const NeoCard = ({ children, className = "", color = "bg-white" }) => (
  <div className={`${color} border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`}>
    {children}
  </div>
);

// --- GEMINI API INTEGRATION ---
const AITutorSection = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    // NOTE: In a production environment, never expose API keys on the client side.
    // Ideally, call your own backend which then calls Gemini.
    const apiKey = ""; 
    const systemPrompt = "You are Neo, a super fun, energetic, and encouraging private tutor for K-12 students. Your goal is to explain complex concepts in simple, memorable ways using analogies and emojis. Keep your explanations under 100 words. If the user asks for a study plan, give a brief 3-point plan.";
    
    try {
      const makeRequest = async (retryCount = 0) => {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
              }),
            }
          );

          if (!response.ok) throw new Error('API request failed');

          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (text) {
            setResponse(text);
          } else {
            throw new Error('No response generated');
          }
        } catch (err) {
          if (retryCount < 5) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return makeRequest(retryCount + 1);
          }
          throw err;
        }
      };

      await makeRequest();
    } catch (err) {
      setError("Oops! My brain froze for a second. Try asking again! 🧊");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 bg-purple-50 border-t-2 border-black relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-10 right-10 opacity-20 animate-pulse">
         <Sparkles size={64} className="text-purple-500" />
       </div>
       <div className="absolute bottom-10 left-10 opacity-20 animate-bounce">
         <Brain size={64} className="text-pink-500" />
       </div>

       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="text-center mb-10">
           <div className="inline-block bg-white border-2 border-black px-4 py-1 rounded-full font-bold mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
              ✨ New Feature
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
             Stuck? Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI Tutor Neo!</span>
           </h2>
           <p className="text-xl font-bold text-gray-500">
             Get instant, fun explanations for any topic. Try "Photosynthesis" or "Algebra"!
           </p>
         </div>

         <div className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2">
            <div className="flex flex-col md:flex-row gap-2">
               <input 
                 type="text" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                 placeholder="What do you want to learn today?..."
                 className="flex-1 px-6 py-4 bg-gray-50 border-2 border-black rounded-xl text-lg font-bold focus:outline-none focus:bg-white focus:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
               />
               <NeoButton 
                 onClick={handleAskAI} 
                 variant="magic" 
                 className="md:w-auto w-full text-lg"
                 disabled={loading}
               >
                 {loading ? "Thinking... 🤔" : "Explain It! ✨"}
               </NeoButton>
            </div>
         </div>

         {/* Result Area */}
         {(response || error) && (
           <div className="mt-8 transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_#A855F7] p-8 relative">
               <div className="absolute -top-5 -left-5 bg-yellow-400 border-2 border-black p-3 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <Sparkles size={32} className="text-black" />
               </div>
               
               {error ? (
                 <p className="text-xl font-bold text-red-500">{error}</p>
               ) : (
                 <div className="prose prose-lg font-medium text-gray-800">
                   <p className="whitespace-pre-wrap leading-relaxed text-lg">{response}</p>
                 </div>
               )}
               
               <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                 <span className="text-sm font-bold text-gray-400">Powered by Gemini AI 💎</span>
                 <NeoButton 
                    href={GOOGLE_FORM_LINK} 
                    target="_blank" 
                    variant="outline" 
                    className="!py-2 !px-4 text-sm"
                 >
                   Need more help? Book a human tutor!
                 </NeoButton>
               </div>
             </div>
           </div>
         )}
       </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle smooth scroll for mobile menu clicks
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-indigo-500 p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tighter transform -rotate-1">
              NoBook<span className="text-indigo-600">Learn</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="font-bold text-gray-800 hover:text-indigo-600 hover:underline decoration-2 underline-offset-4">Courses</a>
            <a href="#why-us" onClick={(e) => handleNavClick(e, 'why-us')} className="font-bold text-gray-800 hover:text-indigo-600 hover:underline decoration-2 underline-offset-4">Why Us</a>
            <a href="#results" onClick={(e) => handleNavClick(e, 'results')} className="font-bold text-gray-800 hover:text-indigo-600 hover:underline decoration-2 underline-offset-4">Results</a>
            <NeoButton href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" variant="secondary" className="!py-2">
              Book a demo
            </NeoButton>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black hover:text-indigo-600 focus:outline-none">
              {isOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-yellow-300 border-t-2 border-black p-4 space-y-4 shadow-lg absolute w-full z-50">
          <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="block text-xl font-bold hover:text-indigo-600">Courses</a>
          <a href="#why-us" onClick={(e) => handleNavClick(e, 'why-us')} className="block text-xl font-bold hover:text-indigo-600">Why Us</a>
          <a href="#results" onClick={(e) => handleNavClick(e, 'results')} className="block text-xl font-bold hover:text-indigo-600">Results</a>
          <NeoButton href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" variant="primary" className="w-full">
            Book a demo class
          </NeoButton>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative bg-[#f0f0f0] overflow-hidden pt-12 pb-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-yellow-300 border-2 border-black px-4 py-1 rounded-full font-bold mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              🚀 Learning made fun again!
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black leading-none mb-6">
              One-to-One <br/>
              <span className="text-indigo-600">Learning.</span> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Any Time.</span>
            </h1>
            <p className="text-xl font-bold text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Forget boring textbooks. Get expert-led, outcome-driven classes trusted by parents in 30+ countries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <NeoButton href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" variant="primary" className="text-lg">
                Start Learning Now
              </NeoButton>
              <NeoButton href="#why-us" variant="white" className="text-lg">
                Explore Features
              </NeoButton>
            </div>

            <div className="flex justify-center lg:justify-start gap-8 font-black text-gray-800">
              <div className="text-center lg:text-left">
                <div className="text-3xl">50K+</div>
                <div className="text-sm font-bold text-gray-500 uppercase">Tutors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl">95%</div>
                <div className="text-sm font-bold text-gray-500 uppercase">Success</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl">30+</div>
                <div className="text-sm font-bold text-gray-500 uppercase">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Content - Form Card */}
          <div className="relative">
            {/* Decorative Blobs */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400 rounded-full border-2 border-black"></div>
            <div className="absolute -bottom-12 -left-8 w-24 h-24 bg-emerald-400 rounded-full border-2 border-black flex items-center justify-center">
              <Star className="text-black" fill="white" size={40}/>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative z-10 transform rotate-1">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-black text-black uppercase transform -skew-x-6 inline-block bg-pink-300 px-2">Book Free Demo</h3>
                <p className="text-gray-600 font-bold mt-2">Personalized 1:1 Learning</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-800 mb-1 uppercase tracking-wide">Name</label>
                  <input type="text" placeholder="Student Full Name" className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-800 mb-1 uppercase tracking-wide">Phone</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border-2 border-r-0 border-black bg-gray-100 text-gray-700 font-bold">
                      +91
                    </span>
                    <input type="tel" className="flex-1 w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-r-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-1 uppercase tracking-wide">Board</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold appearance-none">
                      <option>Select</option>
                      <option>CBSE</option>
                      <option>ICSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-1 uppercase tracking-wide">Grade</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold appearance-none">
                      <option>Select</option>
                      <option>Class 3</option>
                      <option>Class 4</option>
                      <option>Class 5</option>
                      <option>Class 6</option>
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                    </select>
                  </div>
                </div>

                <NeoButton 
                  href={GOOGLE_FORM_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  variant="success" 
                  className="w-full text-lg mt-2"
                >
                  Confirm Booking 🚀
                </NeoButton>
                
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white font-black py-3 px-4 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={24} fill="white" />
                  Chat On WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ title, subtitle, subjects, colorClass, icon, buttonText }) => (
  <NeoCard className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
    <div className={`${colorClass} w-16 h-16 border-2 border-black rounded-lg flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-black mb-2 leading-tight">{title}</h3>
    <p className="text-gray-600 font-medium text-sm mb-4 border-b-2 border-dashed border-gray-300 pb-4">{subtitle}</p>
    
    <div className="flex-1">
      <div className="mb-6">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((sub, i) => (
            <span key={i} className="bg-gray-100 border-2 border-black text-black px-3 py-1 rounded-md text-xs font-bold">
              {sub}
            </span>
          ))}
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-4">
      <a 
         href={GOOGLE_FORM_LINK}
         target="_blank"
         rel="noopener noreferrer"
         className="w-full group flex items-center justify-between font-black text-black hover:text-indigo-600 transition-colors"
      >
        {buttonText} 
        <div className="bg-black text-white p-1 rounded-full group-hover:bg-indigo-600 transition-colors">
          <ChevronRight size={16} />
        </div>
      </a>
    </div>
  </NeoCard>
);

const CourseCategories = () => {
  return (
    // Added scroll-mt-24 to handle sticky nav overlap
    <div id="courses" className="py-24 bg-white border-t-2 border-black scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            What Can We Help You <span className="bg-yellow-300 px-2 inline-block transform -rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Learn?</span>
          </h2>
          <p className="text-xl font-bold text-gray-500">Personalized 1-on-1 learning tailored for you.</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <CourseCard 
              title="School Exam Prep"
              subtitle="CBSE, ICSE & State Boards (Grades 3-10)"
              subjects={['Mathematics', 'Science', 'English', 'Social Studies']}
              colorClass="bg-orange-400 text-white"
              icon={<BookOpen size={32} />}
              buttonText="Explore School Courses"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    // Added scroll-mt-24 to handle sticky nav overlap
    <div id="why-us" className="py-24 bg-yellow-50 border-t-2 border-black scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black">
            Why Choose <span className="text-indigo-600 underline decoration-4 decoration-yellow-400">NoBookLearn?</span>
          </h2>
          <p className="mt-4 text-xl font-bold text-gray-600">Experience the power of fun, personalized education.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              color: "bg-blue-100",
              icon: <BookOpen className="text-blue-600" size={32} />,
              title: "Learn Any Topic",
              desc: "Algebra? Physics? Coding? Study exactly what you want, nothing more."
            },
            {
              color: "bg-pink-100",
              icon: <Zap className="text-pink-600" size={32} />,
              title: "Tailored to You",
              desc: "Courses tailored to your goals. We adapt to your pace and style."
            },
            {
              color: "bg-green-100",
              icon: <Users className="text-green-600" size={32} />,
              title: "1-on-1 Focus",
              desc: "Top 1% educators. 100% focus on you. No distractions."
            },
            {
              color: "bg-orange-100",
              icon: <Clock className="text-orange-600" size={32} />,
              title: "Flexible Pay",
              desc: "No bulk packages. Pay for what you study — as little as one topic."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
              <div className={`${feature.color} w-14 h-14 rounded-full border-2 border-black flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-indigo-600 rounded-3xl p-10 text-center border-2 border-black shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white p-3 rounded-full border-2 border-black mb-4">
                <HelpCircle className="text-indigo-600" size={32} />
             </div>
             <h3 className="text-3xl font-black text-white mb-2">Not sure where to start?</h3>
             <p className="text-indigo-200 font-bold mb-8 text-lg">Book a free session to design your custom plan.</p>
             <NeoButton 
               href={GOOGLE_FORM_LINK}
               target="_blank"
               rel="noopener noreferrer"
               variant="secondary"
               className="text-lg px-10"
             >
               Book Free Demo Class
             </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonTable = () => {
  return (
    // Added id="results" and scroll-mt-24
    <div id="results" className="py-24 bg-white border-t-2 border-black scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            We Stand <span className="text-emerald-500">Apart</span>
          </h2>
          <p className="text-xl font-bold text-gray-500">Traditional coaching is boring. We aren't.</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[768px] border-2 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-4 bg-black text-white">
              <div className="p-6 font-black text-lg">Features</div>
              <div className="p-6 font-black text-center bg-indigo-600 text-xl flex items-center justify-center gap-2">
                 <Star fill="yellow" className="text-yellow-400" /> NoBookLearn
              </div>
              <div className="p-6 font-bold text-center bg-gray-800">Traditional</div>
              <div className="p-6 font-bold text-center bg-gray-900">Others</div>
            </div>
            
            {[
              "1:1 Personal Attention",
              "Flexible Scheduling",
              "Personalized Learning",
              "Live Doubt Clearing",
              "Progress Tracking",
              "Affordable Pricing"
            ].map((feature, idx) => (
              <div key={idx} className="grid grid-cols-4 items-center bg-white border-b-2 border-black last:border-b-0">
                <div className="p-5 font-bold text-black border-r-2 border-black">{feature}</div>
                <div className="p-5 flex justify-center bg-indigo-50 border-r-2 border-black">
                  <div className="bg-emerald-500 border-2 border-black p-1 rounded-full"><CheckCircle className="text-white" size={24} /></div>
                </div>
                <div className="p-5 flex justify-center border-r-2 border-black">
                  <div className="bg-gray-200 border-2 border-gray-400 p-1 rounded-full"><XCircle className="text-gray-500" size={24} /></div>
                </div>
                <div className="p-5 flex justify-center">
                   {idx % 2 === 0 ? 
                     <div className="bg-gray-200 border-2 border-gray-400 p-1 rounded-full"><XCircle className="text-gray-500" size={24} /></div> : 
                     <div className="bg-emerald-100 border-2 border-emerald-300 p-1 rounded-full"><CheckCircle className="text-emerald-500" size={24} /></div>
                   }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoClassInfo = () => {
  return (
    <div className="py-24 bg-[#E0F2FE] border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black">
            Your First <span className="bg-white border-2 border-black px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-indigo-600">Demo Class</span>
          </h2>
          <p className="mt-6 text-xl font-bold text-gray-600">It's not just a demo. It's an experience.</p>
        </div>

        <div className="max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
               { title: "Live 1:1 teaching by top faculty", icon: <Users /> },
               { title: "Personalized academic roadmap", icon: <BookOpen /> },
               { title: "Doubt solving & performance insights", icon: <Zap /> },
               { title: "Parent + Student counselling", icon: <MessageCircle /> }
             ].map((item, i) => (
               <NeoCard key={i} className="flex items-center gap-6 hover:bg-white transition-colors cursor-pointer !p-4">
                 <div className="bg-yellow-300 p-3 border-2 border-black rounded-lg">
                   {item.icon}
                 </div>
                 <h4 className="text-xl font-bold text-black">{item.title}</h4>
               </NeoCard>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="py-24 bg-white border-t-2 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black">
             FAQ
          </h2>
          <p className="mt-4 text-xl font-bold text-gray-500">You got questions? We got answers.</p>
        </div>

        <div className="grid gap-6">
          {[
            { q: "Can I study only one topic?", a: "Absolutely! One-to-one tuition is all about YOU. Study one chapter or the whole book." },
            { q: "How do I select a maths tutor?", a: "Review profiles, check experience, and book a FREE demo to see if you vibe with them." },
            { q: "Is the schedule flexible?", a: "100%. Morning, evening, weekends? We work around YOUR school timetable." },
            { q: "What is one-to-one tuition?", a: "It means you are the VIP. One teacher. One student. Zero distractions." }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white border-2 border-black p-2 rounded-lg mt-1 shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black mb-2">{item.q}</h3>
                  <p className="text-gray-700 font-medium leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CTAFooter = () => {
  return (
    <div className="bg-black py-20 text-white border-t-2 border-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <div className="inline-block bg-pink-500 border-2 border-white text-white px-4 py-1 rounded-full font-bold mb-6 transform -rotate-2">
            🚀 Join the revolution
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Still Confused? <br/><span className="text-yellow-400">Let Us Help.</span>
          </h2>
          <p className="text-gray-400 text-xl font-bold mb-8">
            Our Academic Counsellors will walk you through your needs. It only takes 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <NeoButton 
              href={GOOGLE_FORM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="text-lg w-full sm:w-auto"
            >
              Talk to Counselor <ArrowRight className="ml-2" />
            </NeoButton>
            <div className="text-gray-400 text-sm font-bold flex items-center gap-1">
               <Star fill="currentColor" className="text-yellow-400" size={16} /> 4.9/5 Rating
            </div>
          </div>
        </div>

        <div className="md:w-1/3 w-full">
           <div className="bg-white text-black p-8 rounded-2xl border-4 border-indigo-500 shadow-[0px_0px_30px_rgba(99,102,241,0.5)]">
             <h3 className="text-2xl font-black mb-6 text-center uppercase tracking-tighter">Get Started Today</h3>
             <div className="space-y-4">
               <NeoButton href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" variant="primary" className="w-full justify-center">
                 Book a Free Demo
               </NeoButton>
               <NeoButton href="#" variant="outline" className="w-full justify-center">
                 Explore Plans
               </NeoButton>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="text-3xl font-black text-black mb-4 block tracking-tighter">NoBook<span className="text-indigo-600">Learn</span></span>
          <p className="text-gray-600 font-bold text-sm">
            Making education fun, accessible, and awesome for everyone.
          </p>
        </div>
        <div>
          <h4 className="font-black text-black uppercase mb-4 tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm font-bold text-gray-600">
            <li><a href="#" className="hover:text-indigo-600 hover:underline">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-600 hover:underline">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-600 hover:underline">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-black uppercase mb-4 tracking-wider">Resources</h4>
          <ul className="space-y-2 text-sm font-bold text-gray-600">
            <li><a href="#" className="hover:text-indigo-600 hover:underline">CBSE Solutions</a></li>
            <li><a href="#" className="hover:text-indigo-600 hover:underline">Papers</a></li>
            <li><a href="#" className="hover:text-indigo-600 hover:underline">Mock Tests</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-black uppercase mb-4 tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm font-bold text-gray-600">
            <li>help@nobooklearn.com</li>
            <li>Bengaluru, India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t-2 border-gray-100 text-center text-xs font-bold text-gray-400">
        © 2024 NoBookLearn Edutech Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white" style={{scrollBehavior: 'smooth'}}>
      <Navbar />
      <Hero />
      <CourseCategories />
      <Features />
      <AITutorSection />
      <DemoClassInfo />
      <ComparisonTable />
      <FAQ />
      <CTAFooter />
      <Footer />
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <a 
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all"
        >
          <Phone size={28} strokeWidth={3} />
        </a>
      </div>
    </div>
  );
};

export default App;