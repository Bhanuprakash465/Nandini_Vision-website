from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import ensure_indexes
from app.routes import auth, enquiries, availability, bookings, notifications

app = FastAPI(title="Nandini Vision API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(enquiries.router)
app.include_router(availability.router)
app.include_router(bookings.router)
app.include_router(notifications.router)


def _warn_insecure_config() -> None:
    """Loud, non-fatal warnings so a misconfigured deployment is obvious in the logs."""
    if settings.jwt_secret == "dev-secret-change-me" or len(settings.jwt_secret) < 32:
        print("[config:WARNING] JWT_SECRET is the development default or shorter than 32 characters. "
              "Set a long random JWT_SECRET before going live.")
    if "localhost" in settings.frontend_origin:
        print("[config:WARNING] FRONTEND_ORIGIN is a localhost URL. Set it to the deployed frontend URL "
              "or browsers will block API requests (CORS).")


@app.on_event("startup")
async def on_startup():
    _warn_insecure_config()
    await ensure_indexes()


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "nandini-vision-api"}
