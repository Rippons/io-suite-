import type { FC} from "react";
import { useState } from "react";
import { useSolver } from "../../hooks/useSolver";
import { api } from "../../services/api";
import LoadingState from "../ui/LoadingState";
import PythonTag from "../ui/PythonTag";
import StatBox from "../ui/StatBox";
import FormulaBox from "../ui/FormulaBox";
import StepsList from "../ui/StepsList";

const SimplexRevised: FC = () => {
  const [cText, setCText] = useState("2 3 0 0");
  const [AText, setAText] = useState("1 1 1 0\n2 1 0 1");
  const [bText, setBText] = useState("4 6");
  const { data, loading, error, run } = useSolver(api.simplex);

  const toList   = (t: string) => t.trim().split(/[\s,;]+/).map(Number);
  const toMatrix = (t: string) => t.trim().split("\n").map(r => r.trim().split(/[\s,;]+/).map(Number));

  const solve = () => run({ c: toList(cText), A: toMatrix(AText), b: toList(bText) });

  const numVars        = cText.trim().split(/[\s,;]+/).length;
  const numConstraints = AText.trim().split("\n").length;

  return (
    <div>
      <div className="section-title">Simplex Revisado</div>
      <div className="section-subtitle">// Motor de pivoteo ejecutado en Python</div>

      <div className="card">
        <div className="card-title">Algoritmo</div>
        <FormulaBox>
          1. Base inicial B = I (variables de holgura)<br />
          2. c̄ⱼ = cⱼ - cᴮ·B⁻¹·aⱼ &nbsp;→&nbsp; si c̄ⱼ ≥ 0 ∀j: ÓPTIMO<br />
          3. Columna entrante: min c̄ⱼ &lt; 0<br />
          4. Ratio test: θ* = min&#123; bᵢ/yᵢ : yᵢ &gt; 0 &#125;<br />
          5. Actualizar base y tableau → repetir
        </FormulaBox>
      </div>

      <div className="card">
        <div className="card-title">Datos</div>
        {error && <div className="alert alert-warn">{error}</div>}
        <div className="alert alert-info">
          Incluye columnas de identidad para las variables de holgura.<br />
          Ej: x₁+x₂ ≤ 4, 2x₁+x₂ ≤ 6 → A = [[1,1,1,0],[2,1,0,1]], c = [2,3,0,0]
        </div>
        <div className="grid-2">
          <div>
            <label>Coeficientes c (con ceros para slack)</label>
            <input value={cText} onChange={e => setCText(e.target.value)} />
            <label>RHS b</label>
            <input value={bText} onChange={e => setBText(e.target.value)} />
          </div>
          <div>
            <label>Matriz A (con columnas I para slack)</label>
            <textarea value={AText} onChange={e => setAText(e.target.value)} rows={5} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={solve} disabled={loading}>
          {loading ? "Python calculando..." : "Ejecutar Simplex"}
        </button>
      </div>

      {loading && <div className="result-box"><LoadingState /></div>}

      {data && !loading && (
        <div className="result-box">
          <PythonTag />
          <div className="result-title">∇ Solución Simplex Revisado</div>
          {data.status === "optimal" ? (
            <>
              <div className="stat-row">
                <StatBox label="z* óptimo" value={data.obj_val} />
                {data.x.map((v, i) => (
                  <StatBox
                    key={i}
                    label={i < numVars - numConstraints ? `x${i + 1}` : `s${i - (numVars - numConstraints - 1)}`}
                    value={v}
                    small
                  />
                ))}
              </div>
              <hr className="divider" />
              <div className="card-title">Iteraciones (Python)</div>
              <StepsList steps={data.steps} />
              <hr className="divider" />
              <div className="card-title">Tabla Final</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Base</th>
                      {data.x.map((_, j) => <th key={j}>C{j + 1}</th>)}
                      <th style={{ color: "#00d4ff" }}>b</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableau.map((row, i) => (
                      <tr key={i}>
                        <td className="highlight">B{data.basis[i] + 1}</td>
                        {row.slice(0, data.x.length).map((v, j) => <td key={j}>{v}</td>)}
                        <td className="highlight">{row[data.x.length]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="alert alert-warn">Estado Python: {data.status}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimplexRevised;