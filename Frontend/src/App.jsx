import './App.css';
import { useAuthContext } from './context/AuthContext';
import Home from './pages/home/home';
import Login from './pages/login/login';
import SignUp from './pages/signup/signUp';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { authUser } = useAuthContext();
  console.log("Auth User in App.jsx:", authUser);
  return (
    <div className="p-4 h-screen flex justify-center items-center">
      <Routes>
        <Route path="/" element={authUser ? <Home/>  : <Navigate to={"Login"}/>} />
        <Route path="/login" element={authUser ? <Navigate to='/' /> :<Login />} />
        <Route path="/signup" element={authUser ? <Navigate to='/' /> :<SignUp />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
