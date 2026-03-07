from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import simplex, dual, sensitivity, transport

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Backend de Investigación de Operaciones — Python + FastAPI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simplex.router,     prefix="/api/simplex",     tags=["Simplex"])
app.include_router(dual.router,        prefix="/api/dual",        tags=["Dualidad"])
app.include_router(sensitivity.router, prefix="/api/sensitivity", tags=["Sensibilidad"])
app.include_router(transport.router,   prefix="/api/transport",   tags=["Transporte"])

@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} corriendo ✓"}





