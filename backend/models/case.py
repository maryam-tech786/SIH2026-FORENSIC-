from sqlalchemy import Column, Integer, String, Text
from database.connection import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)

    case_name = Column(String, nullable=False)

    description = Column(Text)

    status = Column(
        String,
        default="Open"
    )