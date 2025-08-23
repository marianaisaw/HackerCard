import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import TeamDashboard from './components/TeamDashboard';
import Sidebar from './components/Sidebar';
import UserRegistration from './components/UserRegistration';
import SignIn from './components/SignIn';
import UserRoleSelection from './components/UserRoleSelection';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        console.log('App: Checking initial auth state...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('App: Initial auth check result:', user ? 'User found' : 'No user');
        
        if (user) {
          setCurrentUser(user);
          console.log('App: User set, checking role...');
          
          // Only redirect if user is not already on role-selection page
          if (location.pathname !== '/role-selection') {
            // Check if user has a role
            console.log('App: Initial check - checking for user profile...');
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('user_id', user.id)
              .single();
            
            console.log('App: Initial profile query result:', { profile, error: profileError });
            
            if (profileError) {
              console.log('App: Initial profile query error, treating as new user');
              navigate('/role-selection');
            } else if (profile?.role) {
              // User has a role, redirect to appropriate dashboard
              console.log('App: User has role:', profile.role);
              if (profile.role === 'admin') {
                navigate('/admin');
              } else if (profile.role === 'team_member') {
                navigate('/team/demo');
              } else {
                // Unknown role, redirect to role selection
                navigate('/role-selection');
              }
            } else {
              // User doesn't have a role, redirect to role selection
              console.log('App: User has no role, redirecting to role selection');
              navigate('/role-selection');
            }
          }
        } else {
          console.log('App: No user found, staying on current page');
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        console.log('App: Setting loading to false');
        setLoading(false);
      }
    };

    checkUser();
    
    // Fallback timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('App: Loading timeout reached, forcing loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('App: Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser(session.user);
          
          // Check if user has a role
          console.log('App: Checking for user profile...');
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          console.log('App: Profile query result:', { profile, error: profileError });
          
          if (profileError) {
            console.log('App: Profile query error, treating as new user');
            navigate('/role-selection');
          } else if (!profile?.role) {
            // New user - redirect to role selection
            console.log('App: New user, redirecting to role selection');
            navigate('/role-selection');
          } else {
            // Existing user with role - redirect to appropriate dashboard
            console.log('App: Existing user with role:', profile.role);
            if (profile.role === 'admin') {
              navigate('/admin');
            } else if (profile.role === 'team_member') {
              navigate('/team/demo');
            } else {
              // Unknown role, redirect to role selection
              navigate('/role-selection');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          // Only redirect to homepage when user actually signs out
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<LandingPage setCurrentUser={setCurrentUser} />}
      />
      <Route 
        path="/signup" 
        element={<UserRegistration setCurrentUser={setCurrentUser} />}
      />
      <Route 
        path="/signin" 
        element={<SignIn setCurrentUser={setCurrentUser} />}
      />
      <Route 
        path="/role-selection" 
        element={<UserRoleSelection setCurrentUser={setCurrentUser} />}
      />
      <Route 
        path="/admin" 
        element={
          <div className="flex h-screen bg-gray-50">
            <Sidebar currentPage="admin" />
            <div className="flex-1 overflow-auto">
              <AdminDashboard />
            </div>
          </div>
        }
      />
      
      <Route 
        path="/team/:teamId" 
        element={
          <div className="flex h-screen bg-gray-50">
            <Sidebar currentPage="team" onSectionChange={(section) => {
              // This will be handled by TeamDashboard
            }} />
            <div className="flex-1 overflow-auto">
              <TeamDashboard />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AppContent />
    </div>
  );
}

export default App;
