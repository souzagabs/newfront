import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ModuloCurso() {
  const { cursoId, moduloId } = useParams();
  const navigate = useNavigate();

  const [modulo, setModulo] = useState(null);
  const [error, setError] = useState("");
  const [progresso, setProgresso] = useState(0); // Para mostrar o progresso do aluno
  const [completed, setCompleted] = useState(false); // Para controlar se o módulo foi concluído

  useEffect(() => {
    const fetchModulo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/modulos/${cursoId}/${moduloId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setModulo(response.data);
        // Verifica se o módulo já foi concluído
        const progressoAluno = await api.get(`/progresso/${cursoId}/${moduloId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgresso(progressoAluno.data.progresso);
        setCompleted(progressoAluno.data.completed);
      } catch (err) {
        setError("Erro ao carregar módulo.");
      }
    };

    fetchModulo();
  }, [cursoId, moduloId]);

  const handleComplete = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post(`/progresso/${cursoId}/${moduloId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompleted(true);
      // Navegar para o próximo módulo (ou próxima página do curso)
      navigate(`/curso/${cursoId}/modulo/${parseInt(moduloId) + 1}`);
    } catch (err) {
      setError("Erro ao marcar o módulo como completo.");
    }
  };

  // Função para navegar ao próximo módulo
  const handleNextModulo = () => {
    const nextModuloId = parseInt(moduloId) + 1; // Próximo módulo
    if (modulo && modulo.cursoId) {
      // Se houver mais módulos, vai para o próximo
      if (modulo.cursoId && modulo.modulos.length > nextModuloId) {
        navigate(`/curso/${cursoId}/modulo/${nextModuloId}`);
      } else {
        // Caso não haja próximo módulo, redirecionar para a página de conclusão ou outro destino
        navigate(`/curso/${cursoId}/conclusao`);
      }
    }
  };

  return (
    <div>
      <h1>{modulo?.titulo}</h1>
      <p>{modulo?.tipoConteudo}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {modulo?.tipoConteudo === "video" && (
          <video src={modulo.urlConteudo} controls />
        )}
        {modulo?.tipoConteudo === "texto" && (
          <p>{modulo?.urlConteudo}</p>
        )}
        {modulo?.tipoConteudo === "externo" && (
          <a href={modulo.urlConteudo} target="_blank" rel="noopener noreferrer">
            Acesse o conteúdo
          </a>
        )}
      </div>

      {!completed && (
        <button onClick={handleComplete}>Marcar como Completo</button>
      )}
      {completed && <p>Você já completou este módulo!</p>}
      
      <button onClick={handleNextModulo}>
        Próximo Módulo
      </button>
    </div>
  );
}

export default ModuloCurso;