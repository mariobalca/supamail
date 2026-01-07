import { supabaseAdmin } from './supabase/admin';
import { AliasWithUser, Rule, LogStatus } from '@/types/database';

export const getAliasWithUser = async (address: string): Promise<AliasWithUser | null> => {
  const { data, error } = await supabaseAdmin
    .from('aliases')
    .select('*, users(*)')
    .eq('address', address)
    .single();

  if (error || !data) return null;
  return data as unknown as AliasWithUser;
};

export const getRulesForAlias = async (aliasId: string): Promise<Rule[]> => {
  const { data, error } = await supabaseAdmin
    .from('rules')
    .select('*')
    .eq('alias_id', aliasId);

  if (error || !data) return [];
  return data as Rule[];
};

export const logEmailActivity = async (payload: {
  alias_id: string;
  sender: string;
  subject: string;
  status: LogStatus;
  ai_summary?: string;
}) => {
  return supabaseAdmin.from('logs').insert(payload);
};
