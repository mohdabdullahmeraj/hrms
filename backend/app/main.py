from fastapi import FastAPI
from app.database import Base, engine
from app.routes import employee, attendance, dashboard
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

app.include_router(employee.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "HRMS Lite Backend Running"}
