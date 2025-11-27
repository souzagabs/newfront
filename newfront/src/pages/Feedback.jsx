import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Feedback({ cursoId }) {
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/feedback/curso/${cursoId}`,
        { avaliacao, comentario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/home");
    } catch (err) {
      setError("Erro ao enviar feedback.");
      console.error(err);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Deixe seu feedback</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Avaliação (1 a 5)</label>
          <input
            type="number"
            value={avaliacao}
            onChange={(e) => setAvaliacao(e.target.value)}
            required
            min="1"
            max="5"
          />
        </div>
        <div>
          <label>Comentário</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
        <button type="submit">Enviar Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;