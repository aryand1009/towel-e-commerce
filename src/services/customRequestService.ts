
import { supabase } from '@/integrations/supabase/client';
import { CustomRequest, CustomRequestInsert, RequestStatus } from '@/types/database';

export const createCustomRequest = async (
  request: CustomRequestInsert
): Promise<CustomRequest | null> => {
  const { data, error } = await supabase
    .from('custom_requests')
    .insert([request as any])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating custom request:', error);
    return null;
  }
  
  return data as CustomRequest;
};

export const getUserCustomRequests = async (
  userId: string
): Promise<CustomRequest[]> => {
  const { data, error } = await supabase
    .from('custom_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching custom requests for user ${userId}:`, error);
    return [];
  }
  
  return data as CustomRequest[] || [];
};

export const getAllCustomRequests = async (): Promise<CustomRequest[]> => {
  const { data, error } = await supabase
    .from('custom_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all custom requests:', error);
    return [];
  }
  
  return data as CustomRequest[] || [];
};

export const approveCustomRequest = async (
  requestId: string,
  completionTime: number
): Promise<CustomRequest | null> => {
  const { data, error } = await supabase
    .from('custom_requests')
    .update({
      status: 'approved' as RequestStatus,
      completion_time: completionTime,
      updated_at: new Date().toISOString()
    } as any)
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error approving custom request ${requestId}:`, error);
    return null;
  }
  
  return data as CustomRequest;
};

export const rejectCustomRequest = async (
  requestId: string,
  rejectionReason: string
): Promise<CustomRequest | null> => {
  const { data, error } = await supabase
    .from('custom_requests')
    .update({
      status: 'rejected' as RequestStatus,
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString()
    } as any)
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error rejecting custom request ${requestId}:`, error);
    return null;
  }
  
  return data as CustomRequest;
};
