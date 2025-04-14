import { useState, useEffect } from 'react';
import './Case.css';
import { API_BASE_URL } from '../../config';
import LoadingButton from '../common/LoadingButton';

function Case() {
  const [ticket, setTicket] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cargar usuarios
    fetch(`${API_BASE_URL}/v1/users`)
      .then(response => response.json())
      .then(data => setUsers(data.data.users))
      .catch(error => console.error('Error cargando usuarios:', error));

    // Cargar tiendas
    fetch(`${API_BASE_URL}/v1/tiendas`)
      .then(response => response.json())
      .then(data => setStores(data.data.tiendas))
      .catch(error => console.error('Error cargando tiendas:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/casos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket,
          idUsuario: parseInt(selectedUser),
          idTienda: parseInt(selectedStore)
        })
      });

      if (response.ok) {
        setMessage('Caso agregado exitosamente');
        setTicket('');
        setSelectedUser('');
        setSelectedStore('');
      } else {
        setMessage('Error al agregar el caso');
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="case-container">
      <div className="case-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ticket">Número de Ticket:</label>
            <input
              type="text"
              id="ticket"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user">Usuario:</label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="store">Tienda:</label>
            <select
              id="store"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              required
            >
              <option value="">Seleccione una tienda</option>
              {stores.map(store => (
                <option key={store.id_tienda} value={store.id_tienda}>
                  {store.cadena} - {store.nombre}
                </option>
              ))}
            </select>
          </div>

          <LoadingButton type="submit" isLoading={isSubmitting}>
            Agregar Caso
          </LoadingButton>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Case;