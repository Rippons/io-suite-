from typing import Optional
from pydantic import BaseModel
from app.schemas.simplex import SimplexStep


class SensitivityRequest(BaseModel):
    c: list[float]
    A: list[list[float]]
    b: list[float]


class SensitivityRange(BaseModel):
    var: str
    current: float
    in_basis: bool
    range_low: Optional[float] = None
    range_high: Optional[float] = None
    x_val: float


class RHSRange(BaseModel):
    constraint: str
    current: float
    range_low: Optional[float] = None
    range_high: Optional[float] = None
    shadow_price: float


class SensitivityResponse(BaseModel):
    status: str
    x: list[float]
    obj_val: float
    steps: list[SimplexStep]
    tableau: list[list[float]]
    basis: list[int]
    ranges: list[SensitivityRange]
    rhs_ranges: list[RHSRange]