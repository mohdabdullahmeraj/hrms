from sqlalchemy.orm import Session
from app import models

def get_all_employees(db: Session):
    return db.query(models.Employee).all()

def get_employee_by_emp_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

def create_employee(db: Session, employee):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, emp_id: int):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if emp:
        db.delete(emp)
        db.commit()
    return emp
