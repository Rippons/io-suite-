import type { FC } from "react";
import type { HomeCardData, TabId } from "../../types";

interface HomeProps {
  onNavigate: (id: TabId) => void;
}

const CARDS: HomeCardData[] = [
  { id: "dual",        icon: "⟺", title: "Método de Dualidad",      desc: "Transforma el primal en su dual y verifica el Teorema de Dualidad Fuerte.",                    tag: "LP · Dualidad"   },
  { id: "sensitivity", icon: "📊", title: "Análisis de Sensibilidad", desc: "Rangos de variación de coeficientes objetivo y RHS sin cambiar la base óptima.",             tag: "Post-Óptimo"     },
  { id: "simplex",     icon: "∇",  title: "Simplex Revisado",         desc: "Algoritmo simplex completo con pivoteo matricial ejecutado paso a paso en Python.",          tag: "Álgebra Matricial"},
  { id: "transport",   icon: "🚚", title: "Problema de Transporte",   desc: "Esquina Noroeste + variables MODI para precios sombra, resuelto en Python.",                  tag: "Redes · Flujo"   },
];

const Home: FC<HomeProps> = ({ onNavigate }) => (
  <div>
    <div className="section-title">Investigación de Operaciones</div>
    <div className="section-subtitle">// Frontend React · Backend Python · v1.0</div>

    <div className="alert alert-info" style={{ marginBottom: 16 }}>
      <strong>Arquitectura:</strong> Interfaz en React + TypeScript. Todos los cálculos
      de optimización se ejecutan en <strong>Python (FastAPI)</strong> en el backend.
    </div>
    <div className="alert alert-python" style={{ marginBottom: 24 }}>
      🐍 Motor matemático: <strong>Python</strong> — Simplex, Dualidad, Sensibilidad y
      Transporte implementados desde cero con numpy.
    </div>

    <div className="home-grid">
      {CARDS.map((c) => (
        <div key={c.id} className="home-card" onClick={() => onNavigate(c.id)}>
          <div className="home-card-icon">{c.icon}</div>
          <div className="home-card-title">{c.title}</div>
          <div className="home-card-desc">{c.desc}</div>
          <div className="home-card-tag">
            <span className="pill">{c.tag}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Home;