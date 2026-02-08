from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Date
from app.database import SessionLocal
from app import schemas, models
from datetime import datetime, timezone, date
from typing import Optional

router = APIRouter(prefix="/attendance", tags=["Attendance"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def mark_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.id == data.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = models.Attendance(
        employee_id=data.employee_id,
        status=data.status,
        marked_at=datetime.now()
    )

    db.add(record)
    db.commit()
    return {"message": "Attendance marked"}


@router.get("/{employee_id}")
def get_attendance(
    employee_id: int,
    date: Optional[date] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    )

    if date:
        query = query.filter(
            models.Attendance.marked_at.cast(Date) == date
        )

    if from_date and to_date:
        query = query.filter(
            models.Attendance.marked_at.between(from_date, to_date)
        )

    return query.all()

