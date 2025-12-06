import { CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onClose: () => void;
}

export default function OrderConfirmation({ order, onClose }: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-30 rounded-full p-4">
              <CheckCircle size={64} strokeWidth={2} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pedido Confirmado</h2>
          <p className="text-sm opacity-90">Tu pedido ha sido creado exitosamente</p>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4 font-semibold">
            Tu código de recogida es:
          </p>

          <div className="bg-orange-50 border-4 border-orange-300 rounded-2xl p-8 mb-6">
            <div className="text-7xl font-black text-orange-600 tracking-widest mb-2">
              {order.secure_id}
            </div>
            <p className="text-sm text-gray-600">Código de recogida</p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 font-semibold">
              Muestra este código al vendedor para recoger tu pedido
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
