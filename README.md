# HackerCard - Hackathon Finance Platform

A virtual debit card platform designed specifically for hackathon participants, featuring budget management, API marketplace, and AI-powered coding mentorship.

## Features

### 🏦 Virtual Debit Card

- Secure virtual card with customizable budget
- Real-time spending tracking
- Budget percentage visualization
- Transaction history management

### 🛒 API Marketplace

- Curated selection of popular APIs and services
- One-click purchases with budget integration
- API key management and security
- Purchase history tracking

### 🤖 SixtyFour AI Coding Mentor

- **AI-Powered Coding Assistant**: Get personalized help with your hackathon project
- **Dual API Integration**: Combines SixtyFour AI for technical research and Gemini for mentorship
- **Project-Based Learning**: Start by sharing your project idea, then get tailored advice
- **API Recommendations**: Get suggestions based on your purchased APIs and remaining budget
- **Real-Time Research**: Access to latest tech trends and documentation
- **Error Debugging**: Help with code issues and best practices

#### How to Use the AI Mentor:

1. Click "API OFFICE HOURS BASED ON YOUR BUDGET" button
2. Share your project idea when prompted
3. Ask questions about APIs, coding, or project structure
4. Get personalized advice combining research and mentorship

#### API Integration Details:

- **SixtyFour AI**: Handles technical documentation research and current tech insights
- **Gemini AI**: Provides encouraging mentorship responses with coding guidance
- **Real-time Updates**: Both APIs are called for each user question after project setup
- **Fallback System**: Graceful error handling if APIs are unavailable

### 👥 Team Management

- Create and manage hackathon teams
- User role management (Admin, Team Member)
- Team history and achievements tracking
- Budget allocation per team

### 📊 Dashboard & Analytics

- Comprehensive spending analytics
- Budget utilization tracking
- Purchase recommendations
- Performance metrics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account for backend services

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd HackerCardTest
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file with your API credentials
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SIXTYFOUR_API_KEY=your_sixtyfour_api_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys Required

### SixtyFour AI

- **Purpose**: Technical documentation research and current tech insights
- **Key**: Set via `REACT_APP_SIXTYFOUR_API_KEY` environment variable
- **Usage**: Automatically called for technical research in the AI mentor

### Gemini AI

- **Purpose**: Mentorship responses and coding guidance
- **Key**: Set via `REACT_APP_GEMINI_API_KEY` environment variable
- **Model**: `gemini-2.0-flash`
- **Usage**: Generates encouraging, supportive mentor responses

## Testing the AI Chatbot

To verify that both APIs are working:

1. **Open the app** and navigate to the Team Dashboard
2. **Click "API OFFICE HOURS BASED ON YOUR BUDGET"** button
3. **Share your project idea** (e.g., "I want to build a social media app with AI features")
4. **Ask follow-up questions** (e.g., "What APIs should I use for user authentication?")
5. **Check the browser console** for detailed API call logs:
   - 🚀 SixtyFour API calls
   - 🤖 Gemini API calls
   - 📡 Response status and data
   - ✅ Success confirmations

### Console Logs to Look For:

```
🚀 Calling SixtyFour API with: {query, projectContext}
📡 SixtyFour API response status: 200
✅ SixtyFour API response data: {...}
📝 SixtyFour API content: "..."

🤖 Calling Gemini API with: {userMessage, projectContext, ...}
📡 Gemini API response status: 200
✅ Gemini API response data: {...}
📝 Gemini API content: "..."
```

## Project Structure

```
src/
├── components/
│   ├── TeamDashboard.js      # Main dashboard with AI chatbot
│   ├── LandingPage.js        # Landing page
│   ├── SignIn.js            # Authentication
│   └── ...                  # Other components
├── supabaseClient.js        # Database connection
└── index.js                 # App entry point
```

## Technologies Used

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Integration**:
  - SixtyFour AI API for technical research
  - Google Gemini API for mentorship
- **UI/UX**: Framer Motion for animations
- **Styling**: Tailwind CSS with custom gradients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about the AI chatbot integration, please check the console logs for detailed API call information and ensure your API keys are properly configured.
