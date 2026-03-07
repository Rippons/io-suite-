from pydantic import BaseModel
from app.schemas.simplex import SimplexStep

class DualRequest(BaseModel):
    c: list[float]
    A: list[list[float]]
    b: list[float]

class DualResponse(BaseModel):
    status: str
    x: list[float]
    obj_val: float
    steps: list[SimplexStep]
    tableau: list[list[float]]
    basis: list[int]
    dual_y: list[float]
    dual_formula: str
    dual_note: str