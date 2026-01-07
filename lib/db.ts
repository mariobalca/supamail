import { createClient } from './supabase/client';
import { Alias, Rule, Log } from '@/types/database';

export const getAliases = async (): Promise<Alias[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('aliases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createAlias = async (address: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('aliases')
    .insert({ address, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleAliasStatus = async (id: string, isActive: boolean) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('aliases')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;
};

export const deleteAlias = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('aliases')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAllRules = async (): Promise<Rule[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rules')
    .select('*, aliases(address)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as any;
};

export const createRule = async (aliasId: string, pattern: string, action: 'allow' | 'block') => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rules')
    .insert({ alias_id: aliasId, pattern, action })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRule = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getLogs = async (): Promise<(Log & { aliases: { address: string } })[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('logs')
    .select('*, aliases(address)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as any;
};
