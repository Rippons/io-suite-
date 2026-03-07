from pydantic import BaseModel

class SimplexRequest(BaseModel):
    c: list[float]
    A: list[list[float]]
    b: list[float]

class SimplexStep(BaseModel):
    iter: int
    pivot_row: int
    pivot_col: int
    obj_val: float

class SimplexResponse(BaseModel):
    status: str
    x: list[float]
    obj_val: float
    steps: list[SimplexStep]
    tableau: list[list[float]]
    basis: list[int]