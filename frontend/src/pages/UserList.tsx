
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users';

type User = {
  id: number;
  username: string;
};

const UserList = () => {
  const { data, isLoading, error } = useQuery<User[]>({ 
    queryKey: ['users'],
    queryFn: getUsers
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {(error as Error).message}</p>;

  const userList = data || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nom d'utilisateur</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user: User) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
