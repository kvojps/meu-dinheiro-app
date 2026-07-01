import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Configuracao from './pages/Configuracao';
import MonthDetail from './pages/MonthDetail';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/configuracao" element={<Configuracao />} />
        <Route path="/meses/:id" element={<MonthDetail />} />
      </Routes>
    </Layout>
  );
}
