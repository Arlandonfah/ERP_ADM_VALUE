import { QueryClient } from '@tanstack/react-query';

// Configuration de base pour React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Ne pas recharger les données quand la fenêtre reprend le focus
      retry: false, // Ne pas réessayer automatiquement les requêtes en erreur
      staleTime: 5 * 60 * 1000, // Considérer les données comme fraîches pendant 5 minutes
    }
  }
});