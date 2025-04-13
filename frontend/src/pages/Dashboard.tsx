
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import  Modal  from '../components/Modal';
import  Loader  from '../components/Loader';


type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
  status: 'Actif' | 'En congé' | 'Absent';
  joinDate: string;
};

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'delete' | 'view' | 'add' | 'edit'| null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');


   
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); 

  
   const filteredEmployees = employees.filter(
    emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Fonction pour changer de page
const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Données simulées
  useEffect(() => {
    
    setTimeout(() => {
      const mockEmployees: Employee[] = [
        { id: 1, name: 'Sophie Martin', position: 'Développeur Frontend', department: 'IT', status: 'Actif', joinDate: '2023-03-15' },
        { id: 2, name: 'Thomas Bernard', position: 'Développeur Backend', department: 'IT', status: 'Actif', joinDate: '2023-01-10' },
        { id: 3, name: 'Camille Dubois', position: 'Designer UX/UI', department: 'Design', status: 'En congé', joinDate: '2022-11-05' },
        { id: 4, name: 'Lucas Petit', position: 'Chef de Projet', department: 'Management', status: 'Actif', joinDate: '2022-08-22' },
        { id: 5, name: 'Emma Leroy', position: 'Ressources Humaines', department: 'RH', status: 'Absent', joinDate: '2023-02-14' },
      ];
      setEmployees(mockEmployees);
      setIsLoading(false);
    }, 1000);
  }, []);


  const handleAddEmployee = () => {
    navigate('/employees/add');
  };


  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('delete');
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (selectedEmployee) {
      try {
        // Appel API pour supprimer l'employé
        const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
           
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        
      
        setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
        setIsModalOpen(false);
        
        
        alert('Employé supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'employé:', error);
       
        alert('Échec de la suppression de l\'employé');
      }
    }
  };

 

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'Actif').length,
    onLeaveEmployees: employees.filter(e => e.status === 'En congé').length,
    absentEmployees: employees.filter(e => e.status === 'Absent').length,
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Actif': return 'bg-green-500';
      case 'En congé': return 'bg-yellow-500';
      case 'Absent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };



  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    position: '',
    department: '',
    status: 'Actif',
    joinDate: new Date().toISOString().substring(0, 10) 
  });
  
  
  const handleAddEmployeeSubmit = () => {
  
    if (!newEmployee.name || !newEmployee.position || !newEmployee.department) {
   
      return;
    }
  
    const employee: Employee = {
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      name: newEmployee.name || '',
      position: newEmployee.position || '',
      department: newEmployee.department || '',
      status: newEmployee.status as 'Actif' | 'En congé' | 'Absent' || 'Actif',
      joinDate: newEmployee.joinDate || new Date().toISOString().substring(0, 10)
    };
  
   
    setEmployees([...employees, employee]);
    
    
    setNewEmployee({
      name: '',
      position: '',
      department: '',
      status: 'Actif',
      joinDate: new Date().toISOString().substring(0, 10)
    });
    setIsModalOpen(false);
  };
  
  
  const handleAddEmployee2 = () => {
    setModalType('add');
    setIsModalOpen(true);
  };


const [editedEmployee, setEditedEmployee] = useState<Partial<Employee & {performanceRating?: number, email?: string}>>({}); 


  const handleEditEmployee = (id: number) => {
  const employee = employees.find(emp => emp.id === id);
  if (employee) {

    setEditedEmployee({
      ...employee,
      performanceRating: 78, 
      email: `${employee.name.toLowerCase().replace(' ', '.')}@example.com` 
    });
    setModalType('edit');
    setIsModalOpen(true);
  }
};


const handleEditEmployeeSubmit = () => {
  if (!editedEmployee.id || !editedEmployee.name || !editedEmployee.position || !editedEmployee.department) {
   
    return;
  }

 
  setEmployees(employees.map(emp => 
    emp.id === editedEmployee.id 
      ? {
          id: editedEmployee.id,
          name: editedEmployee.name || '',
          position: editedEmployee.position || '',
          department: editedEmployee.department || '',
          status: editedEmployee.status as 'Actif' | 'En congé' | 'Absent' || 'Actif',
          joinDate: editedEmployee.joinDate || new Date().toISOString().substring(0, 10)
        } 
      : emp
  ));

  
  setIsModalOpen(false);
  setEditedEmployee({});
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500/10 to-purple-600/10">
      {/* Header avec navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h1 className="text-2xl font-bold">ERP - Gestion des Employés</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {/* <span className="ml-2">{user?.username || "Admin"}</span> */}
            </div>
            <Button 
              onClick={logout} 
              className="bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 font-medium transition-colors ${activeTab === 'dashboard' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Tableau de bord
            </button>
            <button 
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-3 font-medium transition-colors ${activeTab === 'employees' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Liste des employés
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : activeTab === 'dashboard' ? (
          // Vue Tableau de bord
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm font-medium">Total Employés</h2>
                  <p className="text-3xl font-semibold text-gray-800">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm font-medium">Employés Actifs</h2>
                  <p className="text-3xl font-semibold text-gray-800">{stats.activeEmployees}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm font-medium">En Congé</h2>
                  <p className="text-3xl font-semibold text-gray-800">{stats.onLeaveEmployees}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm font-medium">Absents</h2>
                  <p className="text-3xl font-semibold text-gray-800">{stats.absentEmployees}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vue liste des employés
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Liste des employés</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-xl font-medium text-gray-500 mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1.5 text-purple-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                  <span className="text-gray-400">De</span>
                  <span className="ml-1 font-semibold text-gray-700">
                    {filteredEmployees.length === 0 ? 0 : indexOfFirstEmployee + 1}
                  </span>
                </div>

                <div className="flex items-center text-xl font-medium text-gray-500 mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1.5 text-purple-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                  <span className="text-gray-400"> à </span>
                  <span className="ml-1 font-semibold text-gray-700">
                    {Math.min(indexOfLastEmployee, filteredEmployees.length)}
                  </span>
                </div>

              <div className="flex items-center text-xl font-medium text-gray-500 mb-6">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1.5 text-purple-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"     
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <span className="text-gray-400">sur</span>
                <span className="ml-1 font-semibold text-gray-700">
                  {filteredEmployees.length}
                </span>
                <span className="ml-1 text-gray-400">résultats</span>
              </div>
</div>
              <div className="flex space-x-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Button 
                  onClick={handleAddEmployee2} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Tableau des employés */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poste
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Département
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'embauche
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEmployees.length > 0 ? (
                      currentEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {employee.name.split(' ').map(name => name[0]).join('')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)} text-white`}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(employee.joinDate).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button 
                              onClick={() => handleViewEmployee(employee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleEditEmployee(employee.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteConfirmation(employee)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Aucun employé trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Pagination */}
        {filteredEmployees.length > employeesPerPage && (
          <div className="mt-2 mb-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium`}
              >
                <span className="sr-only">Précédent</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Boutons de numéros de page */}
              {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1 
                      ? 'z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-purple-500' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => currentPage < Math.ceil(filteredEmployees.length / employeesPerPage) && paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  currentPage === Math.ceil(filteredEmployees.length / employeesPerPage) 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium`}
              >
                <span className="sr-only">Suivant</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
                      </div>
                    </div>
                  </>
                )}
              </main>

              {/* Footer */}
              <footer className="bg-gray-100 py-4 mt-40">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                  © 2025 ERP - Système de Gestion des Employés. Tous droits réservés.
                </div>
              </footer>

              {/* Modal de confirmation de suppression */}
              {isModalOpen && modalType === 'delete' && selectedEmployee && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-8">
              {/* Background décoratif */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
              
              <div className="relative">
                {/* Cercle avec icône d'alerte */}
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg mb-6 transform transition-transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                {/* Titre et texte */}
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">Confirmer la suppression</h3>
                <p className="text-gray-600 text-center mb-8 px-4">
                  Êtes-vous sûr de vouloir supprimer l'employé <span className="font-semibold text-red-500">{selectedEmployee.name}</span> ? Cette action est irréversible.
                </p>
                
                {/* Boutons avec effet de survol */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleDeleteEmployee}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}


        {/* Modal d'ajout d'employé */}
        {isModalOpen && modalType === 'add' && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-6">
              {/* Background décoratif avec dégradé */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              {/* Contenu du formulaire */}
              <div className="relative">
                {/* Icône et titre */}
                <div className="flex justify-center">
                  <div className="relative mt-4 mb-6">
                    <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Ajouter un nouvel employé</h3>
                
                {/* Formulaire */}
                <form onSubmit={(e) => { e.preventDefault(); handleAddEmployeeSubmit(); }}>
                  <div className="space-y-4 mb-6">
                    {/* Nom */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="name"
                        value={newEmployee.name || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Prénom Nom"
                        required
                      />
                    </div>
                    
                    {/* Poste */}
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Poste <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="position"
                        value={newEmployee.position || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Développeur, Designer, etc."
                        required
                      />
                    </div>
                    
                    {/* Département */}
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Département <span className="text-red-500">*</span></label>
                      <select
                        id="department"
                        value={newEmployee.department || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="" disabled>Sélectionnez un département</option>
                        <option value="IT">IT</option>
                        <option value="Design">Design</option>
                        <option value="Management">Management</option>
                        <option value="RH">RH</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    
                    {/* Statut */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <div className="flex space-x-4">
                        {['Actif', 'En congé', 'Absent'].map((status) => (
                          <label key={status} className="flex items-center">
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              checked={newEmployee.status === status}
                              onChange={() => setNewEmployee({...newEmployee, status: status as 'Actif' | 'En congé' | 'Absent'})}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date d'embauche */}
                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                      <input
                        type="date"
                        id="joinDate"
                        value={newEmployee.joinDate || ''}
                        onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-all"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajouter l'employé
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}


{/* Modal d'édition d'employé */}
{isModalOpen && modalType === 'edit' && selectedEmployee && (
  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <div className="p-6">
      {/* Background décoratif avec dégradé */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Contenu du formulaire */}
      <div className="relative">
        {/* Icône et titre */}
        <div className="flex justify-center">
          <div className="relative mt-4 mb-6">
            <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Modifier un employé</h3>
        
        {/* Formulaire */}
        <form onSubmit={(e) => { e.preventDefault(); handleEditEmployeeSubmit(); }}>
          <div className="space-y-4 mb-6">
            {/* Nom */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="edit-name"
                value={editedEmployee.name || ''}
                onChange={(e) => setEditedEmployee({...editedEmployee, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Prénom Nom"
                required
              />
            </div>
            
            {/* Poste */}
            <div>
              <label htmlFor="edit-position" className="block text-sm font-medium text-gray-700 mb-1">Poste <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="edit-position"
                value={editedEmployee.position || ''}
                onChange={(e) => setEditedEmployee({...editedEmployee, position: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Développeur, Designer, etc."
                required
              />
            </div>
            
            {/* Département */}
            <div>
              <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700 mb-1">Département <span className="text-red-500">*</span></label>
              <select
                id="edit-department"
                value={editedEmployee.department || ''}
                onChange={(e) => setEditedEmployee({...editedEmployee, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="" disabled>Sélectionnez un département</option>
                <option value="IT">IT</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
                <option value="RH">RH</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            
            {/* Statut */}
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <div className="flex space-x-4">
                {['Actif', 'En congé', 'Absent'].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="radio"
                      name="edit-status"
                      value={status}
                      checked={editedEmployee.status === status}
                      onChange={() => setEditedEmployee({...editedEmployee, status: status as 'Actif' | 'En congé' | 'Absent'})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Date d'embauche */}
            <div>
              <label htmlFor="edit-joinDate" className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
              <input
                type="date"
                id="edit-joinDate"
                value={editedEmployee.joinDate || ''}
                onChange={(e) => setEditedEmployee({...editedEmployee, joinDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Taux de performance */}
            <div>
              <label htmlFor="edit-performance" className="block text-sm font-medium text-gray-700 mb-1">
                Performance <span className="text-gray-400 text-xs">({editedEmployee.performanceRating || 0}%)</span>
              </label>
              <input
                type="range"
                id="edit-performance"
                min="0"
                max="100"
                value={editedEmployee.performanceRating || 0}
                onChange={(e) => setEditedEmployee({...editedEmployee, performanceRating: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="edit-email"
                value={editedEmployee.email || ''}
                onChange={(e) => setEditedEmployee({...editedEmployee, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="email@exemple.com"
              />
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-all"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
)}

      {/* Modal de visualisation d'employé */}
{isModalOpen && modalType === 'view' && selectedEmployee && (
  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <div className="p-6">
      {/* Background décoratif avec dégradé */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-purple-900"></div>
      
      {/* Contenu du profil */}
      <div className="relative">
        {/* Avatar amélioré */}
        <div className="flex justify-center">
          <div className="relative mt-4 mb-6">
            <div className="h-28 w-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
              {selectedEmployee.name.split(' ').map(name => name[0]).join('')}
            </div>
            <div className={`absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white ${getStatusColor(selectedEmployee.status)}`}></div>
          </div>
        </div>
        
        {/* Nom et position */}
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-1">{selectedEmployee.name}</h3>
        <p className="text-gray-500 text-center mb-6">{selectedEmployee.position}</p>
        
        {/* Cartes d'information avec effet de hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:scale-105 hover:bg-blue-50">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Département</h4>
            <p className="text-gray-900 font-semibold">{selectedEmployee.department}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:scale-105 hover:bg-blue-50">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedEmployee.status)} text-white`}>
              {selectedEmployee.status}
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:scale-105 hover:bg-blue-50">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'embauche</h4>
            <p className="text-gray-900 font-semibold">{new Date(selectedEmployee.joinDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:scale-105 hover:bg-blue-50">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Ancienneté</h4>
            <p className="text-gray-900 font-semibold">
              {Math.floor((new Date().getTime() - new Date(selectedEmployee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} mois
            </p>
          </div>
        </div>
        
        {/* Statistiques additionnelles avec barre de progression */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Performance</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Performance globale</span>
            <span>78%</span>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3">
          <Button 
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Fermer
          </Button>
          <Button 
            onClick={() => {
              setIsModalOpen(false);
              handleEditEmployee(selectedEmployee.id);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </Button>
        </div>
      </div>
    </div>
  </Modal>
)}
    </div>
  );
};

export default Dashboard;