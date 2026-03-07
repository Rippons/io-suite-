from fastapi import APIRouter, HTTPException
from app.schemas.simplex import SimplexRequest, SimplexResponse
from app.solvers.simplex_solver import simplex_solve

router = APIRouter()

@router.post("/solve", response_model=SimplexResponse)
def solve_simplex(req: SimplexRequest):
    try:
        result = simplex_solve(req.c, req.A, req.b)
        if result["status"] == "unbounded":
            raise HTTPException(status_code=400, detail="El problema es no acotado.")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))