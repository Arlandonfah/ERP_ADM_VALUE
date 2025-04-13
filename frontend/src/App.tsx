import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeList from './pages/EmployeeList';
import Dashboard from './pages/Dashboard';
//import ProtectedRoute from './utils/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
            
          }
        />
        <Route
          path="/employees"
          element={
            
              <EmployeeList />
           
          }
        />
      </Routes>
    </Router>
  );
};

export default App;