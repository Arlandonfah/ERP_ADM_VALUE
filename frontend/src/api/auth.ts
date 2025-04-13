
import apiClient from './axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants'; 

const API_URL = `${API_BASE_URL}/api/auth`; 
export const login = async (credentials: { username: string; password: string }) => {
  try {
    console.log("Envoi de la requête à:", `${API_URL}/login`); 
    const response = await apiClient.post(`${API_URL}/login`, credentials);
    console.log("Réponse reçue:", response.data); 
  } catch (error: any) {
    console.error("Détails de l'erreur:", error); 
    throw error;
  }
};