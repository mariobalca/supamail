export type User = {
  id: string;
  email: string;
  primary_email: string;
  updated_at: string;
};

export type Alias = {
  id: string;
  user_id: string;
  address: string;
  is_active: boolean;
  created_at: string;
};

export type RuleAction = 'allow' | 'block';

export type Rule = {
  id: string;
  alias_id: string;
  pattern: string;
  action: RuleAction;
  created_at: string;
};

export type LogStatus = 'forwarded' | 'blocked';

export type Log = {
  id: string;
  alias_id: string;
  sender: string;
  subject: string | null;
  ai_summary: string | null;
  status: LogStatus;
  created_at: string;
};

export type AliasWithUser = Alias & {
  users: User;
};
