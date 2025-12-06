import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../constants/locations';

interface MenuFormProps {
  onClose: () => void;
}

export default function MenuForm({ onClose }: MenuFormProps) {
  const { currentUser, createMenu } = useApp();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser || !title || !price || !stock || !location) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await createMenu({
        vendor_id: currentUser.id,
        title,
        price: parseFloat(price),
        initial_stock: parseInt(stock, 10),
        location,
        current_stock: parseInt(stock, 10),
      });
      onClose();
    } catch (err) {
      setError('Error al crear el menú');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Publicar Nuevo Menú</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-center gap-2 text-red-600">
              <AlertCircle size={20} />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del Menú
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Menú del Día: Pollo con Arroz"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio (S/.)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15.00"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Inicial
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="20"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ubicación
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              disabled={loading}
              required
            >
              <option value="">-- Selecciona una ubicación --</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
