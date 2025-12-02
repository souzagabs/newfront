import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ModuloCurso() {
  const { cursoId, moduloId } = useParams();
  const navigate = useNavigate();

  const [modulo, setModulo] = useState(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const moduloRes = await api.get(
          `/modulos/curso/${cursoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("MODULOS DO CURSO:", moduloRes.data);

        const moduloEncontrado = moduloRes.data.find(
          (m) => m.id == moduloId
        );

        if (!moduloEncontrado) {
          throw new Error("Módulo não encontrado.");
        }

        setModulo(moduloEncontrado);

        // Busca progresso
        const progressoRes = await api.get(
          `/progresso/${cursoId}/${moduloId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setCompleted(progressoRes.data.completed ?? false);

      } catch (err) {
        console.log(err);
        setError("Erro ao carregar o módulo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId, moduloId]);

  //Marca como concluído
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
      setError("Erro ao marcar como concluído.");
    }
  };

  if (loading) return <p>Carregando módulo...</p>;
  if (!modulo) return <p>Erro ao carregar conteúdo.</p>;

  const renderConteudo = () => {
    const link = modulo.urlConteudo?.trim() || "";
    const tipo = modulo.tipoConteudo
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (tipo === "video") {
      let embed = link;

      if (link.includes("youtube.com/live/")) {
        const id = link.split("youtube.com/live/")[1].split(/[?&]/)[0];
        embed = `https://www.youtube.com/embed/${id}`;
      } else if (link.includes("youtube.com/watch?v=")) {
        const id = link.split("v=")[1].split("&")[0];
        embed = `https://www.youtube.com/embed/${id}`;
      } else if (link.includes("youtu.be/")) {
        const id = link.split("youtu.be/")[1].split(/[?&]/)[0];
        embed = `https://www.youtube.com/embed/${id}`;
      }

      return (
        <iframe
          width="100%"
          height="500"
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
          style={{ border: "none", borderRadius: "10px" }}
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
            lineHeight: "1.6",
            whiteSpace: "pre-wrap"
          }}
        >
          {link}
        </div>
      );
    }

    if (tipo === "externo") {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 15px",
            background: "#673ab7",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Abrir Conteúdo Externo
        </a>
      );
    }

    return <p>Tipo de conteúdo não suportado.</p>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{modulo.titulo}</h1>

        <div style={styles.conteudoArea}>{renderConteudo()}</div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!completed ? (
          <button style={styles.botao} onClick={handleComplete}>
            ✔ Marcar como concluído
          </button>
        ) : (
          <button
            style={styles.botao}
            onClick={() =>
              navigate(`/curso/${cursoId}/modulo/${parseInt(moduloId) + 1}`)
            }
          >
            👉 Ir para o próximo módulo
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    background: "#f2f2f2",
    minHeight: "100vh"
  },
  card: {
    width: "80%",
    background: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  title: {
    marginBottom: "20px"
  },
  conteudoArea: {
    marginBottom: "30px"
  },
  botao: {
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    background: "#673ab7",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default ModuloCurso;
