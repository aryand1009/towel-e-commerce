
import type { Database } from '@/integrations/supabase/types';

// Extract table types from the Database type
export type Tables = Database['public']['Tables'];

// Define types for each table
export type Towel = Tables['towels']['Row'];
export type Cart = Tables['cart']['Row'];
export type Order = Tables['orders']['Row'];
export type OrderItem = Tables['order_items']['Row'];
export type CustomRequest = Tables['custom_requests']['Row'];
export type Profile = Tables['profiles']['Row'];

// Input types for insert/update operations
export type TowelInsert = Tables['towels']['Insert'];
export type CartInsert = Tables['cart']['Insert'];
export type OrderInsert = Tables['orders']['Insert'];
export type OrderItemInsert = Tables['order_items']['Insert'];
export type CustomRequestInsert = Tables['custom_requests']['Insert'];
export type ProfileInsert = Tables['profiles']['Insert'];

// Define enums that match the database
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
