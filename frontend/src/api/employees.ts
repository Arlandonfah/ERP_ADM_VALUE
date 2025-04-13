import apiClient from './axios';

const API_URL = '/api/employees';

export const getEmployees = async (page: number = 1, search: string = '') => {
  try {
    const response = await apiClient.get(API_URL, {
      params: { page, search },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des employés');
  }
};

export const createEmployee = async (employeeData: { firstName: string; lastName: string }) => {
  try {
    const response = await apiClient.post(API_URL, employeeData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'employé');
  }
};

export const updateEmployee = async (id: number, employeeData: { firstName: string; lastName: string }) => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'employé');
  }
};

export const deleteEmployee = async (id: number) => {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'employé');
  }
};