from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class Complaint(Base):

    __tablename__ = "complaints"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    complaint_source = Column(String(100), nullable=True)

    customer_name = Column(String(255), nullable=True)


    product_name = Column(String(255), nullable=True)

    product_strength_grade = Column(String(100), nullable=True)

    batch_lot_number = Column(String(100), nullable=True)


    manufacturing_date = Column(Date, nullable=True)

    expiry_date = Column(Date, nullable=True)


    quantity_affected = Column(String(100), nullable=True)


    complaint_type = Column(String(100), nullable=True)

    complaint_date = Column(Date, nullable=True)


    detailed_complaint_description = Column(Text, nullable=True)


    initial_severity = Column(String(50), nullable=True)

    priority = Column(String(50), nullable=True)


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )