import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Bot,
  MessageCircle,
  X,
  Send,
  Zap,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bell,
  Mic,
  Music,
  Video,
  Headphones,
  Star,
  Building,
  Users,
  LogOut,
  Plus,
  User,
  Mail,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  Code,
  Lightbulb
} from 'lucide-react';

const TeamDashboard = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [apiKeys, setApiKeys] = useState({});
  const [teamsHistory, setTeamsHistory] = useState([]);
  const [showTeamsHistory, setShowTeamsHistory] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [lastCreatedTeamName, setLastCreatedTeamName] = useState('');
  const [currentTeamName, setCurrentTeamName] = useState('');
  const [hackathonCode, setHackathonCode] = useState('');
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTeamsRequestActive, setIsTeamsRequestActive] = useState(false);
  const [isUsersRequestActive, setIsUsersRequestActive] = useState(false);
  const [currentSpending, setCurrentSpending] = useState(0);
  const [purchasedAPIs, setPurchasedAPIs] = useState([]);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [selectedAPIForKey, setSelectedAPIForKey] = useState(null);
  
  // SixtyFour AI Chatbot States
  const [showSixtyFourChat, setShowSixtyFourChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectIdea, setProjectIdea] = useState('');
  const [hasAskedProjectIdea, setHasAskedProjectIdea] = useState(false);

  // API Keys - Load from environment variables
  const SIXTYFOUR_API_KEY = process.env.REACT_APP_SIXTYFOUR_API_KEY;
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const DEFAULT_MODEL = 'gemini-2.0-flash';

  // SixtyFour API function for documentation research
  const callSixtyFourAPI = async (query, projectContext) => {
    try {
      console.log('🚀 Calling SixtyFour API with:', { query, projectContext });
      
      // Validate API key
      if (!SIXTYFOUR_API_KEY) {
        console.log('🔑 SixtyFour API key:', 'No key provided');
        throw new Error('SixtyFour API key not configured');
      }
      
      const response = await fetch('https://api.sixtyfour.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SIXTYFOUR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sixtyfour-1.0',
          messages: [
            {
              role: 'system',
              content: `You are a technical documentation expert. Research and provide insights about the latest APIs, technologies, and best practices for the project: ${projectContext}. Focus on current trends, documentation, and implementation examples.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      console.log('📡 SixtyFour API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SixtyFour API error response:', errorText);
        throw new Error(`SixtyFour API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ SixtyFour API response data:', data);
      
      const content = data.choices[0]?.message?.content || 'No response from SixtyFour API';
      console.log('📝 SixtyFour API content:', content);
      
      return content;
    } catch (error) {
      console.error('❌ SixtyFour API error:', error);
      return `Error calling SixtyFour API: ${error.message}`;
    }
  };

  // Gemini API function for mentorship responses
  const callGeminiAPI = async (userMessage, projectContext, sixtyFourResponse, chatHistory) => {
    try {
      console.log('🤖 Calling Gemini API with:', { userMessage, projectContext, sixtyFourResponse: sixtyFourResponse.substring(0, 100) + '...', chatHistoryLength: chatHistory.length });
      
      // Validate API key
      if (!GEMINI_API_KEY) {
        console.log('🔑 Gemini API key:', 'No key provided');
        throw new Error('Gemini API key not configured');
      }
      
      // Get user's purchased APIs for context
      const purchasedAPIsList = purchasedAPIs.map(api => api.name).join(', ');
      const budgetContext = `User has purchased: ${purchasedAPIsList || 'No APIs purchased yet'}. Budget remaining: $${(100 - currentSpending).toFixed(2)}.`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are a wise coding mentor. Project: ${projectContext}.

Give simple, thoughtful advice. Include:
- Clear solution
- Code example if needed
- Use purchased APIs: ${purchasedAPIsList || 'None'}
- Budget suggestions: $${(100 - currentSpending).toFixed(2)}

Research: ${sixtyFourResponse}

User: ${userMessage}

Be wise, simple, and helpful.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      };

      console.log('📤 Gemini API request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Gemini API response data:', data);
      
      const content = data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini API';
      console.log('📝 Gemini API content:', content);
      
      return content;
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return `Error calling Gemini API: ${error.message}`;
    }
  };

  // Initialize chat with project idea question
  const initializeChat = () => {
    setShowSixtyFourChat(true);
    setChatMessages([{
      id: 1,
      role: 'assistant',
      content: `Hey there, future hackathon champion! 🚀 I'm your SixtyFour AI office hours mentor, and I'm here to help you build something amazing!

I see that you have purchased: ${purchasedAPIs.length > 0 ? purchasedAPIs.map(api => api.name).join(', ') : 'No APIs purchased yet'}

Before we dive into the code, I'd love to hear about your project idea. What are you building? What's your vision? This will help me give you the most relevant advice and API recommendations based on your budget and goals.

Tell me about your project! 💡`,
      timestamp: new Date()
    }]);
    setHasAskedProjectIdea(false); // Start with false to ask for project idea first
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    console.log('💬 Sending chat message:', chatInput);
    console.log('📊 Current state:', { hasAskedProjectIdea, projectIdea, purchasedAPIs: purchasedAPIs.length });

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      let response;
      
      if (!hasAskedProjectIdea) {
        // First message - ask for project idea
        console.log('🎯 First message - setting project idea');
        setProjectIdea(chatInput);
        setHasAskedProjectIdea(true);
        response = "Awesome! I love your project idea! 🎉 Now let me research the latest APIs and technologies that would be perfect for what you're building. I'll also check out some trending project ideas in your space.\n\nWhat specific aspect would you like to work on first? Are you looking for:\n• API recommendations?\n• Code examples?\n• Project structure advice?\n• Help with a specific error?\n\nLet me know what you need most!";
      } else {
        // Subsequent messages - use both APIs
        console.log('🔍 Subsequent message - calling both APIs');
        try {
          console.log('📡 Calling SixtyFour API...');
          const sixtyFourResponse = await callSixtyFourAPI(chatInput, projectIdea);
          console.log('✅ SixtyFour API completed');
          
          const chatHistory = chatMessages.slice(-5); // Last 5 messages for context
          console.log('📡 Calling Gemini API...');
          response = await callGeminiAPI(chatInput, projectIdea, sixtyFourResponse, chatHistory);
          console.log('✅ Gemini API completed');
        } catch (apiError) {
          console.error('❌ API call error:', apiError);
          // Fallback response if APIs fail
          response = "I'm having trouble connecting to my research tools right now, but I can still help you with general coding advice! 💪\n\nWhat specific coding challenge or question do you have about your project? I'm here to mentor you through it!";
        }
      }

      console.log('📝 Final response:', response);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Oops! Something went wrong on my end. Let me try again - what were you asking about? 🤔\n\nIn the meantime, I can help you with:\n• General coding best practices\n• Project structure advice\n• Debugging tips\n• API integration strategies",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      console.log('✅ Chat message processing completed');
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

  const clearUsersList = () => {
    setShowUserList(false);
    setUsers([]);
    setUsersError(null);
    setUsersLoading(false);
    setSelectedUsers([]);
    setIsUsersRequestActive(false); // Reset request flag
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearTeamsLoading = () => {
    setTeamsLoading(false);
    setIsTeamsRequestActive(false);
  };

  const forceResetAllStates = () => {
    clearUsersList();
    clearTeamsLoading();
    clearMessages();
    setTeamsHistory([]);
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);

      // Fetch users from the database
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (profilesError) {
        throw profilesError;
      }

      setUsers(userProfiles || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError(err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshUsers = async (retryCount = 0) => {
    // Prevent multiple simultaneous requests
    if (isUsersRequestActive) {
      console.log('Users request already active, skipping...');
      return;
    }

    try {
      setIsUsersRequestActive(true);
      setUsersLoading(true);
      setUsersError(null);
      setUsers([]); // Clear existing users first

      console.log('Refreshing users... (attempt:', retryCount + 1, ')');

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });

      console.log('Starting user fetch query...');
      const startTime = Date.now();

      // Fetch users from the database with specific columns only
      const usersPromise = supabase
        .from('user_profiles')
        .select('id, user_id, email, full_name, role, created_at')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      const { data: userProfiles, error: profilesError } = await Promise.race([
        usersPromise,
        timeoutPromise
      ]);

      const endTime = Date.now();
      console.log(`User fetch completed in ${endTime - startTime}ms`);

      if (profilesError) {
        throw profilesError;
      }

      console.log('Users fetched successfully:', userProfiles);
      setUsers(userProfiles || []);
    } catch (err) {
      console.error('Error refreshing users:', err);
      
      // Retry once if it's a connection error
      if (retryCount === 0 && (err.message.includes('network') || err.message.includes('timeout'))) {
        console.log('Retrying users fetch...');
        setTimeout(() => refreshUsers(1), 1000);
        return;
      }
      
      setUsersError(err.message || 'Failed to refresh users');
    } finally {
      setUsersLoading(false);
      setIsUsersRequestActive(false);
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };



  const createNewTeam = async () => {
    if (selectedUsers.length === 0 || !newTeamName.trim() || !hackathonCode.trim()) {
      return;
    }

    try {
      console.log('Creating new team:', { newTeamName, hackathonCode, selectedUsers });
      
      // Clear any existing messages
      setSuccessMessage('');
      setErrorMessage('');

      // First, create the team in the teams table
      const { data: newTeamData, error: teamError } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeamName,
            hackathon_code: hackathonCode,
            budget: 500, // Default budget
            spent: 0,
            final_rank: "In Progress",
            achievements: ["New Team Created"]
          }
        ])
        .select();

      if (teamError) {
        console.error('Error creating team:', teamError);
        setErrorMessage(`Failed to create team: ${teamError.message}`);
        setShowCreateTeamModal(false);
        window.location.hash = 'add-team';
        return;
      }

      console.log('Team created successfully:', newTeamData);
      const teamId = newTeamData[0].id;

      // Then, create team members in the team_members table
      const teamMembersData = selectedUsers.map(user => ({
        team_id: teamId,
        user_id: user.user_id, // Use user_id from user_profiles, not the profile id
        role: 'member',
        joined_at: new Date().toISOString()
      }));

      console.log('Creating team members:', teamMembersData);
      console.log('Team ID:', teamId);
      console.log('Selected Users:', selectedUsers);
      console.log('User IDs being used:', selectedUsers.map(u => ({ profileId: u.id, authUserId: u.user_id })));

      // Check if team_members table exists first
      const { data: tableCheck, error: tableCheckError } = await supabase
        .from('team_members')
        .select('id')
        .limit(1);

      console.log('Table check result:', { tableCheck, tableCheckError });

      if (tableCheckError) {
        console.error('Table check error:', tableCheckError);
        setErrorMessage(`Database table error: ${tableCheckError.message}`);
        setShowCreateTeamModal(false);
        window.location.hash = 'add-team';
        return;
      }

      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .insert(teamMembersData)
        .select();

      console.log('Team members insert result:', { membersData, membersError });

      if (membersError) {
        console.error('Error creating team members:', membersError);
        setErrorMessage(`Team created but failed to add members: ${membersError.message}`);
        setShowCreateTeamModal(false);
        window.location.hash = 'add-team';
        return;
      }

      console.log('Team members created successfully');

      // Create the team object for local state
      const newTeam = {
        id: teamId,
        name: newTeamName,
        hackathon: hackathonCode,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        members: selectedUsers.map(u => u.full_name || u.email),
        finalRank: "In Progress",
        budget: 500, // Default budget
        spent: 0,
        achievements: ["New Team Created"]
      };

      // Add to teams history
      setTeamsHistory(prev => [newTeam, ...prev]);

      // Update the current team object with the new team name and card holder
      setTeam(prevTeam => ({
        ...prevTeam,
        name: newTeamName,
        cardHolder: newTeamName.toUpperCase() // Update card holder to new team name
      }));

      // Update current team name immediately
      setCurrentTeamName(newTeamName);

      // Reset form and close modal
      setSelectedUsers([]);
      setNewTeamName('');
      setHackathonCode('');
      setShowCreateTeamModal(false);
      setShowUserList(false);
      setLastCreatedTeamName(newTeam.name);
      setSuccessMessage(`Team "${newTeam.name}" created successfully!`);
      
      // Update URL hash to dashboard
      window.location.hash = 'dashboard';

      // Refresh teams history from database to ensure consistency
      console.log('Refreshing teams history...');
      await fetchTeamsHistory();

      // Show success message or redirect
      console.log('New team created successfully:', newTeam);
    } catch (error) {
      console.error('Error creating team:', error);
      setErrorMessage(`Failed to create team: ${error.message}`);
      setShowCreateTeamModal(false);
      window.location.hash = 'add-team';
    }
  };

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const apis = [
    { id: 1, name: "SixtyFour API", price: 35, description: "Get your SixtyFour API key for agentic research ", icon: "🚀" },
    { id: 2, name: "OpenAI API", price: 20, description: "Access to GPT-5 and other AI models", icon: "🤖" },
    { id: 3, name: "HuggingFace API", price: 15, description: "HuggingFace inference API", icon: "🤗" },
    { id: 4, name: "AWS Credits", price: 50, description: "AWS cloud computing credits", icon: "☁️" },
    { id: 5, name: "Google Cloud", price: 30, description: "Google Cloud Platform credits", icon: "🌐" },
    { id: 6, name: "Stripe API", price: 25, description: "Payment processing API", icon: "💳" },
    { id: 7, name: "Twilio API", price: 20, description: "Communication API services", icon: "📱" },
    { id: 8, name: "Azure Credits", price: 40, description: "Microsoft Azure cloud services", icon: "☁️" },
    { id: 9, name: "Firebase", price: 18, description: "Google's mobile and web app platform", icon: "🔥" },
    { id: 10, name: "MongoDB Atlas", price: 22, description: "Cloud database service", icon: "🍃" },
    { id: 11, name: "SendGrid", price: 16, description: "Email delivery service", icon: "📧" },
    { id: 12, name: "Apify API", price: 28, description: "Powerful web scraping and automation API", icon: "🔍" }
  ];

  const fetchTeamsHistory = async (retryCount = 0) => {
    // Prevent multiple simultaneous requests
    if (isTeamsRequestActive) {
      console.log('Teams request already active, skipping...');
      return;
    }

    try {
      console.log('=== FETCH TEAMS HISTORY START ===');
      setIsTeamsRequestActive(true);
      setTeamsLoading(true);
      setErrorMessage(''); // Clear any previous errors
      console.log('Fetching teams history... (attempt:', retryCount + 1, ')');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });

      console.log('Starting teams fetch query...');
      const startTime = Date.now();

      // Fetch teams with a simple query first
      const teamsPromise = supabase
        .from('teams')
        .select('id, name, hackathon_code, budget, spent, final_rank, achievements, created_at')
        .order('created_at', { ascending: false });

      const { data: teams, error: teamsError } = await Promise.race([
        teamsPromise,
        timeoutPromise
      ]);

      const endTime = Date.now();
      console.log(`Teams fetch completed in ${endTime - startTime}ms`);
      
      console.log('Supabase query completed. Data:', teams, 'Error:', teamsError);

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        
        // Retry once if it's a connection error
        if (retryCount === 0 && (teamsError.message.includes('network') || teamsError.message.includes('timeout'))) {
          console.log('Retrying teams fetch...');
          setTimeout(() => fetchTeamsHistory(1), 1000);
          return;
        }
        
        setErrorMessage(`Failed to fetch teams: ${teamsError.message}`);
        return;
      }

      console.log('Teams fetched:', teams);

      if (!teams || teams.length === 0) {
        console.log('No teams found in database');
        setTeamsHistory([]);
        return;
      }

      // Fetch all team members in a single query for better performance
      console.log('Starting team members fetch query...');
      const membersStartTime = Date.now();
      
      const { data: allTeamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('team_id, user_id, role')
        .in('team_id', teams.map(t => t.id));

      const membersEndTime = Date.now();
      console.log(`Team members fetch completed in ${membersEndTime - membersStartTime}ms`);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        // Continue without members if there's an error
      }

      console.log('All team members fetched:', allTeamMembers);

      // Create a map of team_id to members for faster lookup
      const teamMembersMap = {};
      if (allTeamMembers) {
        allTeamMembers.forEach(member => {
          if (!teamMembersMap[member.team_id]) {
            teamMembersMap[member.team_id] = [];
          }
          teamMembersMap[member.team_id].push(member);
        });
      }

      // Build teams with members
      const teamsWithMembers = teams.map(team => {
        const teamMembers = teamMembersMap[team.id] || [];
        
        // For now, just show the count of members to avoid complex queries
        const memberCount = teamMembers.length;
        
        return {
          id: team.id,
          name: team.name,
          hackathon: team.hackathon_code,
          date: new Date(team.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          members: memberCount > 0 ? [`${memberCount} member${memberCount !== 1 ? 's' : ''}`] : ['No members found'],
          finalRank: team.final_rank || "In Progress",
          budget: team.budget || 500,
          spent: team.spent || 0,
          achievements: team.achievements || ["New Team Created"]
        };
      });

      // Update the current team with the latest team information if available
      if (teamsWithMembers.length > 0) {
        const latestTeam = teamsWithMembers[0]; // First team is the most recent due to DESC ordering
        setTeam(prevTeam => ({
          ...prevTeam,
          name: latestTeam.name,
          cardHolder: latestTeam.name.toUpperCase()
        }));
        setLastCreatedTeamName(latestTeam.name);
        setCurrentTeamName(latestTeam.name);
      }

      console.log('Teams with members:', teamsWithMembers);
      console.log('Setting teams history state...');
      setTeamsHistory(teamsWithMembers);
      
      // Update the current team with the latest team information
      if (teamsWithMembers.length > 0) {
        const latestTeam = teamsWithMembers[0];
        setTeam(prevTeam => ({
          ...prevTeam,
          name: latestTeam.name,
          cardHolder: latestTeam.name.toUpperCase()
        }));
        setLastCreatedTeamName(latestTeam.name);
        setCurrentTeamName(latestTeam.name);
      }
      
      console.log('=== FETCH TEAMS HISTORY SUCCESS ===');
    } catch (error) {
      console.error('=== FETCH TEAMS HISTORY ERROR ===');
      console.error('Error fetching teams history:', error);
      
      // Retry once if it's a connection error
      if (retryCount === 0 && (error.message.includes('network') || error.message.includes('timeout'))) {
        console.log('Retrying teams history fetch...');
        setTimeout(() => fetchTeamsHistory(1), 1000);
        return;
      }
      
      setErrorMessage(`Failed to fetch teams history: ${error.message}`);
    } finally {
      console.log('Setting teams loading to false...');
      setTeamsLoading(false);
      setIsTeamsRequestActive(false);
      console.log('=== FETCH TEAMS HISTORY END ===');
    }
  };



  // Test database connection and table existence
  const testDatabaseTables = async () => {
    try {
      console.log('Testing database tables...');
      
      // Test teams table
      const { data: teamsTest, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .limit(1);
      
      console.log('Teams table test:', { data: teamsTest, error: teamsError });
      
      // Test team_members table
      const { data: membersTest, error: membersError } = await supabase
        .from('team_members')
        .select('id')
        .limit(1);
      
      console.log('Team members table test:', { data: membersTest, error: membersError });
      
      if (teamsError) {
        console.error('Teams table error:', teamsError);
      }
      
      if (membersError) {
        console.error('Team members table error:', membersError);
      }
      
    } catch (error) {
      console.error('Database test error:', error);
    }
  };

  // Mock data
  useEffect(() => {
    // Test database tables first
    testDatabaseTables();
    
    // Don't set section here - let the hash change listener handle it
    // This prevents conflicts between the two useEffects

    setTeam({
      id: teamId,
      name: "Quantum Slays",
      members: ["Alice", "Bob", "Charlie"],
      budget: 500,
      spent: 127.50,
      cardNumber: "4532 **** **** 1234",
      expiryDate: "12/25",
      cvv: "123",
      cardHolder: "QUANTUM SLAYS"
    });
    
    // Set initial team name
    setCurrentTeamName("Quantum Slays");
    setLastCreatedTeamName("Quantum Slays");
    


    setTransactions([
      {
        id: 1,
        description: "OpenAI API Key",
        company: "OpenAI",
        amount: 20.00,
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed",
        hasApiKey: true,
        apiKey: "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
      },
      {
        id: 2,
        description: "AWS Credits",
        company: "Amazon Web Services",
        amount: 50.00,
        timestamp: "2024-01-14T16:45:00Z",
        status: "completed",
        hasApiKey: true,
        apiKey: "AKIAIOSFODNN7EXAMPLE"
      },
      {
        id: 3,
        description: "HuggingFace API",
        company: "HuggingFace",
        amount: 15.50,
        timestamp: "2024-01-13T14:20:00Z",
        status: "completed",
        hasApiKey: true,
        apiKey: "hf_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
      }
    ]);

    // Fetch teams history from database
    console.log('Initial useEffect: About to call fetchTeamsHistory');
    fetchTeamsHistory().catch(error => {
      console.error('Error in initial fetchTeamsHistory call:', error);
    }).then(() => {
      // After fetching teams, update the current team with the latest team info
      if (teamsHistory.length > 0) {
        const latestTeam = teamsHistory[0];
        setTeam(prevTeam => ({
          ...prevTeam,
          name: latestTeam.name,
          cardHolder: latestTeam.name.toUpperCase()
        }));
        setLastCreatedTeamName(latestTeam.name);
        setCurrentTeamName(latestTeam.name);
      }
    });

    // Initial AI message
    setAiMessages([
      {
        id: 1,
        type: 'ai',
        message: "Hello! I'm your AI Budget Assistant. I'm here to help you optimize your spending and make the most of your $500 budget. How can I help you today?",
        timestamp: new Date()
      }
    ]);

    // Start with empty purchased APIs - they will be populated when user makes purchases
    setPurchasedAPIs([]);
  }, [teamId]);

  // Effect to update team name and card holder when teams history changes
  useEffect(() => {
    if (teamsHistory.length > 0) {
      const latestTeam = teamsHistory[0];
      setTeam(prevTeam => ({
        ...prevTeam,
        name: latestTeam.name,
        cardHolder: latestTeam.name.toUpperCase()
      }));
      setLastCreatedTeamName(latestTeam.name);
      setCurrentTeamName(latestTeam.name);
    }
  }, [teamsHistory]);

  // Separate useEffect for hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'teams-history') {
        setActiveSection('teams-history');
        setShowUserList(false); // Reset user list when switching to teams history
        clearUsersList(); // Clear user list state completely
        clearMessages(); // Clear any existing messages
        console.log('Hash change: Navigating to teams-history, calling fetchTeamsHistory');
        fetchTeamsHistory().catch(error => {
          console.error('Error in hash change fetchTeamsHistory call:', error);
        }); // Fetch teams history when navigating to that section
      } else if (hash === 'add-team') {
        setActiveSection('dashboard');
        clearTeamsLoading(); // Clear teams loading state
        setShowUserList(true); // Show user list when navigating to add team
        clearMessages(); // Clear any existing messages
        refreshUsers(); // Refresh users when opening add team section
      } else if (hash === 'create-team') {
        setActiveSection('dashboard');
        clearTeamsLoading(); // Clear teams loading state
        setShowUserList(true); // Show user list when navigating to create hackathon
        setShowCreateTeamModal(true); // Show create hackathon modal
        clearMessages(); // Clear any existing messages
        refreshUsers(); // Refresh users when opening create hackathon section
      } else if (hash === 'dashboard' || hash === '') {
        setActiveSection('dashboard');
        clearUsersList(); // Clear user list state when going back to dashboard
        clearTeamsLoading(); // Clear teams loading state
        clearMessages(); // Clear any existing messages
      } else {
        setActiveSection('dashboard');
        setShowUserList(false);
      }
    };

    // Handle initial hash on component mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    // Cleanup function
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Cleanup user list state when component unmounts or teamId changes
  useEffect(() => {
    return () => {
      clearUsersList();
      clearTeamsLoading();
      clearMessages();
    };
  }, [teamId]);

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Handle Escape key to close create hackathon modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCreateTeamModal) {
        setShowCreateTeamModal(false);
        window.location.hash = 'add-team';
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCreateTeamModal]);

  const getBudgetPercentage = (spent, budget) => {
    return Math.round((spent / budget) * 100);
  };

  const getBudgetColor = (percentage) => {
    if (percentage > 80) return 'text-red-600';
    if (percentage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (percentage) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handlePurchase = (api) => {
    setSelectedAPI(api);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedAPI && team) {
      // Check if there's enough remaining budget
      if (currentSpending + selectedAPI.price > 100) {
        alert('Insufficient budget! You cannot spend more than $100.00');
        return;
      }
      const newTransaction = {
        id: transactions.length + 1,
        description: selectedAPI.name,
        amount: selectedAPI.price,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Update team budget
      setTeam({
        ...team,
        spent: team.spent + selectedAPI.price
      });

      // Update current spending for display
      setCurrentSpending(prev => Math.min(prev + selectedAPI.price, 100));

      // Add to purchased APIs with unique API key
      const purchasedAPI = {
        ...selectedAPI,
        purchaseId: Date.now(),
        apiKey: generateAPIKey(selectedAPI.name),
        purchaseDate: new Date().toISOString()
      };
      setPurchasedAPIs(prev => [...prev, purchasedAPI]);

      // Add AI message
      const aiMessage = {
        id: aiMessages.length + 1,
        type: 'ai',
        message: `Great! You've just purchased ${selectedAPI.name} for $${selectedAPI.price}. You've now spent ${getBudgetPercentage(team.spent + selectedAPI.price, team.budget)}% of your budget. ${
          getBudgetPercentage(team.spent + selectedAPI.price, team.budget) > 70 
            ? "Consider using free alternatives like HuggingFace's free tier to save costs!" 
            : "You're doing great with your budget management!"
        }`,
        timestamp: new Date()
      };

      setAiMessages([...aiMessages, aiMessage]);
      setShowPurchaseModal(false);
      setSelectedAPI(null);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: aiMessages.length + 1,
        type: 'user',
        message: inputMessage,
        timestamp: new Date()
      };

      setAiMessages([...aiMessages, userMessage]);
      setInputMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: aiMessages.length + 2,
          type: 'ai',
          message: "I'm analyzing your request and will provide personalized budget advice. Based on your current spending patterns, I recommend focusing on essential APIs first and exploring free alternatives when possible.",
          timestamp: new Date()
        };
        setAiMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getApiKey = (transactionId) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  const generateAPIKey = (apiName) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    const apiPrefix = apiName.replace(/\s+/g, '').toUpperCase().substring(0, 3);
    return `${apiPrefix}_${timestamp}_${random}`.toUpperCase();
  };

  const handleAPIClick = (api) => {
    setSelectedAPIForKey(api);
    setShowAPIKeyModal(true);
  };

  const copyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  const featureCards = [
    {
      title: "Your VirtualHackerCard",
      description: "Your secure virtual debit card",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      action: "View Card"
    },
    {
      title: "Budget Tracking",
      description: "Monitor your spending in real-time",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      action: "Track Budget"
    },
    {
      title: "API Marketplace",
      description: "Purchase APIs and services",
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      action: "Browse APIs"
    },
    {
      title: "AI Assistant",
      description: "Get smart budget advice",
      icon: <Bot className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      action: "Chat Now"
    },
    {
      title: "Transaction History",
      description: "View all your purchases",
      icon: <Activity className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      action: "View History"
    },
    {
      title: "Teams History",
      description: "View your team history and achievements",
      icon: <Users className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
      action: "View Teams",
      onClick: () => {
        setActiveSection('teams-history');
        window.location.hash = 'teams-history';
      }
    },
    {
      title: "Team Settings",
      description: "Manage team preferences",
      icon: <Users className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
      action: "Settings"
    }
  ];

  if (!team) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workspace</h1>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {getGreeting()}, {currentTeamName || lastCreatedTeamName || team?.name || 'Team Member'}
            </p>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">{successMessage}</span>
                  <button
                    onClick={() => setSuccessMessage('')}
                    className="ml-auto text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">{errorMessage}</span>
                  <button
                    onClick={() => setErrorMessage('')}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Add New Team Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserList(true);
                refreshUsers();
                window.location.hash = 'add-team';
              }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Team</span>
            </motion.button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">Need help?  </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                  showAIAssistant 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        {/* Conditional Content Based on Active Section */}
        <AnimatePresence mode="wait">
          {activeSection === 'teams-history' ? (
            /* Teams History Section */
            <motion.div
              key="teams-history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Teams History</h2>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchTeamsHistory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveSection('dashboard');
                    window.location.hash = 'dashboard';
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all flex items-center space-x-2"
                >
                  <span>Back to Dashboard</span>
                </motion.button>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">{errorMessage}</span>
                  <button
                    onClick={() => setErrorMessage('')}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}



            <div className="grid gap-6">
              {teamsLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                  <p className="text-gray-600 mt-4">Loading teams history...</p>
                </div>
              ) : teamsHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't created any teams yet. Start by adding a new one!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection('dashboard');
                      window.location.hash = 'add-team';
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create Your First Team
                  </motion.button>
                </div>
              ) : (
                teamsHistory.map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-xl mb-2">{team.name}</h3>
                        <p className="text-lg text-gray-600 mb-1">{team.hackathon}</p>
                        <p className="text-sm text-gray-500">{team.date}</p>
                      </div>
                      <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Final Rank</p>
                          <p className="text-2xl font-bold text-indigo-600">{team.finalRank}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Budget</p>
                          <p className="text-2xl font-bold text-green-600">${team.budget}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm font-medium text-gray-600 mb-2">Team Members</p>
                        <div className="flex flex-wrap gap-2">
                          {team.members.map((member, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {team.achievements.map((achievement, index) => (
                          <span key={index} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full font-medium">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : showUserList ? (
          /* User List Section */
          <motion.div
            key="user-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Select Team Members</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Team size: {selectedUsers.length} members
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshUsers}
                  disabled={usersLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                  <span>{usersLoading ? 'Loading...' : 'Refresh'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    clearUsersList();
                    window.location.hash = 'dashboard';
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all flex items-center space-x-2"
                >
                  <span>Back to Dashboard</span>
                </motion.button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    {searchTerm || roleFilter !== 'all' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Showing {filteredUsers.length} of {users.length}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'team_member').length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="team_member">Team Member</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="full_name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </motion.div>



            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Selection Header */}
              {selectedUsers.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-900 font-medium">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedUsers([])}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                      >
                        Clear
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowCreateTeamModal(true);
                          window.location.hash = 'create-team';
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Create Team
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersLoading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                            <span className="text-gray-600">Loading users...</span>
                          </div>
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Shield className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Users</h3>
                            <p className="text-gray-600 mb-4">{usersError}</p>
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={refreshUsers}
                                disabled={usersLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                              >
                                <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                                <span>Try Again</span>
                              </button>
                              <button
                                onClick={() => {
                                  setUsersError(null);
                                  setUsers([]);
                                  setShowUserList(false);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                Go Back
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                          <p className="text-gray-500">
                            {searchTerm || roleFilter !== 'all' 
                              ? 'Try adjusting your search or filters' 
                              : 'No users have been registered yet'
                            }
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.avatar_url ? (
                                  <img 
                                    src={user.avatar_url} 
                                    alt={user.full_name} 
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.full_name || 'No Name'}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800 border-red-200' 
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                  <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUserSelection(user)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedUsers.find(u => u.id === user.id)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                        }`}
                      >
                        {selectedUsers.find(u => u.id === user.id) 
                          ? 'Selected' 
                          : 'Add to Team'
                        }
                      </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Default Dashboard Content */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
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
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={card.onClick}
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

            {/* Virtual Card Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Virtual Card</h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                  {/* Light accent overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/5 opacity-30"></div>
                  {/* Subtle light reflection */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent"></div>
                  <div className="absolute top-8 left-8 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-400/30">
                        <CreditCard className="w-7 h-7 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">HackerCard</p>
                        <p className="font-semibold">Virtual Debit Card</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Balance Section - Moved down to avoid logo overlap */}
                  <div className="text-right mb-8">
                    <p className="text-white/80 text-sm">Balance</p>
                    <p className="text-3xl font-bold">${(100 - currentSpending).toFixed(2)}</p>
                  </div>
                  
                  {/* Brex Logo */}
                  <div className="absolute top-6 right-6">
                    <img 
                      src="/brex.png" 
                      alt="Brex" 
                      className="h-8 w-auto opacity-80"
                    />
                  </div>

                  <div className="mb-8">
                    <p className="text-white/80 text-sm mb-2">Card Number</p>
                    <p className="text-2xl font-mono tracking-wider">{team.cardNumber}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Cardholder</p>
                      <p className="font-semibold">{lastCreatedTeamName || team.cardHolder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm mb-1">Expires</p>
                      <p className="font-semibold">{team.expiryDate}</p>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Budget Used</span>
                      <span>{getBudgetPercentage(currentSpending, 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getBudgetPercentage(currentSpending, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Budget Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">$100.00</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Amount Spent</p>
                    <p className={`text-2xl font-bold ${getBudgetColor(getBudgetPercentage(currentSpending, 100))}`}>
                      ${currentSpending.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">${(100 - currentSpending).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* API Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">API Marketplace</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apis.map((api) => (
                  <motion.div
                    key={api.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePurchase(api)}
                  >
                    <div className="text-3xl mb-3">{api.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{api.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{api.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">${api.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Buy Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Purchased APIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Purchased APIs</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initializeChat}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>API OFFICE HOURS BASED ON YOUR BUDGET</span>
                </motion.button>
              </div>
              {purchasedAPIs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-600 mb-4">You haven't purchased any APIs yet.</p>
                  <p className="text-sm text-gray-500">Purchase APIs from the marketplace to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchasedAPIs.map((api) => (
                    <motion.div
                      key={api.purchaseId}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleAPIClick(api)}
                    >
                      <div className="text-3xl mb-3">{api.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{api.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{api.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Purchased</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-green-700 hover:to-blue-700 transition-all"
                        >
                          Get API Key
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Budget and API Status Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">
                      Budget: <span className="font-semibold">${(100 - currentSpending).toFixed(2)}</span> remaining
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">
                      APIs: <span className="font-semibold">{purchasedAPIs.length}</span> purchased
                    </span>
                  </div>
                </div>
                {purchasedAPIs.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-xs">Available APIs:</span>
                    <div className="flex space-x-1">
                      {purchasedAPIs.slice(0, 3).map((api, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {api.name}
                        </span>
                      ))}
                      {purchasedAPIs.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{purchasedAPIs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Debug Info */}
              <div className="mt-2 text-xs text-gray-500">
                <span className="mr-4">🔑 SixtyFour: {SIXTYFOUR_API_KEY ? '✓ Configured' : '✗ Missing'}</span>
                <span className="mr-4">🤖 Gemini: {GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}</span>
                <span>📊 Project: {projectIdea ? `"${projectIdea.substring(0, 30)}..."` : 'Not set'}</span>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Create Hackathon Modal */}
        <AnimatePresence>
          {showCreateTeamModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowCreateTeamModal(false);
                window.location.hash = 'add-team';
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Hackathon</h3>
                
                <button
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    window.location.hash = 'add-team';
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hackathon Code</label>
                    <input
                      type="text"
                      value={hackathonCode}
                      onChange={(e) => setHackathonCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter hackathon code (e.g., TechCrunch, HackMIT, PennApps)"
                      required
                    />
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Members ({selectedUsers.length})
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {selectedUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-gray-700">
                            {user.full_name || user.email}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUserSelection(user)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </motion.button>
                        </div>
                      ))}
                      {selectedUsers.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">No members selected yet</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => {
                      setShowCreateTeamModal(false);
                      window.location.hash = 'add-team';
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createNewTeam}
                    disabled={!newTeamName.trim() || !hackathonCode.trim() || selectedUsers.length === 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    Create Hackathon
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIAssistant && (
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
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full max-w-2xl h-[600px]"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-semibold">AI Budget Assistant</span>
                  </div>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {aiMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about your budget..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedAPI && (
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
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{selectedAPI.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedAPI.name}</h3>
                <p className="text-gray-600">{selectedAPI.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-2xl font-bold text-blue-600">${selectedAPI.price}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Remaining Budget:</span>
                  <span className="font-semibold text-gray-900">${(100 - currentSpending).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmPurchase}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Confirm Purchase
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showAPIKeyModal && selectedAPIForKey && (
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
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{selectedAPIForKey.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedAPIForKey.name}</h3>
                <p className="text-gray-600">Your Personal API Key</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">API Key:</p>
                  <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm break-all">
                    {selectedAPIForKey.apiKey}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Purchase Date: {new Date(selectedAPIForKey.purchaseDate).toLocaleDateString()}</p>
                  <p>Keep this key secure and don't share it with others.</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAPIForKey.apiKey);
                    alert('API Key copied to clipboard!');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowAPIKeyModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SixtyFour AI Chatbot Modal */}
      <AnimatePresence>
        {showSixtyFourChat && (
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
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-full max-w-4xl h-[700px] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">SixtyFour AI Coding Mentor</h2>
                      <p className="text-white/80 text-sm">Your personal hackathon coding assistant</p>
                      {projectIdea && (
                        <p className="text-white/90 text-xs mt-1 font-medium">
                          🎯 Project: {projectIdea.length > 50 ? projectIdea.substring(0, 50) + '...' : projectIdea}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowSixtyFourChat(false);
                      // Reset chat state when closing
                      setChatMessages([]);
                      setChatInput('');
                      setProjectIdea('');
                      setHasAskedProjectIdea(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white text-gray-900 shadow-sm border border-gray-200 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                      placeholder="Ask me anything about your project, APIs, or coding challenges..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows="2"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </motion.button>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChatInput("I need help with API integration")}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                  >
                    <Code className="w-3 h-3 inline mr-1" />
                    API Help
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChatInput("Suggest some trendy project ideas")}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3 inline mr-1" />
                    Project Ideas
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChatInput("Help me debug this error")}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                  >
                    <Zap className="w-3 h-3 inline mr-1" />
                    Debug Help
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log('🧪 Test button clicked - testing API calls');
                      setChatInput("Test API call - I want to build a social media app with AI features");
                    }}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                  >
                    🧪 Test APIs
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamDashboard;
