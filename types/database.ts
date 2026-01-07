export type User = {
  id: string;
  email: string;
  username: string | null;
  updated_at: string;
};

export type RuleAction = 'allow' | 'block';

export type RuleType = 'domain' | 'email' | 'category';

export type Rule = {
  id: string;
  user_id: string;
  pattern: string;
  action: RuleAction;
  type: RuleType;
  created_at: string;
};

export type LogStatus = 'forwarded' | 'blocked';

export type Log = {
  id: string;
  user_id: string;
  sender: string;
  subject: string | null;
  ai_summary: string | null;
  category: string | null;
  body_html: string | null;
  body_plain: string | null;
  status: LogStatus;
  created_at: string;
};
