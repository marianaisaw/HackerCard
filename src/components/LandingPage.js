import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp, 
  Bot,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';

const LandingPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Instant Virtual Cards",
      description: "Generate virtual debit cards instantly with Stripe Issuing integration",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Create teams, assign budgets, and monitor spending in real-time",
      color: "from-green-500 to-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Controlled",
      description: "Full control over card limits, freezing, and transaction monitoring",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Budget Assistant",
      description: "Smart recommendations to optimize spending and save costs",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Teams Served" },
    { number: "$50K+", label: "Total Budgets" },
    { number: "24/7", label: "Support" },
    { number: "Bro", label: "We Make Your Hacker Life Easier" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HackerCard</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Admin Demo
              </button>
              <button
                onClick={() => navigate('/team/demo')}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Team Demo
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-500 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-600 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-900 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </motion.div>

            {/* Mobile Hamburger Menu */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg fixed top-16 left-0 right-0 z-40"
          >
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all text-left font-medium"
              >
                Admin Demo
              </button>
              <button
                onClick={() => { navigate('/team/demo'); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all text-left font-medium"
              >
                Team Demo
              </button>
              <button
                onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-500 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-600 transition-all text-left font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-900 transition-all text-left font-medium"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              The Future of
              <span className="block">
                              <span className="rainbow-h">H</span>
              <span className="rainbow-a1">a</span>
              <span className="rainbow-c">c</span>
              <span className="rainbow-k">k</span>
              <span className="rainbow-a2">a</span>
              <span className="rainbow-t">t</span>
              <span className="rainbow-h2">h</span>
              <span className="rainbow-o">o</span>
              <span className="rainbow-n1">n</span>
              <span className="mx-2"></span>
              <span className="rainbow-f">F</span>
              <span className="rainbow-i">i</span>
              <span className="rainbow-n2">n</span>
              <span className="rainbow-a3">a</span>
              <span className="rainbow-n3">n</span>
              <span className="rainbow-c2">c</span>
              <span className="rainbow-e">e</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              HackerCard is a virtual debit cards built specifically for hackathons. Give teams instant, 
              secure access to pre-loaded API budgets without messy reimbursements.
            </p>
            
            {/* Virtual Card Design */}
            <motion.div
              className="mb-12 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Card Background */}
                <div className="w-80 h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                  {/* Card Content */}
                  <div className="p-6 h-full flex flex-col justify-between">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <div className="text-white/80 text-sm font-medium">HackerCard</div>
                      <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Middle Section */}
                    <div className="flex-1 flex items-center">
                      <div className="text-white/90 text-2xl font-mono tracking-widest">
                        •••• •••• •••• 1234
                      </div>
                    </div>
                    
                    {/* Bottom Section */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs mb-1">CARD HOLDER</div>
                        <div className="text-white/90 text-sm font-medium">TEAM QUANTUM</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs mb-1">EXPIRES</div>
                        <div className="text-white/90 text-sm font-medium">today</div>
                      </div>
                      <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full shadow-lg animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </motion.div>
            

            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-2 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Divider */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-gradient block">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              From instant card generation to AI-powered budget optimization, 
              HackerCard has everything hackathon organizers and teams need.
            </p>
            
            {/* Hackathon Image */}
            <motion.div
              className="mb-16 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <img 
                  src="/hackathon.jpeg" 
                  alt="Hackathon participants collaborating" 
                  className="w-full max-w-4xl h-80 object-cover rounded-3xl shadow-2xl"
                />
                {/* Overlay with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  For hackers, by hackers
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-center h-full transform transition-all duration-300 group-hover:scale-105`}>
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Hackathon?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of organizers who trust HackerCard to manage their hackathon finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Start Free Trial
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://discord.gg/hackercard', '_blank')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
                Join Discord Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">HackerCard</span>
          </div>
          <p className="text-gray-600">
            Built with ❤️ for the hackathon community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
