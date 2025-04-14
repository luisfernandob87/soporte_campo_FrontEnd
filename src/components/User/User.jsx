import { useState, useEffect } from 'react';
import './User.css';
import { API_BASE_URL } from '../../config';

function User() {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState({
    nombre: '',
    usuario: '',
    password: '',
    confirmPassword: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users`);
      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.data.users);
      }
    } catch (error) {
      setMessage('Error al cargar usuarios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Usuario creado exitosamente');
        setFormData({ nombre: '', usuario: '', password: '', confirmPassword: '' });
        fetchUsers();
      } else {
        setMessage('Error al crear el usuario');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (editingUser.password && editingUser.password !== editingUser.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      const userData = {
        nombre: editingUser.nombre,
        usuario: editingUser.usuario
      };
      if (editingUser.password) {
        userData.password = editingUser.password;
      }
      const response = await fetch(`${API_BASE_URL}/v1/users/${editingUser.id_usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setMessage('Usuario actualizado exitosamente');
        setShowModal(false);
        fetchUsers();
      } else {
        setMessage('Error al actualizar el usuario');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/${selectedUser.id_usuario}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Usuario eliminado exitosamente');
        setShowDeleteConfirm(false);
        fetchUsers();
      } else {
        setMessage('Error al eliminar el usuario');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  return (
    <div className="user-container">
      <div className="user-section">
        <div className="user-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="message error">Las contraseñas no coinciden</p>
            )}
            <button type="submit">Crear Usuario</button>
          </form>
          <div className="user-section">
        <h2>Usuarios Existentes</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id_usuario}>
                  <td>{user.nombre}</td>
                  <td>{user.usuario}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowModal(true);
                      }}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteConfirm(true);
                      }}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>



      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label htmlFor="edit-nombre">Nombre:</label>
                <input
                  type="text"
                  id="edit-nombre"
                  value={editingUser.nombre}
                  onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-usuario">Usuario:</label>
                <input
                  type="text"
                  id="edit-usuario"
                  value={editingUser.usuario}
                  onChange={(e) => setEditingUser({...editingUser, usuario: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-password">Nueva Contraseña (opcional):</label>
                <input
                  type="password"
                  id="edit-password"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-confirmPassword">Confirmar Nueva Contraseña:</label>
                <input
                  type="password"
                  id="edit-confirmPassword"
                  value={editingUser.confirmPassword || ''}
                  onChange={(e) => setEditingUser({...editingUser, confirmPassword: e.target.value})}
                />
              </div>
              {editingUser.password && editingUser.confirmPassword && editingUser.password !== editingUser.confirmPassword && (
                <p className="message error">Las contraseñas no coinciden</p>
              )}
              <div className="button-group">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Está seguro que desea eliminar al usuario {selectedUser.nombre}?</p>
            <div className="button-group">
              <button onClick={handleDelete}>Confirmar</button>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
}

export default User;