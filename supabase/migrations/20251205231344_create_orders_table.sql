/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `secure_id` (text, 4-char unique pickup code)
      - `menu_id` (uuid, foreign key to menus)
      - `buyer_id` (uuid, foreign key to users)
      - `buyer_name` (text, buyer name for vendor display)
      - `vendor_id` (uuid, vendor who owns the menu)
      - `status` (text, 'pendiente' or 'entregado')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to read own orders
    - Add policy for vendors to read orders for their menus
    - Add policy for buyers to create orders
    - Add policy for vendors to update order status
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secure_id text NOT NULL UNIQUE,
  menu_id uuid NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  buyer_name text NOT NULL,
  vendor_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'entregado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Vendors can read orders for their menus"
  ON orders FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Vendors can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_secure_id ON orders(secure_id);
CREATE INDEX idx_menus_vendor_id ON menus(vendor_id);
CREATE INDEX idx_menus_location ON menus(location);
