// --------------- CLIENTE ---------------
export interface Cliente {
    id: number;
    documento: string;
    nombres: string;
    email: string;
    celular: string;
    saldo: number;
    fechaRegistro: string; // NestJS devuelve fechas como strings
    fechaActualizacion: string;
}

export interface RegistroClienteDto {
    documento: string;
    nombres: string;
    email: string;
    celular: string;
}

export interface RecargaBilleteraDto {
    documento: string;
    celular: string;
    valor: number;
}

export interface IniciarPagoDto {
    documento: string;
    celular: string;
    valorCompra: number;
}

export interface ConfirmarPagoDto {
    idSesion: string;
    token: string;
}

export interface ConsultarSaldoDto {
    documento: string;
    celular: string;
}

// --------------- RESPUESTAS DE API ---------------
export interface ApiResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: string | string[];
}

// Tipos específicos para respuestas del BL Service
export interface IniciarPagoResponseData {
    idSesion: string;
    mensajeConfirmacion: string;
}

export interface ConsultarSaldoResponseData {
    saldo: number;
}