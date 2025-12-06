/*
  # Create menus table

  1. New Tables
    - `menus`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key to users)
      - `title` (text, menu title/name)
      - `price` (numeric, price in local currency)
      - `initial_stock` (integer, starting stock amount)
      - `current_stock` (integer, available stock)
      - `location` (text, physical location of the menu)
      - `active` (boolean, if menu is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `menus` table
    - Add policy for authenticated users to read all menus
    - Add policy for vendors to create menus
    - Add policy for vendors to update/delete own menus
*/

CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  title text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  initial_stock integer NOT NULL CHECK (initial_stock > 0),
  current_stock integer NOT NULL CHECK (current_stock >= 0),
  location text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active menus"
  ON menus FOR SELECT
  USING (active = true);

CREATE POLICY "Vendors can create menus"
  ON menus FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own menus"
  ON menus FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete own menus"
  ON menus FOR DELETE
  TO authenticated
  USING (vendor_id = auth.uid());
