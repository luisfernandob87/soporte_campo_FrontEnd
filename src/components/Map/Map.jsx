import './Map.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { API_BASE_URL } from '../../config';
import kfcLogo from '../../assets/kfc_logo.svg';
import pizzaHutLogo from '../../assets/pizza_hut_logo.png';
import starbucksLogo from '../../assets/starbucks_logo.svg';
import wendysLogo from '../../assets/wendys_logo.svg';
import { format } from 'date-fns';

// Configurar el ícono personalizado
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Crear iconos personalizados para cada cadena
const createCustomIcon = (iconUrl) => {
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const icons = {
  'KFC': createCustomIcon(kfcLogo),
  'Pizza Hut': createCustomIcon(pizzaHutLogo),
  'Starbucks': createCustomIcon(starbucksLogo),
  "Wendy's": createCustomIcon(wendysLogo)
};

function Map() {
  const [tiendas, setTiendas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [capaVisible, setCapaVisible] = useState({
    'KFC': true,
    'Pizza Hut': true,
    'Starbucks': true,
    "Wendy's": true,
    'Usuarios': true
  });

  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/tiendas`);
        const data = await response.json();
        if (data.status === 'success') {
          setTiendas(data.data.tiendas);
        }
      } catch (error) {
        console.error('Error al obtener las tiendas:', error);
      }
    };

    fetchTiendas();

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/users`);
        const data = await response.json();
        if (data.status === 'success') {
          setUsuarios(data.data.users.filter(user => user.latitud !== '0' && user.longitud !== '0'));
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const toggleCapa = (cadena) => {
    setCapaVisible(prev => ({
      ...prev,
      [cadena]: !prev[cadena]
    }));
  };

  return (
    <div className="map-container">
      <div className="layer-controls">
        {Object.keys(icons).map(cadena => (
          <button
            key={cadena}
            className={`layer-button ${capaVisible[cadena] ? 'active' : ''}`}
            onClick={() => toggleCapa(cadena)}
          >
            <img src={icons[cadena].options.iconUrl} alt={cadena} />
            {cadena}
          </button>
        ))}
        <button
          className={`layer-button ${capaVisible['Usuarios'] ? 'active' : ''}`}
          onClick={() => toggleCapa('Usuarios')}
        >
          <img src={userIcon.options.iconUrl} alt="Usuarios" />
          Usuarios
        </button>
      </div>
      <div className="map-content">
        <MapContainer
          center={[14.6426491,-90.5156846]}
          zoom={12}
          zoomControl={false}
          className="leaflet-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>'
          />
          <ZoomControl position="bottomright" />
          {tiendas.map((tienda) => (
            capaVisible[tienda.cadena] && (
              <Marker
                key={tienda.id_tienda}
                position={[parseFloat(tienda.latitud), parseFloat(tienda.longitud)]}
                icon={icons[tienda.cadena] || L.Icon.Default.prototype.options}
              >
                <Popup>
                  <div>
                    <h3>{tienda.cadena}</h3>
                    <p>Tienda: {tienda.nombre}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
          {capaVisible['Usuarios'] && usuarios.map((usuario) => (
            <Marker
              key={usuario.id_usuario}
              position={[parseFloat(usuario.latitud), parseFloat(usuario.longitud)]}
              icon={userIcon}
            >
              <Popup>
                <div>
                  <h3>{usuario.nombre}</h3>
                  <p>Última actualización: {format(new Date(usuario.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;