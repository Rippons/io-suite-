import numpy as np
from app.solvers.simplex_solver import simplex_solve

def dual_solve(c: list, A: list, b: list) -> dict:
    result = simplex_solve(c, A, b)

    if result["status"] != "optimal":
        return result

    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    c = np.array(c, dtype=float)

    m, n = A.shape

    # Construimos la matriz extendida del primal:
    # [A | I]
    I = np.eye(m)
    A_ext = np.hstack([A, I])

    # Costos extendidos:
    # variables originales -> c
    # holguras -> 0
    c_ext = np.concatenate([c, np.zeros(m)])

    basis = result["basis"]

    # Matriz base B y costos básicos c_B
    B = A_ext[:, basis]
    c_B = c_ext[basis]

    # Variables duales: y^T = c_B^T * B^{-1}
    try:
        B_inv = np.linalg.inv(B)
        dual_y = (c_B @ B_inv).tolist()
    except np.linalg.LinAlgError:
        dual_y = [None] * m

    # Fórmula del dual
    dual_formula = " + ".join([f"{round(float(b[i]), 2)}·y{i+1}" for i in range(m)])

    # Restricciones duales A^T y >= c
    dual_constraints = []
    for j in range(n):
        terms = []
        for i in range(m):
            coef = A[i, j]
            if coef != 0:
                terms.append(f"{round(float(coef), 2)}·y{i+1}")
        left_side = " + ".join(terms) if terms else "0"
        dual_constraints.append(f"{left_side} >= {round(float(c[j]), 2)}")

    dual_note = f"Por dualidad fuerte: z* = w* = {result['obj_val']}"

    return {
        **result,
        "dual_y": [round(v, 6) if v is not None else None for v in dual_y],
        "dual_formula": f"min w = {dual_formula}",
        "dual_constraints": dual_constraints,
        "dual_note": dual_note,
    }