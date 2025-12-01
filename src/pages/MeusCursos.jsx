import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function MeusCursos() {
  const [cursos, setCursos] = useState([]);
  const [cursosCriados, setCursosCriados] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [modulosAbertos, setModulosAbertos] = useState({});

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

        const response = await api.get("/cursos/meuscursos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data)) {
          const cursosData = response.data;

          if (decodedToken.role === "INSTRUTOR") {
            const cursosDoInstrutor = cursosData.filter(
              (c) => c.instrutorId === decodedToken.id
            );
            setCursosCriados(cursosDoInstrutor);

            const cursosInscritos = cursosData.filter(
              (c) => c.instrutorId !== decodedToken.id
            );
            setCursos(cursosInscritos);
          } else if (decodedToken.role === "ALUNO") {
            const cursosInscritos = cursosData.filter((c) =>
              c.inscricoes?.some((i) => i.userId === decodedToken.id)
            );
            setCursos(cursosInscritos);
          }
        } else {
          setError("Não foi possível carregar os cursos.");
        }
      } catch (err) {
        console.error("Erro ao carregar cursos!", err);
        setError("Erro ao buscar cursos.");
      }
    };

    fetchCursos();
  }, []);

  const abrirModal = (curso) => {
    setCursoEditando({ ...curso });
    setModulosAbertos({});
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCursoEditando(null);
  };

  const atualizarCurso = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/cursos/${cursoEditando.id}`, cursoEditando, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCursosCriados((prev) =>
        prev.map((c) => (c.id === cursoEditando.id ? cursoEditando : c))
      );

      fecharModal();
    } catch (err) {
      console.error("Erro ao atualizar curso", err);
      setError("Erro ao salvar o curso.");
    }
  };

  const handleAdicionarModulo = () => {
    const novo = {
      id: Date.now(),
      titulo: "",
      descricao: "",
      videoUrl: ""
    };

    const modulosAtualizados = [...(cursoEditando.modulos || []), novo];

    setCursoEditando({
      ...cursoEditando,
      modulos: modulosAtualizados,
    });

    setModulosAbertos((prev) => ({
      ...prev,
      [novo.id]: true
    }));
  };

  const removerModulo = (id) => {
    setCursoEditando({
      ...cursoEditando,
      modulos: cursoEditando.modulos.filter((m) => m.id !== id),
    });
  };

  const toggleModulo = (id) => {
    setModulosAbertos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const excluirCurso = async (cursoId) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/cursos/${cursoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCursos(cursos.filter((c) => c.id !== cursoId));
      setCursosCriados(cursosCriados.filter((c) => c.id !== cursoId));
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
            <button onClick={() => navigate(`/curso/${curso.id}/modulo/1`)}>
              Ir para o Módulo
            </button>
          </div>
        ))
      ) : (
        <p>Você ainda não está inscrito em nenhum curso.</p>
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
                <button onClick={() => navigate(`/curso/${curso.id}`)}>
                  Ver Curso
                </button>
                <button onClick={() => abrirModal(curso)}>Editar</button>
                <button onClick={() => excluirCurso(curso.id)}>Excluir</button>
              </div>
            ))
          ) : (
            <p>Você ainda não criou nenhum curso.</p>
          )}
        </>
      )}

      {modalAberto && (
        <div style={styles.fundo}>
          <div style={styles.modal}>
            <h2>Editar Curso</h2>

            <label>Nome:</label>
            <input
              type="text"
              value={cursoEditando.nome}
              onChange={(e) =>
                setCursoEditando({ ...cursoEditando, nome: e.target.value })
              }
            />

            <label>Descrição:</label>
            <textarea
              value={cursoEditando.descricao}
              onChange={(e) =>
                setCursoEditando({ ...cursoEditando, descricao: e.target.value })
              }
            />

            <h3>Módulos</h3>

            {(cursoEditando.modulos || []).map((m) => (
              <div
                key={m.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleModulo(m.id)}
                >
                  <strong>{m.titulo || "Módulo sem título"}</strong>
                  <span>{modulosAbertos[m.id] ? "▲" : "▼"}</span>
                </div>

                {modulosAbertos[m.id] && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <label>Título do módulo:</label>
                    <input
                      value={m.titulo || ""}
                      onChange={(e) => {
                        const novos = cursoEditando.modulos.map((mod) =>
                          mod.id === m.id
                            ? { ...mod, titulo: e.target.value }
                            : mod
                        );
                        setCursoEditando({
                          ...cursoEditando,
                          modulos: novos,
                        });
                      }}
                    />

                    <label>Descrição:</label>
                    <textarea
                      value={m.descricao || ""}
                      onChange={(e) => {
                        const novos = cursoEditando.modulos.map((mod) =>
                          mod.id === m.id
                            ? { ...mod, descricao: e.target.value }
                            : mod
                        );
                        setCursoEditando({
                          ...cursoEditando,
                          modulos: novos,
                        });
                      }}
                    />

                    <label>Link do vídeo (YouTube):</label>
                    <input
                      value={m.videoUrl || ""}
                      onChange={(e) => {
                        const novos = cursoEditando.modulos.map((mod) =>
                          mod.id === m.id
                            ? { ...mod, videoUrl: e.target.value }
                            : mod
                        );
                        setCursoEditando({
                          ...cursoEditando,
                          modulos: novos,
                        });
                      }}
                    />

                    <button onClick={() => removerModulo(m.id)}>
                      Excluir módulo
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button onClick={handleAdicionarModulo}>+ Adicionar módulo</button>

            <div style={styles.actions}>
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={atualizarCurso}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  fundo: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    width: 480,
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  actions: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
};

export default MeusCursos;
