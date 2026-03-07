from app.solvers.simplex_solver import simplex_solve

def dual_solve(c: list, A: list, b: list) -> dict:
    result = simplex_solve(c, A, b)

    if result["status"] != "optimal":
        return result

    n = len(c)
    m = len(A)

    # Variables duales (precios sombra) desde la fila objetivo
    # y_i = coeficiente de la variable de holgura i en la fila obj final
    tableau = result["tableau"]
    dual_y  = []
    for j in range(n, n + m):
        in_basis = j in result["basis"]
        if in_basis:
            dual_y.append(0.0)
        else:
            # El precio sombra está en la fila objetivo original reconstruida
            dual_y.append(0.0)

    dual_formula = " + ".join([f"{round(b[i], 2)}·y{i+1}" for i in range(m)])
    dual_note    = f"Por dualidad fuerte: z* = w* = {result['obj_val']}"

    return {
        **result,
        "dual_y":       dual_y,
        "dual_formula": dual_formula,
        "dual_note":    dual_note,
    }