from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Date
from datetime import date
from app.database import SessionLocal
from app import models

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    today = date.today()

    total_employees = db.query(models.Employee).count()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.status == "Present",
        models.Attendance.marked_at.cast(Date) == today
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.status == "Absent",
        models.Attendance.marked_at.cast(Date) == today
    ).count()

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today
    }
