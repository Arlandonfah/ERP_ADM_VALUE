import React from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAccessEmployees = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/employees');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full -top-48 -left-48 filter blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full -bottom-48 -right-48 filter blur-3xl"></div>
      
      <div className="relative z-10 text-center px-4 max-w-6xl">
        {/* Illustration SVG */}
        <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z" fill="url(#paint0_linear)"/>
          <path d="M140 70H60V130H140V70Z" fill="white"/>
          <path d="M80 90H70V100H80V90Z" fill="#4F46E5"/>
          <path d="M90 90H80V100H90V90Z" fill="#4F46E5"/>
          <path d="M100 90H90V100H100V90Z" fill="#4F46E5"/>
          <path d="M130 110H70V120H130V110Z" fill="#4F46E5"/>
          <defs>
            <linearGradient id="paint0_linear" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
              <stop stop-color="#4F46E5"/>
              <stop offset="1" stop-color="#6366F1"/>
            </linearGradient>
          </defs>
        </svg>

        <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-md">
          Gestion des Employés
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Solution complète d'ERP pour une gestion optimisée de vos ressources humaines.
          Centralisez les informations, gérez les contrats et simplifiez la paie avec
          notre plateforme tout-en-un sécurisée.
        </p>

        {/* Fonctionnalités clés */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
            <svg className="w-12 h-12 mb-4 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">Gestion RH Complète</h3>
            <p className="text-white/80">Suivi des contrats, congés et évaluations des employés</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
            <svg className="w-12 h-12 mb-4 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">Analytique en Temps Réel</h3>
            <p className="text-white/80">Tableaux de bord personnalisables et rapports détaillés</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
            <svg className="w-12 h-12 mb-4 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">Sécurité Maximale</h3>
            <p className="text-white/80">Chiffrement AES-256 et authentification à deux facteurs</p>
          </div>
        </div>

        <Button
          onClick={handleAccessEmployees}
          className="px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform shadow-xl"
        >
          Accéder au Dashboard
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Button>

        {/* Footer */}
        <div className="mt-12 flex gap-6 justify-center text-white/80">
          <a href="#" className="hover:text-white transition-colors">À propos</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Sécurité</a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;