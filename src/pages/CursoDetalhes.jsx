import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

function CursoDetalhes() {
  const { cursoId } = useParams();  // Obtém o ID do curso da URL
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState("");  // Para mostrar erros, se houver
  const [message, setMessage] = useState("");  // Para mostrar mensagens de sucesso ou erro
  const [isSubscribed, setIsSubscribed] = useState(false); // Estado para verificar se já se inscreveu
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento

  // Função para carregar os detalhes do curso
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

  // Função para inscrever o usuário no curso
  const inscreverCurso = async () => {
    if (isSubscribed) {
      setMessage("Você já está inscrito neste curso.");
      return; // Impede nova inscrição
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    // Decodificando o token para pegar o usuarioId
    const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decodificando o JWT
    const usuarioId = decodedToken.id;  // Pegando o id do usuário decodificado

    // Convertendo o cursoId para inteiro
    const cursoIdInt = parseInt(cursoId, 10);  // Garantindo que cursoId seja um número inteiro

    console.log("Enviando inscrição para o curso:", cursoIdInt, "com o usuário:", usuarioId);  // Logando os dados

    try {
      setLoading(true); // Inicia o carregamento ao tentar inscrever

      const response = await api.post(
        "/cursos/inscricoes",
        { usuarioId, cursoId: cursoIdInt },  // Enviando o cursoId como número inteiro
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessage("Inscrição realizada com sucesso!");  // Exibe mensagem de sucesso
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

  // Exibe erros
  if (error) {
    return <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;
  }

  // Exibe mensagem de carregamento enquanto os dados do curso não são carregados
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

      {/* Exibindo a mensagem de sucesso ou erro */}
      {message && <div style={{ color: 'green', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

      {/* Botão de inscrição */}
      <button onClick={inscreverCurso} disabled={isSubscribed || loading}>
        {loading ? "Carregando..." : isSubscribed ? "Você já está inscrito" : "Inscrever-se"}
      </button>
    </div>
  );
}

export default CursoDetalhes;