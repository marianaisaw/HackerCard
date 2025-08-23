# 🚀 HackerCard - Virtual Debit Card Platform for Hackathons

> **Award-winning UI design for virtual debit card management built specifically for hackathon organizers and teams.**

## ✨ Features

### 🎯 **For Hackathon Organizers (Admin Dashboard)**

- **Team Management**: Create, edit, and delete teams with instant virtual card generation
- **Budget Control**: Assign budgets, monitor spending, and freeze cards as needed
- **Real-time Analytics**: Live transaction monitoring and budget utilization insights
- **Stripe Integration**: Seamless virtual card creation using Stripe Issuing (test mode)

### 🎯 **For Teams (Team Dashboard)**

- **Modern Virtual Card**: Sleek fintech-style virtual card with masked numbers
- **Live Budget Tracking**: Real-time budget progress with visual indicators
- **API Marketplace**: One-click purchases for popular APIs (OpenAI, AWS, etc.)
- **AI Budget Assistant**: Intelligent spending recommendations and cost optimization

### 🎨 **Design & UX**

- **Award-winning UI**: Modern, responsive design with smooth animations
- **Framer Motion**: Beautiful micro-interactions and page transitions
- **Glass Morphism**: Contemporary design elements with backdrop blur effects
- **Responsive Design**: Optimized for all devices and screen sizes

## 🛠️ Tech Stack

- **Frontend**: React 18 + React Router
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Create React App
- **Authentication**: Supabase Auth with Google & GitHub OAuth

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/hackercard.git
cd hackercard
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Available Routes

- **`/`** - Landing page with feature overview
- **`/admin`** - Admin dashboard for organizers
- **`/team/:teamId`** - Team dashboard (e.g., `/team/demo`)

## 🎨 Design System

### Color Palette

- **Primary**: Blue gradient (#6366f1 → #4f46e5)
- **Secondary**: Green (#10b981)
- **Accent**: Orange (#f59e0b)
- **Neutral**: Gray scale with semantic colors

### Typography

- **Font Family**: Inter (Google Fonts)
- **Scale**: 12px to 60px with consistent ratios
- **Weights**: 300, 400, 500, 600, 700, 800

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Modals**: Smooth animations with backdrop blur
- **Forms**: Clean inputs with focus states

## 🔐 Authentication

### Supported Providers

- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account

### Setup Instructions

1. **Configure Supabase Auth**

   - Enable Google OAuth in Supabase Dashboard
   - Enable GitHub OAuth in Supabase Dashboard
   - Add your OAuth credentials (Client ID & Secret)

2. **Environment Variables**

   ```bash
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   - Run the `database_setup.sql` script in Supabase SQL Editor
   - This creates the `user_profiles` table for role management

### Authentication Flow

1. User signs in with Google or GitHub
2. Redirected to role selection (hacker/admin)
3. Role saved to database
4. Redirected to appropriate dashboard

## 🔧 Customization

### Adding New APIs

Edit the `apis` array in `TeamDashboard.js`:

```javascript
const apis = [
  {
    id: 7,
    name: "New API Service",
    price: 35,
    description: "Description of the new service",
    icon: "🚀",
  },
];
```

### Modifying Colors

Update CSS custom properties in `src/index.css`:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... */
}
```

### Adding New Features

The modular component structure makes it easy to add new features:

- Create new components in `src/components/`
- Add routes in `src/App.js`
- Update navigation as needed

## 📊 Project Structure

```
src/
├── components/
│   ├── LandingPage.js      # Hero section & features
│   ├── AdminDashboard.js   # Organizer management
│   └── TeamDashboard.js    # Team interface
├── App.js                  # Main routing
├── index.js               # Entry point
└── index.css              # Global styles & tokens
```

## 🎯 Key Features Explained

### 1. **Virtual Card Generation**

- Instant card creation when teams are added
- Secure masked numbers for privacy
- Real-time balance updates

### 2. **AI Budget Assistant**

- Contextual spending advice
- Cost optimization recommendations
- Integration with purchase history

### 3. **Real-time Monitoring**

- Live transaction updates
- Budget utilization tracking
- Instant notifications and alerts

### 4. **Responsive Design**

- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for all devices

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Inter Font** for modern typography

## 📞 Support

- **Email**: support@hackercard.com
- **Discord**: [Join our community](https://discord.gg/hackercard)
- **Documentation**: [docs.hackercard.com](https://docs.hackercard.com)

---

**Built with ❤️ for the hackathon community**

_Transform your hackathon finances with HackerCard - where innovation meets financial control._
