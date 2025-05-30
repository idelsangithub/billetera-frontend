// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegistroPage from './pages/RegistroPage';
import OperacionesPage from './pages/OperacionesPage';

function App() {
  return (
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">Billetera Virtual</h1>
              <div>
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</Link>
                <Link to="/registro" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Registro</Link>
                <Link to="/operaciones" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Operaciones</Link>
              </div>
            </div>
          </nav>

          {/* Contenido principal */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/registro" element={<RegistroPage />} />
              <Route path="/operaciones" element={<OperacionesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;