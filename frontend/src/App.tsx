import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import MonthDetail from './pages/MonthDetail';
import History from './pages/History';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/months/:id" element={<MonthDetail />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  );
}
