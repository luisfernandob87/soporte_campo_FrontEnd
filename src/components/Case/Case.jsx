import { useState, useEffect } from 'react';
import './Case.css';

function Case() {
  const [ticket, setTicket] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Cargar usuarios
    fetch('http://localhost:4000/api/v1/users')
      .then(response => response.json())
      .then(data => setUsers(data.data.users))
      .catch(error => console.error('Error cargando usuarios:', error));

    // Cargar tiendas
    fetch('http://localhost:4000/api/v1/tiendas')
      .then(response => response.json())
      .then(data => setStores(data.data.tiendas))
      .catch(error => console.error('Error cargando tiendas:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/v1/casos', {
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

          <button type="submit">Agregar Caso</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Case;