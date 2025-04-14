import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur requis'),
  password: z.string().min(8, 'Mot de passe trop court'),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data);
      //localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
      {/* Effets de fond décoratifs */}
      <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full -top-48 -left-48 filter blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full -bottom-48 -right-48 filter blur-3xl"></div>
      
      <div className="relative backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/20 w-96 transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl mb-12 mt-2 font-bold text-white text-center mb-8 drop-shadow-lg">
          ERP-- Systeme de Gestion des Employée <br/>
          <p className="mt-4 mb-4 text-xl">Connectez-vous!</p> 
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('username')}
              placeholder="Nom d'utilisateur"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-white transition-all"
            />
            {errors.username && (
              <p className="mt-1 ml-2 text-sm text-red-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-white transition-all"
            />
            {errors.password && (
              <p className="mt-1 ml-2 text-sm text-red-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <a href="#" className="text-white/70 hover:text-white/80 text-sm transition-colors">
            Mot de passe oublié ?
          </a>
          <p className="text-white/70 text-sm">
            Pas de compte ?{' '}
            <a href="#" className="text-white hover:text-white/80 font-semibold transition-colors">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;