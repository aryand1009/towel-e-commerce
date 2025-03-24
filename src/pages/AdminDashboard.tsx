
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not an admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <motion.div 
      className="container mx-auto py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel p-8 rounded-lg">
        <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
        
        <div className="mb-6">
          <p className="text-towel-gray">Welcome, Admin {user?.name || user?.email}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Orders Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>New Orders</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Processing</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipped</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivered</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Custom Requests</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pending Review</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Approved</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rejected</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button variant="default" className="w-full">
            Manage Products
          </Button>
          <Button variant="outline" className="w-full">
            View All Orders
          </Button>
          <Button variant="outline" className="w-full">
            Custom Requests
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

export default AdminDashboard;
