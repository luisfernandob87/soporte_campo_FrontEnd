import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import Store from './components/Store/Store';
import User from './components/User/User';
import Case from './components/Case/Case';
import Map from './components/Map/Map';
import './App.css';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getFormName = (path) => {
    switch (path) {
      case '/store':
        return 'Agregar Tienda';
      case '/user':
        return 'Agregar Usuario';
      case '/case':
        return 'Agregar Caso';
      case '/map':
        return 'Ver Mapa';
      default:
        return 'Panel de Administración';
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{getFormName(location.pathname)}</h1>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      <main className="app-content">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/store" replace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/user" element={<User />} />
          <Route path="/case" element={<Case />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
