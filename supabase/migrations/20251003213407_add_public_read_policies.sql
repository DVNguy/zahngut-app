/*
  # Add public read access policies

  1. Security Changes
    - Add policies to allow anonymous users to read from all public tables
    - These are read-only policies for the public-facing app
    - Write access remains restricted (admin panel only)
  
  2. Tables with new policies
    - `praxis_info` - Practice information
    - `opening_hours` - Opening hours
    - `treatments` - Treatment information
    - `videos` - Educational videos
    - `aftercare` - Aftercare instructions
    - `design_settings` - Design configuration
    - `emergency_info` - Emergency contact information
    - `news` - News posts
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to praxis_info" ON praxis_info;
DROP POLICY IF EXISTS "Allow public read access to opening_hours" ON opening_hours;
DROP POLICY IF EXISTS "Allow public read access to active treatments" ON treatments;
DROP POLICY IF EXISTS "Allow public read access to active videos" ON videos;
DROP POLICY IF EXISTS "Allow public read access to active aftercare" ON aftercare;
DROP POLICY IF EXISTS "Allow public read access to design_settings" ON design_settings;
DROP POLICY IF EXISTS "Allow public read access to emergency_info" ON emergency_info;
DROP POLICY IF EXISTS "Allow public read access to published news" ON news;

-- Praxis Info: Allow public read access
CREATE POLICY "Allow public read access to praxis_info"
  ON praxis_info
  FOR SELECT
  TO anon
  USING (true);

-- Opening Hours: Allow public read access
CREATE POLICY "Allow public read access to opening_hours"
  ON opening_hours
  FOR SELECT
  TO anon
  USING (true);

-- Treatments: Allow public read access to active treatments
CREATE POLICY "Allow public read access to active treatments"
  ON treatments
  FOR SELECT
  TO anon
  USING (active = true);

-- Videos: Allow public read access to active videos
CREATE POLICY "Allow public read access to active videos"
  ON videos
  FOR SELECT
  TO anon
  USING (active = true);

-- Aftercare: Allow public read access to active aftercare
CREATE POLICY "Allow public read access to active aftercare"
  ON aftercare
  FOR SELECT
  TO anon
  USING (active = true);

-- Design Settings: Allow public read access
CREATE POLICY "Allow public read access to design_settings"
  ON design_settings
  FOR SELECT
  TO anon
  USING (true);

-- Emergency Info: Allow public read access
CREATE POLICY "Allow public read access to emergency_info"
  ON emergency_info
  FOR SELECT
  TO anon
  USING (true);

-- News: Allow public read access to published news
CREATE POLICY "Allow public read access to published news"
  ON news
  FOR SELECT
  TO anon
  USING (published = true);