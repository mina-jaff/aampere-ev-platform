import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import VehicleList from './components/vehicles/VehicleList';
import VehicleDetail from './components/vehicles/VehicleDetail';

function App() {
  return (
    <div className="App">
      <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </main>
      </Router>
    </div>
  );
}

export default App;
