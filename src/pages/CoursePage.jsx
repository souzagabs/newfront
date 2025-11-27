import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

function CoursePage() {
  const [curso, setCurso] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function carregarCurso() {
      try {
        const response = await api.get(`/cursos/${id}`);
        setCurso(response.data);
      } catch (err) {
        console.error("Erro ao carregar curso", err);
      }
    }

    carregarCurso();
  }, [id]);

  return (
    <div className="course-container">
      {curso && (
        <>
          <h1>{curso.nome}</h1>
          <p>{curso.descricao}</p>
          <h2>Módulos:</h2>
          <ul>
            {curso.modulos.map((modulo) => (
              <li key={modulo.id}>
                <h3>{modulo.titulo}</h3>
                <p>{modulo.tipoConteudo}</p>
                <a href={modulo.urlConteudo} target="_blank" rel="noopener noreferrer">
                  Acessar Conteúdo
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CoursePage;