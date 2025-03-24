
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div 
      className="container mx-auto py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel p-8 rounded-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">My Profile</h1>
        
        <div className="mb-8">
          <p className="text-towel-gray">Welcome, {user?.name || user?.email}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-towel-gray">Name</p>
                <p className="font-medium">{user?.name || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-towel-gray">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-towel-gray">Account Type</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">My Orders</h2>
            <div className="text-center py-6">
              <p className="text-towel-gray">You don't have any orders yet.</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
