import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEmployee, updateEmployee } from '../api/employees';

const schema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
});

type FormData = z.infer<typeof schema>;

const EmployeeForm = ({ employee, onClose }: { employee?: any; onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: employee });

  const onSubmit = async (data: FormData) => {
    if (employee) {
      await updateEmployee(employee.id, data);
    } else {
      await createEmployee(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('firstName')}
        placeholder="Prénom"
        className="w-full p-2 border rounded"
      />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      <input
        {...register('lastName')}
        placeholder="Nom"
        className="w-full p-2 border rounded"
      />
      {errors.lastName && <p>{errors.lastName.message}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        {employee ? 'Modifier' : 'Créer'}
      </button>
    </form>
  );
};

export default EmployeeForm;