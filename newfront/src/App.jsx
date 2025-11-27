import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import CreateCourse from './pages/CriarCurso';
import CreateModule from './pages/CriarModulo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />

        <Route path="/criarcurso" element={<CreateCourse />} />
        <Route path="/criar-modulo/:cursoId" element={<CreateModule />} />
      </Routes>
    </Router>
  );
}

export default App;
