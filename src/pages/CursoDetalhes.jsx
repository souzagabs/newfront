import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

function CursoDetalhes() {
  const { cursoId } = useParams(); 
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState("");  
  const [message, setMessage] = useState("");  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    async function carregarCurso() {
      try {
        const response = await api.get(`/cursos/${cursoId}`);
        setCurso(response.data);  // Armazena os dados do curso
      } catch (err) {
        console.error("Erro ao carregar curso!", err);
        setError("Erro ao carregar curso.");
      }
    }

    if (cursoId) {
      carregarCurso();  // Chama a função para carregar o curso se o cursoId estiver presente
    }
  }, [cursoId]);

  const inscreverCurso = async () => {
    if (isSubscribed) {
      setMessage("Você já está inscrito neste curso.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const usuarioId = decodedToken.id;

    const cursoIdInt = parseInt(cursoId, 10); 

    console.log("Enviando inscrição para o curso:", cursoIdInt, "com o usuário:", usuarioId); 

    try {
      setLoading(true); // Inicia o carregamento ao tentar inscrever

      const response = await api.post(
        "/cursos/inscricoes",
        { usuarioId, cursoId: cursoIdInt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessage("Inscrição realizada com sucesso!");
        setIsSubscribed(true); // Marca o usuário como inscrito
      } else {
        setMessage(`Erro inesperado. Código de status: ${response.status}`);
      }
    } catch (err) {
      console.error("Erro ao inscrever-se no curso:", err);
      setError("Erro ao inscrever-se no curso.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  if (error) {
    return <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;
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

      {message && <div style={{ color: 'green', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

      <button onClick={inscreverCurso} disabled={isSubscribed || loading}>
        {loading ? "Carregando..." : isSubscribed ? "Você já está inscrito" : "Inscrever-se"}
      </button>
    </div>
  );
}

export default CursoDetalhes;