import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CursoDetalhes.css";

function CursoDetalhes() {
  const { cursoId } = useParams(); 
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState("");  
  const [message, setMessage] = useState("");  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate(); 

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
      carregarCurso(); 
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

    try {
      setLoading(true); 

      const response = await api.post(
        "/cursos/inscricoes",
        { usuarioId, cursoId: cursoIdInt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setMessage("Inscrição realizada com sucesso!");
        setIsSubscribed(true);

        const modulosResponse = await api.get(`/modulos/curso/${cursoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (modulosResponse.data.length > 0) {
          const primeiroModuloId = modulosResponse.data[0].id;
          navigate(`/curso/${cursoId}/modulo/${primeiroModuloId}`);
        } else {
          navigate(`/curso/${cursoId}`);
        }
      } else {
        setMessage(`Erro inesperado. Código de status: ${response.status}`);
      }
    } catch (err) {
      console.error("Erro ao inscrever-se no curso:", err);
      setError("Você já se inscreveu.");
    } finally {
      setLoading(false); 
    }
  };

  if (error) return <div className="error">{error}</div>;

  if (!curso) return <div>Carregando...</div>;

  return (
    <div className="curso-detalhes">
      <div className="curso-header">
        <h1>{curso.nome}</h1>
        <p className="descricao">{curso.descricao}</p>
        <p><strong>Instrutor:</strong> {curso.instrutor?.nome}</p>
      </div>

      <div className="modulos-container">
        <h2>Modulos:</h2>
        <ul>
          {curso.modulos?.map((modulo) => (
            <li key={modulo.id} className="modulo-item">{modulo.titulo}</li>
          ))}
        </ul>
      </div>

      {message && <div className="message">{message}</div>}

      <button 
        className="inscrever-btn"
        onClick={() => {
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/login"); 
          } else {
            inscreverCurso();
          }
        }}
        disabled={isSubscribed || loading}
      >
        {loading ? "Carregando..." : isSubscribed ? "Você já está inscrito" : "Inscrever-se"}
      </button>
    </div>
  );
}

export default CursoDetalhes;
