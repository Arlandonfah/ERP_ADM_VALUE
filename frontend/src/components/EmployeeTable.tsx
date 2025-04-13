import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../api/employees';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const EmployeeTable = () => {
  const { data, isLoading, error } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: () => getEmployees()
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des données : {error.message}</div>;


  const employeeList = Array.isArray(data) ? data : [];

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Nom</th>
          <th className="border p-2">Prénom</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employeeList.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-100">
            <td className="border p-2">{employee.lastName}</td>
            <td className="border p-2">{employee.firstName}</td>
            <td className="border p-2">
              <button className="mr-2 text-blue-500">Edit</button>
              <button className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;