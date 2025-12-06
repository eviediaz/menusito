import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface OrderValidatorProps {
  onClose: () => void;
}

export default function OrderValidator({ onClose }: OrderValidatorProps) {
  const { validateOrder, markOrderAsDelivered } = useApp();
  const [code, setCode] = useState('');
  const [validatedOrder, setValidatedOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setValidatedOrder(null);
    setDelivered(false);

    if (!code.trim()) return;

    const order = validateOrder(code.trim());

    if (order) {
      setValidatedOrder(order);
    } else {
      setError(true);
    }
  };

  const handleDeliver = async () => {
    if (validatedOrder) {
      await markOrderAsDelivered(validatedOrder.id);
      setDelivered(true);
    }
  };

  const handleReset = () => {
    setCode('');
    setValidatedOrder(null);
    setError(false);
    setDelivered(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Validar Pedido</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!validatedOrder && !error && !delivered && (
            <form onSubmit={handleValidate} className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Ingresa el código de recogida del cliente
              </p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: K9M2"
                maxLength={4}
                className="w-full px-6 py-6 text-3xl font-bold text-center border-4 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none uppercase tracking-widest"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
              >
                Validar Código
              </button>
            </form>
          )}

          {error && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-red-100 rounded-full p-6">
                  <AlertCircle size={64} className="text-red-500" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">
                  Código Inválido
                </h3>
                <p className="text-gray-600">
                  No se encontró un pedido pendiente con este código
                </p>
              </div>
              <button
                onClick={handleReset}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Intentar de Nuevo
              </button>
            </div>
          )}

          {validatedOrder && !delivered && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
              </div>
              <div className="bg-green-50 border-4 border-green-400 rounded-2xl p-6">
                <h3 className="text-3xl font-bold text-green-600 mb-4">
                  ENTREGAR A
                </h3>
                <p className="text-4xl font-black text-gray-800">
                  {validatedOrder.buyer_name}
                </p>
              </div>
              <button
                onClick={handleDeliver}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-xl transition-colors text-xl"
              >
                Marcar como Entregado
              </button>
            </div>
          )}

          {delivered && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-6 animate-pulse">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">
                  Pedido Entregado
                </h3>
                <p className="text-gray-600">
                  El pedido ha sido marcado como entregado exitosamente
                </p>
              </div>
              <button
                onClick={handleReset}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Validar Otro Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
