from pydantic import BaseModel

class TransportRequest(BaseModel):
    supply: list[float]
    demand: list[float]
    costs: list[list[float]]

class TransportStep(BaseModel):
    i: int
    j: int
    amount: float
    cost: float
    subtotal: float

class TransportResponse(BaseModel):
    alloc: list[list[float]]
    total: float
    steps: list[TransportStep]
    method: str
    u: list[float | None]
    v: list[float | None]