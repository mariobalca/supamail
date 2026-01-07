import { supabaseAdmin } from './supabase/admin';
import { User, Rule, LogStatus } from '@/types/database';

export const getUserBySupamailAddress = async (address: string): Promise<User | null> => {
  const domain = process.env.MAILGUN_DOMAIN || 'supamail.mariobalca.com';
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
}) => {
  return supabaseAdmin.from('logs').insert(payload);
};
