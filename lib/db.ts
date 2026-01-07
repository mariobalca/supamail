import { createClient } from './supabase/client';
import { Rule, Log, User, RuleType } from '@/types/database';

export const getProfile = async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
};

export const updateUsername = async (username: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('users')
    .update({ username, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) throw error;
};

export const getAllRules = async (): Promise<Rule[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createRule = async (
  pattern: string,
  action: 'allow' | 'block',
  type: RuleType = 'domain'
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('rules')
    .insert({ user_id: user.id, pattern, action, type })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRule = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('rules').delete().eq('id', id);

  if (error) throw error;
};

export const getLogs = async (): Promise<Log[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getCategories = async (): Promise<string[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map((c) => c.name);
};
