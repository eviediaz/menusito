import { UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { loginAsRole } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-orange-600 mb-3">Menusitos</h1>
        <p className="text-lg text-gray-700">Menús universitarios al instante</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => loginAsRole('vendor')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-8 shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="flex flex-col items-center gap-4">
            <UtensilsCrossed size={64} strokeWidth={1.5} />
            <div>
              <div className="text-2xl font-bold mb-1">Soy Vendedor</div>
              <div className="text-sm opacity-90">Sra. del Puesto</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => loginAsRole('buyer')}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl p-8 shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="flex flex-col items-center gap-4">
            <ShoppingBag size={64} strokeWidth={1.5} />
            <div>
              <div className="text-2xl font-bold mb-1">Soy Comensal</div>
              <div className="text-sm opacity-90">Alumno/Estudiante</div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Modo de demostración</p>
      </div>
    </div>
  );
}
