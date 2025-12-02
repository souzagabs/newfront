import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import "../styles/MeusCursos.css";

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
            // Cursos criados pelo instrutor
            const cursosDoInstrutor = cursosData.filter(
              (c) => c.instrutorId === decodedToken.id
            );
            const cursosUnicos = cursosDoInstrutor.filter(
              (curso, index, self) =>
                index === self.findIndex((c) => c.id === curso.id)
            );
            setCursosCriados(cursosUnicos);

            // Cursos em que o instrutor está inscrito (não criados por ele)
            const cursosInscritos = cursosData.filter(
              (c) => c.instrutorId !== decodedToken.id
            );
            const cursosInscritosUnicos = cursosInscritos.filter(
              (curso, index, self) =>
                index === self.findIndex((c) => c.id === curso.id)
            );
            setCursos(cursosInscritosUnicos);
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
      // Atualiza o curso (nome e descrição)
      await api.put(
        `/cursos/${cursoEditando.id}`,
        {
          nome: cursoEditando.nome,
          descricao: cursoEditando.descricao,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atualiza os módulos em lote
      await api.put(
        `/modulos/lote/${cursoEditando.id}`,
        {
          modulos: cursoEditando.modulos,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atualiza localmente
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
      urlConteudo: "",
      tipoConteudo: "video",
    };

    const modulosAtualizados = [...(cursoEditando.modulos || []), novo];

    setCursoEditando({
      ...cursoEditando,
      modulos: modulosAtualizados,
    });

    setModulosAbertos((prev) => ({
      ...prev,
      [novo.id]: true,
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
    <div className="meus-cursos-page">
      <div className="meus-cursos-header">
        <h1>Meus Cursos</h1>
        {role === "INSTRUTOR" && (
          <button className="primary-btn" onClick={() => navigate("/criarcurso")}>
            Criar Curso
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="section">
        <h2 className="section-title">Cursos que você está inscrito</h2>

        {cursos.length > 0 ? (
          <div className="cursos-grid">
            <AnimatePresence>
              {cursos.map((curso) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  key={curso.id}
                  className="curso-card"
                >
                  <div className="curso-card-content" onClick={() => navigate(`/curso/${curso.id}`)}>
                    <h3 className="curso-title">{curso.nome}</h3>
                    <p className="curso-desc">{curso.descricao}</p>
                    <p className="curso-mods">Módulos: {curso.modulos ? curso.modulos.length : 0}</p>
                  </div>

                  <div className="curso-card-actions">
                    <button
                      className="ghost-btn"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const token = localStorage.getItem("token");
                          const res = await api.get(`/modulos/curso/${curso.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });

                          if (!res.data.length) {
                            return navigate(`/curso/${curso.id}`);
                          }

                          const primeiroModulo = res.data[0].id;
                          navigate(`/curso/${curso.id}/modulo/${primeiroModulo}`);
                        } catch (err) {
                          console.log("Erro ao carregar módulos:", err);
                          navigate(`/curso/${curso.id}`);
                        }
                      }}
                    >
                      Ir para o módulo
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="muted">Você ainda não está inscrito em nenhum curso.</p>
        )}
      </section>

      {role === "INSTRUTOR" && (
        <section className="section">
          <h2 className="section-title">Cursos criados por você</h2>

          {cursosCriados.length > 0 ? (
            <div className="cursos-grid">
              <AnimatePresence>
                {cursosCriados.map((curso) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    key={curso.id}
                    className="curso-card"
                  >
                    <div className="curso-card-content">
                      <h3 className="curso-title">{curso.nome}</h3>
                      <p className="curso-desc">{curso.descricao}</p>
                      <p className="curso-mods">Módulos: {curso.modulos ? curso.modulos.length : 0}</p>
                    </div>

                    <div className="curso-card-actions">
                      <button className="ghost-btn" onClick={() => navigate(`/curso/${curso.id}`)}>
                        Ver Curso
                      </button>
                      <button className="secondary-btn" onClick={() => abrirModal(curso)}>
                        Editar
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => {
                          if (window.confirm("Confirma exclusão deste curso?")) excluirCurso(curso.id);
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="muted">Você ainda não criou nenhum curso.</p>
          )}
        </section>
      )}

      {/* Modal de edição */}
      <AnimatePresence>
        {modalAberto && cursoEditando && (
          <motion.div
            className="modal-fundo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.98, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Editar Curso</h3>
                <button className="close-btn" onClick={fecharModal}>
                  ×
                </button>
              </div>

              <label className="label">Nome:</label>
              <input
                className="input"
                type="text"
                value={cursoEditando.nome}
                onChange={(e) => setCursoEditando({ ...cursoEditando, nome: e.target.value })}
              />

              <label className="label">Anotações</label>
              <textarea
                className="textarea"
                value={cursoEditando.descricao}
                onChange={(e) => setCursoEditando({ ...cursoEditando, descricao: e.target.value })}
              />

              <h4 className="sub-title">Módulos</h4>

              <div className="modulos-list">
                {(cursoEditando.modulos || []).map((m) => (
                  <div className="modulo-card" key={m.id}>
                    <div className="modulo-card-top" onClick={() => toggleModulo(m.id)}>
                      <strong>{m.titulo || "Módulo sem título"}</strong>
                      <span className="toggle-icon">{modulosAbertos[m.id] ? "▲" : "▼"}</span>
                    </div>

                    {modulosAbertos[m.id] && (
                      <div className="modulo-card-body">
                        <label className="label">Título do módulo:</label>
                        <input
                          className="input"
                          value={m.titulo || ""}
                          onChange={(e) => {
                            const novos = cursoEditando.modulos.map((mod) =>
                              mod.id === m.id ? { ...mod, titulo: e.target.value } : mod
                            );
                            setCursoEditando({ ...cursoEditando, modulos: novos });
                          }}
                        />

                        <label className="label">Link do vídeo (YouTube):</label>
                        <input
                          className="input"
                          value={m.urlConteudo || ""}
                          onChange={(e) => {
                            const novos = cursoEditando.modulos.map((mod) =>
                              mod.id === m.id
                                ? { ...mod, urlConteudo: e.target.value, tipoConteudo: mod.tipoConteudo || "video" }
                                : mod
                            );
                            setCursoEditando({ ...cursoEditando, modulos: novos });
                          }}
                        />

                        <div className="modulo-actions">
                          <button className="danger-btn" onClick={() => removerModulo(m.id)}>
                            Excluir módulo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-controls">
                <button className="ghost-btn" onClick={handleAdicionarModulo}>
                  + Adicionar módulo
                </button>

                <div className="modal-actions">
                  <button className="ghost-btn" onClick={fecharModal}>
                    Cancelar
                  </button>
                  <button className="primary-btn" onClick={atualizarCurso}>
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MeusCursos;
