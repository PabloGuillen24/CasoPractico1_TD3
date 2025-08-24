// src/App.tsx
import React from 'react';
import ClientesList from './components/ClientesList';
import ClienteForm from './components/ClienteForm';

function App() {
    return (
        <div className="App p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Gestión de Clientes
            </h1>

            <div className="mb-8">
                <ClienteForm />
            </div>

            <div>
                <ClientesList />
            </div>
        </div>
    );
}

export default App;
