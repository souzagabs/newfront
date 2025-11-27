import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function CursoDetalhes() {
  const { cursoId } = useParams(); // Pega o id do curso da URL
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarCurso() {
      try {
        const response = await api.get(`/cursos/${cursoId}`);
        setCurso(response.data); 
      } catch (err) {
        console.error("Erro ao carregar curso!", err);
        setError("Erro ao carregar curso.");
      }
    }

    if (cursoId) {
      carregarCurso();  // Chama a função para carregar o curso se o ID estiver presente
    }
  }, [cursoId]);

  if (error) {
    return <div>{error}</div>;  
  }

  if (!curso) {
    return <div>Carregando...</div>; 
  }

  return (
    <div>
      <h1>{curso.nome}</h1>
      <p>{curso.descricao}</p>
      <p>Instrutor: {curso.instrutor?.nome}</p>
      <h2>Modulos:</h2>
      <ul>
        {curso.modulos?.map((modulo) => (
          <li key={modulo.id}>{modulo.titulo}</li>
        ))}
      </ul>

      <button>Inscrever-se</button>
    </div>
  );
}

export default CursoDetalhes;
