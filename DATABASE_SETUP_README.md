# Database Setup for HackerCard Hackathons Feature

This document explains how to set up the database tables for the new hackathons functionality in HackerCard.

## Overview

The hackathons feature requires several new database tables to properly manage hackathon creation, participation, and team management. This setup provides:

- **Hackathons table**: Stores hackathon information with auto-generated codes
- **Hackathon participants table**: Tracks user participation in hackathons
- **Enhanced teams table**: Links teams to specific hackathons
- **Comprehensive security policies**: Row-level security for data protection
- **Performance optimization**: Proper indexing for fast queries

## Prerequisites

- Supabase project set up and running
- Access to Supabase SQL Editor
- Existing `user_profiles` table (from previous setup)

## Setup Steps

### 1. Run the Hackathons Table Creation Script

Copy and paste the entire contents of `create_hackathons_table.sql` into your Supabase SQL Editor and execute it.

This script will:
- Create the `hackathons` table
- Create the `hackathon_participants` table
- Update the existing `teams` table
- Set up Row Level Security (RLS) policies
- Create necessary indexes and views
- Grant appropriate permissions

### 2. Verify Table Creation

After running the script, verify that the following tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('hackathons', 'hackathon_participants');

-- Check if the view was created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'hackathon_stats';
```

### 3. Test the Setup

Create a test hackathon to verify everything works:

```sql
-- Insert a test hackathon (replace with actual user ID)
INSERT INTO hackathons (name, code, budget, max_members_per_team, sponsors, created_by)
VALUES ('Test Hackathon', 'TEST12', 1000.00, 5, ARRAY['OpenAI API', 'AWS Credits'], 'your-user-id-here');

-- Check the hackathon_stats view
SELECT * FROM hackathon_stats;
```

## Table Structure

### Hackathons Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `name` | TEXT | Hackathon name | Required |
| `code` | TEXT | 6-character unique code | Required, unique, length=6 |
| `budget` | DECIMAL(10,2) | Default budget per team | Required, > 0 |
| `max_members_per_team` | INTEGER | Maximum team size | Required, > 0 |
| `sponsors` | TEXT[] | Array of API sponsors | Optional |
| `status` | TEXT | Hackathon status | 'active', 'inactive', 'completed', 'cancelled' |
| `created_by` | UUID | Admin who created it | References auth.users |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

### Hackathon Participants Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `hackathon_id` | UUID | Reference to hackathon | Required, references hackathons |
| `user_id` | UUID | Reference to user | Required, references auth.users |
| `joined_at` | TIMESTAMP | When user joined | Auto-generated |
| `role` | TEXT | User role in hackathon | 'participant', 'organizer', 'judge' |

### Enhanced Teams Table

The existing `teams` table now includes:
- `hackathon_id` column linking to the hackathons table
- Constraint ensuring either `hackathon_id` or `hackathon_code` is provided

## Security Features

### Row Level Security (RLS)

- **Admins**: Full access to all hackathons (create, read, update, delete)
- **Regular users**: Can only view active hackathons
- **Participants**: Can only see participants of hackathons they're in

### Data Validation

- Budget must be positive
- Max team size must be positive
- Hackathon codes must be exactly 6 characters
- Unique hackathon codes

## Performance Features

### Indexes

- `hackathons.code` - Fast lookups by hackathon code
- `hackathons.status` - Filtering by status
- `hackathons.created_at` - Sorting by creation date
- `hackathon_participants.hackathon_id` - Fast participant lookups
- `hackathon_participants.user_id` - Fast user participation lookups

### Views

- `hackathon_stats` - Pre-computed statistics for dashboard display

## Usage Examples

### Creating a Hackathon (Admin)

```javascript
const { data, error } = await supabase
  .from('hackathons')
  .insert({
    name: 'TechCrunch 2024',
    code: 'TC2024', // Auto-generated in the app
    budget: 1000.00,
    max_members_per_team: 4,
    sponsors: ['OpenAI API', 'AWS Credits'],
    status: 'active'
  });
```

### Fetching Hackathon Statistics

```javascript
const { data: stats, error } = await supabase
  .from('hackathon_stats')
  .select('*')
  .eq('status', 'active');
```

### Joining a Hackathon

```javascript
const { data, error } = await supabase
  .from('hackathon_participants')
  .insert({
    hackathon_id: 'hackathon-uuid',
    user_id: 'user-uuid',
    role: 'participant'
  });
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure RLS policies are properly set up
2. **Foreign Key Violation**: Check that referenced users/hackathons exist
3. **Code Length Error**: Ensure hackathon codes are exactly 6 characters

### Debugging Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('hackathons', 'hackathon_participants');

-- Check table permissions
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('hackathons', 'hackathon_participants');
```

## Next Steps

After setting up the database:

1. **Update AdminDashboard.js**: Already done - now uses database instead of local state
2. **Update TeamDashboard.js**: Modify team creation to use hackathon codes from database
3. **Add validation**: Ensure hackathon codes exist before team creation
4. **Add real-time updates**: Use Supabase subscriptions for live data updates

## Support

If you encounter issues during setup:

1. Check the Supabase logs for detailed error messages
2. Verify all SQL commands executed successfully
3. Ensure your user has the necessary permissions
4. Check that the existing tables (`user_profiles`, `teams`, `team_members`) are properly set up
