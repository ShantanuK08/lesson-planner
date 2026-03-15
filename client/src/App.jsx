import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LessonEditor from './pages/LessonEditor';
import LessonDetail from './pages/LessonDetail';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/lessons/new" element={
          <ProtectedRoute>
            <LessonEditor />
          </ProtectedRoute>
        } />
        <Route path="/lessons/:id" element={
          <ProtectedRoute>
            <LessonEditor />
          </ProtectedRoute>
        } />
        <Route path="/lessons/:id/view" element={
          <ProtectedRoute>
            <LessonDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}