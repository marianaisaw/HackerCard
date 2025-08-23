-- Create hackathons table to store hackathon information
CREATE TABLE IF NOT EXISTS hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  budget DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  max_members_per_team INTEGER NOT NULL DEFAULT 4,
  sponsors TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')) DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT hackathon_budget_positive CHECK (budget > 0),
  CONSTRAINT hackathon_max_members_positive CHECK (max_members_per_team > 0),
  CONSTRAINT hackathon_code_length CHECK (char_length(code) = 6)
);

-- Create hackathon_participants table to track which users are participating in which hackathons
CREATE TABLE IF NOT EXISTS hackathon_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT CHECK (role IN ('participant', 'organizer', 'judge')) DEFAULT 'participant',
  
  -- Ensure unique participation per user per hackathon
  UNIQUE(hackathon_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for hackathons table
-- Admins can view all hackathons
CREATE POLICY "Admins can view all hackathons" ON hackathons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can create hackathons
CREATE POLICY "Admins can create hackathons" ON hackathons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can update hackathons
CREATE POLICY "Admins can update hackathons" ON hackathons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can delete hackathons
CREATE POLICY "Admins can delete hackathons" ON hackathons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Regular users can view active hackathons
CREATE POLICY "Users can view active hackathons" ON hackathons
  FOR SELECT USING (status = 'active');

-- Create policies for hackathon_participants table
-- Users can view participants of hackathons they're in
CREATE POLICY "Users can view participants of their hackathons" ON hackathon_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hackathon_participants hp
      WHERE hp.hackathon_id = hackathon_participants.hackathon_id 
      AND hp.user_id = auth.uid()
    )
  );

-- Users can join hackathons
CREATE POLICY "Users can join hackathons" ON hackathon_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own participation
CREATE POLICY "Users can update own participation" ON hackathon_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can leave hackathons
CREATE POLICY "Users can leave hackathons" ON hackathon_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathons_code ON hackathons(code);
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_by ON hackathons(created_by);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_at ON hackathons(created_at);
CREATE INDEX IF NOT EXISTS idx_hackathon_participants_hackathon_id ON hackathon_participants(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_participants_user_id ON hackathon_participants(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hackathons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hackathons_updated_at 
  BEFORE UPDATE ON hackathons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_hackathons_updated_at();

-- Update teams table to reference hackathons instead of just hackathon_code
ALTER TABLE teams ADD COLUMN IF NOT EXISTS hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_teams_hackathon_id ON teams(hackathon_id);

-- Add a constraint to ensure either hackathon_code or hackathon_id is provided
-- Note: We'll add this constraint manually after checking if it exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'teams_hackathon_reference' 
    AND table_name = 'teams'
  ) THEN
    ALTER TABLE teams ADD CONSTRAINT teams_hackathon_reference 
      CHECK (
        (hackathon_id IS NOT NULL) OR 
        (hackathon_code IS NOT NULL AND char_length(hackathon_code) > 0)
      );
  END IF;
END $$;

-- Create a view to show hackathon statistics
CREATE OR REPLACE VIEW hackathon_stats AS
SELECT 
  h.id,
  h.name,
  h.code,
  h.budget,
  h.max_members_per_team,
  h.status,
  h.created_at,
  COUNT(DISTINCT t.id) as current_teams_count,
  COUNT(DISTINCT tm.user_id) as current_members_count,
  COALESCE(SUM(t.budget), 0) as total_teams_budget,
  COALESCE(SUM(t.spent), 0) as total_teams_spent
FROM hackathons h
LEFT JOIN teams t ON h.id = t.hackathon_id
LEFT JOIN team_members tm ON t.id = tm.team_id
GROUP BY h.id, h.name, h.code, h.budget, h.max_members_per_team, h.status, h.created_at;

-- Grant necessary permissions
GRANT SELECT ON hackathon_stats TO authenticated;
GRANT ALL ON hackathons TO authenticated;
GRANT ALL ON hackathon_participants TO authenticated;
