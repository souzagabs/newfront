import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* LOGO / NOME */}
        <div className="footer-section">
          <h2 className="footer-logo">NeonLearn</h2>
          <p className="footer-description">
            Plataforma moderna de aprendizado, feita para acelerar o seu futuro.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/meuscursos">Meus Cursos</a></li>
            <li><a href="/criarcurso">Criar Curso</a></li>
            <li><a href="/login">Entrar</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <p>📧 suporte@neonlearn.com</p>
          <p>🌐 www.neonlearn.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NeonLearn — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;