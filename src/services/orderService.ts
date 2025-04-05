
interface Order {
  id: string;
  items: any[];
  total: number;
  date: string;
  status: string;
  userName?: string;
  userEmail?: string;
}

interface SalesData {
  [category: string]: number;
}

// Get all orders from localStorage
export const getAllOrders = (): Order[] => {
  const savedOrders = localStorage.getItem('orders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

// Get order by ID
export const getOrderById = (orderId: string): Order | null => {
  const orders = getAllOrders();
  return orders.find(order => order.id === orderId) || null;
};

// Save orders to localStorage
export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // If no orders left, clear sales data
  if (orders.length === 0) {
    clearSalesData();
  }
};

// Delete an order and update sales data
export const deleteOrder = (orderId: string): void => {
  const orders = getAllOrders();
  const orderToDelete = orders.find(order => order.id === orderId);
  
  if (!orderToDelete) return;
  
  // Remove from orders
  const updatedOrders = orders.filter(order => order.id !== orderId);
  saveOrders(updatedOrders);
  
  // Update sales data
  updateSalesDataAfterDeletion(orderToDelete);
};

// Update order status
export const updateOrderStatus = (orderId: string, newStatus: string): void => {
  const orders = getAllOrders();
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return { ...order, status: newStatus };
    }
    return order;
  });
  
  saveOrders(updatedOrders);
};

// Update sales data when an order is deleted
const updateSalesDataAfterDeletion = (deletedOrder: Order): void => {
  // Get current sales data
  const savedSalesData = localStorage.getItem('salesData');
  if (!savedSalesData) return;
  
  const salesData: SalesData = JSON.parse(savedSalesData);
  
  // Subtract the deleted order items from sales data
  deletedOrder.items.forEach(item => {
    const category = item.category || 'Other';
    if (salesData[category]) {
      salesData[category] -= item.price * item.quantity;
      
      // If category value drops to zero or below, remove it
      if (salesData[category] <= 0) {
        delete salesData[category];
      }
    }
  });
  
  // Save updated sales data
  localStorage.setItem('salesData', JSON.stringify(salesData));
};

// Clear all sales data
export const clearSalesData = (): void => {
  localStorage.removeItem('salesData');
};

// Synchronize sales data with current orders
export const syncSalesDataWithOrders = (): void => {
  const orders = getAllOrders();
  
  // If no orders, clear sales data
  if (orders.length === 0) {
    clearSalesData();
    return;
  }
  
  // Recalculate sales data from scratch based on existing orders
  const salesData: SalesData = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category || 'Other';
      if (!salesData[category]) {
        salesData[category] = 0;
      }
      salesData[category] += item.price * item.quantity;
    });
  });
  
  // Save updated sales data
  localStorage.setItem('salesData', JSON.stringify(salesData));
};
