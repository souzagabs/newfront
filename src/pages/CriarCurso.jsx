import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/CriarCurso.css";

Modal.setAppElement("#root");

function CriarCurso() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");

  const [cursoCriado, setCursoCriado] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modulos, setModulos] = useState([]);

  const [tituloModulo, setTituloModulo] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("Vídeo");
  const [urlConteudo, setUrlConteudo] = useState("");

  const navigate = useNavigate();

  // Agora só abre o modal — NÃO cria curso ainda
  const handleSubmit = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  // Adiciona módulo somente ao array local
  const handleAdicionarModulo = () => {
    if (!tituloModulo || !urlConteudo) return;

    setModulos([
      ...modulos,
      { titulo: tituloModulo, tipoConteudo, urlConteudo },
    ]);

    setTituloModulo("");
    setUrlConteudo("");
  };

  // Este botão agora cria o curso + módulos
  const handleFinalizar = async () => {
    if (modulos.length === 0) {
      setError("Adicione pelo menos um módulo antes de finalizar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Cria curso
      const response = await api.post(
        "/cursos",
        { nome, descricao },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const novoCurso = response.data;
      setCursoCriado(novoCurso);

      for (const m of modulos) {
        await api.post(
          `/modulos/${novoCurso.id}`,
          {
            titulo: m.titulo,
            tipoConteudo: m.tipoConteudo,
            urlConteudo: m.urlConteudo,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setModalIsOpen(false);
      navigate("/meuscursos");
    } catch (err) {
      console.error("Erro ao finalizar criação:", err);
      setError("Erro ao finalizar criação do curso.");
    }
  };

  return (
    <div className="criar-curso-page">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-title"
      >
        Criar Curso
      </motion.h1>

      {error && <p className="error-text">{error}</p>}

      <form className="criar-curso-form" onSubmit={handleSubmit}>
        <label>Nome do Curso</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Anotações</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <button type="submit" className="primary-btn">
          Criar Curso
        </button>
      </form>

      {/* Modal */}
      <AnimatePresence>
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal-criar"
            overlayClassName="modal-overlay-criar"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2 className="modal-title">Adicionar Módulos</h2>

              <div className="modal-inputs">
                <label>Título do Módulo</label>
                <input
                  type="text"
                  value={tituloModulo}
                  onChange={(e) => setTituloModulo(e.target.value)}
                />

                <label>Tipo de Conteúdo</label>
                <select
                  value={tipoConteudo}
                  onChange={(e) => setTipoConteudo(e.target.value)}
                >
                  <option value="Vídeo">Vídeo</option>
                  <option value="Texto">Texto</option>
                </select>

                <label>URL do Conteúdo</label>
                <input
                  type="text"
                  value={urlConteudo}
                  onChange={(e) => setUrlConteudo(e.target.value)}
                />
              </div>
              <button className="primary-btn" onClick={handleAdicionarModulo}>
                Adicionar Módulo
              </button>

              <div className="modulos-lista-preview">
                {modulos.map((m, i) => (
                  <div key={i} className="modulo-preview">
                    <strong>{m.titulo}</strong> — {m.tipoConteudo}
                  </div>
                ))}
              </div>

              <button
                className="secondary-btn close-modal-btn"
                onClick={handleFinalizar}
              >
                Finalizar
              </button>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CriarCurso;