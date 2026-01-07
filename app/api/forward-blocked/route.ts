import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forwardEmail } from '@/lib/mailgun';
import { getLog, updateLogStatus } from '@/lib/db.server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { logId } = await req.json();

    const log = await getLog(logId);

    if (!log || log.user_id !== user.id) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    if (log.status === 'forwarded') {
      return NextResponse.json({ message: 'Email already forwarded' });
    }

    // Forward the email
    await forwardEmail(
      user.email!,
      log.sender,
      `[Resend] ${log.subject}`,
      log.body_html || '',
      log.body_plain || ''
    );

    // Update log status
    await updateLogStatus(logId, 'forwarded');

    return NextResponse.json({ message: 'Email forwarded successfully' });
  } catch (error) {
    console.error('Forward error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
