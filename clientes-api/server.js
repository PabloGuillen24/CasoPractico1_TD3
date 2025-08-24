const express = require('express');
const soap = require('soap');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para leer JSON del body

const wsdlUrl = 'http://clientesws.somee.com/clienteswebservice.asmx?wsdl';

//Obtener lista de clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const client = await soap.createClientAsync(wsdlUrl);
        const [result] = await client.ObtenerClientesAsync({});
        const clientes = result.ObtenerClientesResult.Cliente;
        res.json(clientes);
    } catch (error) {
        console.error(' Error al obtener clientes:', error.message);
        res.status(500).json({ error: 'No se pudo obtener los clientes' });
    }
});

//Guardar los clientes
app.post('/api/guardar-cliente', async (req, res) => {
    const { nombre, telefono, direccion, CodigoPostal, fechaNacimiento } = req.body;

    try {
        const client = await soap.createClientAsync(wsdlUrl);
        const args = { nombre, telefono, direccion, CodigoPostal, fechaNacimiento };
        const [result] = await client.GuardarClienteAsync(args);
        res.json({ success: true, result });
    } catch (error) {
        console.error(' Error al guardar cliente:', error.message);
        res.status(500).json({ error: 'No se pudo guardar el cliente' });
    }
});

app.post('/api/eliminar-cliente', async (req, res) => {
    const { id } = req.body;

    try {
        const client = await soap.createClientAsync(wsdlUrl);
        const args = { id }; // ← importante: minúscula
        const [result] = await client.EliminarClienteAsync(args);

        console.log('🧾 Respuesta de EliminarCliente:', result);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error al eliminar cliente:', error.message);
        res.status(500).json({ error: 'No se pudo eliminar el cliente' });
    }
});

app.post('/api/modificar-cliente', async (req, res) => {
    const { id, nombre, telefono } = req.body;

    try {
        const client = await soap.createClientAsync(wsdlUrl);
        const args = { id, nombre, telefono };
        const [result] = await client.ModificarClienteAsync(args);

        res.json({ success: true, result });
    } catch (error) {
        console.error('Error al modificar cliente:', error.message);
        res.status(500).json({ error: 'No se pudo modificar el cliente' });
    }
});

app.post('/api/filtrar-clientes', async (req, res) => {
    const { nombre } = req.body;

    try {
        const client = await soap.createClientAsync(wsdlUrl);
        const args = { nombre }; // ← debe ser minúscula como en el XML
        const [result] = await client.FiltrarClientesAsync(args);
        const clientesFiltrados = result.FiltrarClientesResult.Cliente;
        res.json(clientesFiltrados || []);
    } catch (error) {
        console.error('Error al filtrar clientes:', error.message);
        res.status(500).json({ error: 'No se pudo filtrar los clientes' });
    }
});




app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
