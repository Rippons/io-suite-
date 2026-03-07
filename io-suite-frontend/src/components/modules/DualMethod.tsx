import type { FC } from "react";
import { useSolver } from "../../hooks/useSolver";
import { api } from "../../services/api";
import LoadingState from "../ui/LoadingState";
import PythonTag from "../ui/PythonTag";
import StatBox from "../ui/StatBox";
import FormulaBox from "../ui/FormulaBox";
import StepsList from "../ui/StepsList";
import { useState } from "react";

const DualMethod: FC = () => {
  const [cText, setCText] = useState("5 4");
  const [AText, setAText] = useState("6 4\n1 2\n-1 1");
  const [bText, setBText] = useState("24 6 1");
  const { data, loading, error, run } = useSolver(api.dual);

  const toList  = (t: string) => t.trim().split(/[\s,;]+/).map(Number);
  const toMatrix = (t: string) => t.trim().split("\n").map(r => r.trim().split(/[\s,;]+/).map(Number));

  const solve = () => run({ c: toList(cText), A: toMatrix(AText), b: toList(bText) });

  return (
    <div>
      <div className="section-title">Método de Dualidad</div>
      <div className="section-subtitle">// max cᵀx s.t. Ax ≤ b  ↔  min bᵀy s.t. Aᵀy ≥ c</div>

      <div className="card">
        <div className="card-title">Teoría</div>
        <FormulaBox>
          PRIMAL: max z = cᵀx &nbsp;&nbsp; s.t. Ax ≤ b, x ≥ 0<br />
          DUAL:   min w = bᵀy &nbsp;&nbsp; s.t. Aᵀy ≥ c, y ≥ 0<br /><br />
          Dualidad Fuerte: z* = w* &nbsp;|&nbsp; Holgura Complementaria: xⱼ·(cᵀ - yᵀA)ⱼ = 0
        </FormulaBox>
      </div>

      <div className="card">
        <div className="card-title">Datos del Problema Primal</div>
        {error && <div className="alert alert-warn">{error}</div>}
        <div className="grid-2">
          <div>
            <label>Función Objetivo c</label>
            <input value={cText} onChange={e => setCText(e.target.value)} placeholder="ej: 5 4" />
            <div className="help-text">Separados por espacio</div>
            <label>Vector b (RHS)</label>
            <input value={bText} onChange={e => setBText(e.target.value)} placeholder="ej: 24 6 1" />
          </div>
          <div>
            <label>Matriz A</label>
            <textarea value={AText} onChange={e => setAText(e.target.value)} rows={5} />
            <div className="help-text">Una fila por línea</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={solve} disabled={loading}>
          {loading ? "Calculando..." : "Resolver en Python ↔"}
        </button>
      </div>

      {loading && <div className="result-box"><LoadingState /></div>}

      {data && !loading && (
        <div className="result-box">
          <PythonTag />
          <div className="result-title">⟺ Solución Primal-Dual</div>
          {data.status === "optimal" ? (
            <>
              <div className="stat-row">
                <StatBox label="z* = w*" value={data.obj_val} />
                {data.x.map((v, i) => <StatBox key={i} label={`x${i + 1}`} value={v} small />)}
              </div>
              <hr className="divider" />
              <div className="card-title">Función Dual</div>
              <FormulaBox>
                min w = {data.dual_formula}<br />
                s.t. Aᵀy ≥ c,  y ≥ 0<br /><br />
                ✓ {data.dual_note}
              </FormulaBox>
              <hr className="divider" />
              <div className="card-title">Iteraciones (Python)</div>
              <StepsList steps={data.steps} />
              <div className="alert alert-success" style={{ marginTop: 16 }}>
                ✓ Dualidad Fuerte verificada: z* = w* = {data.obj_val}
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

export default DualMethod;