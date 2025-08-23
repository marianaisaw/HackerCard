# 🚀 HackerCard Setup Guide

## 🔐 Environment Variables Setup

### 1. Create Environment File

Create a `.env` file in the root directory of your project:

```bash
touch .env
```

### 2. Add Your Supabase Credentials

Add the following variables to your `.env` file:

```bash
REACT_APP_SUPABASE_URL=https://kfaifzvagvxufoqxfjci.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYWlmenZhZ3Z4dWZvcXhmamNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MTM4NDksImV4cCI6MjA3MDk4OTg0OX0.bLWhL32KH3n4XC9Sdey3Sihm4pfkD558ua2NhHy19xk
```

### 3. Alternative: Use config.js

If you prefer not to use environment variables, you can create a `config.js` file:

1. Copy `config.example.js` to `config.js`
2. Fill in your actual values
3. Update the supabaseClient.js files to import from config.js

## ⚠️ Security Important Notes

- **NEVER commit your `.env` file to version control**
- The `.gitignore` file is already configured to exclude `.env` files
- If you accidentally commit sensitive information, immediately rotate your API keys
- Use environment variables in production deployments

## 🚀 Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Troubleshooting

### "Missing Supabase environment variables" Error

This error occurs when the environment variables are not properly set. Make sure:

1. Your `.env` file exists in the root directory
2. The variable names are exactly as shown above
3. You've restarted your development server after creating the `.env` file

### Environment Variables Not Loading

- Restart your development server after creating the `.env` file
- Ensure the `.env` file is in the root directory (same level as `package.json`)
- Check that there are no spaces around the `=` sign in your `.env` file

## 📱 Available Routes

- **`/`** - Landing page
- **`/admin`** - Admin dashboard
- **`/team/:teamId`** - Team dashboard (e.g., `/team/demo`)

## 🎯 Next Steps

1. Set up your Supabase database using the SQL scripts in the root directory
2. Configure authentication providers in your Supabase dashboard
3. Customize the application for your specific hackathon needs

---

**Need help?** Check the main README.md for more detailed information about features and customization.
