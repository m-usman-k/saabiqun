from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, content

Base.metadata.create_all(bind=engine)

saabiqun_app = FastAPI(title="Saabiqun API")

saabiqun_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

saabiqun_app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
saabiqun_app.include_router(content.router, prefix="/api/content", tags=["content"])

@saabiqun_app.get("/")
def read_root():
    return {"message": "Welcome to Saabiqun API"}
