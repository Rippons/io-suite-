from app.api.routes.simplex import simplex_solve


c = [2, 3, 0, 0]

A = [
    [1, 1, 1, 0],
    [2, 1, 0, 1]
]

b = [4, 6]

result = simplex_solve(c, A, b)

print("Status:", result["status"])
print("Variables:", result["x"])
print("Valor óptimo Z:", result["obj_val"])
