import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-buttons">
        <Link to="/store" className="nav-button">
          Agregar Tienda
        </Link>
        <Link to="/user" className="nav-button">
          Agregar Usuario
        </Link>
        <Link to="/case" className="nav-button">
          Agregar Caso
        </Link>
        <Link to="/map" className="nav-button">
          Ver Mapa
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;