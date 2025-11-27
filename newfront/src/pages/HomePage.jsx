import { useEffect, useState } from "react";
import api from "../services/api";

function HomePage() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    async function carregarCursos() {
      try {
        const response = await api.get("/cursos");
        setCursos(response.data);
      } catch (err) {
        console.error("Erro ao carregar cursos", err);
      }
    }

    carregarCursos();
  }, []);

  return (
    <div>
      <h1>Cursos Disponíveis</h1>

      {cursos.map((curso) => (
        <div key={curso.id}>
          <h2>{curso.nome}</h2>
          <p>{curso.descricao}</p>
          <p>Instrutor: {curso.instrutor?.nome}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
