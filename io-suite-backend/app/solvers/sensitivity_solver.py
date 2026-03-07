from app.solvers.simplex_solver import simplex_solve

def sensitivity_solve(c: list, A: list, b: list) -> dict:

    result = simplex_solve(c, A, b)

    if result["status"] != "optimal":
        return {**result, "ranges": [], "rhs_ranges": []}

    n = len(c)
    m = len(A)

    tableau = result["tableau"]
    basis = result["basis"]
    x = result["x"]

    # ─────────────────────────────
    # PRECIOS SOMBRA (dual)
    # y^T = c_B^T B^{-1}
    # ─────────────────────────────

    shadow_prices = []

    for i in range(m):
        # coeficiente de la slack en la fila objetivo final
        val = tableau[-1][n + i] if len(tableau) > m else 0
        shadow_prices.append(round(val, 6))

    # ─────────────────────────────
    # RANGOS COEFICIENTES OBJETIVO
    # usando costos reducidos
    # ─────────────────────────────

    ranges = []

    for j in range(n):

        in_basis = j in basis

        if in_basis:
            range_low = float("-inf")
            range_high = float("inf")
        else:
            reduced_cost = 0

            if len(tableau) > m:
                reduced_cost = tableau[-1][j]

            range_low = round(c[j] + min(0, reduced_cost), 4)
            range_high = round(c[j] + max(0, reduced_cost), 4)

        ranges.append({
            "var": f"x{j+1}",
            "current": c[j],
            "in_basis": in_basis,
            "range_low": range_low,
            "range_high": range_high,
            "x_val": x[j],
        })

    # ─────────────────────────────
    # RANGOS RHS
    # usando cambios permisibles
    # ─────────────────────────────

    rhs_ranges = []

    for i in range(m):

        bi = b[i]

        theta_plus = float("inf")
        theta_minus = float("inf")

        for r in range(m):

            col_val = tableau[r][n + i]
            rhs_val = tableau[r][n + m]

            if col_val > 1e-9:
                theta_plus = min(theta_plus, rhs_val / col_val)

            elif col_val < -1e-9:
                theta_minus = min(theta_minus, -rhs_val / col_val)

        low = bi - theta_minus if theta_minus != float("inf") else float("-inf")
        high = bi + theta_plus if theta_plus != float("inf") else float("inf")

        rhs_ranges.append({
            "constraint": f"b{i+1}",
            "current": bi,
            "range_low": round(low, 4) if low != float("-inf") else low,
            "range_high": round(high, 4) if high != float("inf") else high,
            "shadow_price": shadow_prices[i] if i < len(shadow_prices) else 0,
        })

    return {
        **result,
        "ranges": ranges,
        "rhs_ranges": rhs_ranges,
        "shadow_prices": shadow_prices
    }
