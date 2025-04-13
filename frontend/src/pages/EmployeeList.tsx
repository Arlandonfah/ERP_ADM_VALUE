import { useQuery } from '@tanstack/react-query';
import { getEmployees, deleteEmployee } from '../api/employees';
import EmployeeForm from '../components/EmployeeForm';
import Modal from '../components/Modal';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { queryClient } from '../lib/react-query';

const EmployeeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(1, ''),
  });

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      await deleteEmployee(id);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des données.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Employés</h1>
      <Button onClick={() => setIsModalOpen(true)}>Ajouter un employé</Button>

      <ul>
        {data.map((employee: any) => (
          <li key={employee.id}>
            {employee.firstName} {employee.lastName}
            <button onClick={() => handleEdit(employee)}>Modifier</button>
            <button onClick={() => handleDelete(employee.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <EmployeeForm 
            employee={selectedEmployee} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeeList;
