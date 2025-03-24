
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";

interface Order {
  id: string;
  items: any[];
  total: number;
  date: string;
  status: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A172F7', '#FF6B6B'];

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  // Redirect if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Load sales data from localStorage
    const savedSalesData = localStorage.getItem('salesData');
    if (savedSalesData) {
      const parsedData = JSON.parse(savedSalesData);
      const chartData = Object.entries(parsedData).map(([name, value]) => ({
        name,
        value
      }));
      setSalesData(chartData);
    }
  }, []);

  // Calculate order statistics
  const newOrders = orders.filter(order => order.status === 'Processing').length;
  const shippedOrders = orders.filter(order => order.status === 'Shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-sm text-towel-gray mb-1">Total Revenue</h3>
            <p className="text-2xl font-semibold">${totalRevenue.toFixed(2)}</p>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-sm text-towel-gray mb-1">New Orders</h3>
            <p className="text-2xl font-semibold">{newOrders}</p>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-sm text-towel-gray mb-1">Shipped</h3>
            <p className="text-2xl font-semibold">{shippedOrders}</p>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-sm text-towel-gray mb-1">Delivered</h3>
            <p className="text-2xl font-semibold">{deliveredOrders}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Sales Analysis</h2>
            <div className="h-[300px]">
              {salesData.length > 0 ? (
                <ChartContainer className="w-full" config={{
                  sales: { theme: { light: "#0088FE", dark: "#0088FE" } },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                      />
                      <Legend 
                        content={<ChartLegendContent />} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center" 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-towel-gray">
                  No sales data available
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Recent Orders</h2>
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-towel-gray">
                No orders yet
              </div>
            )}
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
