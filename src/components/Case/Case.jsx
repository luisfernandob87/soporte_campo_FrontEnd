import { useState, useEffect } from 'react';
import './Case.css';
import { API_BASE_URL } from '../../config';
import LoadingButton from '../common/LoadingButton';

const SearchableSelect = ({ options, value, onChange, placeholder, labelKey, valueKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredOptions = options.filter(option =>
    option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option[valueKey].toString() === value);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (option) => {
    onChange(option[valueKey].toString());
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleOptionClick(filteredOptions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="searchable-select" onKeyDown={handleKeyDown}>
      <div 
        className="select-input" 
        onClick={handleInputClick}
      >
        {selectedOption ? selectedOption[labelKey] : placeholder}
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar..."
            className="select-search"
            autoFocus
          />
          <div className="select-options">
            {filteredOptions.map((option, index) => (
              <div
                key={option[valueKey]}
                className={`select-option ${highlightedIndex === index ? 'highlighted' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option[labelKey]}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="no-options">No se encontraron resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
            <SearchableSelect
              options={users}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Seleccione un usuario"
              labelKey="nombre"
              valueKey="id_usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="store">Tienda:</label>
            <SearchableSelect
              options={stores}
              value={selectedStore}
              onChange={setSelectedStore}
              placeholder="Seleccione una tienda"
              labelKey="nombre"
              valueKey="id_tienda"
            />
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