import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ModuloCurso() {
  const { cursoId, moduloId } = useParams();
  const navigate = useNavigate();

  const [modulo, setModulo] = useState(null);
  const [modulosCurso, setModulosCurso] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const modulosRes = await api.get(
          `/modulos/curso/${cursoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setModulosCurso(modulosRes.data);

        const m = modulosRes.data.find((x) => x.id == moduloId);
        if (!m) throw new Error("Módulo não encontrado");

        setModulo(m);

        // Carrega progresso
        const progressoRes = await api.get(
          `/progresso/${cursoId}/${moduloId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCompleted(progressoRes.data.completed ?? false);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId, moduloId]);

  // Concluir módulo
  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/progresso/${cursoId}/${moduloId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompleted(true);

      navigate(`/curso/${cursoId}/modulo/${parseInt(moduloId) + 1}`);
    } catch (err) {
      console.log(err);
    }
  };

  // ----- Renderiza conteúdo -----
  const renderConteudo = () => {
    const link = modulo.urlConteudo?.trim() || "";
    const tipo = modulo.tipoConteudo
      ?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (tipo === "video") {
      let embed = link;

      if (link.includes("youtube.com/live/")) {
        const id = link.split("youtube.com/live/")[1].split(/[?&]/)[0];
        embed = `https://www.youtube.com/embed/${id}`;
      } else if (link.includes("watch?v=")) {
        const id = link.split("v=")[1].split("&")[0];
        embed = `https://www.youtube.com/embed/${id}`;
      } else if (link.includes("youtu.be/")) {
        const id = link.split("youtu.be/")[1].split(/[?&]/)[0];
        embed = `https://www.youtube.com/embed/${id}`;
      }

      return (
        <iframe
          width="100%"
          height="480"
          src={embed}
          frameBorder="0"
          allowFullScreen
          style={{ borderRadius: "10px" }}
        ></iframe>
      );
    }

    if (tipo === "pdf") {
      let pdfLink = link;

      if (link.includes("drive.google.com/file")) {
        const id = link.split("/d/")[1]?.split("/")[0];
        pdfLink = `https://drive.google.com/file/d/${id}/preview`;
      }

      return (
        <iframe
          src={pdfLink}
          width="100%"
          height="600"
          style={{ borderRadius: "10px", border: "none" }}
        ></iframe>
      );
    }

    if (tipo === "texto") {
      return (
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
            lineHeight: 1.6
          }}
        >
          {link}
        </div>
      );
    }

    return <p>Conteúdo não suportado.</p>;
  };

  if (loading) return <p>Carregando...</p>;
  if (!modulo) return <p>Erro ao carregar módulo</p>;

  return (
    <div style={styles.page}>
      
      {/* SIDEBAR*/}
      <aside style={styles.sidebar}>
        <h3 style={{ padding: "15px" }}>Módulos</h3>
        {modulosCurso.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/curso/${cursoId}/modulo/${m.id}`)}
            style={{
              padding: "12px 15px",
              cursor: "pointer",
              background: m.id == moduloId ? "#ece0ff" : "transparent",
              borderLeft: m.id == moduloId ? "4px solid #673ab7" : "4px solid transparent"
            }}
          >
            ▶ {m.titulo}
          </div>
        ))}
      </aside>

      {/*CONTEÚDO */}
      <main style={styles.content}>
        <h1>{modulo.titulo}</h1>

        {renderConteudo()}

        {!completed ? (
          <button style={styles.button} onClick={handleComplete}>
            ✔ Marcar como concluído
          </button>
        ) : (
          <button
            style={styles.button}
            onClick={() =>
              navigate(`/curso/${cursoId}/modulo/${parseInt(moduloId) + 1}`)
            }
          >
            👉 Ir para o próximo módulo
          </button>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    background: "#f4f4f4",
    minHeight: "100vh", 
  },
  sidebar: {
    width: "280px",
    background: "white",
    borderRight: "1px solid #ddd",
    overflowY: "auto",     
    maxHeight: "100vh"     
  },
  content: {
    flex: 1,
    padding: "25px",
    overflow: "visible",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#673ab7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }
};


export default ModuloCurso;
