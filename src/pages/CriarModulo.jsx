import { useState, useEffect } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function CreateModule() {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("video");
  const [urlConteudo, setUrlConteudo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cursoId) {
      setError("Erro: cursoId não informado.");
      console.error("cursoId está undefined!");
    }
  }, [cursoId]);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/modulos/${cursoId}`, 
        {
          titulo,
          tipoConteudo,
          urlConteudo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/curso/${cursoId}`);
    } catch (err) {
      console.error(err);
      setError(`Erro ao criar módulo: ${err.response?.data?.error || "Erro desconhecido"}`);
    }
  };

  return (
    <div>
      <h1>Criar Módulo</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!cursoId ? (
        <p>Curso não encontrado. Volte e tente novamente.</p>
      ) : (
        <form onSubmit={enviar}>
          <label>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

          <label>Tipo</label>
          <select
            value={tipoConteudo}
            onChange={(e) => setTipoConteudo(e.target.value)}
          >
            <option value="video">Vídeo</option>
            <option value="texto">Texto</option>
            <option value="externo">Link Externo</option>
          </select>

          <label>Link / Conteúdo</label>
          <input
            value={urlConteudo}
            onChange={(e) => setUrlConteudo(e.target.value)}
          />

          <button type="submit">Criar Módulo</button>
        </form>
      )}
    </div>
  );
}

export default CreateModule;