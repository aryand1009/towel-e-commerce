
import { supabase } from '@/integrations/supabase/client';
import { Cart, CartInsert } from '@/types/database';

export const getCartItems = async (userId: string): Promise<Cart[]> => {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      towels:towel_id (
        id, name, price, image
      )
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
  
  return data as Cart[] || [];
};

export const addToCart = async (cartItem: CartInsert): Promise<Cart | null> => {
  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', cartItem.user_id)
    .eq('towel_id', cartItem.towel_id)
    .single();

  if (existing) {
    // Update quantity if item exists
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: (existing as any).quantity + cartItem.quantity })
      .eq('id', (existing as any).id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
    
    return data as Cart;
  } else {
    // Insert new item if it doesn't exist
    const { data, error } = await supabase
      .from('cart')
      .insert([cartItem as any])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
    
    return data as Cart;
  }
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<Cart | null> => {
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity } as any)
    .eq('id', cartItemId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating cart item ${cartItemId}:`, error);
    return null;
  }
  
  return data as Cart;
};

export const removeFromCart = async (cartItemId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId);
  
  if (error) {
    console.error(`Error removing item ${cartItemId} from cart:`, error);
    return false;
  }
  
  return true;
};

export const clearCart = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error clearing cart for user ${userId}:`, error);
    return false;
  }
  
  return true;
};
