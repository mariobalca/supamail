# Supamail - AI-Powered Personal Email Firewall

Supamail is a professional-grade SaaS designed to protect your primary inbox from noise, spam, and unwanted trackings. By providing you with a unique **Supamail ID**, it acts as a secure bridge between the public internet and your private email address.

## 🚀 Key Features

- **Supamail ID (Identity Protection)**: Claim a unique `username@supamail-domain.com` and use it everywhere instead of your real email.
- **AI Smart-Digest**: Automatically categorizes incoming emails and generates concise 3-5 word summaries, prepended to the subject line for instant context.
- **Advanced Filtering Engine**: Set granular rules to allow or block emails based on:
  - **Specific Email Addresses**
  - **Entire Domains**
  - **AI Categories** (e.g., Promotions, Social, Updates)
- **Rule Precedence**: Intelligent logic ensures specific exceptions (like whitelisting a single sender) override broader blocks (like a category block).
- **Activity Dashboard**: Monitor all incoming traffic, review blocked content, and manually forward important emails to your inbox.
- **Seamless Recovery**: Preview blocked emails in a secure sandbox and whitelist trusted domains with a single click.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, SSR Auth, RLS)
- **Email Infrastructure**: [Mailgun API](https://www.mailgun.com/) (Inbound Routes & Outbound Forwarding)
- **AI Engine**: [OpenAI API](https://openai.com/) (GPT-4o-mini for categorization and summarization)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Component Library**: Custom reusable primitives (Button, Card, Input, Badge, etc.)
- **Testing**: [Vitest](https://vitest.dev/) (Unit and Integration suites)
- **Standards**: ESLint 9 (Flat Config), Prettier, and TypeScript.

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/supamail.git
cd supamail
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mailgun
NEXT_PUBLIC_MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_SIGNING_KEY=your_webhook_signing_key
MAILGUN_URL=https://api.eu.mailgun.net # Optional: Use for EU region

# OpenAI
OPENAI_API_KEY=your_openai_key
```

### 4. Database Setup
Execute the migration scripts located in `supabase/migrations/` within your Supabase SQL Editor to set up the schema, RLS policies, and initial categories.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

### Run the full test suite
```bash
npm run test
```

### Simulate an Inbound Email (Local)
To verify the entire webhook flow (DB -> AI -> Forwarding) without an actual Mailgun setup:
```bash
npx ts-node scripts/test-inbound.ts
```

## 🏗 Architecture

- `app/api/inbound`: Core webhook handler for Mailgun.
- `lib/db.server.ts`: Server-side database services (bypasses RLS via `supabaseAdmin`).
- `lib/db.ts`: Client-side database services (respects RLS).
- `lib/mailgun.ts`: Mailgun client and signature verification logic.
- `lib/ai.ts`: OpenAI integration for categorization and summarization.
- `components/ui`: Reusable component library.
- `proxy.ts`: Next.js Middleware for authentication and onboarding enforcement.

## 📄 License
MIT
