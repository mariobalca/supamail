import { supabaseAdmin } from './supabase/admin';
import { User, Rule, LogStatus, Log as UserLog } from '@/types/database';

export const getUserBySupamailAddress = async (
  address: string
): Promise<User | null> => {
  const domain = process.env.MAILGUN_DOMAIN || 'supamail-domain.com';
  if (address.endsWith(`@${domain}`)) {
    const username = address.split('@')[0];
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (!userError && userData) {
      return userData as User;
    }
  }

  return null;
};

export const getRulesForUser = async (userId: string): Promise<Rule[]> => {
  const { data, error } = await supabaseAdmin
    .from('rules')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];
  return data as Rule[];
};

export const logEmailActivity = async (payload: {
  user_id: string;
  sender: string;
  subject: string;
  status: LogStatus;
  ai_summary?: string;
  category?: string;
  body_html?: string;
  body_plain?: string;
}) => {
  return supabaseAdmin.from('logs').insert(payload);
};

export const getLog = async (id: string): Promise<UserLog | null> => {
  const { data, error } = await supabaseAdmin
    .from('logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as UserLog;
};

export const updateLogStatus = async (id: string, status: LogStatus) => {
  const { error } = await supabaseAdmin
    .from('logs')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const getAllCategories = async (): Promise<string[]> => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('name')
    .order('name', { ascending: true });

  if (error || !data) return [];
  return data.map((c) => c.name);
};

export const getOrCreateCategory = async (name: string): Promise<string> => {
  // First, check if it exists (case-insensitive-ish or exact)
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('name')
    .eq('name', name)
    .maybeSingle();

  if (data) return data.name;

  // If not found, insert it
  const { data: newData, error: insertError } = await supabaseAdmin
    .from('categories')
    .insert({ name })
    .select('name')
    .single();

  if (insertError) {
    // Possibly a race condition where it was just inserted
    const { data: retryData } = await supabaseAdmin
      .from('categories')
      .select('name')
      .eq('name', name)
      .single();
    if (retryData) return retryData.name;
    throw insertError;
  }

  return newData.name;
};
