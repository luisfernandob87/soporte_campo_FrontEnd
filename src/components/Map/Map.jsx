import './Map.css';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map() {
  return (
    <div className="map-container">
      <h2>Ver Mapa</h2>
      <div className="map-content">
        <MapContainer
          center={[-33.4489, -70.6693]}
          zoom={13}
          zoomControl={false}
          className="leaflet-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;