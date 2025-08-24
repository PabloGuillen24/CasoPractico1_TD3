import { useState } from 'react';

const ClienteForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        CodigoPostal: '',
        fechaNacimiento: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/guardar-cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log('Respuesta del backend:', result);
        } catch (error) {
            console.error('Error al guardar cliente:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                name="CodigoPostal"
                placeholder="Código Postal"
                value={formData.CodigoPostal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Fecha de nacimiento"
                aria-label="Fecha de nacimiento"
            />

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
            >
                Guardar Cliente
            </button>
        </form>
    );
};

export default ClienteForm;
