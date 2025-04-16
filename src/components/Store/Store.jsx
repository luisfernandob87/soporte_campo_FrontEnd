import { useState, useEffect } from 'react';
import './Store.css';
import { API_BASE_URL } from '../../config';
import LoadingButton from '../common/LoadingButton';

function Store() {
  const [formData, setFormData] = useState({
    cadena: '',
    nombre: '',
    latitud: '',
    longitud: ''
  });
  const [message, setMessage] = useState('');
  const [stores, setStores] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/tiendas`);
      if (response.ok) {
        const data = await response.json();
        setStores(data.data.tiendas);
      }
    } catch (error) {
      console.error('Error al obtener tiendas:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/v1/tiendas/${editingId}`
        : `${API_BASE_URL}/v1/tiendas`;
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(isEditing ? 'Tienda actualizada exitosamente' : 'Tienda agregada exitosamente');
        setFormData({
          cadena: '',
          nombre: '',
          latitud: '',
          longitud: ''
        });
        setIsEditing(false);
        setEditingId(null);
        fetchStores();
      } else {
        setMessage(isEditing ? 'Error al actualizar la tienda' : 'Error al agregar la tienda');
      }
    } catch (error) {
      setMessage('Error de conexión');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (store) => {
    setFormData({
      cadena: store.cadena,
      nombre: store.nombre,
      latitud: store.latitud,
      longitud: store.longitud
    });
    setIsEditing(true);
    setEditingId(store.id_tienda);
  };

  const handleDelete = async (id_tienda) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tienda?')) {
      setIsDeletingId(id_tienda);
      try {
        const response = await fetch(`${API_BASE_URL}/v1/tiendas/${id_tienda}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Tienda eliminada exitosamente');
          fetchStores();
        } else {
          setMessage('Error al eliminar la tienda');
        }
      } catch (error) {
        setMessage('Error de conexión');
        console.error('Error:', error);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  return (
    <div className="store-container">
      <div className="store-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cadena">Cadena:</label>
            <select
              id="cadena"
              name="cadena"
              value={formData.cadena}
              onChange={handleChange}
              required
            >
              <option value="">- Seleccione -</option>
              <option value="China Wok">China Wok</option>
              <option value="KFC">KFC</option>
              <option value="Pizza Hut">Pizza Hut</option>
              <option value="Starbucks">Starbucks</option>
              <option value="Wendy's">Wendy's</option>
            </select>
          </div>

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
            <label htmlFor="latitud">Latitud:</label>
            <input
              type="text"
              id="latitud"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitud">Longitud:</label>
            <input
              type="text"
              id="longitud"
              name="longitud"
              value={formData.longitud}
              onChange={handleChange}
              required
            />
          </div>
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Actualizar Tienda' : 'Agregar Tienda'}
          </LoadingButton>
          {isEditing && (
            <LoadingButton
              type="button"
              onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({
                cadena: '',
                nombre: '',
                latitud: '',
                longitud: ''
              });
            }}
            >
              Cancelar Edición
            </LoadingButton>
          )}
        </form>
        {message && <p className="message">{message}</p>}

        <div className="stores-list">
          <h3>Tiendas Existentes</h3>
          <table>
            <thead>
              <tr>
                <th>Cadena</th>
                <th>Nombre</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id_tienda}>
                  <td>{store.cadena}</td>
                  <td>{store.nombre}</td>
                  <td>{store.latitud}</td>
                  <td>{store.longitud}</td>
                  <td>
                    <LoadingButton
                      onClick={() => handleEdit(store)}
                      isLoading={isSubmitting}
                    >
                      Editar
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(store.id_tienda)}
                      isLoading={isDeletingId === store.id_tienda}
                    >
                      Eliminar
                    </LoadingButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Store;