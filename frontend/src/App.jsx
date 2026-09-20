import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Overview from './pages/Overview';
import Cases from './pages/Cases';
import NewCase from './pages/NewCase';
import CaseDetail from './pages/CaseDetail';
import Rules from './pages/Rules';
import Help from './pages/Help';
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './pages/Analytics';
// ...

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
      <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
      <Route path="/cases/new" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
      <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
      <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;