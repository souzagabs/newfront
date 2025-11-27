import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
  const [nome, setNome] = useState("");          // Nome do curso
  const [descricao, setDescricao] = useState(""); // Descrição do curso
  const [error, setError] = useState("");        // Para mensagens de erro
  const navigate = useNavigate();                // Para navegação após a criação do curso

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar que o formulário recarregue a página

    try {
      const token = localStorage.getItem("token"); // Pega o token do localStorage
      const response = await api.post(
        "/cursos", // Endpoint para criar o curso
        { nome, descricao },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no header
          },
        }
      );

      // Se tudo correr bem, redireciona o instrutor para a home
      navigate("/home");
    } catch (err) {
      setError("Erro ao criar curso. Tente novamente.");
      console.error(err);
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
          <label>Descrição do Curso</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <button type="submit">Criar Curso</button>
      </form>
    </div>
  );
}

export default CreateCourse;