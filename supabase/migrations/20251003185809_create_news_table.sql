/*
  # Create News/Updates Table

  1. New Tables
    - `news`
      - `id` (uuid, primary key) - Unique identifier for each news post
      - `title` (text) - Title of the news post
      - `content` (text) - Main content/description
      - `image_url` (text, optional) - URL to image
      - `video_url` (text, optional) - URL to video
      - `published` (boolean) - Whether the post is published
      - `created_at` (timestamptz) - When the post was created
      - `updated_at` (timestamptz) - When the post was last updated
      - `display_order` (integer) - Order for displaying posts

  2. Security
    - Enable RLS on `news` table
    - Add policy for public read access to published posts
    - Add policy for authenticated admin access to all posts
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  video_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  display_order integer DEFAULT 0
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public can read published news
CREATE POLICY "Anyone can view published news"
  ON news
  FOR SELECT
  USING (published = true);

-- Authenticated users can view all news (for admin)
CREATE POLICY "Authenticated users can view all news"
  ON news
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert news
CREATE POLICY "Authenticated users can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update news
CREATE POLICY "Authenticated users can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete news
CREATE POLICY "Authenticated users can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_news_display_order ON news(display_order DESC, created_at DESC);