export type UserRole = 'vendor' | 'buyer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Menu {
  id: string;
  vendor_id: string;
  title: string;
  price: number;
  initial_stock: number;
  current_stock: number;
  location: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pendiente' | 'entregado';

export interface Order {
  id: string;
  secure_id: string;
  menu_id: string;
  buyer_id: string;
  buyer_name: string;
  vendor_id: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
