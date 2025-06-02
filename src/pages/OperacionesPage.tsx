// src/pages/OperacionesPage.tsx
import React, { useState } from 'react';
import {
    recargaBilletera,
    iniciarPago,
    confirmarPago,
    consultarSaldo,
} from '../api/billeteraApi';
import {
    RecargaBilleteraDto,
    IniciarPagoDto,
    ConfirmarPagoDto,
    ConsultarSaldoDto,
} from '../shared/types';
import { Link } from 'react-router-dom';

const OperacionesPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [saldo, setSaldo] = useState<number | null>(null);

    // Form states
    const [recargaData, setRecargaData] = useState<RecargaBilleteraDto>({ documento: '', celular: '', valor: 0 });
    const [iniciarPagoData, setIniciarPagoData] = useState<IniciarPagoDto>({ documento: '', celular: '', valorCompra: 0 });
    const [confirmarPagoData, setConfirmarPagoData] = useState<ConfirmarPagoDto>({ idSesion: '', token: '' });
    const [consultarSaldoData, setConsultarSaldoData] = useState<ConsultarSaldoDto>({ documento: '', celular: '' });

    const showFeedback = (msg: string, success: boolean) => {
        setMessage(msg);
        setIsSuccess(success);
        // Limpiar mensaje después de 5 segundos para que desaparezca automáticamente
        setTimeout(() => setMessage(null), 5000);
    };

    // --- Handlers de Recarga ---
    const handleRecargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecargaData({ ...recargaData, [e.target.name]: e.target.name === 'valor' ? parseFloat(e.target.value) || 0 : e.target.value });
    };

    const handleRecargaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Limpiar mensajes previos
        try {
            const response = await recargaBilletera(recargaData);
            showFeedback(`Recarga exitosa. Nuevo saldo: $${response.saldo.toFixed(2)}`, true);
            setRecargaData({ documento: '', celular: '', valor: 0 });
        } catch (error: any) {
            showFeedback(error.message || 'Error en la recarga.', false);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers de Iniciar Pago ---
    const handleIniciarPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIniciarPagoData({ ...iniciarPagoData, [e.target.name]: e.target.name === 'valorCompra' ? parseFloat(e.target.value) || 0 : e.target.value });
    };

    const handleIniciarPagoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Limpiar mensajes previos
        try {
            const response = await iniciarPago(iniciarPagoData);
            showFeedback(`Pago iniciado. ${response.mensajeConfirmacion} ID de Sesión: ${response.idSesion}`, true);
            setConfirmarPagoData(prev => ({ ...prev, idSesion: response.idSesion })); // Precarga el ID de sesión
            setIniciarPagoData({ documento: '', celular: '', valorCompra: 0 });
        } catch (error: any) {
            showFeedback(error.message || 'Error al iniciar pago.', false);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers de Confirmar Pago ---
    const handleConfirmarPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmarPagoData({ ...confirmarPagoData, [e.target.name]: e.target.value });
    };

    const handleConfirmarPagoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Limpiar mensajes previos
        try {
            const response = await confirmarPago(confirmarPagoData);
            showFeedback(`Pago confirmado. Nuevo saldo: $${response.saldo.toFixed(2)}`, true);
            setConfirmarPagoData({ idSesion: '', token: '' });
        } catch (error: any) {
            showFeedback(error.message || 'Error al confirmar pago. Revise ID de Sesión y Token.', false);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers de Consultar Saldo ---
    const handleConsultarSaldoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsultarSaldoData({ ...consultarSaldoData, [e.target.name]: e.target.value });
    };

    const handleConsultarSaldoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaldo(null); // Limpia saldo anterior
        setMessage(null); // Limpiar mensajes previos
        try {
            const response = await consultarSaldo(consultarSaldoData);
            // CLAVE AQUÍ: Convierte a número usando parseFloat o Number()
            const parsedSaldo = parseFloat(response.saldo.toString()); // Asegúrate de que response.saldo sea un string si viene de la DB

            if (isNaN(parsedSaldo)) { // Manejar caso donde la conversión falla
                throw new Error("El saldo recibido no es un número válido.");
            }

            setSaldo(parsedSaldo); // Guarda el saldo como un número
            showFeedback('Saldo consultado exitosamente.', true);
        } catch (error: any) {
            console.log(error);
            showFeedback(error.message || 'Error al consultar saldo.', false);
            setSaldo(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="container py-8 mx-auto">
                <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
                    Operaciones de Billetera
                </h2>

                {/* Mensaje de retroalimentación global flotante */}
                {message && (
                    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message}
                    </div>
                )}

                {/* Sección Consultar Saldo */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">1. Consultar Saldo</h3>
                    <form onSubmit={handleConsultarSaldoSubmit} className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <input
                            type="text"
                            name="documento"
                            placeholder="Documento"
                            value={consultarSaldoData.documento}
                            onChange={handleConsultarSaldoChange}
                            className="flex-grow w-full p-2 border border-gray-300 rounded-md md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="celular"
                            placeholder="Celular"
                            value={consultarSaldoData.celular}
                            onChange={handleConsultarSaldoChange}
                            className="flex-grow w-full p-2 border border-gray-300 rounded-md md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className={`py-2 px-5 rounded-md text-white font-semibold ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300`}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Consultar'
                            )}
                        </button>
                    </form>
                    {saldo !== null && (
                        <p className="mt-4 text-2xl font-bold text-center text-blue-800">
                            Saldo Actual: ${saldo.toFixed(2)}
                        </p>
                    )}
                </div>

                <hr className="my-8 border-gray-300" />

                {/* Sección Recargar Billetera */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">2. Recargar Billetera</h3>
                    <form onSubmit={handleRecargaSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="documento"
                            placeholder="Documento"
                            value={recargaData.documento}
                            onChange={handleRecargaChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="celular"
                            placeholder="Celular"
                            value={recargaData.celular}
                            onChange={handleRecargaChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor a Recargar"
                            value={recargaData.valor === 0 ? '' : recargaData.valor}
                            onChange={handleRecargaChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 rounded-md text-white font-semibold ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition duration-300 flex items-center justify-center`}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Recargar'
                            )}
                        </button>
                    </form>
                </div>

                <hr className="my-8 border-gray-300" />

                {/* Sección Iniciar Pago */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">3. Iniciar Pago</h3>
                    <form onSubmit={handleIniciarPagoSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="documento"
                            placeholder="Documento del Comprador"
                            value={iniciarPagoData.documento}
                            onChange={handleIniciarPagoChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="celular"
                            placeholder="Celular del Comprador"
                            value={iniciarPagoData.celular}
                            onChange={handleIniciarPagoChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            name="valorCompra"
                            placeholder="Valor de la Compra"
                            value={iniciarPagoData.valorCompra === 0 ? '' : iniciarPagoData.valorCompra}
                            onChange={handleIniciarPagoChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 rounded-md text-white font-semibold ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} transition duration-300 flex items-center justify-center`}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Iniciar Pago'
                            )}
                        </button>
                    </form>
                </div>

                <hr className="my-8 border-gray-300" />

                {/* Sección Confirmar Pago */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">4. Confirmar Pago</h3>
                    <form onSubmit={handleConfirmarPagoSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="idSesion"
                            placeholder="ID de Sesión (recibido al iniciar pago)"
                            value={confirmarPagoData.idSesion}
                            onChange={handleConfirmarPagoChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="token"
                            placeholder="Token de Confirmación (recibido por email)"
                            value={confirmarPagoData.token}
                            onChange={handleConfirmarPagoChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 rounded-md text-white font-semibold ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} transition duration-300 flex items-center justify-center`}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Confirmar Pago'
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="font-semibold text-blue-600 hover:underline">
                        &larr; Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OperacionesPage;