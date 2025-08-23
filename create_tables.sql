-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hackathon_code TEXT NOT NULL,
  budget DECIMAL(10,2) DEFAULT 500.00,
  spent DECIMAL(10,2) DEFAULT 0.00,
  final_rank TEXT DEFAULT 'In Progress',
  achievements TEXT[] DEFAULT ARRAY['New Team Created'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'member',
  UNIQUE(team_id, user_id)
);

-- Enable Row Level Security (RLS) for teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security (RLS) for team_members table
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create simple policies for teams table (allow all operations for now)
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true) WITH CHECK (true);

-- Create simple policies for team_members table (allow all operations for now)
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_hackathon_code ON teams(hackathon_code);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_user ON team_members(team_id, user_id);
