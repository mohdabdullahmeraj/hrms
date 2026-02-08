from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import schemas, crud, models

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.EmployeeResponse)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Employee).filter(
        models.Employee.employee_id == employee.employee_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")
    return crud.create_employee(db, employee)

@router.get("/")
def list_employees(db: Session = Depends(get_db)):
    return crud.get_all_employees(db)

@router.delete("/{employee_id}")
def remove_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = crud.delete_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}

@router.get("/{employee_id}/attendance-summary")
def attendance_summary(employee_id: int, db: Session = Depends(get_db)):
    total_present = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id,
        models.Attendance.status == "Present"
    ).count()

    total_absent = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id,
        models.Attendance.status == "Absent"
    ).count()

    return {
        "employee_id": employee_id,
        "present_days": total_present,
        "absent_days": total_absent
    }
