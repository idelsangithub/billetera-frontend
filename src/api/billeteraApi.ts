import axios from 'axios';
import {
    RegistroClienteDto,
    RecargaBilleteraDto,
    IniciarPagoDto,
    ConfirmarPagoDto,
    ConsultarSaldoDto,
    ApiResponse,
    Cliente,
    IniciarPagoResponseData,
    ConsultarSaldoResponseData,
} from '../shared/types';

const API_URL = process.env.REACT_APP_BL_SERVICE_URL || 'http://localhost:3000/billetera';

const billeteraApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para manejar errores de la API
const handleApiResponse = <T>(response: ApiResponse<T>): T => {
    if (response.code !== 200) {
        const errorMessage = typeof response.error === 'string' ? response.error : (Array.isArray(response.error) ? response.error.join(', ') : response.message);
        throw new Error(errorMessage || 'Ocurrió un error desconocido.');
    }
    if (!response.data && response.message) {
        // Para casos donde no hay 'data' pero sí un mensaje de éxito (ej. solo confirmación)
        return {} as T; // Devuelve un objeto vacío pero tipado si es solo mensaje
    }
    if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta exitosa.');
    }
    return response.data;
};

// --- Funcionalidades de la API ---

export const registroCliente = async (data: RegistroClienteDto): Promise<Cliente> => {
    const response = await billeteraApi.post<ApiResponse<Cliente>>('/registro-cliente', data);
    return handleApiResponse(response.data);
};

export const recargaBilletera = async (data: RecargaBilleteraDto): Promise<Cliente> => {
    const response = await billeteraApi.post<ApiResponse<Cliente>>('/recarga', data);
    return handleApiResponse(response.data);
};

export const iniciarPago = async (data: IniciarPagoDto): Promise<IniciarPagoResponseData> => {
    const response = await billeteraApi.post<ApiResponse<IniciarPagoResponseData>>('/iniciar-pago', data);
    return handleApiResponse(response.data);
};

export const confirmarPago = async (data: ConfirmarPagoDto): Promise<Cliente> => {
    const response = await billeteraApi.post<ApiResponse<Cliente>>('/confirmar-pago', data);
    return handleApiResponse(response.data);
};

export const consultarSaldo = async (data: ConsultarSaldoDto): Promise<ConsultarSaldoResponseData> => {
    const response = await billeteraApi.get<ApiResponse<ConsultarSaldoResponseData>>('/saldo', { params: data });
    return handleApiResponse(response.data);
};

export default billeteraApi;