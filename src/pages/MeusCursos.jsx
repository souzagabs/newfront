import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function MeusCursos() {
  const [cursos, setCursos] = useState([]); // Cursos em que o usuário está inscrito
  const [cursosCriados, setCursosCriados] = useState([]); // Cursos criados pelo instrutor
  const [error, setError] = useState("");
  const [role, setRole] = useState(""); // Armazenar o papel do usuário
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token de autenticação não encontrado!");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setRole(decodedToken.role);

        console.log("Fazendo requisição para /cursos/meuscursos com token:", token);

        const response = await api.get("/cursos/meuscursos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Resposta da API - Meus Cursos:", response.data);

        if (response.data && Array.isArray(response.data)) {
          if (decodedToken.role === "INSTRUTOR") {
            // Cursos criados pelo instrutor
            const cursosDoInstrutor = response.data.filter((curso) => curso.instrutorId === decodedToken.id);
            setCursosCriados(cursosDoInstrutor);

            // Cursos em que o instrutor se inscreveu
            const cursosInscritos = response.data.filter((curso) => curso.instrutorId !== decodedToken.id);
            setCursos(cursosInscritos);
          } else if (decodedToken.role === "ALUNO") {
            // Alunos só têm acesso aos cursos que estão inscritos
            const cursosInscritos = response.data.filter((curso) => curso.inscricoes.some((inscricao) => inscricao.userId === decodedToken.id));
            setCursos(cursosInscritos);
          }
        } else {
          setError("Não foi possível carregar os cursos.");
        }

      } catch (err) {
        console.error("Erro ao carregar cursos!", err);
        setError("Erro ao carregar cursos.");
      }
    };

    fetchCursos();
  }, []);

  const excluirCurso = async (cursoId) => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/cursos/${cursoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCursos(cursos.filter((curso) => curso.id !== cursoId));
      setCursosCriados(cursosCriados.filter((curso) => curso.id !== cursoId));
    } catch (err) {
      console.error("Erro ao excluir curso", err);
      setError("Erro ao excluir o curso.");
    }
  };

  return (
    <div>
      <h1>Meus Cursos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {role === "INSTRUTOR" && (
        <button onClick={() => navigate("/criarcurso")}>Criar Curso</button>
      )}

      <h2>Cursos que você está inscrito</h2>
      {cursos.length > 0 ? (
        cursos.map((curso) => (
          <div key={curso.id}>
            <h3>{curso.nome}</h3>
            <p>{curso.descricao}</p>
            <p>Modulos: {curso.modulos ? curso.modulos.length : 0}</p>
            <button onClick={() => navigate(`/meuscursos/${curso.id}`)}>Ver curso</button>
          </div>
        ))
      ) : (
        <p>Você ainda não se inscreveu em nenhum curso.</p>
      )}

      {role === "INSTRUTOR" && (
        <>
          <h2>Cursos Criados por Você</h2>
          {cursosCriados.length > 0 ? (
            cursosCriados.map((curso) => (
              <div key={curso.id}>
                <h3>{curso.nome}</h3>
                <p>{curso.descricao}</p>
                <p>Modulos: {curso.modulos ? curso.modulos.length : 0}</p>
                <button onClick={() => navigate(`/meuscursos/${curso.id}`)}>Ver curso</button>
                <button onClick={() => excluirCurso(curso.id)}>Excluir</button>
              </div>
            ))
          ) : (
            <p>Você ainda não criou nenhum curso.</p>
          )}
        </>
      )}
    </div>
  );
}

export default MeusCursos;