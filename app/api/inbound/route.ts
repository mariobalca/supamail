import { NextRequest, NextResponse } from 'next/server';
import {
  getUserBySupamailAddress,
  getRulesForUser,
  logEmailActivity,
} from '@/lib/db.server';
import { verifySignature, forwardEmail } from '@/lib/mailgun';
import { generateSmartSubject } from '@/lib/ai';
import { Rule } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const sender = formData.get('from') as string;
    const recipient = formData.get('recipient') as string;
    const subject = formData.get('subject') as string;
    const bodyHtml = (formData.get('body-html') as string) || '';
    const bodyPlain = (formData.get('body-plain') as string) || '';
    const timestamp = formData.get('timestamp') as string;
    const token = formData.get('token') as string;
    const signature = formData.get('signature') as string;

    // 1. Verify Mailgun Signature
    if (!verifySignature(timestamp, token, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 2. Find User by Supamail Address
    const user = await getUserBySupamailAddress(recipient);

    if (!user) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // 3. AI Feature: Generate Smart Subject/Summary and Category
    const { summary, enhancedSubject, category } = await generateSmartSubject(
      subject,
      bodyPlain || bodyHtml
    );

    // 4. Check Rules (Whitelist/Blacklist/Category)
    const rules = await getRulesForUser(user.id);

    // Precedence Logic:
    // 1. Specific Email rules override everything else.
    // 2. Domain rules override Category rules.
    // 3. 'allow' action overrides 'block' within the same or lower specificity level.

    let finalAction: 'allow' | 'block' = 'allow'; // Default to allow

    // Categorize rules by type
    const emailRules = rules.filter(r => r.type === 'email');
    const domainRules = rules.filter(r => r.type === 'domain');
    const categoryRules = rules.filter(r => r.type === 'category');

    const matchesRule = (rule: Rule) => {
      if (rule.type === 'email') return sender.toLowerCase() === rule.pattern.toLowerCase();
      if (rule.type === 'category') return rule.pattern.toLowerCase() === category.toLowerCase();
      return sender.toLowerCase().includes(rule.pattern.toLowerCase());
    };

    // Find if any rule matches at each level
    const matchedEmailRule = emailRules.find(matchesRule);
    const matchedDomainRule = domainRules.find(matchesRule);
    const matchedCategoryRule = categoryRules.find(matchesRule);

    if (matchedEmailRule) {
      finalAction = matchedEmailRule.action;
    } else if (matchedDomainRule) {
      finalAction = matchedDomainRule.action;
    } else if (matchedCategoryRule) {
      finalAction = matchedCategoryRule.action;
    }

    if (finalAction === 'block') {
      await logEmailActivity({
        user_id: user.id,
        sender,
        subject,
        status: 'blocked',
        ai_summary: summary,
        category,
        body_html: bodyHtml,
        body_plain: bodyPlain,
      });
      return NextResponse.json({ message: 'Email blocked' });
    }

    // 5. Forward Email via Mailgun
    await forwardEmail(
      user.email,
      sender,
      enhancedSubject,
      bodyHtml,
      bodyPlain
    );

    // 6. Log Success
    await logEmailActivity({
      user_id: user.id,
      sender,
      subject,
      ai_summary: summary,
      category,
      status: 'forwarded',
      body_html: bodyHtml,
      body_plain: bodyPlain,
    });

    return NextResponse.json({ message: 'Email forwarded' });
  } catch (error) {
    console.error('Inbound error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
