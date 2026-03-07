import numpy as np
import traceback
from app.solvers.simplex_solver import simplex_solve

def sensitivity_solve(c: list, A: list, b: list) -> dict:
    try:
        print("=== SENSITIVITY INPUT ===")
        print("c:", c)
        print("A:", A)
        print("b:", b)

        result = simplex_solve(c, A, b)

        print("=== SIMPLEX RESULT ===")
        print("status:", result.get("status"))
        print("basis:", result.get("basis"))
        print("x:", result.get("x"))

        if result["status"] != "optimal":
            return {**result, "ranges": [], "rhs_ranges": [], "shadow_prices": []}

        n = len(c)
        m = len(A)

        basis = result["basis"]
        x = result["x"]

        A_np = np.array(A, dtype=float)
        b_np = np.array(b, dtype=float)
        c_np = np.array(c, dtype=float)

        I = np.eye(m)
        A_aug = np.hstack([A_np, I])

        print("A_aug:", A_aug)
        print("basis:", basis)

        B = A_aug[:, basis]
        print("B:", B)

        B_inv = np.linalg.inv(B)
        print("B_inv:", B_inv)

        c_aug = np.concatenate([c_np, np.zeros(m)])
        c_B = c_aug[basis]
        y = c_B @ B_inv
        shadow_prices = [round(v, 6) for v in y.tolist()]

        reduced_costs = (y @ A_aug) - c_aug

        ranges = []
        nonbasic = [j for j in range(n + m) if j not in basis]

        for j in range(n):
            in_basis = j in basis

            if not in_basis:
                rc = reduced_costs[j]
                range_low = c[j]
                range_high = c[j] + rc
            else:
                k = basis.index(j)

                delta_low = -np.inf
                delta_high = np.inf

                for q in nonbasic:
                    alpha = B_inv[k, :] @ A_aug[:, q]
                    rq = reduced_costs[q]

                    if abs(alpha) < 1e-12:
                        continue

                    bound = -rq / alpha

                    if alpha > 0:
                        delta_low = max(delta_low, bound)
                    else:
                        delta_high = min(delta_high, bound)

                range_low = c[j] + delta_low if delta_low != -np.inf else None
                range_high = c[j] + delta_high if delta_high != np.inf else None

            ranges.append({
                "var": f"x{j+1}",
                "current": c[j],
                "in_basis": in_basis,
                "range_low": round(range_low, 4) if range_low is not None else None,
                "range_high": round(range_high, 4) if range_high is not None else None,
                "x_val": x[j],
            })

        rhs_ranges = []

        xB = B_inv @ b_np

        for i in range(m):
            bi = b[i]
            col = B_inv[:, i]

            theta_plus = np.inf
            theta_minus = np.inf

            for r in range(m):
                if col[r] > 1e-12:
                    theta_plus = min(theta_plus, xB[r] / col[r])
                elif col[r] < -1e-12:
                    theta_minus = min(theta_minus, -xB[r] / col[r])

            low = bi - theta_minus if theta_minus != np.inf else None
            high = bi + theta_plus if theta_plus != np.inf else None

            rhs_ranges.append({
                "constraint": f"b{i+1}",
                "current": bi,
                "range_low": round(low, 4) if low is not None else None,
                "range_high": round(high, 4) if high is not None else None,
                "shadow_price": round(y[i], 6),
            })

        return {
            **result,
            "ranges": ranges,
            "rhs_ranges": rhs_ranges,
            "shadow_prices": shadow_prices,
        }

    except Exception as e:
        print("=== ERROR IN SENSITIVITY SOLVER ===")
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "ranges": [],
            "rhs_ranges": [],
            "shadow_prices": []
        }