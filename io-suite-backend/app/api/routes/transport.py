from fastapi import APIRouter, HTTPException
from app.schemas.transport import TransportRequest, TransportResponse
from app.solvers.transport_solver import transport_solve

router = APIRouter()

@router.post("/solve", response_model=TransportResponse)
def solve_transport(req: TransportRequest):
    try:
        total_supply = sum(req.supply)
        total_demand = sum(req.demand)
        if abs(total_supply - total_demand) > 1e-6:
            raise HTTPException(
                status_code=400,
                detail=f"Problema desequilibrado: oferta ({total_supply}) ≠ demanda ({total_demand})"
            )
        result = transport_solve(req.supply, req.demand, req.costs)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))