
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderInsert, OrderItem, OrderItemInsert, OrderStatus } from '@/types/database';

export const createOrder = async (
  order: OrderInsert,
  orderItems: OrderItemInsert[]
): Promise<Order | null> => {
  // Start a Postgres transaction to ensure all operations succeed or fail together
  const { data, error } = await supabase
    .rpc('create_order', {
      order_data: order,
      items_data: orderItems
    });

  if (error) {
    console.error('Error creating order:', error);
    
    // If RPC doesn't exist, we'll fall back to manual creation
    // We'll create the order first
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (orderError || !orderData) {
      console.error('Error creating order manually:', orderError);
      return null;
    }
    
    // Then create the order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);
    
    if (itemsError) {
      console.error('Error creating order items manually:', itemsError);
      return null;
    }
    
    return orderData as Order;
  }
  
  return data as Order;
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return [];
  }
  
  return data as Order[] || [];
};

export const getOrderDetails = async (orderId: string): Promise<{order: Order | null, items: OrderItem[]}> => {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error(`Error fetching order ${orderId}:`, orderError);
    return { order: null, items: [] };
  }
  
  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  if (itemsError) {
    console.error(`Error fetching items for order ${orderId}:`, itemsError);
    return { order: order as Order, items: [] };
  }
  
  return { order: order as Order, items: items as OrderItem[] || [] };
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status } as any)
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    return null;
  }
  
  return data as Order;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
  
  return data as Order[] || [];
};
