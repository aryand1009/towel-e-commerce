
import type { Database } from '@/integrations/supabase/types';

// Define custom enum types matching the database
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

// Define types for each table
export type Towel = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  category: string;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  stock: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Cart = {
  id: string;
  user_id: string;
  towel_id: string;
  quantity: number;
  added_at: string | null;
  towels?: Towel;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: OrderStatus;
  created_at: string | null;
  updated_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  towel_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export type CustomRequest = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  quantity: number;
  budget: number | null;
  phone: string | null;
  image: string | null;
  status: RequestStatus;
  created_at: string | null;
  updated_at: string | null;
  completion_time: number | null;
  rejection_reason: string | null;
};

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
};

// Input types for insert/update operations
export type TowelInsert = Omit<Towel, 'id' | 'created_at' | 'updated_at'>;
export type CartInsert = Omit<Cart, 'id' | 'added_at'>;
export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'>;
export type OrderItemInsert = Omit<OrderItem, 'id'>;
export type CustomRequestInsert = Omit<CustomRequest, 'id' | 'created_at' | 'updated_at' | 'completion_time' | 'rejection_reason'>;
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
