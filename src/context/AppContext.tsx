import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Menu, Order, UserRole } from '../types';
import { generateSecureId } from '../utils/idGenerator';
import { supabase } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  selectedLocation: string | null;
  menus: Menu[];
  orders: Order[];
  loading: boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  setSelectedLocation: (location: string) => void;
  createMenu: (menu: Omit<Menu, 'id' | 'created_at' | 'updated_at' | 'active'>) => Promise<void>;
  createOrder: (menuId: string) => Promise<Order | null>;
  validateOrder: (secureId: string) => Order | null;
  markOrderAsDelivered: (orderId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: 'e4d2e7b1-1234-4a5b-b6c7-d8e9f0a1b2c3', name: 'Sra. María del Puesto', role: 'vendor' },
  { id: 'b8c9d0e1-5678-4f9a-a0b1-c2d3e4f56677', name: 'Carlos Estudiante', role: 'buyer' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Subscribe to MENUS
    const menusChannel = supabase
      .channel('public:menus') // Give the channel a unique name
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'menus' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMenus((prev) => [...prev, payload.new as Menu]);
          } else if (payload.eventType === 'UPDATE') {
            setMenus((prev) =>
              prev.map((m) => (m.id === payload.new.id ? (payload.new as Menu) : m))
            );
          } else if (payload.eventType === 'DELETE') {
            setMenus((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // 2. Subscribe to ORDERS
    // We define the filter logic inside the callback based on the user role
    const ordersChannel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Logic for VENDORS
          if (currentUser.role === 'vendor') {
             // Vendors usually see all orders specifically for them, 
             // but if you want to filter purely by ID here you can check payload.new.vendor_id
            if (payload.eventType === 'INSERT') {
              setOrders((prev) => [...prev, payload.new as Order]);
            } else if (payload.eventType === 'UPDATE') {
              setOrders((prev) =>
                prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o))
              );
            }
          } 
          // Logic for BUYERS
          else {
            // Ensure payload.new exists before checking buyer_id (it doesn't exist on DELETE)
            if (payload.eventType === 'INSERT' && payload.new.buyer_id === currentUser.id) {
              setOrders((prev) => [...prev, payload.new as Order]);
            } else if (payload.eventType === 'UPDATE' && payload.new.buyer_id === currentUser.id) {
              setOrders((prev) =>
                prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o))
              );
            }
          }
        }
      )
      .subscribe();

    fetchMenus();
    fetchOrders();

    // 3. Cleanup function using removeChannel
    return () => {
      supabase.removeChannel(menusChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [currentUser]);

  const fetchMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchOrders = async () => {
    if (!currentUser) return;

    try {
      let query = supabase.from('orders').select('*');

      if (currentUser.role === 'buyer') {
        query = query.eq('buyer_id', currentUser.id);
      } else {
        query = query.eq('vendor_id', currentUser.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginAsRole = (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedLocation(null);
    setMenus([]);
    setOrders([]);
  };

  const createMenu = async (
    menuData: Omit<Menu, 'id' | 'created_at' | 'updated_at' | 'active'>
  ) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase.from('menus').insert([
        {
          vendor_id: currentUser.id,
          title: menuData.title,
          price: menuData.price,
          initial_stock: menuData.initial_stock,
          current_stock: menuData.initial_stock,
          location: menuData.location,
          active: true,
        },
      ])
      .select()
      .single();

      if (error) throw error;

      if (data) {
        setMenus((prev) => [...prev, data as Menu]);
      }
      
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  };

  const createOrder = async (menuId: string): Promise<Order | null> => {
    if (!currentUser) return null;

    try {
      const menu = menus.find((m) => m.id === menuId);
      if (!menu || menu.current_stock <= 0) {
        return null;
      }

      const secureId = generateSecureId();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            secure_id: secureId,
            menu_id: menuId,
            buyer_id: currentUser.id,
            buyer_name: currentUser.name,
            vendor_id: menu.vendor_id,
            status: 'pendiente',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: updateError } = await supabase
        .from('menus')
        .update({ current_stock: menu.current_stock - 1 })
        .eq('id', menuId);

      if (updateError) throw updateError;

      return orderData as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const validateOrder = (secureId: string): Order | null => {
    const order = orders.find(
      (o) =>
        o.secure_id.toUpperCase() === secureId.toUpperCase() &&
        o.status === 'pendiente'
    );
    return order || null;
  };

  const markOrderAsDelivered = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'entregado' })
        .eq('id', orderId)
        .select()
        .single();  // <— Muy importante

      if (error) throw error;

      if (data) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? data : o))
        );
      }

    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        selectedLocation,
        menus,
        orders,
        loading,
        loginAsRole,
        logout,
        setSelectedLocation,
        createMenu,
        createOrder,
        validateOrder,
        markOrderAsDelivered,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
