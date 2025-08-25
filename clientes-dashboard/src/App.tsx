import React, { useState, useEffect } from 'react';
import ClientesList from './components/ClientesList';
import './App.css';

function App() {
    const [clientes, setClientes] = useState([]);

    const fetchClientes = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/clientes');
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <div className="App">
            <h1 className="app-title">Caso Practico 1 TD3 EQUIPO 4</h1>
            <ClientesList clientes={clientes} onRefresh={fetchClientes} />
        </div>
    );
}

export default App;
