import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Bienvenido a tu Billetera Virtual
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Gestiona tus transacciones de forma segura y sencilla.
                </p>
                <div className="flex flex-col space-y-4">
                    <Link to="/registro" className="w-full">
                        <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 w-full">
                            Registrar Cliente
                        </button>
                    </Link>
                    <Link to="/operaciones" className="w-full">
                        <button className="border border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-300 w-full">
                            Realizar Operaciones
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;