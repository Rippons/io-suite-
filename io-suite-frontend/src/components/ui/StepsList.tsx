import type { FC } from "react";
import type { SimplexStep } from "../../types";

interface StepsListProps {
  steps: SimplexStep[];
}

const StepsList: FC<StepsListProps> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="alert alert-success">
        ✓ Solución óptima desde la base inicial — 0 iteraciones necesarias
      </div>
    );
  }

  return (
    <div className="steps-list">
      {steps.map((s) => (
        <div className="step-item" key={s.iter}>
          <div className="step-num">{s.iter + 1}</div>
          <span>
            Entra C<strong style={{ color: "#5aaaf0" }}>{s.pivot_col + 1}</strong>
            , sale R<strong style={{ color: "#5aaaf0" }}>{s.pivot_row + 1}</strong>
          </span>
          <span style={{ marginLeft: "auto", color: "#00d4ff" }}>
            z = {s.obj_val}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepsList;