def transport_solve(supply: list, demand: list, costs: list) -> dict:
    m, n  = len(supply), len(demand)
    s     = supply[:]
    d     = demand[:]
    alloc = [[0.0] * n for _ in range(m)]
    steps = []

    # ── Método de la Esquina Noroeste ─────────────────────────────────────────
    i, j = 0, 0
    while i < m and j < n:
        amount    = min(s[i], d[j])
        alloc[i][j] = amount
        steps.append({
            "i":        i,
            "j":        j,
            "amount":   amount,
            "cost":     costs[i][j],
            "subtotal": round(amount * costs[i][j], 2),
        })
        s[i] -= amount
        d[j] -= amount
        if s[i] == 0:
            i += 1
        else:
            j += 1

    total = sum(
        alloc[i][j] * costs[i][j]
        for i in range(m)
        for j in range(n)
    )

    # ── Variables MODI (u, v) ─────────────────────────────────────────────────
    u = [None] * m
    v = [None] * n
    u[0] = 0.0

    basic_cells = [(step["i"], step["j"]) for step in steps]
    changed     = True
    while changed:
        changed = False
        for (r, c) in basic_cells:
            if u[r] is not None and v[c] is None:
                v[c]   = costs[r][c] - u[r]
                changed = True
            elif v[c] is not None and u[r] is None:
                u[r]   = costs[r][c] - v[c]
                changed = True

    return {
        "alloc":  alloc,
        "total":  round(total, 2),
        "steps":  steps,
        "method": "Esquina Noroeste",
        "u":      [round(x, 4) if x is not None else None for x in u],
        "v":      [round(x, 4) if x is not None else None for x in v],
    }