import { useEffect, useState } from 'react';
import './ClientesList.css';

const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteEditando, setClienteEditando] = useState<any>(null);
    const [filtroNombre, setFiltroNombre] = useState('');

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/clientes');
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    const handleFiltrar = async () => {
        if (!filtroNombre.trim()) return fetchClientes();

        try {
            const response = await fetch('http://localhost:3001/api/filtrar-clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: filtroNombre }),
            });

            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al filtrar clientes:', error);
            alert('No se pudo filtrar los clientes');
        }
    };

    const handleLimpiarFiltro = () => {
        setFiltroNombre('');
        fetchClientes();
    };

    const handleEdit = (cliente: any) => {
        setClienteEditando(cliente);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/modificar-cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: clienteEditando.Id,
                    nombre: clienteEditando.Nombre,
                    telefono: clienteEditando.Telefono,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Cliente modificado exitosamente');
                setClienteEditando(null);
                fetchClientes();
            } else {
                alert('No se pudo modificar el cliente');
            }
        } catch (error) {
            console.error('Error al modificar cliente:', error);
            alert('Hubo un problema al conectar con el servidor');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

        try {
            const response = await fetch('http://localhost:3001/api/eliminar-cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Cliente eliminado exitosamente');
                fetchClientes();
            } else {
                alert('No se pudo eliminar el cliente');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('Hubo un problema al conectar con el servidor');
        }
    };

    return (
        <div className="clientes-container">
            <h2 className="clientes-title">Lista de Clientes</h2>

            <div className="clientes-filtro">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
                <button onClick={handleFiltrar}>Filtrar</button>
                <button onClick={handleLimpiarFiltro}>Limpiar</button>
            </div>

            {clienteEditando && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Cliente</h3>

                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={clienteEditando.Nombre}
                            onChange={(e) =>
                                setClienteEditando({ ...clienteEditando, Nombre: e.target.value })
                            }
                        />

                        <label>Teléfono:</label>
                        <input
                            type="text"
                            value={clienteEditando.Telefono}
                            onChange={(e) =>
                                setClienteEditando({ ...clienteEditando, Telefono: e.target.value })
                            }
                        />

                        <div className="modal-buttons">
                            <button className="btn-save" onClick={handleSaveEdit}>
                                Guardar
                            </button>
                            <button className="btn-cancel" onClick={() => setClienteEditando(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="clientes-table-wrapper">
                <table className="clientes-table">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Código Postal</th>
                        <th>Fecha Nacimiento</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientes.map((cliente: any) => (
                        <tr key={cliente.Id}>
                            <td>{cliente.Nombre}</td>
                            <td>{cliente.Telefono}</td>
                            <td>{cliente.Direccion || '—'}</td>
                            <td>{cliente.CodigoPostal}</td>
                            <td>{cliente.FechaNacimiento?.split('T')[0]}</td>
                            <td>{cliente.FechaRegistro?.split('T')[0]}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(cliente)}>
                                    Editar
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(cliente.Id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientesList;
