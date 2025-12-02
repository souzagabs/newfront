import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import CreateCourse from './pages/CriarCurso';
import MeusCursos from './pages/MeusCursos';
import CursoDetalhes from './pages/CursoDetalhes';
import ModuloCurso from './pages/ModuloCurso';
import Header from "./components/Header";
import Footer from "./components/Footer";
import PoliticaDireitosAutorais from './pages/PoliticaDireitosAutorais';

function App() {
  return (
    <Router>
        <Header />
      <Routes>
       
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/politica-de-direitos-autorais" element={<PoliticaDireitosAutorais />} />
        <Route path="/criarcurso" element={<CreateCourse />} />
        <Route path="/meuscursos" element={<MeusCursos />} />
        <Route path="/curso/:cursoId" element={<CursoDetalhes />} />
        <Route path="/cursos/meuscursos" element={<MeusCursos />} />
        <Route path="/curso/:cursoId/modulo/:moduloId" element={<ModuloCurso />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;