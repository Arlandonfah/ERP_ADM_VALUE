import apiClient from './axios';

const API_URL = '/api/users'; 
// Récupérer la liste des utilisateurs
export const getUsers = async () => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data; // Retourne la liste des utilisateurs
  } catch (error) {
    throw new Error('Erreur lors du chargement des utilisateurs');
  }
};