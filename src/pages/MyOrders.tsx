
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink, PackageCheck } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
}

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load orders from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      // In a real app, filter orders by user ID
      // For this demo, we're showing all orders
      setOrders(allOrders);
    }
  }, [isAuthenticated]);

  // Helper function to get status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

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
      <div className="glass-panel p-8 rounded-lg max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-3xl font-semibold">My Orders</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <OrderList orders={orders} />
              </TabsContent>
              
              <TabsContent value="processing">
                <OrderList orders={orders.filter(order => 
                  order.status.toLowerCase() === 'processing'
                )} />
              </TabsContent>
              
              <TabsContent value="shipped">
                <OrderList orders={orders.filter(order => 
                  order.status.toLowerCase() === 'shipped'
                )} />
              </TabsContent>
              
              <TabsContent value="delivered">
                <OrderList orders={orders.filter(order => 
                  order.status.toLowerCase() === 'delivered'
                )} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <PackageCheck className="h-12 w-12 mx-auto text-towel-gray mb-4" />
            <h3 className="text-xl font-medium mb-2">No orders yet</h3>
            <p className="text-towel-gray mb-6">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper component to display order list
const OrderList = ({ orders }: { orders: Order[] }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg border-dashed">
        <p className="text-towel-gray">No orders found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>
                  {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                </CardDescription>
              </div>
              <Badge
                variant={
                  order.status.toLowerCase() === 'processing' ? 'warning' :
                  order.status.toLowerCase() === 'shipped' ? 'secondary' :
                  order.status.toLowerCase() === 'delivered' ? 'success' :
                  'destructive'
                }
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-towel-gray">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              
              {order.items.length > 2 && (
                <p className="text-sm text-towel-gray">
                  +{order.items.length - 2} more item(s)
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm text-towel-gray">Total</p>
              <p className="font-semibold">₹{order.total.toFixed(2)}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/order-details/${order.id}`} className="flex items-center gap-1">
                View Details <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyOrders;
