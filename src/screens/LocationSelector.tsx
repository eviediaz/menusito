import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../constants/locations';

export default function LocationSelector() {
  const { setSelectedLocation, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-500 text-white rounded-full p-4">
            <MapPin size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Selecciona tu Ubicación</h1>
        <p className="text-lg text-gray-600">
          {currentUser?.role === 'buyer'
            ? 'Dónde quieres comprar menús hoy?'
            : 'Dónde venderás menús?'}
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        {LOCATIONS.map((location) => (
          <button
            key={location}
            onClick={() => setSelectedLocation(location)}
            className="w-full bg-white border-2 border-orange-300 hover:border-orange-500 hover:bg-orange-50 text-gray-800 rounded-xl p-4 text-left font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-orange-500" />
              <span>{location}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
