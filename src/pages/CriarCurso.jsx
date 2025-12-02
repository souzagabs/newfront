import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function CriarCurso() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");
  const [cursoCriado, setCursoCriado] = useState(null); // Curso criado
  const [modalIsOpen, setModalIsOpen] = useState(false); // Para abrir/fechar o modal de adicionar módulos
  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar que o formulário recarregue a página

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/cursos",
        { nome, descricao },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCursoCriado(response.data); 
      setModalIsOpen(true); // Abrir o modal de adicionar módulos
    } catch (err) {
      setError("Erro ao criar curso. Tente novamente.");
      console.error(err);
    }
  };

  const handleAdicionarModulo = async (titulo, tipoConteudo, urlConteudo) => {
    const token = localStorage.getItem("token");

    try {
      await api.post(
        `/modulos/${cursoCriado.id}`, // Endpoint para adicionar módulo ao curso
        { titulo, tipoConteudo, urlConteudo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModulos([...modulos, { titulo, tipoConteudo, urlConteudo }]);
    } catch (err) {
      console.error("Erro ao adicionar módulo:", err);
    }
  };

  return (
    <div className="create-course-container">
      <h1>Criar Curso</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Curso</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fundamentação Teórica</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <button type="submit">Criar Curso</button>
      </form>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Adicionar Módulos ao Curso</h2>
        <div>
          {/* Espaço de criação de formulário para adicionar módulos */}
          <div>
            <label>Título do Módulo</label>
            <input type="text" id="moduloTitulo" />
          </div>
          <div>
            <label>Tipo de Conteúdo</label>
            <select id="moduloTipoConteudo">
              <option value="Vídeo">Vídeo</option>
              <option value="Texto">Texto</option>
            </select>
          </div>
          <div>
            <label>URL do Conteúdo</label>
            <input type="text" id="moduloUrlConteudo" />
          </div>
          <button
            type="button"
            onClick={() => {
              const titulo = document.getElementById("moduloTitulo").value;
              const tipoConteudo = document.getElementById("moduloTipoConteudo").value;
              const urlConteudo = document.getElementById("moduloUrlConteudo").value;
              handleAdicionarModulo(titulo, tipoConteudo, urlConteudo);
            }}
          >
            Adicionar Módulo
          </button>
        </div>
        <button onClick={() => setModalIsOpen(false)}>Fechar</button>
      </Modal>
    </div>
  );
}

export default CriarCurso;