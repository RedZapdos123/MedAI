import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MediGen from './pages/MediGen';
import CareChat from './pages/CareChat';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medigen" element={<MediGen />} />
        <Route path="/carechat" element={<CareChat />} />
      </Routes>
    </Router>
  );
}

export default App;
