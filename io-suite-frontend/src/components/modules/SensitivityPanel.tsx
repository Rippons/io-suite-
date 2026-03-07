import type { FC } from "react";
import { useState } from "react";
import { useSolver } from "../../hooks/useSolver";
import { api } from "../../services/api";
import LoadingState from "../ui/LoadingState";
import PythonTag from "../ui/PythonTag";
import StatBox from "../ui/StatBox";
import FormulaBox from "../ui/FormulaBox";

const SensitivityPanel: FC = () => {
  const [cText, setCText] = useState("3 5");
  const [AText, setAText] = useState("1 0\n0 2\n3 2");
  const [bText, setBText] = useState("4 12 18");
  const { data, loading, error, run } = useSolver(api.sensitivity);

  const toList = (t: string) => t.trim().split(/[\s,;]+/).map(Number);
  const toMatrix = (t: string) => t.trim().split("\n").map(r => r.trim().split(/[\s,;]+/).map(Number));

  const solve = () => run({ c: toList(cText), A: toMatrix(AText), b: toList(bText) });
  const fmt = (v: number | null) => {
    if (v === null || v === undefined) return "∞";
    if (!Number.isFinite(v)) return "∞";
    return Number(v).toFixed(4);
  };

  const amplitude = (low: number | null, high: number | null) => {
    if (low === null || high === null) return "∞";
    return (high - low).toFixed(4);
  };
  return (
    <div>
      <div className="section-title">Análisis de Sensibilidad</div>
      <div className="section-subtitle">// Rangos de variación calculados en Python</div>

      <div className="card">
        <div className="card-title">¿Qué analiza?</div>
        <FormulaBox>
          Dado x* óptimo, ¿cuánto puede cambiar cⱼ sin que x* deje de ser óptimo?<br />
          ¿Cuánto puede cambiar bᵢ sin que la base óptima cambie?<br /><br />
          Coeficiente cⱼ: &nbsp; cⱼ + Δ ∈ [cⱼ - δ⁻, cⱼ + δ⁺]<br />
          RHS bᵢ: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bᵢ + Δ ∈ [bᵢ - θ⁻, bᵢ + θ⁺]
        </FormulaBox>
      </div>

      <div className="card">
        <div className="card-title">Datos</div>
        {error && <div className="alert alert-warn">{error}</div>}
        <div className="grid-2">
          <div>
            <label>Coeficientes objetivo c</label>
            <input value={cText} onChange={e => setCText(e.target.value)} />
            <label>RHS b</label>
            <input value={bText} onChange={e => setBText(e.target.value)} />
          </div>
          <div>
            <label>Matriz A</label>
            <textarea value={AText} onChange={e => setAText(e.target.value)} rows={5} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={solve} disabled={loading}>
          {loading ? "Calculando..." : "Analizar en Python"}
        </button>
      </div>

      {loading && <div className="result-box"><LoadingState /></div>}

      {data && !loading && data.status === "optimal" && (
        <div className="result-box">
          <PythonTag />
          <div className="result-title">📊 Análisis de Sensibilidad</div>
          <div className="stat-row">
            <StatBox label="z óptimo" value={data.obj_val} />
            {data.x.map((v, i) => <StatBox key={i} label={`x${i + 1}*`} value={v} small />)}
          </div>
          <hr className="divider" />
          <div className="card-title">Rangos — Coeficientes Objetivo</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Variable</th><th>c actual</th><th>x*</th><th>En base</th><th>Rango mín</th><th>Rango máx</th><th>Amplitud</th></tr>
              </thead>
              <tbody>
                {data.ranges.map((r, i) => (
                  <tr key={i}>
                    <td className="highlight">{r.var}</td>
                    <td>{r.current}</td>
                    <td>{r.x_val}</td>
                    <td><span className={`tag ${r.in_basis ? "tag-green" : "tag-orange"}`}>{r.in_basis ? "Sí" : "No"}</span></td>
                    <td>{fmt(r.range_low)}</td>
                    <td>{fmt(r.range_high)}</td>
                    <td>{amplitude(r.range_low, r.range_high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="divider" />
          <div className="card-title">Rangos — Lado Derecho (RHS)</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Restricción</th><th>b actual</th><th>b mínimo</th><th>b máximo</th><th>Precio sombra</th></tr>
              </thead>
              <tbody>
                {data.rhs_ranges.map((r, i) => (
                  <tr key={i}>
                    <td className="highlight">{r.constraint}</td>
                    <td>{r.current}</td>
                    <td>{fmt(r.range_low)}</td>
                    <td>{fmt(r.range_high)}</td>
                    <td style={{ color: "#dfaa4a" }}>{r.shadow_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensitivityPanel;