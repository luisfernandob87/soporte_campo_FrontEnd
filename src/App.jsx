import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import Store from './components/Store/Store';
import User from './components/User/User';
import Case from './components/Case/Case';
import Map from './components/Map/Map';
import './App.css';

function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Panel de Administración</h1>
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
    </Router>
  );
}

export default App;
