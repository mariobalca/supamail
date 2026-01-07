import { NextRequest, NextResponse } from 'next/server';
import { getUserBySupamailAddress, getRulesForUser, logEmailActivity } from '@/lib/db.server';
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
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // 3. Check Rules (Whitelist/Blacklist)
    const rules = await getRulesForUser(user.id);

    // Simple matching logic
    const isBlocked = rules?.some((rule: Rule) =>
      rule.action === 'block' && sender.includes(rule.pattern)
    );

    if (isBlocked) {
      await logEmailActivity({
        user_id: user.id,
        sender,
        subject,
        status: 'blocked'
      });
      return NextResponse.json({ message: 'Email blocked' });
    }

    // 4. AI Feature: Generate Smart Subject/Summary
    const { summary, enhancedSubject } = await generateSmartSubject(subject, bodyPlain || bodyHtml);

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
      status: 'forwarded'
    });

    return NextResponse.json({ message: 'Email forwarded' });
  } catch (error) {
    console.error('Inbound error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
