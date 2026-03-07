from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "IO Suite API"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()