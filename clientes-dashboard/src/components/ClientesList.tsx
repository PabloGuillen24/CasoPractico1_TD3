import React, { useState } from 'react';
import './ClientesList.css';

interface Cliente {
    Id: number;
    Nombre: string;
    Telefono: string;
    Direccion?: string;
    CodigoPostal?: string;
    FechaNacimiento?: string;
}

interface ClientesListProps {
    clientes: Cliente[];
    onRefresh: () => void;
}

const ClientesList: React.FC<ClientesListProps> = ({ clientes, onRefresh }) => {
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[] | null>(null);

    const handleFiltrar = async () => {
        if (!filtroNombre.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/api/filtrar-clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: filtroNombre }),
            });

            const data: Cliente[] = await response.json();
            const filtradosValidos = data.filter(c => c && c.Nombre);
            setClientesFiltrados(filtradosValidos);
        } catch (error) {
            console.error('Error al filtrar clientes:', error);
            alert('No se pudo filtrar los clientes');
        }
    };

    const handleAgregarCliente = () => {
        setClienteEditando({
            Id: 0,
            Nombre: '',
            Telefono: '',
            Direccion: '',
            CodigoPostal: '',
            FechaNacimiento: '',
        });
    };

    const handleSaveEdit = async () => {
        if (!clienteEditando) return;

        const endpoint = clienteEditando.Id === 0
            ? 'http://localhost:3001/api/agregar-cliente'
            : 'http://localhost:3001/api/modificar-cliente';

        const payload = clienteEditando.Id === 0
            ? clienteEditando
            : {
                Id: clienteEditando.Id,
                Nombre: clienteEditando.Nombre,
                Telefono: clienteEditando.Telefono,
            };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.success) {
                alert(clienteEditando.Id === 0 ? 'Cliente agregado exitosamente' : 'Cliente modificado exitosamente');
                setClienteEditando(null);
                onRefresh();
                setClientesFiltrados(null);
            } else {
                alert('No se pudo guardar el cliente');
            }
        } catch (error) {
            console.error('Error al guardar cliente:', error);
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
                onRefresh();
                setClientesFiltrados(null);
            } else {
                alert('No se pudo eliminar el cliente');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('Hubo un problema al conectar con el servidor');
        }
    };

    const clientesParaMostrar = clientesFiltrados ?? clientes;

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
                <button onClick={() => {
                    setFiltroNombre('');
                    setClientesFiltrados(null);
                    onRefresh();
                }}>Limpiar</button>
            </div>

            <div className="clientes-agregar-wrapper">
                <button className="btn-agregar" onClick={handleAgregarCliente}>
                    + Agregar Cliente
                </button>
            </div>

            {clienteEditando && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{clienteEditando.Id === 0 ? 'Agregar Cliente' : 'Editar Cliente'}</h3>

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

                        {clienteEditando.Id === 0 && (
                            <>
                                <label>Dirección:</label>
                                <input
                                    type="text"
                                    value={clienteEditando.Direccion || ''}
                                    onChange={(e) =>
                                        setClienteEditando({ ...clienteEditando, Direccion: e.target.value })
                                    }
                                />

                                <label>Código Postal:</label>
                                <input
                                    type="text"
                                    value={clienteEditando.CodigoPostal || ''}
                                    onChange={(e) =>
                                        setClienteEditando({ ...clienteEditando, CodigoPostal: e.target.value })
                                    }
                                />

                                <label>Fecha de Nacimiento:</label>
                                <input
                                    type="date"
                                    value={clienteEditando.FechaNacimiento?.split('T')[0] || ''}
                                    onChange={(e) =>
                                        setClienteEditando({ ...clienteEditando, FechaNacimiento: e.target.value })
                                    }
                                />
                            </>
                        )}

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
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientesParaMostrar.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                No se encontraron clientes.
                            </td>
                        </tr>
                    ) : (
                        clientesParaMostrar.map((cliente) => (
                            <tr key={cliente.Id}>
                                <td>{cliente.Nombre}</td>
                                <td>{cliente.Telefono}</td>
                                <td>{cliente.Direccion || '—'}</td>
                                <td>{cliente.CodigoPostal || '—'}</td>
                                <td>{cliente.FechaNacimiento?.split('T')[0] || '—'}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => setClienteEditando(cliente)}>
                                        Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(cliente.Id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientesList;
