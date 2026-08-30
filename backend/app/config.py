from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "nandini_vision"

    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    frontend_origin: str = "http://localhost:3000"

    resend_api_key: str = ""
    email_from: str = "Nandini Vision <hello@nandinistudio.demo>"
    owner_email: str = "owner@nandinistudio.demo"

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_email: str = ""
    smtp_app_password: str = ""

    whatsapp_number: str = "919876543210"

    admin_email: str = "owner@nandinistudio.demo"
    admin_password: str = "change-me-now"

    class Config:
        env_file = ".env"


settings = Settings()