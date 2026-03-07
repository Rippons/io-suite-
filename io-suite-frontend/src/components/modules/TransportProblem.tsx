import type { FC} from "react";
import { useState } from "react";
import { useSolver } from "../../hooks/useSolver";
import { api } from "../../services/api";
import LoadingState from "../ui/LoadingState";
import PythonTag from "../ui/PythonTag";
import StatBox from "../ui/StatBox";
import FormulaBox from "../ui/FormulaBox";

const TransportProblem: FC = () => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [supply, setSupply] = useState<number[]>([300, 400, 500]);
  const [demand, setDemand] = useState<number[]>([250, 350, 400]);
  const [costs,  setCosts]  = useState<number[][]>([[2,3,1],[5,4,8],[5,6,8]]);
  const [inputError, setInputError] = useState("");
  const { data, loading, error, run } = useSolver(api.transport);

  const updateSize = (newM: number, newN: number) => {
    setM(newM); setN(newN);
    setSupply(Array(newM).fill(100));
    setDemand(Array(newN).fill(100));
    setCosts(Array(newM).fill(null).map(() => Array(newN).fill(1)));
  };

  const updateCost = (i: number, j: number, v: string) => {
    const c = costs.map(r => [...r]);
    c[i][j] = Number(v) || 0;
    setCosts(c);
  };

  const solve = () => {
    const totalS = supply.reduce((a, b) => a + b, 0);
    const totalD = demand.reduce((a, b) => a + b, 0);
    if (totalS !== totalD) {
      setInputError(`Desequilibrado: Oferta (${totalS}) ≠ Demanda (${totalD})`);
      return;
    }
    setInputError("");
    run({ supply, demand, costs });
  };

  return (
    <div>
      <div className="section-title">Problema de Transporte</div>
      <div className="section-subtitle">// Esquina Noroeste + MODI resuelto en Python</div>

      <div className="card">
        <div className="card-title">Modelo</div>
        <FormulaBox>
          min  z = Σᵢ Σⱼ cᵢⱼ xᵢⱼ<br />
          s.t. Σⱼ xᵢⱼ = sᵢ &nbsp;(oferta origen i)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Σᵢ xᵢⱼ = dⱼ &nbsp;(demanda destino j)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xᵢⱼ ≥ 0
        </FormulaBox>
      </div>

      <div className="card">
        <div className="card-title">Configuración</div>
        {(inputError || error) && <div className="alert alert-warn">{inputError || error}</div>}

        <div className="flex-row" style={{ marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Orígenes (m)</label>
            <select value={m} onChange={e => updateSize(Number(e.target.value), n)} style={{ marginBottom: 0 }}>
              {[2,3,4,5].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Destinos (n)</label>
            <select value={n} onChange={e => updateSize(m, Number(e.target.value))} style={{ marginBottom: 0 }}>
              {[2,3,4,5].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <label>Ofertas</label>
        <div className="flex-row" style={{ marginBottom: 16 }}>
          {supply.map((v, i) => (
            <input key={i} type="number" value={v} style={{ flex: 1, marginBottom: 0 }}
              onChange={e => { const s = [...supply]; s[i] = Number(e.target.value); setSupply(s); }} />
          ))}
        </div>

        <label>Demandas</label>
        <div className="flex-row" style={{ marginBottom: 16 }}>
          {demand.map((v, j) => (
            <input key={j} type="number" value={v} style={{ flex: 1, marginBottom: 0 }}
              onChange={e => { const d = [...demand]; d[j] = Number(e.target.value); setDemand(d); }} />
          ))}
        </div>

        <label>Costos cᵢⱼ</label>
        <div style={{ display: "grid", gridTemplateColumns: `80px ${Array(n).fill("1fr").join(" ")}`, gap: 4, marginBottom: 16 }}>
          <div className="transport-cell header-cell" />
          {demand.map((d, j) => (
            <div key={j} className="transport-cell header-cell">
              D{j+1}<br /><span style={{ color: "#00d4ff" }}>{d}</span>
            </div>
          ))}
          {costs.map((row, i) => [
            <div key={`h${i}`} className="transport-cell header-cell">
              O{i+1}<br /><span style={{ color: "#00d4ff" }}>{supply[i]}</span>
            </div>,
            ...row.map((v, j) => (
              <div key={`${i}-${j}`} className="transport-cell">
                <input type="number" value={v}
                  style={{ padding: "4px", textAlign: "center", marginBottom: 0, border: "none", background: "transparent", color: "#c0d0f0", fontSize: 14 }}
                  onChange={e => updateCost(i, j, e.target.value)} />
              </div>
            )),
          ])}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={solve} disabled={loading}>
            {loading ? "Python calculando..." : "Resolver en Python"}
          </button>
          <button className="btn btn-secondary" onClick={() => {
            setM(3); setN(3);
            setSupply([300,400,500]); setDemand([250,350,400]);
            setCosts([[2,3,1],[5,4,8],[5,6,8]]);
          }}>
            Cargar Ejemplo
          </button>
        </div>
      </div>

      {loading && <div className="result-box"><LoadingState /></div>}

      {data && !loading && (
        <div className="result-box">
          <PythonTag />
          <div className="result-title">🚚 Solución — {data.method}</div>
          <div className="stat-row">
            <StatBox label="Costo Total" value={`$${data.total.toLocaleString()}`} />
            <StatBox label="Asignaciones" value={data.steps.length} small />
            <StatBox label="Método" value="NW Corner" small />
          </div>

          <hr className="divider" />
          <div className="card-title">Matriz de Asignaciones</div>
          <div style={{ display: "grid", gridTemplateColumns: `80px ${Array(n).fill("1fr").join(" ")} 80px`, gap: 4 }}>
            <div className="transport-cell header-cell" />
            {demand.map((_, j) => (
              <div key={j} className="transport-cell header-cell">
                D{j+1}<br /><span style={{ color: "#00d4ff", fontSize: 11 }}>{demand[j]}</span>
              </div>
            ))}
            <div className="transport-cell header-cell">Oferta</div>
            {data.alloc.map((row, i) => [
              <div key={`h${i}`} className="transport-cell header-cell">
                O{i+1}<br /><span style={{ color: "#00d4ff", fontSize: 11 }}>{supply[i]}</span>
              </div>,
              ...row.map((v, j) => (
                <div key={`${i}-${j}`} className={`transport-cell ${v > 0 ? "alloc-cell" : ""}`}>
                  <span className="cost-badge">{costs[i][j]}</span>
                  <span className="alloc-val">{v > 0 ? v : "—"}</span>
                </div>
              )),
              <div key={`s${i}`} className="transport-cell header-cell">{supply[i]}</div>,
            ])}
            <div className="transport-cell header-cell">Demanda</div>
            {demand.map((d, j) => <div key={j} className="transport-cell header-cell">{d}</div>)}
            <div className="transport-cell header-cell" style={{ color: "#00d4ff" }}>✓</div>
          </div>

          <hr className="divider" />
          <div className="card-title">Pasos — Esquina Noroeste</div>
          <div className="steps-list">
            {data.steps.map((s, i) => (
              <div className="step-item" key={i}>
                <div className="step-num">{i + 1}</div>
                <span>O{s.i+1} → D{s.j+1}: <strong style={{ color: "#5aaaf0" }}>{s.amount}</strong> unid.</span>
                <span style={{ marginLeft: "auto", color: "#dfaa4a" }}>c = {s.cost}</span>
                <span style={{ color: "#00d4ff" }}>subtotal = {s.subtotal}</span>
              </div>
            ))}
            <div className="step-item" style={{ borderTop: "1px solid #1e3a6a", paddingTop: 12, marginTop: 4 }}>
              <div className="step-num" style={{ background: "#0a2040", color: "#00d4ff" }}>∑</div>
              <strong style={{ color: "#e0f0ff" }}>Costo Total</strong>
              <span style={{ marginLeft: "auto", color: "#00d4ff", fontSize: 18, fontWeight: 700 }}>
                ${data.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportProblem;