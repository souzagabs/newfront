import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* LOGO / NOME */}
        <div className="footer-section">
          <h2 className="footer-logo">NeoAcademy</h2>
          <p className="footer-description">
            Plataforma moderna de aprendizado, feita para acelerar o seu futuro.
          </p>
        </div>

        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/meuscursos">Meus Cursos</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <p>📧 neoacad3demy@gmail.com</p>
        </div>
      </div>

      {/* AVISO INSTITUCIONAL */}
      <div className="footer-warning">
        <p>
          A NeoAcademy não hospeda nem distribui conteúdo de terceiros.  
          Materiais dos cursos são responsabilidade exclusiva de seus instrutores.  
          Consulte nossa <Link to="/politica-de-direitos-autorais">Política de Direitos Autorais</Link>
        </p>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NeoAcademy — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;