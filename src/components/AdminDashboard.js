import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  MessageCircle,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Building,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [hackathonName, setHackathonName] = useState('');
  const [initialBudget, setInitialBudget] = useState(500);
  const [maxMembersPerTeam, setMaxMembersPerTeam] = useState(4);
  const [createdHackathons, setCreatedHackathons] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to generate a random hackathon code
  const generateHackathonCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Function to copy hackathon code to clipboard
  const copyHackathonCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setSuccessMessage(`Hackathon code "${code}" copied to clipboard!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      setSuccessMessage('Failed to copy code to clipboard');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSponsorToggle = (sponsorName) => {
    setSponsors(prev => {
      if (prev.includes(sponsorName)) {
        return prev.filter(s => s !== sponsorName);
      } else {
        return [...prev, sponsorName];
      }
    });
  };

  const selectAllSponsors = () => {
    const allSponsors = [
      "OpenAI API", "HuggingFace API", "AWS Credits", "Google Cloud",
      "Stripe API", "Twilio API", "Azure Credits", "Firebase",
      "MongoDB Atlas", "SendGrid", "Algolia", "Mapbox"
    ];
    setSponsors(allSponsors);
  };

  const clearAllSponsors = () => {
    setSponsors([]);
  };

  const handleCreateHackathon = async () => {
    if (!hackathonName.trim()) {
      alert('Please enter a hackathon name');
      return;
    }

    try {
      const hackathonCode = generateHackathonCode();

      // Insert hackathon into database
      const { data: newHackathon, error } = await supabase
        .from('hackathons')
        .insert([
          {
            name: hackathonName,
            code: hackathonCode,
            budget: initialBudget,
            max_members_per_team: maxMembersPerTeam,
            sponsors: [...sponsors],
            status: 'active',
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating hackathon:', error);
        setSuccessMessage(`Failed to create hackathon: ${error.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
        return;
      }

      console.log('Hackathon created successfully:', newHackathon);
      
      // Add to the list of created hackathons
      setCreatedHackathons(prev => [{
        id: newHackathon.id,
        name: newHackathon.name,
        code: newHackathon.code,
        budget: newHackathon.budget,
        maxMembersPerTeam: newHackathon.max_members_per_team,
        sponsors: newHackathon.sponsors || [],
        createdAt: new Date(newHackathon.created_at).toLocaleDateString(),
        status: newHackathon.status,
        teamsCount: newHackathon.current_teams_count || 0,
        totalMembers: newHackathon.current_members_count || 0
      }, ...prev]);
      
      // Show success message with the generated code
      setSuccessMessage(`Hackathon "${hackathonName}" created successfully! Code: ${hackathonCode}`);
      setTimeout(() => setSuccessMessage(''), 5000); // Clear after 5 seconds
      
      // Close modal and reset form
      setShowCreateTeam(false);
      setHackathonName('');
      setInitialBudget(500);
      setMaxMembersPerTeam(4);
      setSponsors([]);
    } catch (error) {
      console.error('Error creating hackathon:', error);
      setSuccessMessage(`Failed to create hackathon: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleCloseModal = () => {
    setShowCreateTeam(false);
    // Reset form
    setHackathonName('');
    setInitialBudget(500);
    setMaxMembersPerTeam(4);
    setSponsors([]);
  };

  // Function to fetch hackathons from database
  const fetchHackathons = async () => {
    try {
      const { data: hackathons, error } = await supabase
        .from('hackathon_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hackathons:', error);
        return;
      }

      // Transform database data to match component state
      const transformedHackathons = hackathons.map(hackathon => ({
        id: hackathon.id,
        name: hackathon.name,
        code: hackathon.code,
        budget: hackathon.budget,
        maxMembersPerTeam: hackathon.max_members_per_team,
        sponsors: hackathon.sponsors || [],
        createdAt: new Date(hackathon.created_at).toLocaleDateString(),
        status: hackathon.status,
        teamsCount: hackathon.current_teams_count || 0,
        totalMembers: hackathon.current_members_count || 0
      }));

      setCreatedHackathons(transformedHackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  // Mock data
  useEffect(() => {
    setTeams([
      {
        id: 1,
        name: "Quantum Salys",
        members: ["Alice", "Bob", "Charlie"],
        budget: 500,
        spent: 127.50,
        status: "active",
        cardNumber: "**** **** **** 1234",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        name: "AI Pioneers",
        members: ["David", "Eva", "Frank"],
        budget: 750,
        spent: 89.25,
        status: "active",
        cardNumber: "**** **** **** 5678",
        createdAt: "2024-01-14"
      },
      {
        id: 3,
        name: "Blockchain Builders",
        members: ["Grace", "Henry"],
        budget: 300,
        spent: 45.00,
        status: "frozen",
        cardNumber: "**** **** **** 9012",
        createdAt: "2024-01-13"
      }
    ]);

    setTransactions([
      {
        id: 1,
        team: "Quantum Slays",
        description: "OpenAI API Key",
        amount: 20.00,
        type: "purchase",
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed"
      },
      {
        id: 2,
        team: "AI Pioneers",
        description: "HuggingFace API",
        amount: 15.50,
        type: "purchase",
        timestamp: "2024-01-15T09:15:00Z",
        status: "completed"
      },
      {
        id: 3,
        team: "Quantum Slays",
        description: "AWS Credits",
        amount: 50.00,
        type: "purchase",
        timestamp: "2024-01-14T16:45:00Z",
        status: "completed"
      }
    ]);

    // Fetch hackathons from database
    fetchHackathons();
  }, []);

  const getBudgetPercentage = (spent, budget) => {
    return Math.round((spent / budget) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'frozen': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'frozen': return <Lock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const totalBudget = teams.reduce((sum, team) => sum + team.budget, 0);
  const totalSpent = teams.reduce((sum, team) => sum + team.spent, 0);
  const activeTeams = teams.filter(team => team.status === 'active').length;

  const featureCards = [
    {
      title: "Team Management",
      description: "Create and manage hackathon teams",
      icon: <Building className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      action: "Manage Teams"
    },
    {
      title: "Budget Control",
      description: "Monitor and control team budgets",
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      action: "View Budgets"
    },
    {
      title: "Transaction Monitoring",
      description: "Track all spending in real-time",
      icon: <Activity className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      action: "View Transactions"
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reports",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      action: "View Analytics"
    },
    {
      title: "Card Management",
      description: "Generate and manage virtual cards",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      action: "Manage Cards"
    },
    {
      title: "Security Controls",
      description: "Advanced security and permissions",
      icon: <Shield className="w-8 h-8" />,
      color: "from-gray-500 to-gray-600",
      action: "Security Settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workspace</h1>
            <p className="text-3xl font-bold text-gray-900 mt-1">Good afternoon, Admin</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">Have a question?</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:bg-purple-700 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk to AI</span>
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateTeam(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Hackathon</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-8 mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="px-8 py-8">
        {/* Feature Cards - My Workspace */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Workspace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => card.path && navigate(card.path)}
                className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group ${
                  card.path ? 'hover:scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="text-blue-600 font-medium text-sm flex items-center space-x-1 group-hover:text-blue-700 transition-colors"
                >
                  <span>{card.action}</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-3xl font-bold text-gray-900">{activeTeams}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round((totalSpent / totalBudget) * 100)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Latest from Teams */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest from Teams</h3>
          <div className="space-y-3">
            {teams.slice(0, 5).map((team, index) => (
              <div key={team.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{team.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{team.name}</p>
                  <p className="text-sm text-gray-600">{team.members.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$100.00</p>
                  <p className="text-xs text-gray-500">remaining</p>
                </div>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full text-center py-3 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Explore All Teams
            </motion.button>
          </div>
        </div>

        {/* Created Hackathons Section */}
        {createdHackathons.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Created Hackathons</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchHackathons}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdHackathons.map((hackathon) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{hackathon.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hackathon.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {hackathon.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Code:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{hackathon.code}</span>
                        <button
                          onClick={() => copyHackathonCode(hackathon.code)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Copy code to clipboard"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">${hackathon.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Team Size:</span>
                      <span className="font-medium text-gray-900">{hackathon.maxMembersPerTeam}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Teams:</span>
                      <span className="font-medium text-gray-900">{hackathon.teamsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Members:</span>
                      <span className="font-medium text-gray-900">{hackathon.totalMembers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">{hackathon.createdAt}</span>
                    </div>
                  </div>
                  
                  {hackathon.sponsors.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">API Sponsors:</p>
                      <div className="flex flex-wrap gap-1">
                        {hackathon.sponsors.map((sponsor, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {sponsor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors">
                      Manage
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Create Hackathon Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-3">Create or Manage Hackathons</h3>
              <p className="text-blue-100 mb-6">
                Set up new hackathon teams with instant virtual card generation, 
                assign budgets, and monitor spending in real-time.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <Building className="w-5 h-5" />
                <span className="text-sm">Instant team creation</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm">Virtual card generation</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure budget control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Hackathon Modal */}
      <AnimatePresence>
        {showCreateTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Hackathon</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hackathon Name</label>
                  <input
                    type="text"
                    value={hackathonName}
                    onChange={(e) => setHackathonName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter hackathon name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Budget</label>
                  <input
                    type="number"
                    value={initialBudget}
                    onChange={(e) => setInitialBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter budget amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Members Per Team</label>
                  <input
                    type="number"
                    value={maxMembersPerTeam}
                    onChange={(e) => setMaxMembersPerTeam(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter max team size"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Sponsors ({sponsors.length} selected)
                  </label>
                  <div className="space-y-2">
                    {/* Multi-select checkboxes for sponsors */}
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("OpenAI API")}
                          onChange={() => handleSponsorToggle("OpenAI API")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">OpenAI API</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("HuggingFace API")}
                          onChange={() => handleSponsorToggle("HuggingFace API")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">HuggingFace API</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("AWS Credits")}
                          onChange={() => handleSponsorToggle("AWS Credits")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">AWS Credits</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Google Cloud")}
                          onChange={() => handleSponsorToggle("Google Cloud")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Google Cloud</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Stripe API")}
                          onChange={() => handleSponsorToggle("Stripe API")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Stripe API</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Twilio API")}
                          onChange={() => handleSponsorToggle("Twilio API")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Twilio API</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Azure Credits")}
                          onChange={() => handleSponsorToggle("Azure Credits")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Azure Credits</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Firebase")}
                          onChange={() => handleSponsorToggle("Firebase")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Firebase</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("MongoDB Atlas")}
                          onChange={() => handleSponsorToggle("MongoDB Atlas")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">MongoDB Atlas</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("SendGrid")}
                          onChange={() => handleSponsorToggle("SendGrid")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">SendGrid</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Algolia")}
                          onChange={() => handleSponsorToggle("Algolia")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Algolia</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sponsors.includes("Mapbox")}
                          onChange={() => handleSponsorToggle("Mapbox")}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        />
                        <span className="text-sm text-gray-700">Mapbox</span>
                      </label>
                    </div>
                    
                    {/* Quick action buttons */}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={selectAllSponsors}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={clearAllSponsors}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    {sponsors.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {sponsors.map((sponsor, index) => (
                          <div key={index} className="flex items-center justify-between py-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">{sponsor}</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                ✓ Added
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSponsorToggle(sponsor)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <p className="text-sm text-gray-500 text-center">No sponsors added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Check the boxes above to select API providers</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Check the boxes above to select API providers as sponsors for your hackathon teams
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateHackathon}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                >
                  Create Hackathon
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
