from fastapi import APIRouter, HTTPException
from app.schemas.sensitivity import SensitivityRequest, SensitivityResponse
from app.solvers.sensitivity_solver import sensitivity_solve

router = APIRouter()

@router.post("/solve", response_model=SensitivityResponse)
def solve_sensitivity(req: SensitivityRequest):
    try:
        result = sensitivity_solve(req.c, req.A, req.b)
        if result["status"] != "optimal":
            raise HTTPException(status_code=400, detail=f"Estado: {result['status']}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))