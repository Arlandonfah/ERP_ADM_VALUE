import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur requis'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

type FormData = z.infer<typeof schema>;

const AuthForm = ({ onSubmit, title }: { onSubmit: (data: FormData) => void; title: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <input
        {...register('username')}
        placeholder="Nom d'utilisateur"
        className="w-full p-2 border rounded"
      />
      {errors.username && <p>{errors.username.message}</p>}
      <input
        {...register('password')}
        type="password"
        placeholder="Mot de passe"
        className="w-full p-2 border rounded"
      />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        {title}
      </button>
    </form>
  );
};

export default AuthForm;