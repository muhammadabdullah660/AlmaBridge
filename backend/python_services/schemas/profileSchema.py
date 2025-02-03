from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional, Dict


class ProfileSchema(BaseModel):
    profileUrl: str
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    birth_date: Optional[str] = None
    headline: Optional[str] = None
    about: Optional[str] = None
    skills: List[str] = []
    education: List[Dict[str, str]] = Field(default_factory=list)
    experiences: List[Dict[str, str]] = Field(default_factory=list)


    @field_validator("skills", mode="before")
    def validate_skills(cls, skills):
        if not isinstance(skills, list):
            raise ValueError("Skills must be a list")
        if any(len(skill) < 2 for skill in skills):
            raise ValueError("Each skill must have at least 2 characters.")
        return skills
    

    @field_validator("phone", mode="before")
    def validate_phone(cls, phone):
        if phone and (not phone.isdigit() or len(phone) < 7):
            raise ValueError("Phone number must be numeric and at least 7 digits long.")
        return phone
    
