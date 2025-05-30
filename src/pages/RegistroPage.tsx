import React, { useState } from 'react';
import { registroCliente } from '../api/billeteraApi';
import { Cliente, RegistroClienteDto } from '../shared/types';
import { Link } from 'react-router-dom';

const RegistroPage: React.FC = () => {
    const [formData, setFormData] = useState<RegistroClienteDto>({
        documento: '',
        nombres: '',
        email: '',
        celular: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Limpiar mensajes previos

        try {
            const cliente: Cliente = await registroCliente(formData);
            setMessage(`Cliente ${cliente.nombres} registrado con éxito. ID: ${cliente.id}`);
            setIsSuccess(true);
            setFormData({ documento: '', nombres: '', email: '', celular: '' }); // Limpiar formulario
        } catch (error: any) {
            setMessage(error.message || 'Error al registrar cliente.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Registro de Nuevo Cliente
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="documento"
                        placeholder="Documento"
                        value={formData.documento}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        name="nombres"
                        placeholder="Nombres Completos"
                        value={formData.nombres}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        name="celular"
                        placeholder="Celular"
                        value={formData.celular}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 px-6 rounded-md text-white font-semibold ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300 flex items-center justify-center`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Registrar'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link to="/operaciones" className="text-blue-600 hover:underline">
                        Ir a Operaciones
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistroPage;