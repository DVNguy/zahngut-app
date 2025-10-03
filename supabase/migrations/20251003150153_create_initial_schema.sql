/*
  # Zahngut Bad Wünnenberg - Initial Database Schema

  ## Overview
  Creates the complete database structure for a German dental practice PWA with patient app and admin panel.

  ## New Tables
  
  1. `praxis_info` - Practice basic information
     - name (text) - Practice name
     - slogan (text) - Practice slogan/tagline
     - telefon (text) - Phone number
     - notdienst (text) - Emergency phone number
     - email (text) - Contact email
     - doctolib (text) - Doctolib booking URL
     - address (jsonb) - Address object with street, zip, city
     - updated_at (timestamptz) - Last update timestamp

  2. `opening_hours` - Weekly opening hours
     - day_of_week (text) - Day name in German
     - opens_at (time) - Opening time
     - closes_at (time) - Closing time
     - is_closed (boolean) - Whether practice is closed this day
     - display_order (integer) - Order for display (1=Monday to 7=Sunday)

  3. `treatments` - Dental treatments offered
     - id (uuid) - Primary key
     - category (text) - Treatment category
     - name (text) - Treatment name
     - icon (text) - Emoji or icon identifier
     - icon_type (text) - 'emoji' or 'custom'
     - custom_icon_url (text) - URL for custom icon
     - untertitel (text) - Subtitle
     - was (text) - "What is it?" description
     - ablauf (jsonb) - Array of procedure steps
     - vorteile (jsonb) - Array of benefits
     - dauer (text) - Duration
     - empfohlen (text) - Recommendation
     - active (boolean) - Whether visible to patients
     - created_at, updated_at (timestamptz)

  4. `videos` - Educational videos
     - id (uuid) - Primary key
     - title (text) - Video title
     - category (text) - Video category
     - duration (text) - Video duration
     - views (integer) - View count
     - url (text) - YouTube URL
     - thumbnail (text) - Thumbnail URL
     - active (boolean) - Whether visible
     - created_at, updated_at (timestamptz)

  5. `aftercare` - Post-treatment care instructions
     - id (uuid) - Primary key
     - behandlung (text) - Treatment type
     - kurzbeschreibung (text) - Short description
     - zeitraum (text) - Time period
     - icon (text) - Emoji or icon
     - icon_type (text) - 'emoji' or 'custom'
     - custom_icon_url (text) - URL for custom icon
     - phasen (jsonb) - Three phases with title, time, items array
     - warnung (jsonb) - Array of warning symptoms
     - active (boolean) - Whether visible
     - created_at, updated_at (timestamptz)

  6. `design_settings` - UI customization settings
     - colors (jsonb) - Color palette object
     - logo_type (text) - 'icon' or 'custom'
     - logo_icon (text) - Emoji for icon-based logo
     - custom_logo_url (text) - URL for custom logo
     - custom_icon_url (text) - URL for PWA icons
     - updated_at (timestamptz)

  7. `emergency_info` - Emergency contact information
     - nummer (text) - Emergency phone number
     - zeiten (text) - Emergency hours description
     - anweisungen (jsonb) - Array of first aid instructions
     - zahn_aus (text) - Instructions for knocked-out tooth
     - zahn_locker (text) - Instructions for loose tooth
     - updated_at (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access (patients need to view data)
  - Allow write access only to authenticated users (admins)

  ## Notes
  - All tables include automatic timestamp management
  - JSONB used for flexible array/object storage
  - Single-row tables (praxis_info, design_settings, emergency_info) managed as singletons
*/

-- Create praxis_info table
CREATE TABLE IF NOT EXISTS praxis_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Zahngut Bad Wünnenberg',
  slogan text NOT NULL DEFAULT 'Moderne Zahnmedizin. Der Mensch im Mittelpunkt.',
  telefon text NOT NULL DEFAULT '',
  notdienst text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  doctolib text NOT NULL DEFAULT '',
  address jsonb DEFAULT '{"street": "", "zip": "", "city": ""}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create opening_hours table
CREATE TABLE IF NOT EXISTS opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  opens_at time,
  closes_at time,
  is_closed boolean DEFAULT false,
  display_order integer NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  icon text DEFAULT '🦷',
  icon_type text DEFAULT 'emoji',
  custom_icon_url text,
  untertitel text DEFAULT '',
  was text DEFAULT '',
  ablauf jsonb DEFAULT '[]'::jsonb,
  vorteile jsonb DEFAULT '[]'::jsonb,
  dauer text DEFAULT '',
  empfohlen text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  duration text DEFAULT '',
  views integer DEFAULT 0,
  url text NOT NULL,
  thumbnail text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create aftercare table
CREATE TABLE IF NOT EXISTS aftercare (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  behandlung text NOT NULL,
  kurzbeschreibung text DEFAULT '',
  zeitraum text DEFAULT '',
  icon text DEFAULT '📋',
  icon_type text DEFAULT 'emoji',
  custom_icon_url text,
  phasen jsonb DEFAULT '{"phase1": {"title": "", "time": "", "items": []}, "phase2": {"title": "", "time": "", "items": []}, "phase3": {"title": "", "time": "", "items": []}}'::jsonb,
  warnung jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create design_settings table
CREATE TABLE IF NOT EXISTS design_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colors jsonb DEFAULT '{"primary": "#0891b2", "primaryDark": "#0e7490", "accent": "#06b6d4", "secondary": "#3bc4e5", "success": "#10B981", "warning": "#F59E0B", "error": "#EF4444"}'::jsonb,
  logo_type text DEFAULT 'icon',
  logo_icon text DEFAULT '🦷',
  custom_logo_url text,
  custom_icon_url text,
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_info table
CREATE TABLE IF NOT EXISTS emergency_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nummer text NOT NULL DEFAULT '',
  zeiten text NOT NULL DEFAULT '',
  anweisungen jsonb DEFAULT '[]'::jsonb,
  zahn_aus text DEFAULT '',
  zahn_locker text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_treatments_category ON treatments(category);
CREATE INDEX IF NOT EXISTS idx_treatments_active ON treatments(active);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(active);
CREATE INDEX IF NOT EXISTS idx_aftercare_active ON aftercare(active);
CREATE INDEX IF NOT EXISTS idx_opening_hours_order ON opening_hours(display_order);

-- Enable Row Level Security
ALTER TABLE praxis_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aftercare ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read praxis info"
  ON praxis_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read opening hours"
  ON opening_hours FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read active treatments"
  ON treatments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read active videos"
  ON videos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read active aftercare"
  ON aftercare FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read design settings"
  ON design_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read emergency info"
  ON emergency_info FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated write access (admins)
CREATE POLICY "Authenticated users can update praxis info"
  ON praxis_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert praxis info"
  ON praxis_info FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage opening hours"
  ON opening_hours FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage treatments"
  ON treatments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage videos"
  ON videos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage aftercare"
  ON aftercare FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update design settings"
  ON design_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert design settings"
  ON design_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update emergency info"
  ON emergency_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert emergency info"
  ON emergency_info FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_praxis_info_updated_at
  BEFORE UPDATE ON praxis_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_hours_updated_at
  BEFORE UPDATE ON opening_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at
  BEFORE UPDATE ON treatments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aftercare_updated_at
  BEFORE UPDATE ON aftercare
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_settings_updated_at
  BEFORE UPDATE ON design_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_info_updated_at
  BEFORE UPDATE ON emergency_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();