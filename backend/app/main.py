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


@app.on_event("startup")
async def on_startup():
    await ensure_indexes()


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "nandini-vision-api"}
