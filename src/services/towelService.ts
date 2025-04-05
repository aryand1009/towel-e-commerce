
import { supabase } from '@/integrations/supabase/client';
import { Towel, TowelInsert } from '@/types/database';

export const getTowels = async (): Promise<Towel[]> => {
  const { data, error } = await supabase
    .from('towels')
    .select('*');
  
  if (error) {
    console.error('Error fetching towels:', error);
    return [];
  }
  
  return data as Towel[] || [];
};

export const getTowelById = async (id: string): Promise<Towel | null> => {
  const { data, error } = await supabase
    .from('towels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching towel with ID ${id}:`, error);
    return null;
  }
  
  return data as Towel;
};

export const createTowel = async (towel: TowelInsert): Promise<Towel | null> => {
  const { data, error } = await supabase
    .from('towels')
    .insert([towel as any])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating towel:', error);
    return null;
  }
  
  return data as Towel;
};

export const updateTowel = async (id: string, towel: Partial<TowelInsert>): Promise<Towel | null> => {
  const { data, error } = await supabase
    .from('towels')
    .update(towel as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating towel with ID ${id}:`, error);
    return null;
  }
  
  return data as Towel;
};

export const deleteTowel = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('towels')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting towel with ID ${id}:`, error);
    return false;
  }
  
  return true;
};
