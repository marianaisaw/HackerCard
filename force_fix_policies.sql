-- Force remove all existing policies from teams and team_members tables
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies from teams table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'teams') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON teams';
    END LOOP;
    
    -- Drop all policies from team_members table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'team_members') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON team_members';
    END LOOP;
END $$;

-- Disable RLS temporarily to clear all policies
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create new policies with different names
CREATE POLICY "teams_full_access" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "team_members_full_access" ON team_members FOR ALL USING (true) WITH CHECK (true);

-- Verify the new policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('teams', 'team_members');
