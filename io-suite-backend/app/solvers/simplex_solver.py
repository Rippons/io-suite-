def simplex_solve(c: list, A: list, b: list) -> dict:
    m = len(A)          # número de restricciones
    n = len(c)          # número de variables originales

    # Construir tableau con variables de holgura
    tableau = []
    for i, row in enumerate(A):
        slack = [1.0 if i == j else 0.0 for j in range(m)]
        tableau.append([float(v) for v in row] + slack + [float(b[i])])

    # Fila objetivo (negativos para maximización)
    obj = [-float(ci) for ci in c] + [0.0] * m + [0.0]

    # Base inicial = variables slack
    basis = list(range(n, n + m))

    steps = []

    for iteration in range(200):

        # Buscar columna pivote (coeficiente más negativo)
        pivot_col = -1
        min_val = -1e-9

        for j in range(n + m):
            if obj[j] < min_val:
                min_val = obj[j]
                pivot_col = j

        # Si no hay negativos -> solución óptima
        if pivot_col == -1:
            break

        # Ratio test
        ratios = []
        for i in range(m):
            if tableau[i][pivot_col] > 1e-9:
                ratio = tableau[i][n + m] / tableau[i][pivot_col]
                ratios.append((ratio, i))

        if not ratios:
            return {
                "status": "unbounded",
                "x": [],
                "obj_val": None,
                "steps": steps,
                "tableau": [],
                "basis": []
            }

        _, pivot_row = min(ratios)

        # Pivote
        pv = tableau[pivot_row][pivot_col]
        tableau[pivot_row] = [v / pv for v in tableau[pivot_row]]

        for i in range(m):
            if i != pivot_row:
                factor = tableau[i][pivot_col]
                tableau[i] = [
                    tableau[i][j] - factor * tableau[pivot_row][j]
                    for j in range(n + m + 1)
                ]

        # Actualizar función objetivo
        factor_obj = obj[pivot_col]
        obj = [
            obj[j] - factor_obj * tableau[pivot_row][j]
            for j in range(n + m + 1)
        ]

        basis[pivot_row] = pivot_col

        steps.append({
            "iter": iteration,
            "pivot_row": pivot_row,
            "pivot_col": pivot_col,
            "obj_val": round(obj[n + m], 6),
        })

    # Extraer solución completa (x + slack)
    solution = [0.0] * (n + m)

    for i, b_idx in enumerate(basis):
        solution[b_idx] = round(tableau[i][n + m], 6)

    return {
        "status": "optimal",
        "x": solution[:n],
        "slack": solution[n:n + m],
        "obj_val": round(obj[n + m], 6),
        "steps": steps,
        "tableau": [[round(v, 4) for v in row] for row in tableau],
        "basis": basis,
    }
