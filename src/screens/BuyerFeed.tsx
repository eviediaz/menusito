import { useState } from 'react';
import { LogOut, MapPin, Package, ShoppingBag, Search, MapPinOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { LOCATIONS } from '../constants/locations';
import OrderConfirmation from '../components/OrderConfirmation';
import LocationSelector from './LocationSelector';

export default function BuyerFeed() {
  const { currentUser, selectedLocation, setSelectedLocation, menus, orders, createOrder, logout } = useApp();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!selectedLocation) {
    return <LocationSelector />;
  }

  const myOrders = orders.filter((o) => o.buyer_id === currentUser?.id);
  const activePendingOrder = myOrders.find((o) => o.status === 'pendiente');

  const filteredMenus = menus.filter((menu) => {
    const matchesLocation = menu.location === selectedLocation;
    const matchesSearch = menu.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  const handleOrder = async (menuId: string) => {
    const order = await createOrder(menuId);
    if (order) {
      setCurrentOrder(order);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-20">
      <header className="bg-orange-500 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold">Menusitos</h1>
            <p className="text-sm opacity-90">{currentUser?.name}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{selectedLocation}</span>
          </div>
          <button
            onClick={() => setSelectedLocation(null)}
            className="flex items-center gap-1 hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors"
          >
            <MapPinOff size={16} />
            <span>Cambiar</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {activePendingOrder && (
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Package size={28} />
              <h2 className="text-xl font-bold">Pedido Activo</h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-3">
              <p className="text-sm mb-2 opacity-90">Tu código de recogida:</p>
              <p className="text-5xl font-black tracking-widest text-center">
                {activePendingOrder.secure_id}
              </p>
            </div>
            <p className="text-sm text-center opacity-90">
              Muestra este código al recoger tu pedido
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag size={28} />
              Menús Disponibles
            </h2>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar menú..."
              className="w-full pl-12 pr-4 py-3 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          {filteredMenus.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">
                {menus.length === 0
                  ? 'No hay menús disponibles en este momento'
                  : 'No se encontraron menús que coincidan con tu búsqueda'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4">
                        {menu.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-3xl font-black text-orange-600">
                          S/. {menu.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-gray-500" />
                        <span className="text-sm font-semibold">
                          {menu.current_stock > 0
                            ? `${menu.current_stock} disponible${menu.current_stock !== 1 ? 's' : ''}`
                            : 'Agotado'}
                        </span>
                      </div>

                      {menu.current_stock > 0 ? (
                        <button
                          onClick={() => handleOrder(menu.id)}
                          disabled={!!activePendingOrder}
                          className={`px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                            activePendingOrder
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                          }`}
                        >
                          {activePendingOrder ? 'Pedido Activo' : 'Pedir'}
                        </button>
                      ) : (
                        <div className="px-8 py-3 bg-red-100 text-red-600 rounded-xl font-bold">
                          Agotado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {myOrders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h2>
            <div className="space-y-3">
              {myOrders
                .slice()
                .reverse()
                .slice(0, 5)
                .map((order) => {
                  const menu = menus.find((m) => m.id === order.menu_id);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{order.secure_id}</p>
                        <p className="text-sm text-gray-600">{menu?.title}</p>
                      </div>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          order.status === 'entregado'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {order.status === 'entregado' ? 'Entregado' : 'Pendiente'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {currentOrder && (
        <OrderConfirmation
          order={currentOrder}
          onClose={() => setCurrentOrder(null)}
        />
      )}
    </div>
  );
}
