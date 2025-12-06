import { useState } from 'react';
import { LogOut, Plus, CheckCircle, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MenuForm from '../components/MenuForm';
import OrderValidator from '../components/OrderValidator';

export default function VendorDashboard() {
  const { currentUser, menus, orders, logout } = useApp();
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showValidator, setShowValidator] = useState(false);

  const vendorMenus = menus.filter((m) => m.vendor_id === currentUser?.id);
  const vendorOrders = orders.filter((o) => o.vendor_id === currentUser?.id);
  const pendingOrders = vendorOrders.filter((o) => o.status === 'pendiente');

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-500 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Vendedor</h1>
            <p className="text-sm opacity-90">{currentUser?.name}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {pendingOrders.length > 0 && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <Package size={24} />
              <span className="font-bold">
                {pendingOrders.length} pedido{pendingOrders.length !== 1 && 's'} pendiente{pendingOrders.length !== 1 && 's'}
              </span>
            </div>
            <button
              onClick={() => setShowValidator(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Validar Pedido
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Menús</h2>
            <button
              onClick={() => setShowMenuForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>

          {vendorMenus.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-4">No tienes menús publicados</p>
              <button
                onClick={() => setShowMenuForm(true)}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Publicar tu primer menú
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="border-2 border-orange-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{menu.title}</h3>
                    <span className="text-2xl font-bold text-orange-600">
                      S/. {menu.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{menu.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-gray-500" />
                      <span className="text-sm font-semibold">
                        Stock: {menu.current_stock}/{menu.initial_stock}
                      </span>
                    </div>
                    {menu.current_stock === 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Pedidos</h2>
          {vendorOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No hay pedidos todavía</p>
          ) : (
            <div className="space-y-3">
              {vendorOrders
                .slice()
                .reverse()
                .slice(0, 10)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{order.secure_id}</p>
                      <p className="text-sm text-gray-600">{order.buyer_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === 'entregado' ? (
                        <>
                          <CheckCircle size={20} className="text-green-500" />
                          <span className="text-sm font-semibold text-green-600">
                            Entregado
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-yellow-600">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      {showMenuForm && <MenuForm onClose={() => setShowMenuForm(false)} />}
      {showValidator && <OrderValidator onClose={() => setShowValidator(false)} />}
    </div>
  );
}
