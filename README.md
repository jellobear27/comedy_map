# 🎤 ComedyMap

**The ultimate platform for comedians to discover open mics, learn from courses, and connect with the comedy community across the USA.**

![ComedyMap](https://via.placeholder.com/1200x630/7B2FF7/FFFFFF?text=ComedyMap)

## ✨ Features

### For Comedians
- **🗺️ Open Mic Finder** - Discover open mics across all 50 states with real-time updates
- **📚 Expert Courses** - Learn from established comedians with comprehensive courses
- **👥 Community** - Connect with fellow comedians, share advice, and celebrate wins
- **📅 Tour Planning** - Plan your comedy tour with integrated scheduling

### For Venues
- **🎭 Find Hosts** - Connect with experienced comedy hosts in your area
- **📢 Promoter Network** - Access professional comedy promoters
- **📋 Free Listings** - List your open mic for free once established

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, or pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/comedy_map.git
   cd comedy_map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # Copy the contents of supabase/schema.sql and run in Supabase
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Payments**: [Stripe](https://stripe.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
comedy_map/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── community/         # Community forum
│   │   ├── courses/           # Course marketplace
│   │   ├── dashboard/         # User dashboard
│   │   ├── for-venues/        # Venue-specific pages
│   │   ├── open-mics/         # Open mic search
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── supabase/          # Supabase client configuration
│   │   └── stripe.ts          # Stripe configuration
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Auth middleware
├── supabase/
│   └── schema.sql             # Database schema
└── public/                    # Static assets
```

## 🎨 Design System

ComedyMap features a stunning electric gradient-based design:

### Colors
- **Electric Violet**: `#7B2FF7`
- **Hot Magenta**: `#F72585`
- **Neon Coral**: `#FF6B6B`
- **Cyber Teal**: `#00F5D4`
- **Golden Hour**: `#FFB627`

### Typography
- **Primary**: Sora (Google Fonts)
- **Mono**: JetBrains Mono

## 📝 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |

## 🔐 Authentication

ComedyMap uses Supabase Auth with support for:
- Email/Password authentication
- OAuth (Google, GitHub)
- Magic links
- Session management via cookies

## 💳 Payments

Stripe integration supports:
- Course purchases
- Secure checkout
- Webhook handling for payment events

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- All Supabase and Stripe keys to production values

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## 📧 Support

For support, email support@comedymap.com or join our Discord community.

---

Built with ⚡ for comedians everywhere
