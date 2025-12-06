import { AppProvider, useApp } from './context/AppContext';
import Home from './screens/Home';
import VendorDashboard from './screens/VendorDashboard';
import BuyerFeed from './screens/BuyerFeed';

function AppContent() {
  const { currentUser, loading } = useApp();

  if (!currentUser) {
    return <Home />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-300 border-t-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'vendor') {
    return <VendorDashboard />;
  }

  return <BuyerFeed />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
