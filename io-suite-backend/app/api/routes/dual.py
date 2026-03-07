from fastapi import APIRouter, HTTPException
from app.schemas.dual import DualRequest, DualResponse
from app.solvers.dual_solver import dual_solve

router = APIRouter()

@router.post("/solve", response_model=DualResponse)
def solve_dual(req: DualRequest):
    try:
        result = dual_solve(req.c, req.A, req.b)
        if result["status"] != "optimal":
            raise HTTPException(status_code=400, detail=f"Estado: {result['status']}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))